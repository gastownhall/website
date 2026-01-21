#!/bin/bash
# Script to capture gt/bd command help for documentation verification

echo "=========================================="
echo "GAS TOWN COMMAND VERIFICATION"
echo "=========================================="
echo ""

echo "=== gt version ==="
gt version 2>&1
echo ""

echo "=== gt install --help ==="
gt install --help 2>&1
echo ""

echo "=== gt init --help ==="
gt init --help 2>&1
echo ""

echo "=== gt rig --help ==="
gt rig --help 2>&1
echo ""

echo "=== gt rig add --help ==="
gt rig add --help 2>&1
echo ""

echo "=== gt mayor --help ==="
gt mayor --help 2>&1
echo ""

echo "=== gt start --help ==="
gt start --help 2>&1
echo ""

echo "=== gt crew --help ==="
gt crew --help 2>&1
echo ""

echo "=== gt crew add --help ==="
gt crew add --help 2>&1
echo ""

echo "=== gt convoy --help ==="
gt convoy --help 2>&1
echo ""

echo "=== gt convoy create --help ==="
gt convoy create --help 2>&1
echo ""

echo "=== gt sling --help ==="
gt sling --help 2>&1
echo ""

echo "=== gt seance --help ==="
gt seance --help 2>&1
echo ""

echo "=== gt escalate --help ==="
gt escalate --help 2>&1
echo ""

echo "=== gt stop --help ==="
gt stop --help 2>&1
echo ""

echo "=== gt doctor --help ==="
gt doctor --help 2>&1
echo ""

echo "=== bd version ==="
bd version 2>&1
echo ""

echo "=== bd dep --help ==="
bd dep --help 2>&1
echo ""

echo "=== bd create --help ==="
bd create --help 2>&1
echo ""

echo "=== bd update --help ==="
bd update --help 2>&1
echo ""

echo "=========================================="
echo "VERIFICATION COMPLETE"
echo "=========================================="
