#!/usr/bin/env python3
"""Convert Codex JSONL session files to readable Markdown."""

import json
import sys
from datetime import datetime
from pathlib import Path

def format_timestamp(ts_str):
    """Format ISO timestamp to readable format."""
    try:
        dt = datetime.fromisoformat(ts_str.replace('Z', '+00:00'))
        return dt.strftime('%Y-%m-%d %H:%M:%S')
    except:
        return ts_str

def extract_text_from_content(content):
    """Extract text from content array."""
    if not content:
        return ""
    
    parts = []
    for item in content:
        if isinstance(item, dict):
            if item.get('type') == 'input_text':
                parts.append(item.get('text', ''))
            elif item.get('type') == 'text':
                parts.append(item.get('text', ''))
    
    return '\n'.join(parts)

def process_codex_jsonl(input_file, output_file):
    """Convert Codex JSONL to Markdown."""
    
    with open(input_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    session_info = {}
    messages = []
    
    for line in lines:
        try:
            obj = json.loads(line.strip())
            obj_type = obj.get('type')
            payload = obj.get('payload', {})
            timestamp = obj.get('timestamp', '')
            
            # Session metadata
            if obj_type == 'session_meta':
                session_info = payload
            
            # User and assistant messages
            elif obj_type == 'response_item':
                item_type = payload.get('type')
                role = payload.get('role')
                
                if item_type == 'message' and role in ['user', 'assistant']:
                    content = payload.get('content', [])
                    text = extract_text_from_content(content)
                    
                    # Filter out system instructions and environment context
                    if text and not text.startswith('<permissions instructions>') and \
                       not text.startswith('# AGENTS.md instructions') and \
                       not text.startswith('<environment_context>'):
                        messages.append({
                            'timestamp': timestamp,
                            'role': role,
                            'text': text
                        })
                
                # Function calls
                elif item_type == 'function_call':
                    func_name = payload.get('name')
                    args = payload.get('arguments', '{}')
                    try:
                        args_dict = json.loads(args)
                        command = args_dict.get('command', '')
                        if command:
                            messages.append({
                                'timestamp': timestamp,
                                'role': 'tool',
                                'tool': func_name,
                                'text': f"Running: `{command}`"
                            })
                    except:
                        pass
                
                # Function call outputs
                elif item_type == 'function_call_output':
                    output = payload.get('output', '')
                    if output and len(output) < 1000:  # Only show short outputs
                        messages.append({
                            'timestamp': timestamp,
                            'role': 'tool_output',
                            'text': f"```\n{output}\n```"
                        })
                
                # Reasoning
                elif item_type == 'reasoning':
                    summary = payload.get('summary', [])
                    if summary:
                        text = extract_text_from_content(summary)
                        if text:
                            messages.append({
                                'timestamp': timestamp,
                                'role': 'thinking',
                                'text': text
                            })
        
        except json.JSONDecodeError:
            continue
    
    # Write Markdown output
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write("# Codex Session\n\n")
        
        if session_info:
            f.write("## Session Info\n\n")
            f.write(f"- **Session ID**: {session_info.get('id', 'N/A')}\n")
            f.write(f"- **Started**: {format_timestamp(session_info.get('timestamp', ''))}\n")
            f.write(f"- **Working Directory**: `{session_info.get('cwd', 'N/A')}`\n")
            f.write(f"- **CLI Version**: {session_info.get('cli_version', 'N/A')}\n")
            f.write(f"- **Model**: {session_info.get('model_provider', 'N/A')}\n")
            git_info = session_info.get('git', {})
            if git_info:
                f.write(f"- **Branch**: {git_info.get('branch', 'N/A')}\n")
                f.write(f"- **Commit**: {git_info.get('commit_hash', 'N/A')[:8]}\n")
            f.write("\n---\n\n")
        
        # Write conversation
        f.write("## Conversation\n\n")
        
        for msg in messages:
            role = msg['role']
            text = msg['text']
            ts = format_timestamp(msg['timestamp'])
            
            if role == 'user':
                f.write(f"### User ({ts})\n\n")
                f.write(f"{text}\n\n")
            elif role == 'assistant':
                f.write(f"### Assistant ({ts})\n\n")
                f.write(f"{text}\n\n")
            elif role == 'thinking':
                f.write(f"**Thinking**: {text}\n\n")
            elif role == 'tool':
                tool = msg.get('tool', 'tool')
                f.write(f"**Tool ({tool})**: {text}\n\n")
            elif role == 'tool_output':
                f.write(f"**Output**:\n{text}\n\n")
    
    print(f"Converted {input_file} -> {output_file}")
    print(f"Found {len(messages)} conversation items")

if __name__ == '__main__':
    if len(sys.argv) != 3:
        print("Usage: convert_codex.py <input.jsonl> <output.md>")
        sys.exit(1)
    
    input_file = Path(sys.argv[1])
    output_file = Path(sys.argv[2])
    
    if not input_file.exists():
        print(f"Error: {input_file} not found")
        sys.exit(1)
    
    process_codex_jsonl(input_file, output_file)
