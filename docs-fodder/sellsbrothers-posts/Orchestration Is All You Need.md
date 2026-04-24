---
title: "Orchestration Is All You Need"
author: "Chris Sells"
date: "2026-04-21"
source: "https://sellsbrothers.com/orchestration-is-all-you-need"
---
_What agentic engineering looks like when you really mean it._

In the last year, as our AI software engineering tools have evolved, so have our software engineering processes. We have learned to take advantage of the tools to cut down the latency of our SDLC and CI/CD processes. We’ve already learned that if we’re not careful, we’re going to vibe code AI “slop,” the unchecked code and configuration that an AI coding agent generates when run without guardrails.

The kind of guardrails I mean come straight out of the software engineering 101 playbook:

- Getting feedback from multiple points of view
- Checking technical designs for completeness, consistency and accuracy
- Comprehensive unit, UI, integration, performance and security test suites
- Thorough error instrumentation and run-time monitoring in operation
- Human taste and judgment as the definition of “done”

Using agents for what they’re good at (coding, checking, testing, iterating) while letting the humans set the bar for quality elevates your process from “it works on my machine” and defines the “agentic engineering” discipline. You can use agents interactively to get the quality you’re looking for, if you’re careful to apply the guardrails. But if you want to build automated pipelines that require less and less human interaction over time, you’re going to have to start with something called harness engineering.

“Harness engineering” is the act of gathering together the underlying LLM with the tools and context (data, instructions, information about the environment) into a program optimized for a specific task. Each one of the CLI coding agents itself is a harness that’s optimized for getting the most out of the underlying LLM from a latency, throughput and quality point of view, packaged in a TUI with programmatic access built in.

And while it’s easy enough for a human to switch between tools from an interactive point of view, it’s real work to be able to switch between `codex` and `opencode` in your automated processes. While each of them provides the programmatical surface area you need to automate them, all agents are different in their invocation arguments, service endpoints, etc. To solve that problem, we need harness engineering again, but one level of abstraction up.

![](https://cdn.blot.im/blog_12688eba996c4a98b1ec3a945e78e4f1/_image_cache/a20d5233-eff0-4539-a92c-abbe756fd407/image1.png)

As an example, [the Gas City OSS project](https://github.com/gastownhall/gascity) defines a provider protocol that we implement on top of each of the major (and several of the long tail) CLI coding agents to enable them to be swapped in and out of city, pack and formula definitions (more on that later):

```
// Pseudo-code for the canonical in-memory worker API.
type FactoryWorker interface {
    // Lifecycle
    Start(context.Context) error
    StartResolved(context.Context, string, runtime.Config) error
    Attach(context.Context) error
    Create(context.Context, CreateMode) (sessionpkg.Info, error)
    Reset(context.Context) error
    Stop(context.Context) error
    Kill(context.Context) error
    Close(context.Context) error
    Rename(context.Context, string) error
    State(context.Context) (State, error)

    // Messaging
    Message(context.Context, MessageRequest) (MessageResult, error)
    Interrupt(context.Context, InterruptRequest) error
    Nudge(context.Context, NudgeRequest) (NudgeResult, error)

    // Transcript and History
    History(context.Context, HistoryRequest) (*HistorySnapshot, error)
    Transcript(context.Context, TranscriptRequest) (*TranscriptResult, error)
    TranscriptPath(context.Context) (string, error)
    AgentMappings(context.Context) ([]AgentMapping, error)
    AgentTranscript(context.Context, string) (*AgentTranscriptResult, error)

    // ... and more!
}
```

Not only does this allow you to eliminate the programmatic differences that get in the way of your swapping yesterday’s best coding agent out for today’s best agent out of your automations, but it also allows you to easily take advantage of the variations between the models, e.g. cost, limits, quality, availability, suitability to a specific job (e.g. planning, coding, image processing).

The use of the provider harness in Gas City allows you to turn a CLI coding agent into a “factory worker” that you can tailor to the specific job (“you’re an expert UX designer…”) and drop into your custom workflows (“write the plan, then get it reviewed by these other agents, then ask the UX designer agent to flesh out the jobs to be done, …”) that we call orchestrations.

## orchestration all the way down

Reminding ourselves of human software engineering teams again, we have a series of workflows that human teams go through to get a product or feature out the door. For example, imagine an engineer that’s just written some code. Do they immediately release it to customers? No. They must solicit review feedback from their teammates first, dealing with any issues that arise. Only when they get the thumbs up are they allowed to merge new code into the main product codebase.

Now, if Eddie the Engineer is a human, he can do his coding, solicit feedback and iterate all on his own. Likewise, his teammates will get their notifications and do their part to keep the flow of software moving.

However, if Eddie is an AI coding agent, to do his part requires that he’s “orchestrated,” e.g. that he’s been defined as an expert software engineer running on the codex provider using the GPT5.4 model. Once an agent is included in an orchestration, we can have as many instances of it as we want, each dedicated to execution on its own work item with its own agent Eddie instance.

![](https://cdn.blot.im/blog_12688eba996c4a98b1ec3a945e78e4f1/_image_cache/f75d6f59-09d0-4f9f-9a5a-648217ce4fd3/image2.png)

Once each Eddie is done with his work, the orchestration engine will hand it off to as many LLMs as you decide to review the work, gathering that feedback to iterate on until Eddie’s code gets a clean bill of health.

This isn’t theoretical. The code review orchestration we use with Gas City combines a dynamic set of agents configured to focus on security, performance, React, etc. that are then spread across the `codex`, `gemini` and `claude` providers so that we get a wide range of review feedback to iterate on. We know from experience that this greatly improves the quality of our code (and plans and tests and …).

Every part of our human software engineering processes can be turned into an agentic orchestration. The artifact-review-iterate process is the same for engineers, PMs, UX designers, etc. And those processes string together into the overall software process itself.

![](https://cdn.blot.im/blog_12688eba996c4a98b1ec3a945e78e4f1/_image_cache/a5396023-75cb-4aa2-968a-b6b302ce8af9/image3.png)

The factory worker harnesses allow you to bring the CLI coding agents into your orchestrations, but it’s the orchestrations that allow you to spread the work across as many agents as you can spin up.

## embracing the bitter lesson

There’s a tempting alternative to all of this: just wait for the models to get good enough that you don’t need orchestrations. Eventually, the thinking goes, GPT-7 or Claude 6 or Gemini Ultra will be capable enough that you can hand it your repo and your customer feedback and walk away.

This is the wrong side of [the bitter lesson](http://www.incompleteideas.net/IncIdeas/BitterLesson.html). Rich Sutton’s observation was that general methods that leverage compute have always eventually beaten methods that leverage human-encoded domain knowledge. Waiting for the perfect model is turning away from that lesson. It’s a bet that compute will eventually stop mattering, that there’s a model capability threshold past which the apparatus becomes unnecessary. And while the singularity is by definition the horizon beyond which we cannot predict the future, the past is pretty clear about the benefits of being on the right side of that lesson.

![](https://cdn.blot.im/blog_12688eba996c4a98b1ec3a945e78e4f1/_image_cache/5cf581a5-02fa-42d5-b30d-3ebd54bd8171/image4.png)

A software factory is on the right side. Orchestrations are how you turn more compute into better output, indefinitely. Five agents from different providers providing feedback is how you broaden your range of feedback no matter how good any specific agent’s response is. A better model just makes the orchestration better.

And now let’s talk about how you might build the software factory to run your orchestrations.

## Gas City: build your software factory

Like Steve Yegge’s Gas Town that inspired it, Gas City provides the harness that turns CLI coding agents from different vendors into factory workers that can be plugged into “formulas” (orchestrations) to execute “beads” (work) against multiple “rigs” (projects).

Another name for an agentic orchestration system is a “software factory” or “dark factory” (so named because you don’t need humans to run it). Gas City provides the pieces — the agentic harness, the orchestration engine, the automation engine — and lets you configure the software factory to match the way that you want to work.

Want to start from scratch to build your factory alongside your software? You can. Want to have a fully featured Gas Town out of the box? Gas City provides that as a pre-packaged “pack” that you can choose at initialization time. Want to define your own pack that defines your favorite combo of agents, formulas (orchestrations) and orders (automatically triggered scripts or formulas) and share it with a team? That’s exactly what packs are for.

In fact, we’ve engineered Gas City such that any orchestration system you can think of — Ralph Loops, StrongDM Software Factories, Anthropic Agent Teams — can be captured in a pack. We’ve already started to gather some of them in [the gascity-packs repo](https://github.com/gastownhall/gascity-packs) with more to come.

Those packs come from our own use of Gas City to build Gas City, as you might expect. On a single day, we were able to [merge 74 PRs](https://github.com/gastownhall/gascity-packs/tree/main/pr-review). Of course, the only way we can handle that kind of volume is by using Gas City itself.

But what surprised us wasn’t just that we are using Gas City for implementation tasks. We’ve also built issue triage, deployment and operations. We’ve hired 15 agentic employees to help us run [Gas City, Inc](https://gascity.com), ranging from marketing to release management. And, leaning on the techniques in OpenClaw, each of them has a personality and the ability to chat with us via [Discord](https://github.com/gastownhall/gascity-packs/tree/main/discord).

![](https://cdn.blot.im/blog_12688eba996c4a98b1ec3a945e78e4f1/_image_cache/75ef386f-6a3d-4548-8674-fe4183d7e61b/image5.png)

What we’re finding is that not only does Gas City evolve based on bug reports and feature requests, but the Gas City software factory itself evolves to meet the needs of the software. The more we push on the limits of what orchestrated agents can do, the more we realize that we’re just getting started!

## getting involved

The Gas Town ecosystem has grown quite a bit in popularity since Steve Yegge submitted the first commit to the Beads project in October. Together, Beads, Gas Town and Gas City have gathered more than 35,000 stars, 5000 PRs and 2500 issues from more than 500 contributors.

![](https://cdn.blot.im/blog_12688eba996c4a98b1ec3a945e78e4f1/_image_cache/262c006e-0492-4211-8a80-70e57485f447/image6.png)

In addition, we’ve got The Wasteland, which is our burgeoning set of federated Gas Towns and Cities for centralized management of distributed work. And we’ve got [a hosted version of Gas City coming soon](https://gascity.com/gasworks/).

Of course, we’ve also got [Gas City Hall](https://gascityhall.com), the community for all things in Gaslandia, including the Discord server, the social news feed, the docs and a link to the repo. Or perhaps you’d like some hands-on training? Then sign up for [Software Factory Intensive](https://www.actual.ai/softwarefactory), a two-day workshop from our partners at [Actual.ai](http://Actual.ai) on how to build your very own software factory with Gas City.

## where are we

It might not have sunk in yet, but your job has changed. Instead of building the software, you’re going to be building the factory that builds the software. And reviews it. And validates it. And deploys and operates and maintains it.

But the agents still need you to define what “done” looks like. Encode those definitions into reusable orchestrations, spinning up as many as you need, and let the factory carry the work your team used to carry by hand.

Start with Gas City. Plug in the Gas Town pack or build your own from scratch. The ecosystem is open source, the community is growing, and we’re using it ourselves every day to build the thing you’re about to install.

Go build your factory.
