Welcome to Gas City
===================

[![Steve Yegge](https://miro.medium.com/v2/resize:fill:64:64/1*8Ae2b9dv-sQtme8C4_sjhA.jpeg)](https://medium.com/?source=post_page---byline--57f564bb3607---------------------------------------)

[Steve Yegge](https://medium.com/?source=post_page---byline--57f564bb3607---------------------------------------)

18 min read

·

9 hours ago

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2F57f564bb3607&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fwelcome-to-gas-city-57f564bb3607&user=Steve+Yegge&userId=c1ec701babb7&source=---header_actions--57f564bb3607---------------------clap_footer------------------)

--

2

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F57f564bb3607&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fwelcome-to-gas-city-57f564bb3607&source=---header_actions--57f564bb3607---------------------bookmark_footer------------------)

[Listen](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2Fplans%3Fdimension%3Dpost_audio_button%26postId%3D57f564bb3607&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fwelcome-to-gas-city-57f564bb3607&source=---header_actions--57f564bb3607---------------------post_audio_button------------------)

Share

What is Gas City, you ask? It is Gas Town, but torn apart and rewritten from the ground up as an SDK for building your own dark factories. It enables you to deploy teams of collaborating agents in any topology, not just the hardwired original (and complex) Gas Town team shape.

Gas City released version [v1.0.0](https://github.com/gastownhall/gascity) this week. It went to alpha test a few weeks ago and is ready for use today!

![From Gas Town to Gas City](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ugMnDZOGGqghQtwvVv9XeA.jpeg)

This is a pivotal moment in the Mad Max school of agent orchestration, a.k.a. Gaslandia, Gas Universe, Gas Nation, or the Gasosphere, depending on who you ask. It all began with [Beads](https://medium.com/introducing-beads-a-coding-agent-memory-system-637d7d92514a), which was like discovering oil. It continued with [Gas Town](https://medium.com/welcome-to-gas-town-4f25ee16dd04), and we soon opened the [Wasteland](https://medium.com/welcome-to-the-wasteland-a-thousand-gas-towns-a5eb9bc8dc1f), a public commons board for federated work arbitrage and a budding private army. Gas City is the next step in that progression. I first predicted and described Gas City back in [January](https://medium.com/steveys-birthday-blog-34f437139cb5), and it has finally arrived.

_Disclaimer_: I did not write Gas City. It was created by Julian Knutsen and Chris Sells, both of whom you can meet on the [Discord](https://gastownhall.ai/). I am only lightly affiliated with the code, in the sense that I outlined my vision in a blog post, and they built it. But it’s exactly what I wished for, and it is being run by far more serious and disciplined engineers than me. I am all-in with Gas City, contributing myself, and this is our official new direction!

Gas City has deconstructed the entire Gas Town stack into composable, declarative building blocks called “packs”. You can use these to assemble arbitrary agent topologies, deploy them, sit back, and watch them work from a rich console. _(Or tmux, if that floats your boat. That still works in Gas City!)_ Gas City is the supervisor plane that connects, manages, and coordinates these deployed mini-factories.

As its unboxing flex, Gas City comes with a fully functional “Gas Town” pack, which runs an exact replica of Gas Town. This is the default pack that runs on startup. So Gas City starts off as a drop-in replacement for the original Gas Town, and can import all your rigs and beads.

Both systems are backed by the powerful and peerless MEOW stack. MEOW, the [Molecular Expression of Work](https://medium.com/welcome-to-gas-town-4f25ee16dd04), is a lightweight [Beads](https://github.com/gastownhall/beads)-based framework that places Work front and center, as the first-class system primitive, creating a versioned knowledge graph of all your issues and tasks. Work is the currency that drives the Gas Universe ecosystem. It’s Beads all the way down, powered at the base of the stack by a unique git-versioned database called [Dolt](https://github.com/dolthub/dolt). Dolt was the magic that made our stack run smoothly.

![Dolt is Gas City’s internal powerhouse](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*GXgxqfbvv4fvLDMvOUh7zA.jpeg)

Gas City solves an enormous number of problems associated with spinning up long-running agentic worker “teams.” It builds atop the innovations and community contributions from Gas Town, giving you out-of-the-box, scalable, convenient access to agent identity, messaging, history, context, state, skills, roles, personas, and much more. And for coding agent maintainers, Gas City exposes a rich Factory Worker API. It’s a way to make your own agent the driver for Gas City.

Gas City is generally an improvement on Gas Town on all fronts, from code quality, to the services it offers. For instance it offers fine-grained model selection and switching at various levels, for cost control.

Gas City doesn’t aim to solve all your problems. You will need to wire it to your own sandboxing, MCP servers, and so on. But it provides you with a rock-solid and easy-to-use foundation to build on: one with a Discord community with thousands of active members.

This combination of tech stack and community makes Gas City, as far as I can tell, the only viable solution for building custom orchestrators backed by Git. You can build and run an entire business with it, tracking every step taken by any agent in a database with git version history. The forensics and auditing capabilities of Gas City are unparalleled, because of MEOW and [Dolt](https://www.dolthub.com/).

What about maturity? Unlike Gas Town, which is an experiment run like a Wild West, Gas City is a rapidly maturing, enterprise-focused SDK for building and deploying autonomous agentic workflows. These deployments can be for anything: devops and monitoring jobs, ETLs, data pipelines, ticket queues, incident response, whatever you like.

Gas City is completely open-sourced and MIT-licensed. Built for enterprise, fun for tinkerers.

The rest of this post is about why you might want to try it yourself. This post is _not_ about how to use Gas City; there is a ton of getting started material emerging, but a good start is the gastownhall.ai Discord general announcements.

**The Light Factory**

Everyone is buzzing about “dark factories,” so let’s start there.

A dark factory is any system in which coding agents are set up to work autonomously without humans watching. The name is frankly a little bit misleading. It just means background work. It’s only dark inside a dark factory because the work is happening in rooms where there are no humans present. But those rooms are allowed to have windows. Observability is a choice in dark factory design.

Gas City, like Gas Town, has chosen to maximize Observability. You can dive in and interact with any worker at any time, and nothing is ever hidden from you, nor from the agents, except for the guardrails you choose to install.

So then is Claude Code a dark factory? The terminology here, with factories and harnesses and so on, is all evolving fast, so there aren’t any reliable definitions yet. But Claude Code did not start life as a dark factory, because you were generally supposed to watch it while it works. It’s making overtures in that direction with subagents and agent teams, but they keep the lights off intentionally, presumably because it’s a consumer-facing product and it keeps it simpler.

Gas City takes a different approach: all agent workers are equally visible and addressable. The lights are on. Normally for the ephemeral “polecat” workers, you don’t bother looking at them. But unlike with coding-agent subagents, if you want to talk to your polecats, you absolutely can.

And so far, Gas City is the only dark factory that has been designed with the goal of creating other factories. The lights are 100% on when you’re working with the Mayor and Crew in Gas City, and you can dial them up as needed in the back rooms with the polecats and dogs. For this reason I have begun to think of Gas City as a Light Factory… or at least, a very well-lit dark one!

![Gas City: The Light Factory](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*8-hYkilxtT7SKwJfRY-odQ.jpeg)

At first, dark factories were only used for writing code faster. They focused on the software development process, and basically replaced IDEs. And that’s still primarily how they are used today. I do see some shops making good headway into CI/CD pipelines and peripheral business processes. But dark factories are headed towards handling infrastructure, operations, and even core business processes.

Gas Town users soon realized that you could use Gas Town’s stack to create standalone orchestrators that had nothing to do with writing code. Gene Kim and I have talked to companies that are doing this, and I’ve also started myself. Running my online game Wyvern requires a bunch of routine maintenance that goes way beyond CI/CD.

For instance, when players in my game hit 25th level, a unique perk is they can upload custom images for that character. That perk is permanent operational debt that I’m saddled with. I have to monitor the “Hall of Fame” submission queue, visually scan the player-uploaded images for inappropriateness, and then approve and upload them into the game. I’ve automated much of it, but I still have to look at them and run the scripts to approve or reject.

A dark factory could totally do that. And it’s got nothing to do with writing code. It’s a business process.

So dark factories are a much broader concept than IDEs. They can automate and orchestrate any arbitrary process. But with what reliability?

Well, that depends on how robust your custom factories are, doesn’t it?

**The Shape of Things to Come**

In the very near future, devs will become shepherds, tending flocks of agents which do the ground-level work. It’s not really a manager job, because the workers are not humans; a coding agent’s cat doesn’t get sick and need to go to the vet in the middle of a sev-1 outage. But agentic workers do make human-like mistakes, and they respond well to being managed like people, by and large. They don’t need management. But they need guidance. Shepherding. Keeping-on-rails. That’s the new role for human builders and operators.

![Engineers: Agent pack shepherds](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*PlXGD_eYtYufEXWUqTm5aQ.jpeg)

As soon as I had this realization, the shepherd thing, I knew we’d discovered at least 2–3 new squares in my now-infamous “8 Stages of AI Adoption” diagram from Welcome to Gas Town:

![Original 8-Stage Dev AI Evolution Chart (January)](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*o55_sML8whpdfDK1hD6qwg.jpeg)

At Level 8, you have mastered using an orchestrator to manage dozens of concurrent agents. As your experience grows, you begin to see the potential to use agent mini-factories everywhere.

After you deploy your first real one, you officially have a garden you’re tending. A tiny crew of agents, acting like employees. Your little factory team runs 24x7, which requires maintenance. You now have to keep it running, manage upgrades and patches, rotate the logs, and of course make sure it’s doing its job. But you don’t have to do the work yourself anymore! So it’s still a huge automation improvement… as long as you can keep it reliable.

You should almost never deploy a single-agent pack for a real business process. The reality is that any agent can go temporarily insane, at any time, and make a bad call. No matter how smart they are. We know now that hallucinations and false memories and forgetting are baked mathematically into all memory systems; there’s no avoiding it. So you should never just have one coding agent managing a piece of infrastructure. Not even for a low-stakes part of your business. You should always have at least two or three working together on a little crew.

This is exactly why dark factories are so attractive. With Gas City you can build any sort of adversarial group structure you like, for a team of collaborating agents. They can watch over each other. By catching each other’s mistakes, the agent group reaches a far more reliable consensus and outcomes than you can get from a single agent. That’s why we think of deployed orchestration as being fundamentally made of multi-agent teams: factories. Define your pack, deploy it, et voila — you are officially on the path to being an AI-native shop.

**Orchestration-maxxing**

Let’s look at what a specific small custom factory looks like in practice.

For my game’s player custom-image uploader, images are submitted via a website form, so it starts with an agent that wakes up on a hook and does the work. Then a second agent checks the first agent’s work. Perhaps the first agent makes a recommendation, and the second agent takes action.

I could add more agents to that pack, but I think two should be enough for this little workflow. It’s super low volume, low-stakes, not the end of the world if the agent crew messes up and approves a bad image. Adding that second agent, much like a second hash function, dramatically decreases the chance of some sort of collision. So in my pack, I declare the two agents, their identities, prompts, sandboxes, skills, and all the other stuff they need. Gas City can help you do this automatically, of course.

![Two-agent pack handling Wyvern custom player image queue](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*06pNV96zX1_y03WM77gr9w.jpeg)

A deployed Gas City pack is an AI-native business process automation. Once your pack is running, Gas City’s supervisor agent system will keep it going, even on remote machines.

At this point, with one deployment, you are officially at Level 9 on the AI Adoption Chart.

After you make your first one, you realize you want to use dark factories for _everything_. I want every damn NPC in my actual game to be an agent, yeah? Not first, obviously! I’ll have to build up to that gradually, just like you should, when you first start with AI factories. Pick low-stakes, easy wins, get them automated, and learn your lessons early on when getting burned isn’t so bad.

Level 10 of the AI Adoption is where you’ve deployed a bunch of agent packs, each with its own little world it’s managing. They have identities, consoles, you can check in on any of them, tweak their standing orders, you name it. They’re starting to be a handful. But you don’t need to build an orchestrator for them, since Gas City is the orchestrator. What exactly are you missing?

The problem is, in stage 10, you, the human, are the control plane. Once you have a few dozen of these deployed packs, you will start to become the bottleneck on curating them. Gas City manages them, and they’re all functioning correctly on their own, but how are they working together as an end-to-end system? They can all send messages to each other, but have you given them clear, practical guidance on when it’s appropriate to do so?

The answer to all your problems at Stage 10 is of course to slather on more Gas City. You build yet another crew, with a declarative Gas City pack, and its job is to manage a subset of your deployed packs. Maybe you spin up a couple of them, one for the cloud services, one for customer service. Area manager teams, basically. You evolve it into the shape of your problem.

Once you start building your way out of needing to hand-manage dozens of packs, you’ve officially graduated to Level 11, which is Factory Builder. You’re building a full custom orchestrator, a full dark factory, and you’re operating at the level of architect, curator, and shepherd.

![The (currently) 11 Stages of AI Adoption](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*lVrdJo8E8v_bDLdCy1e84g.jpeg)

Your Gas City is the sum of those little factories you’ve created to run your business around the clock. No sick cats, no vets. Just the occasional wild worker hallucination. But your teams, if you build them right, will catch most mistakes. And all of it will be logged and auditable.

Reliability, friends, is a dial. You choose where to set it. More rounds of review, more backstops, more guardrails, more judges, and you can get agentic workers to be as reliable as you need them to be, at least up to some practical ceiling. I wouldn’t use it in situations where you could physically hurt people, e.g. in medical or navigation systems. Not in 2026. But we’ll build our way there, like engineers do, over the next couple of years.

That’s the new world. If you’re convinced already, then you’re done! You can just go play with Gas City. I’ll finish up by talking about how you can use Gas City to start chipping away at your SaaS problem.

**Escape From SaaS Mountain**

When I was a kid, my parents wouldn’t let me watch Escape From Witch Mountain (1975) for whatever dumb reason. Probably because it had “Witch” in the title and I was six. I’m still miffed about it, though. Who knows how much better-prepared I’d be for life if I’d watched it?

And now, I wonder, are investors and boardrooms watching Escape from SaaS Mountain? Or are their moms not letting them, too? Perhaps we’ll never know.

SaaS is in kind of a funny position right now. If you look at the pyramid from the top, at the SalesForces of the world, it looks like they’re fine, they just need to pivot to make their SaaS sexy to agents. Benioff did that recently with SF, exposing the whole platform headless and API-first, in exactly that: a bid to make SalesForce sexy to agents. That’s the new game for SaaS.

People look up there and say, oh it’s gonna be just fine, those are systems of record, nobody’s going to reimplement them. Nobody wants to pay the tax of maintaining those systems for security, compliance, performance, scalability, etc. Right? This is just the new Buy vs Build.

But then you look at the _bottom_ of the SaaS pyramid and it’s like, oh crap, this stuff is disintegrating in real time. Just in this past month I was visiting an enterprise customer where the non-technical staff — non-technical! — have been rebuilding a $30k/year SaaS tool in-house on Gas Town. Their VP is now mapping out how to convert millions in annual SaaS spend into headcount, bringing those capabilities in-house as core competencies. The question they asked us was: how do we actually do this at scale?

From that perspective, it’s clear that some SaaS will be eaten, and the rest will have to pivot. The only question is how far up the pyramid people will be able to push, bringing it in-house. It’s going to take a few years to find out.

![SaaS Mountain is showing some cracks](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gZLRwEoeXo12y4je1GO74Q.jpeg)

I’m going to share some stuff with you that will potentially change the way you think about SaaS forever. Much of it is credit to Brendan Hopper, Commonwealth Bank of Australia.

Atlassian, nominally, is an Australian company: a poster child for what the Aussies can accomplish when they put their mind to tech. But according to Brendan, it’s branding over substance. Atlassian is registered in Delaware, about half their devs are U.S.-based, and they have strong incentives to have engineers in the U.S. They serve pretty much all traffic out of the U.S. For all practical purposes, Atlassian is a U.S. company.

Much love to Atlassian, but they have to be, because there is no other option. The center of gravity on the U.S. west coast is inescapable.

Every dollar of SaaS spent outside the U.S. is extracted from a local economy and moved into California’s economy, which would now be the fourth largest economy in the world if it were a separate country. SaaS is moves money from the rest of the world into the U.S. And there’s no fighting it. If a big non-US tech company like Atlassian can’t, it’s going to be hard for everyone.

Another interesting thing about SaaS is that it grows to become the superset of all the features for all its customers. Over time, most customers gradually recede to using 20% of the SaaS’s features, while subsidizing the remaining 80% for the other customers.

The implication is that you don’t need to reimplement all of SalesForce, just the parts you’re using. If you want to bring SaaS in-house, you only need to build the 20% of the features you need. And you also only need as much security, scaling, and compliance as is appropriate for your company, which is not necessarily the same as you need for a Fortune 100 company.

So SaaS is extractive, and expensive. Almost nobody is getting full value out of it, and all that value is streaming into Silicon Valley.

Yet another funny thing about SaaS is that the Venn diagram overlap with your own needs is always incomplete. Not only are you subsidizing features you won’t use, you’re also failing to get features that you _would_ use. And when SaaS becomes dominant it stops innovating.

In short, SaaS began life as a way for everyone to get savings through specialization and economy of scale. And it has evolved into an extraction machine that’s ideal for almost nobody.

So you shouldn’t feel bad about de-SaaSing your company. Just start at the bottom.

The bottom of the SaaS pyramid is a rowdy place, a rough place. A lot of it isn’t even SaaS, it’s software on disks in a closet that someone is paying an annual license for. Construction, paralegal, medical, farming, biotech, environmental, there are hundreds of domains where ancient SaaS is still holding companies hostage, and not meeting people’s needs.

So the people are fighting back! As the models and tools get more powerful, people are beginning to bring their SaaS back in house. I hear VPs of Eng say, “We are spending $X million/year on SaaS. Let’s convert that to salaries and bring it in as a core competency.”

But until this week, there hasn’t been a viable path forward, aside from experimenting with building your own orchestration on raw coding agents. That is a long journey, and most people need help with it. Most of the orchestrator vendors out there are off building agent brains and persona libraries — interesting research projects, but not what you need to replace a piece of SaaS in production. To replace SaaS, you need the unglamorous stuff: declarative deploys, audit trails, version history, identity, and a memory layer that survives the inevitable agent failures. Those are the primitives that make in-housing tractable.

Enter Gas City: The ultimate de-SaaSer. It’s like de-lousing your company. It makes Build and Maintain a pragmatic choice, particularly at the bottom end of the pyramid. You build the replacement software, then set up agent teams to run it for you.

A small team of three to five human engineers running Gas City packs can credibly replace seven-figure SaaS bills, and the capability stays in-house as a compounding asset instead of leaking out as recurring rent. Yes, you own the uptime, security, and compliance now. But you only need the level of each that fits your company — not Salesforce-grade everything for a 200-person business. And Gas City’s audit trail, with every agent action recorded in a git-versioned Dolt database, is frankly better than what most SaaS vendors can produce when you ask for theirs. That’s your SOC2 story, sitting right there in the database, already written.

That’s the problem with OSS SaaS replacements today, and it’s why few have adopted them: they don’t run themselves. ChatWoot is a full-featured ZenDesk replacement, but you have to run it, and most companies can’t afford the operational overhead. SaaS has to evolve to be AI-native! It’s not good enough to be OSS. It has to have agents in it, running it, just like ZenDesk the SaaS handles everything for you as a service.

This implies that all SaaS worldwide needs to be rewritten/reenvisioned from the ground up to be fully agentic.

But where do you start?

That’s where Gas City gives you a refreshing leg up. You can start building bespoke Gas City orchestrators today. You’re not going to rewrite your business overnight. In fact it’s going to take years. You should approach the whole endeavor with appropriate levels of caution and even trepidation.

But you might as well start eating the elephant a bite at a time.

**Next Up For Gaslandia**

I had a set of projects in flight that were banking at least Mythos-class models, which means they’re all on hold. Gas City will be the extent of my ambitions for a while. I plan to become a Gas City power user, not just for coding, but for running my own systems. I want to see that control plane emerge and understand how you can run a business with hundreds of collaborating agents.

Most other orchestrators I’ve seen have been able to be super high-ambition. Many lean heavily into the idea that agents, when put together, can just figure stuff out. And to a large extent, they can. But they are intentionally low-control systems. And when they fail, they go off-rails with no audit trail.

Gas City is a high-control system. It has high parallelism (Julian has had hundreds of concurrent workers in a city), but it uses structure to keep agent swarms organized. It’s still incredibly flexible and freeform when it needs to be; you can just tell a group of polecats to go solve any problem. But most work is spelled out, tracked, and governed carefully.

A key concept in MEOW is the _formula_ — a reusable template for a unit of work. You write a formula once for a recurring workflow (triage an incident, review a player-uploaded image, rotate the logs, run the nightly ETL) and then pour it whenever you need that work done, instantiating a fresh molecule of beads that an agent crew can pick up and execute. Over time your library of formulas becomes a declarative inventory of every business process you’ve ever automated — version-controlled in Dolt, composable, and forkable by anyone on your team. That’s how Gas City turns undocumented workflow knowledge into a durable, shareable codebase.

When you express all your work in the MEOW stack, as Beads and Epics (typically harvested from an upstream system like Obsidian), and your agent actions are all recorded in both a database and version history, you wind up with infinitely more control over the outcomes.

In enterprises, controlling the outcomes is the holy grail. So I personally wouldn’t use any other orchestrator I’ve seen. They don’t have the federatable, versioned, queryable memory system that Dolt provides. They don’t have MEOW.

Everyone is suffering from tool overload. There are too many tools out there, and nobody can keep up with all of them. My life is so simple in comparison. I never look deeply at any new technology until it reaches a pretty loud public signal threshold. And I almost never have to, because the Gas Town ecosystem has solved so many of my problems.

The Gas Universe in general is a pretty reliable bet at this point. It integrates with everything. Beads has been out for six months, Gas Town for four months, and the Wasteland for two. We’ve got over two thousand on the Discord. The community has spoken: This is The Way. People love working with this system, despite its occasional quirks and frustrations. It’s more fun than anything else we know.

Should you switch from Gas Town to Gas City? Yes! Gas City aims to be better in every way. And Gas City hit 1.0 today, so you should be good to go. Make sure to complain loudly on the Discord if it’s not working for you! Help will be on the way.

Do you _have_ to switch to Gas City? Nope, we have some new maintainers onboarding onto Gas Town this week to help with the load. We’re going to continue maintaining the O.G. Gas Town as long as people still need it.

See you all on the Discord at [gastownhall.ai](http://gastownhall.ai).

![Gas City launches v1.0!](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*ux-45f5SVQ8k70vgH_xGkA.jpeg)