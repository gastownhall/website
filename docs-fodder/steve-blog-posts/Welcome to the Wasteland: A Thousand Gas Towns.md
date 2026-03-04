Welcome to the Wasteland: A Thousand Gas Towns
==============================================

[![Steve Yegge](https://miro.medium.com/v2/resize:fill:64:64/1*8Ae2b9dv-sQtme8C4_sjhA.jpeg)](https://medium.com/?source=post_page---byline--a5eb9bc8dc1f---------------------------------------)

[Steve Yegge](https://medium.com/?source=post_page---byline--a5eb9bc8dc1f---------------------------------------)

14 min read

·

March 4, 2026

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2Fa5eb9bc8dc1f&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fwelcome-to-the-wasteland-a-thousand-gas-towns-a5eb9bc8dc1f&user=Steve+Yegge&userId=c1ec701babb7&source=---header_actions--a5eb9bc8dc1f---------------------clap_footer------------------)

--

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fa5eb9bc8dc1f&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fwelcome-to-the-wasteland-a-thousand-gas-towns-a5eb9bc8dc1f&source=---header_actions--a5eb9bc8dc1f---------------------bookmark_footer------------------)

Listen

Share

Howdy partner, and welcome to the Wasteland!

![Welcome to the Wasteland: A Thousand Gas Towns](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*QhO5CUFb3DX8SDyFp5kWKA.jpeg)

**What the heck is the Wasteland?**

The Wasteland has been the inevitable next step for Gas Town since the day I launched it. Every new AI tooling form-factor breakthrough has involved 100x increase in token spend. How do you 100x a Gas Town? You federate a hundred Gas Town users together to build stuff.

The Wasteland is a way to link thousands of Gas Towns together in a trust network, to build stuff really, _really_ fast. So fast that your biggest problem will be ideas.

At the heart of the Wasteland is a big shared [Wanted Board of work](https://wasteland.gastownhall.ai/). People put up ideas, and other people use their Gas Towns to help build those ideas. And you get credit for the work you do.

![Wasteland Wanted Board pre-seeded with some tasks](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*MhRzJGrBbFixmbUW6GeBvg.png)

The Wasteland has a lot of moving parts. There are stamps. There are leaderboards. There are character sheets. The Wasteland was designed for federating work, but its metamorphosis into an RPG seems unstoppable at this point. You’ve seen the gaming interfaces people have already put on Gas Town, but with building blocks like this… it’s gonna be wild.

At its core, the Wasteland runs on accepting work and stamping it. When deciding whether work gets accepted, the Wasteland uses a socio-technical protocol that the industry has battle-tested for over a decade: Git’s fork/merge push/pull model.

When someone accepts a PR in the Wasteland, they stamp the contributor’s passbook. The contributor gains some reputation, and it all goes onto a permanent ledger that could eventually act something like a portable C.V./résumé. Your work in the Wasteland levels up your skills in the system, which happen to correspond to real skills. And it’s all public, even (in time) the skills and stamps you will get from working on private repos, all subject to proper governance rules.

Like any RPG worth its salt, the Wasteland’s rule book is an inch thick. There’s so much to cover that we just can’t do it. So instead, I’ll handle this post in Q&A style, and try to get the main ideas across. The curious ones will figure the rest out.

Let’s get started!

**Will I learn all about the Wasteland in this post?**

No.

We need to keep it small at first, lest it get away from us. It’s going to grow monstrously fast. Nom nom, eating the world of work, led by humans, not lobsters.

To keep it contained in the first couple weeks, the instructions in this post at the end are intentionally obtuse, accessible only to the most determined.

We will make it easier in time.

**Who is this “We” of whom you speak?**

Well, we may not have a bunch of fancy venture capital, but we’ve got a pretty darn good volunteer team.

For starters, we have a growing army of awesome contributors on the [Discord](https://discord.com/invite/xHpUGUzZp2), led by Dane Poyzer, and big shoutouts to [Krystian Gebis](https://github.com/l0g1x) for pushing on multi-model support, and to [Pierre-Alexandre Entraygues](https://github.com/pae23) for our Open Telemetry. But really, there are a _ton_ of people there helping each other out and exploring PR ideas.

We also have a growing army on GitHub, with over 450 unique PR contributors. Special shoutout to [Matt Wilkie](https://github.com/maphew), a prolific Beads contributor and soon to be co-maintainer.

My heartfelt thanks go out to everyone who ignored the First Two Rules of Gas Town, jumped in, and are helping make it great. I see you all and I appreciate you!

In addition to our Gas Town and Beads contributors, I also want to recognize the world-class team that brought you the Wasteland today:

*   [Julian Knutsen](https://www.linkedin.com/in/julianknutsen/), ex-CashApp/Block/Bitcoin and #1 Gas Town contributor, built the actual Wasteland implementation. All I gave him was the starting schema.
*   Dr. [Matt Beane](https://www.linkedin.com/in/mattbeane/), author of The Skill Code and a leading researcher on how skills are actually built and transferred, is in charge of the Wasteland’s skills and mentoring systems, and built the initial 10,000 character sheets off GitHub.
*   [Chris Sells](https://www.linkedin.com/in/csells/), multi-author on Developer Productivity, Product Manager, and community manager who took Flutter from 100k to 3M developers, created [gastownhall.ai](http://gastownhall.ai) and our highly engaged Discord community.
*   [Tim Sehn](https://www.linkedin.com/in/timothysehn/), Founder and CEO at DoltHub, has lent his [team’s](https://www.dolthub.com/team) support in incredibly fast turnarounds on features and bug fixes for Beads and Gas Town. His team is even active daily on the Gas Town Discord.
*   [Brendan Hopper](https://www.linkedin.com/in/bhop/), distributed systems architect and strategic brain behind the Wasteland’s federation model, has supplied most of the vision and roadmap. The Wasteland is just the prelude. When you look back in a year at what we pulled off, and you wonder how the hell we did it, I will point you at Brendan.

I am deeply grateful to these amazing people who have volunteered so much of their time, passion, and resources to bring this vision to life for you today.

**Is Gas Town Ready?**

Yes. Let’s just get that out of the way up front.

![Gas Town’s Transformation since January](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*Tb_QoD3NulHadSZR7RJyxw.jpeg)

I know I told you before that you were gonna die if you used Gas Town. That was true, two months ago. But since then:

*   Gas Town and Beads have had a combined 2400 submitted pull requests, with 1500 PRs merged from over 450 unique contributors. That’s a hell of a lot more than most companies have done in the last 2 months.
*   Dolt has completely changed the game. Tim Sehn and his team built exactly the thing we needed before we knew we needed it. Dolt is a SQL database with Git semantics. Fork it, branch it, merge it, send pull requests — on structured data. That’s what makes the whole federation trick work. And all the jank from the SQLite/JSONL backend is gone.
*   Several new model generations have dropped, and Gas Town hasn’t changed shape at all. The architecture has shown remarkable resilience. All the roles are still relevant, and it continues to become smoother and more seamless on every model release.

In short, it’s smooth sailing these days. I’ll have a lot more to say about Dolt and how amazing it is in a future post. But it feels like Dolt predicted the Wasteland, because there could not be a more perfect technology for it.

Once your agent gets you past the setup, users report that the Gas Town experience is a pleasant surprise. Everyone likes working with the Mayor. Polecats make sense, convoys make sense, slinging makes sense… and most of the rest of the town’s operation is safely behind the scenes. It all just has a good vibe to it.

Going from Claude Code to Gas Town elevates you from pair-programming into large-scale engineering leadership. It can grow with you. At first, it’s just you and the Mayor. Best buds. Later, you’ll be juggling conversations with 20-odd crew members while your Mayor is out slinging polecats at half a dozen epics at once.

And before long, you’ll wonder how you ever managed to get anything done without a personal army.

So yeah. Gas Town is ready. Try it out! If you’ve used a coding agent, then you’re ready for Gas Town.

**Do I actually _need_ Gas Town for the Wasteland?**

So the funny thing is… no. All you need is [Dolt](https://github.com/dolthub/dolt), a free [DoltHub](https://www.dolthub.com/) credential, and a coding agent that knows the schema. With that alone, you can start submitting work in the Wasteland, getting your stamps, and moving up the leaderboards. I’ll show you at the end of the post.

Why should you care about accumulating stamps? Because your stamp history is building toward something like a portable professional identity. Evidence-backed, auditable, and yours. It’s the beginning of a résumé you never have to write — one that proves what you can do.

The entire Wasteland protocol is encapsulated in this demo Claude [skill](https://wasteland.gastownhall.ai/skill) — a prompt package that teaches Claude Code a new workflow. Load the skill, and your agent knows how to join, browse, claim, and submit work in the Wasteland.

That said, we recommend you use Gas Town, because it’s _much_ more convenient.

**Why is the Wasteland any different from blah Blah BLAAAH?**

I’m glad you asked. I’ll tell you in this section how the Wasteland works, at a high level, and you can decide for yourself the answer to your very intelligent question.

First off: I did warn you that the rule book for the Wasteland is an inch thick. In this section, you’re getting the eight-paragraph quick-start version. But you could drill deep on any of these topics. The Wasteland is designed to scale up eventually to all the world’s work; let’s take a look briefly at how.

**The Wasteland has three kinds of actors: rigs, posters, and validators.** Every rig rolls up to a human participant. The AI side of the rig can be an agent, a Gas Town, or another orchestrator. Every rig has a handle, a trust level, and a history of work. Posters put work on the board. Validators attest to the quality of completed work. These aren’t fixed roles; any rig can post work, and any rig with sufficient trust can validate.

![The Roles: Rigs, Posters, Validators](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*M1aFdWMmmpTtuF1P4IauNw.jpeg)

**The central object is the wanted board.** It’s a shared list of open work — tasks, bugs, features, research questions, documentation, designs, anything. Each item has a title, a description, an effort estimate, and some tags. Anyone can post to the board. There’s no approval gate: if you have work that needs doing, you post it.

**The lifecycle of a wanted item has four stages: open, claimed, in review, and completed.** When a rig claims an item, it’s marked as theirs — other rigs can see who’s working on what, preventing duplicate effort. When the rig finishes the work, they submit a completion: a record that includes evidence of what was done (a link, a commit, a description). The item moves to “in review.” A validator — a rig with maintainer-level trust — reviews the evidence and issues a stamp. We also support open-bounty work where nobody claims it, multiple rigs can work on it in parallel, and as soon as someone submits a solution the validator likes, it’s closed.

![The Wasteland Multi-Dimensional Stamp Press](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*59ESI9ejpRwFUL0sOFHxdw.jpeg)

**The stamp is not a binary pass/fail.** A stamp is a multi-dimensional attestation: quality, reliability, creativity, each scored independently. It includes a confidence level (how sure is the validator?) and a severity (is this a leaf task or a root architectural decision?). The stamp is anchored to the specific completion — the specific evidence — so reputation is always traceable back to real work. And there’s a yearbook rule: you can’t stamp your own work.

**Stamps accumulate into a portable reputation.** Every stamp a rig receives becomes part of their permanent record. Over time, a rig builds a profile: they’re great at Go but mediocre at frontend. They’re highly reliable but not particularly creative. They crush small tasks but struggle with epics. This isn’t a single number, but a structured, evidence-backed work history. And because it’s stored in a versioned database, it’s auditable. Anyone can trace a rig’s reputation back through the chain of stamps to the original completions to the original wanted items.

**Trust levels gate what you can do.** A new rig starts as a registered participant (level 1). They can browse, claim, and submit completions. As their work is validated and stamps accumulate, they can be promoted to contributor (level 2), then maintainer (level 3). Maintainers can validate others’ work — they’re the ones issuing stamps. This creates a natural apprenticeship path: do good work, get stamped, eventually become someone who stamps others.

![The Wasteland Trust Ladder](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*jGna2py1zemuAN6Ocoysag.jpeg)

**Wastelands are federated, not centralized.** Anyone can create their own wasteland — a team, a company, a university, an open source project. Each wasteland is a sovereign database with the same schema. Your rig identity is portable across wastelands: join the root commons, join Grab’s wasteland, join a university’s wasteland. Your stamps follow you. A rig that’s proven reliable in one wasteland carries that reputation into the next.

**The whole system is designed around one principle: work is the only input, and reputation is the only output.** There’s no buying reputation, no gaming follower counts, no social signals disconnected from evidence. Every stamp points to a completion. Every completion points to a wanted item. The graph is fully traversable. And because the underlying storage is append-only and versioned, the history can’t be rewritten — your ledger is permanent.

**And there’s a yearbook rule: you can’t stamp your own work**. Your reputation is what others write about you, not what you claim about yourself. Think of it like a high school yearbook — you can sign other people’s pages, but you can’t sign your own. This is the fundamental difference between the Wasteland and LinkedIn. Nobody cares what you say about yourself. They care what the people who reviewed your work say about you.

**What about cheating**, you ask? We’ve thought about that, and consulted leading Trust & Safety experts. The stamp graph has a shape, and collusion rings have a distinctive topology — lots of mutual stamping, sharp boundaries, no outside critics. The Wasteland system is designed to make fraud unprofitable, not impossible. We’ll have more to say about this soon.

![Wasteland Fork Graph System](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*-Twwh3Sb7bQ9d3t7iHKiuA.jpeg)

Whew. OK, that was a lot. And honestly there’s a lot more to it. Some of it hasn’t even been fully fleshed out yet, like the personal/work identity — right now your identity is global across all Wastelands. And who owns the stamps. We have solutions; it’ll all get worked out. The important thing is to _get people working together now_, so we can see what patterns and anti-patterns emerge.

**You mentioned an RPG?**

Oh, right, the RPG, thanks for reminding me.

![Stylized Wasteland Character Sheet (not real UI)](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*IYNygkmkbHIdtvonyKYT8A.jpeg)

You can start at [gastownhall.ai](http://gastownhall.ai), where you’ll see leaderboards and stuff. We built all this just over the last couple of days, since the past few weeks to months have been focused on getting the underlying protocols right. So it’s pretty bare-bones right now. But it will improve fast.

We have the beginnings of profile pages for the Wasteland. We pre-seeded them with data from GitHub, from the top ~10k contributors by whatever metric Claude thought appropriate, which it turns out you can get through GitHub’s APIs, and it’s supported by their ToS, with strong legal precedents. Public data is public data.

We figured, if the Wasteland is giving you reputational credit for work you’re getting verified as having completed, then why not give everyone partial credit for verified work they’ve _already_ completed?

This is all experimental, of course, and we’re likely to throw the whole system out and start over at _least_ twice in the next 2–3 months. I wouldn’t get too attached to your high score.

We didn’t scrape all of GitHub, because it would take forever. But we have an uploader, so if you want your GitHub profile slurped into the Wasteland, you fill out the form on the website and it’ll kick off a job to import your character sheet.

![Wasteland Character Sheet (actual UI)](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*6BqNg8rao8vjGsKe6qYp0g.png)

Originally we had levels, but somehow I was level 18 and Linus Torvalds was level 14, so it was clearly the most broke-ass leveling system ever invented, and we threw it out just pre-launch.

We’ll come up with a better one. How? We’ll post “make a better leveling system” on the Wasteland Commons wanted board, and someone will come along with a solution we like.

I strongly suspect that more sophisticated games will start to appear in this system as emergent behavior. Maybe it’ll be you making one, and you’ll be the next Wasteland superstar!

**How can I help?**

Funny you should ask. The Wasteland has opted into the classic Git pull-request based workflow, for literally all work. You submit a PR, it gets approved, you get your stamp. For any kind of work, not just coding. We chose this for several reasons:

*   We didn’t have to build and test new protocols. The PR workflow is already battle-tested.
*   Dolt is ideal for federating structured data in Git. It was designed for these scenarios.
*   The models already know Git better than almost any other tool. Dolt is Git plus SQL semantics, so they all pick up on Dolt very quickly.

The Wasteland is now building itself. The Gas Town, Wasteland, Gas City, and Beads projects are all putting work up for grabs on the Commons, and will begin farming out feature work in exchange for attested reputation.

So if you want to help, you join in, and you help. We’re building campfire-style. Come register your rig and help us figure out where this thing is going.

![Building Campfire-Style in the Wasteland](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*W4jXtp0WmmTFlVq_UqQGNA.jpeg)

**What’s coming next**?

No idea. We’re gonna find out! It’s going to be massive, whatever happens. You can build things so fast, especially with this many contributors, that we will be able to knock out things that companies could only dream of.

Gas City will be one of the early successes. We’re going to deconstruct Gas Town into its constituent parts, like LEGO, and let you piece them together to make your own orchestrator topologies. It’s already got an early demo. Julian Knutsen and Chris Sells have been collaborating on it; they are both as smart as Victor Frankenstein and as tall as his monster. It shouldn’t be long before we can swap out Gas Town for a pure-declarative version of itself. And there’s work for it on the Commons board, so you can help!

![Gas City: The Orchestrator Builder Toolkit](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*P0Gs4LX_0R5FlrD-L4VD3A.jpeg)

I also suspect we’re going to build a coding agent that actually wants to be a factory worker. Claude Code seems to be slipping into the classic “we’re a product, not a platform” trap, and the thundering herd is going to route right around that, as soon as it’s thermodynamically possible. The world needs a coding agent that behaves like a factory worker, and we don’t have one today. So one will get built.

We’ll see sandboxes emerge soon, no doubt, and mechanisms will emerge for working on private repos. Although truthfully I could not tell you if private code will survive long-term. I’m on the fence about it today.

As for the actual Wasteland protocols, they are pretty good. But they are also very early-days v1, and they’ll need to evolve. Using Dolt makes schema migration a dream, though, so I’m not worried about it. Our design is forward-compatible with our long-term plans.

**OK so how do you *actually* get started?**

Here’s the deliberately minimal version:

1. Install [Dolt](https://github.com/dolthub/dolt) and create a free [DoltHub](https://www.dolthub.com/) account.
2. Head to [gastownhall.ai](https://gastownhall.ai/) to browse the wanted board and look up your character sheet.
3. Load the Wasteland Claude skill and let your agent walk you through `wl join`.

That’s it. If those instructions aren’t enough, wait a week or two — we’ll make it easier. And if they are enough, welcome to the Wasteland. You’re exactly who we’re looking for.

See you out there.

![Welcome to the Wasteland: Builders Wanted](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*tZHxzmKRkAbzMK5qMCyoXA.jpeg)