Gas Town Emergency User Manual
==============================

[![Steve Yegge](https://miro.medium.com/v2/resize:fill:64:64/1*8Ae2b9dv-sQtme8C4_sjhA.jpeg)](https://medium.com/?source=post_page---byline--cf0e4556d74b---------------------------------------)

[Steve Yegge](https://medium.com/?source=post_page---byline--cf0e4556d74b---------------------------------------)

13 min read

·

5 days ago

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2Fcf0e4556d74b&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fgas-town-emergency-user-manual-cf0e4556d74b&user=Steve+Yegge&userId=c1ec701babb7&source=---header_actions--cf0e4556d74b---------------------clap_footer------------------)

--

8

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2Fcf0e4556d74b&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fgas-town-emergency-user-manual-cf0e4556d74b&source=---header_actions--cf0e4556d74b---------------------bookmark_footer------------------)

Listen

Share

It’s been a busy 12 days since I launched Gas Town. ️I’ve merged over 100 PRs from nearly 50 contributors, adding 44k lines of code that no human has looked at. This has grown Gas Town’s total size to 189k lines of Go code since its first commit on Dec 15th, which is now 2684 commits ago. It’s accelerating; I carefully reviewed and merged 25 PRs today alone on Gas Town, and another 17 on Beads. Another dozen or so I sent back to the contributors for changes.

How can I keep up this maintainer pace without breaking a sweat? Well I’m glad you asked, Pilgrim. I’m using Gas Town, that’s how. Keep those PRs coming. I’ll show you how I keep up with them using PR Sheriffs.

![Gas Town works all night while you sleep](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*rC7NX4lGtoKT17gs32qo0g.jpeg)

I see people have been breaking the first two rules of Gas Town. You’re not supposed to be using it. But I see early adopters cheering drunkenly on LinkedIn because Gas Town drained their bank account and did 10 projects overnight. You know, people used to get mad when Devin did this. But I get it. Once you get hooked on Gas Town, it’s hard to get mad. It’s just so damn cool. So I’m publishing this guide to give a _few_ pointers to the intrepid.

My apologies to the BAGS crowd, you know who you are — you rock, but unfortunately I’ve been drowning in the Gas Town Murder Mystery, plus a deluge of community PRs, not to mention fending off money _other_ people are trying to throw at me. So I’ve been too overwhelmed to go find the money I hear you’ve been throwing at me. But I will come visit BAGS ASAP my MFs.

Gas Town version 0.3.0 will be out this week. This will be a comparatively stable version. We’ve gone through all sorts of crazy issues since launch. There was the Gas Town Serial Killer Murder Mystery that went on like a game of Clue for close to a week. Spoiler: The Deacon did it. It was cleaning up “stale” workers that weren’t stale and murdering entire crews mid-task. So yeah there was that. And we’ve had workers stalling out, getting lost, orphaned, confused about who they are. And no shortage of heresies: compelling but wrong beliefs about the architecture that spread invisibly. Heresies happen regularly when you’re coding blind. You have to sniff them out and eradicate them, often multiple times.

Anyway. It’s all working more smoothly now. Gas Town’s User Safety Index has been upgraded from “randomly rips user’s face off” to “randomly kicks user in groin,” which I think you’ll agree is _still_ a good reason not to use it yet, no matter how much fun everyone seems to be having with it.

![Gas Town stabilizes quickly through community contributions](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*0AvTjOPUGl0XFP51PnKWLA.jpeg)

With that, here are some tips on how I use Gas Town. I’ll group them into three developer loops. The [Vibe Coding](https://www.amazon.com/Vibe-Coding-Building-Production-Grade-Software/dp/1966280025) book I wrote with Gene Kim, just published in October, characterizes the agentic developer workflow as three nested loops: **Outer Loop** (days to weeks), **Middle Loop** (hours to days), and **Inner Loop** (seconds to minutes). They aren’t strictly isolated and there’s some overlap, because some tasks happen at cadences that aren’t time-based, but pressure-based. But it’s a reasonably good mental model. These loops still hold, and Gas Town adds some new steps to each one.

**Dev Outer Loop**
------------------

*   **Upgrade every day** if you’re really going to try to use Gas Town. You shouldn’t be using it now, unless you’re either experimenting or you’re contributing. Otherwise it’s too much of a headache. Give it a few weeks.
*   **Learn tmux** — it’s a little tricky at first, but incredibly powerful. Try to learn a new keybinding or feature each day. Familiarize yourself with how copying text out of the terminal works. Ask your agent how you can customize tmux, and then have it customize it for you. tmux is your friend.
*   **Bring your own workflow**. Gas Town doesn’t force any particular workflow, any more than an IDE does. Do most of your talking to the Mayor until you’re comfortable with it. But use the workers however you feel comfortable. Mostly it’s asking them to file beads, and then asking them to implement them — all variations of that basic theme. I’ll show some of my workflows below, but they change just about every week.

The tmux tip is huge. It’s a small commitment with a big payoff.

![tmux lets you talk to every worker at once](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*BSopHKuuW4PDVr1jBlNtMQ.jpeg)

Dev Middle Loop
---------------

*   **You technically only need the Mayor.** Running with just the Mayor is a good tutorial/intro to Gas Town. I run in Mayor-only mode from time to time. The Mayor can file and fix issues itself, or you can ask it to sling work to polecats. Even alone, it still gets all the benefits of GUPP, MEOW, etc. Use `gt may at` from your town root to attach to the Mayor. Your two main entry points to Gas Town are `gt may at` and `gt crew at`.
*   **You can use Polecats without the Refinery** and even without the Witness or Deacon. Just tell the Mayor to shut down the rig and sling work to the polecats with the message that they are to merge to main directly. Or the polecats can submit MRs and then the Mayor can merge them manually. It’s really up to you. The Refineries are useful if you have done a LOT of up-front specification work, and you have huge piles of Beads to churn through with long convoys.
*   **It’s OK not to swarm all the time.** Sometimes you will be stuck on some serial bottleneck, and you’re only using one or two workers at a time, with all the others paused. For instance, you might be getting ready to restart your entire town, for a version upgrade, and you want to land everyone’s work first and clean all the sandboxes. Or maybe you need to roll out a schema change before everyone continues. It’s totally normal to be bottlenecked on just one or two workers at a time.
*   **Run regular town cleanups**. You can do this with any of your crew, it doesn’t need to be the Mayor. Have a crew member go through and clear out stale beads, workers, processes, untracked files, etc. Anything you do often, you can make a plugin that the Deacon will run on its patrol.

![Vibe Coding with Gas Town: The Three Cadences](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*x8-gpH_9UrFbr0bRibD91A.jpeg)

Dev Inner Loop
--------------

*   **Sling swarm work in Convoys**. Polecats thrive on well-defined, fully-spec’ed beads epics. Doing it in convoys allows you to track your completed features and high-level work items in the dashboard. Convoys will soon be completely automated, but you sometimes have to tell the Mayor (or whoever is kicking off a convoy) which work to include in the convoy. You can easily merge and update convoys as they run, however, by asking any agent to do it.
*   **Don’t watch your agents work**. Make sure they have their marching orders, and let them do their thing. But. When you see that an agent is finished working, stop everything, ignore everyone else, and read what it has to say. Scroll back and make sure you understand what it did and what it’s saying. Then act on it. You can go in any order you like, but at some point you have to act on each agent’s response or risk losing work. Spend your time reading agent responses and giving them direction — not watching them work.
*   **Use** `gt handoff` **liberally** **after every task, in every worker**. Only let sessions go long if they need to accumulate important context for a big design or decision. Polecats take this philosophy to the extreme, and self-destruct after they submit their MR or finish their task. For all other workers, there are several ways to hand off, including saying “let’s hand off”, optionally with instructions (expensive but very flexible), run `/handoff` (expensive and inflexible), or shell out to run `!gt handoff` to ask Gas Town to do it mechanically (no cost). The worker will be spun up on a new shift, preserving the tmux session.

Finally, “**Work with your Crew**” is the biggest tip of all, so it’s getting its own section. Your Crew are your named, long-lived workers on each project rig. They’re your design team, and they create guzzoline for the swarms.

**Working with Crew**
---------------------

Polecats are ephemeral and unsupervised workers. When you have the Mayor `gt sling` work to a rig, a polecat will pick it up. They complete their work and submit MRs without human intervention. (Though, polecats can also escalate work, when it needs human attention.)

Polecats are best for well-defined, well-specified work. You should feed them Beads epics that have been thoroughly decomposed and vetted multiple times for suitability for polecats. They shouldn’t have to make decisions.

But how do you get those big, well-defined epics? That’s where the Crew comes in. Your Crew are named, long-lived agents who work on your Rigs. You can see here a picture of my desktop running Gas Town in a very typical configuration.

*   I have the Mayor in a MacOS Terminal window in the center, in a tmux session that says “Mayor” at the bottom. The status bar shows rig statuses and other metadata.
*   The left side is my Gas Town rig workers: jack, joe, max, gus, george, dennis. Of a possible six, I have five active at the moment. If I ever want to add more, I’ll just add more with `gt crew add gastown tommynorris` or whatever, and then I’ll have seven. They don’t all need to be active at once.
*   The right side is my Beads rig, which is gradually shifting to Lord of the Rings names, but still has some Jane Austen and miscellaneous. You can easily `gt crew remove <rig> <name>` to remove their repo clone, and then create another crew member with a different name. I have all six active on the right side at the moment.

In this setup, the Mayor is about to kick off a Convoy, so I’ll have a peak of about 15–16 workers going. I could get aggressive and kick off multiple convoys, but I’m being a bit cautious until I know the murder spree is over.

When v0.3.0 launches I’ll be pretty certain that class of bugs is solved. Right now it’s looking pretty good.

![Gas Town crew, Mayor, and Beads Crew tmux sessions](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*NEgEYkSy3-_o5lTJR8fC4Q.png)

Your Personal Concierges
------------------------

I use the Crew for any sort of thought-intensive work, including design work, reviewing contributor PRs, creating implementation plans, and sometimes doing specific code reviews.

The crew for a rig are on a tmux cycle group. So the left-side (blue) cycles through Gas Town crew, and the right side (green) cycles through Beads crew.

I believe this is the secret-weapon “second workflow” of Gas Town. The main workflow is talking to the Mayor and having it file beads and sling them to polecats as convoys. And that’s great for well-defined work. But cycling through your crew lets you have richer, more hands-on discussions with your agents.

I started life with about 3 crew per rig, but I’ve worked my way up to 7–8 crew per rig. You can add new ones with `gt crew add` but I just ask some other worker to do it for me. I just pick a theme for each rig’s crew names and then choose the names myself. Having a theme helps you identify which rig they’re from at a glance.

Before I start farming work to a crew, I make sure they’re all reset: no hook, no mail, clean sandbox, fresh session. You can do this with an announcement, but I usually just tell one of the crew members to get all the crew ready. Give them a few minutes to take care of that; work on other stuff while you wait.

![How I use Gas Town: Rig Cycling and Polecat Slinging](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_nRKWon2XOtpRpeph0gkRg.jpeg)

When they’re all settled, I’ll go through them all in order, in a big loop.

*   Give each crew member a bug, PR, or GHI to tackle. Or, give it a feature to design or a problem to solve. But give it the work, and then _leave it alone_ to do that work.
*   Cycle to the next or previous crew member with `C-b n` or `C-b p` and give them a task as well. You can use `gt ready` to get a town-level view of ready work, and choose one item to hand to each crew member.
*   Do this until every crew member is spinning, working on some task you gave them. If you want to be paranoid, `gt sling` the task to them (or have them sling it to themself or another crew) to hook it so they will continue working on it after a crash.

With one rig fully spinning, I go to my next Rig (Beads, in this case) and start the exact same loop. Go through each crew, give them a meaty task, and let them work.

Then we get to the fun part. You get to see where all your slot machines landed.

As you’re cycling through your crews, you will see some still working, and others will begin finishing. Some of them will finish simple stuff and you just `gt handoff` to prep them for more work. Others will have questions, or complex summaries, and you’ll need to reserve some time to read what they’ve written and act on it.

I find this is the most satisfying part of the workflow. It’s like you’re Jeff Bezos and your team is presenting results to you, one at a time. You let some merge, send others back to the drawing board, and repurpose still others for random whims. This is the part of the workflow where your project direction unfolds.

**Crew Sheriffs**
-----------------

![PR Sheriff: permanent standing orders for a designated Crew member](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*dimvNqeBdA6PeGeoIHIUAw.jpeg)

One last Crew tip: I have a new ad-hoc role that I’ve been using for the past week, called the “PR Sheriff.” One of my Beads crew has a permanent hook: `bd-4f43s: PR Sheriff Standing Orders`. On every session startup, the sheriff checks open PRs and divides them into easy wins and those needing human review, then slings the easy wins to other crew for merging and cleanup.

The amazing thing about this is that every time I boot up my Beads crew, they automatically go merge another 5 or so PRs, and flag a couple more for me to review with them. It keeps them busy for a few minutes every time I start up the town, while I’m doing other stuff. I’ve now got a sheriff set up over on the Gas Town rig as well.

The PR Sheriff bead gets accidentally unhooked often enough that I’ve just reassigned it a new id, `bd-pr-sheriff`, making it easier for me to remember what it’s called when I need to tell the worker to re-pin it (or reference it when talking to a different worker.)

Tending the Invisible Garden
----------------------------

When you work with Gas Town, you don’t usually have time to inspect the code you’re creating. That’s not your role. But you need to make sure the code meets your quality bar. How do you ensure your garden is healthy if you can’t see it?

The answer: **regular code review sweeps, followed by bug-fix sweeps** that fix the issues filed during the code-review sweeps. Gas Town excels at both of these. It can generate tons of work with a swarm (filing Beads as it finds problems) and then crank through tons of work with another swarm. You just keep doing this until the code reviews are just nitpicking, or the agents say the code is ready to ship. Do some of this every day, and hope that most of the time you don’t find anything bad. The only way to be sure is to do it all the time.

![Tending the Invisible Garden of Vibe Coding](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*b_FatkwLZMoy6ZaBAbOm5g.jpeg)

Your garden can get diseases. I mentioned “heresies” above. Agents are very approximate workers and they like to guess at stuff. They will often make _wrong_ guesses about how your system is supposed to work. If that wrong guess makes it into the code, sneaking through the review process, then it becomes enshrined and other agents may notice it and propagate the heresy in their own work.

“Idle polecats” is an example of a heresy that plagues Gas Town. There is no such thing as an idle polecat; it’s not a pool, and they vanish when their work is done. But polecats do have long-term identities, so it’s more like they are clocking out and leaving the building between jobs, which is harder for agents to wrap their heads around. So “idle polecats” make it back into the code base, comments, and docs all the time.

I’ve found the most helpful way to rid yourself of persistent heresies is to capture your guiding principles in the agent priming (onboarding). Which means you have to come up with some guiding principles in the first place.

Your core principles or axioms will be different for every project you’re working on. But the more coverage you can get with them, the more classes of heresy you can avoid or easily correct simply by pointing at the principle they violate. Gas Town core principles include things like Zero Framework Cognition (shared with Beads), which I’ve written about, GUPP, MEOW, Discovery over Tracking, Beads as the Universal Data Plane, and so on. All of these help me stamp out heresies that try to creep into my code.

Videos Coming Soon
------------------

A lot of this stuff you can only really show with a video. I’ll get some put together ASAP.

In the meantime, thanks to everyone who’s been messing with it despite knowing it will rip their faces off. It those faceless early adopters who will help us turn it into a real product. Hats off you all!

![Thanks to Gas Town Early Adopters!](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*gCC6N2OBNLXy01v8q_7efA.jpeg)