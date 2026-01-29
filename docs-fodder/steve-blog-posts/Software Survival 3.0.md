Software Survival 3.0
=====================

[![Steve Yegge](https://miro.medium.com/v2/resize:fill:64:64/1*8Ae2b9dv-sQtme8C4_sjhA.jpeg)](https://medium.com/?source=post_page---byline--97a2a6255f7b---------------------------------------)

[Steve Yegge](https://medium.com/?source=post_page---byline--97a2a6255f7b---------------------------------------)

20 min read

·

Just now

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fvote%2Fp%2F97a2a6255f7b&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fsoftware-survival-3-0-97a2a6255f7b&user=Steve+Yegge&userId=c1ec701babb7&source=---header_actions--97a2a6255f7b---------------------clap_footer------------------)

--

[nameless link](https://medium.com/m/signin?actionUrl=https%3A%2F%2Fmedium.com%2F_%2Fbookmark%2Fp%2F97a2a6255f7b&operation=register&redirect=https%3A%2F%2Fsteve-yegge.medium.com%2Fsoftware-survival-3-0-97a2a6255f7b&source=---header_actions--97a2a6255f7b---------------------bookmark_footer------------------)

Listen

Share

I spent a lot of time writing software with AI last year, and I had some pretty good successes, notably [Beads](https://github.com/steveyegge/beads) and [Gas Town](https://github.com/steveyegge/gastown). I wrote a whole bunch of other systems, some still in progress. And I got a solid intuition, a feel for how AI’s exponential progression is, well, progressing.

That intuition is how I created Gas Town. I believe the exponential curves; I believe everything Dario Amodei and Andrej Karpathy are saying about software. And if you were leaning in when Claude Code came out 11 months ago, then if you extrapolated from completions in 2023 to chat in 2024 to agents in early 2025, you arrived inescapably at orchestration arriving in early 2026.

So towards the end of the year, I went looking for what I knew would be there, and found Gas Town right where I was looking for it. I was like a geologist who knew there would be an oil deposit there, and I drilled and it hit. I dug around and found a shape that _just_ barely worked, with the best late 2025’s models that hadn’t been trained to be factory workers, plus a lot of duct tape. And janky as it may be, Gas Town has illuminated and kicked off the next wave for everyone.

I think I’ve established a pretty good track record of predicting the future, from Death of the Junior Developer back in June 2024 when the job market was still super hot, to Revenge of the Junior Developer which predicted today’s orchestrators 10 months ago, to Gas Town itself, which I think is pushing pretty far into the frontiers of what’s possible today.

All of my predictive power comes from believing the curves. It’s that simple.

In this post, I’m going to make a prediction about which software will survive, if you believe Karpathy, in a world where AI writes all the software and is essentially infinitely capable. I think you can make a simple survival argument that comes down to selection pressure.

First let’s talk about my credentials and qualifications for this post. My next-door neighbor Marv has a fat squirrel that runs up to his sliding-glass door every morning, waiting to be fed. It’s against a city ordinance to feed them but Marv is 82 and he ain’t having it. So the squirrel has grown chonkulous, and it shows up like clockwork when we’re about to go golf or head to the range in his corvette or any of the other 82-year-old stuff we do.

Marv’s squirrel knows approximately the same amount about evolutionary biology as I do, and would score similarly to me on a University-level examination on the subject.

But I have this hunch. I think I know how to predict whether your software is going to make it or not, if you assume (as I do) that Karpathy and Amodei are completely 100% correct.

Let’s see if I can convince you.

Are We Gonna Make It?
---------------------

Karpathy describes a future where AI can build pretty much anything on demand, and we’ve already seen early evidence of this in the form of emerging pressure on SaaS companies, as the buy vs build calculus changes. It’s getting easier and easier to build what you need rather than buying it. We’re seeing business departments [vibe coding](https://www.amazon.com/Vibe-Coding-Building-Production-Grade-Software/dp/1966280025) their own SaaS instead of re-upping with niche vendors. Three years ago, GPT-3.5 could barely write a coherent function, and now AI can write small-scale (but valuable) SaaS for you. The trajectory is exponential, so home-grown medium-scale SaaS will be on the table by EOY.

It’s not just SaaS. We’ve already seen entire categories begin to be eaten up by AI: Stack Overflow and Chegg were early victims, but now we’re seeing pressure on new sectors. Tier-1 customer support software, low-code/no-code systems, content generation tools (e.g. writing assistants), a whole lot of productivity tooling. Even IDE vendors are beginning to sweat over Claude Code, and with good reason.

If you believe the AI researchers–who have been spot-on accurate for literally four decades–then all software sectors are threatened. Even if you don’t buy into their vision wholesale, it’s prudent to be cautious and at least think about it.

I see boards and C-suites beginning to ask, how can we plan ahead to survive in the Software 3.0 era? But they don’t have any sort of a framework for thinking about it yet. I think mine, while not perfect, provides a pretty good starting point. You be the judge.

The Selection Argument
----------------------

Inference costs tokens, which cost energy, which costs money. For purposes of computing software survival odds, we can think of {tokens, energy, money} all as being equivalent, and all are perpetually constrained. This resource constraint, I predict, will create a selection pressure that shapes the whole software ecosystem with a simple rule: **software tends to survive if it saves cognition**.

This is, roughly speaking, an evolutionary argument, at least according to Marv’s Squirrel. In any environment with constrained resources, entities that use those resources efficiently tend to outcompete those that don’t. Karpathy’s Software 3.0 ecosystem should similarly select for tools that minimize cognitive expenditure, which you can measure and model pretty closely as token spend.

I think that systems have a financial and indeed an ethical obligation to minimize compute costs for solving cognitive problems, because energy is rapidly becoming the world’s biggest constraint. For starters, this obligation implies that we should use smaller models when they can perform the same tasks. That may seem obvious, but I think our current monolithic coding agents aren’t doing a very good job of it. Orchestration systems give me hope that we can do a better job of allocating work to the right model tiers in the future, saving energy and money in the process.

But even with a bazillion smaller models deployed everywhere including your dental fillings, I think there is still a role for large classes of “old-fashioned” software systems that aren’t models, and don’t necessarily use AI at all. This essay concerns those systems, which I think will survive and thrive if they have the right properties.

My hunch is that if a tool saves AIs tokens, it has a high chance of being used and surviving. And tools that don’t save tokens will gradually be phased out. That’s not a guarantee; it’s just going to be a strong general selective pressure. There are caveats and exceptions and carve-outs that we’ll discuss.

The good news is, there are plenty of concrete ways you can plan ahead to help ensure your software survives the transition to the Karpathy Software 3.0 era.

The Survival Ratio
------------------

For any tool T, my model posits that survival looks something like the following, in Squirrel Math:

> Survival(T) ∝ (Savings × Usage × H) / (Awareness_cost + Friction_cost)

Where:

*   **Survival(T)** is a fitness function — the ratio of cognitive value to cognitive cost. A tool tends to survive when this ratio exceeds 1 — when using it saves more than knowing and operating it costs. Tools with very high ratios in the 1000s, like grep, get plot armor and become indestructible. Below 1, the tool is selected against and gets routed around; LLMs will synthesize alternatives.
*   **Savings** is the cognitive savings: how many tokens does using this tool save, vs. synthesizing the equivalent functionality from scratch?
*   **Usage** is how often and how broadly the tool applies to different situations. Niche tools may require an incredible Savings in order to compensate for their narrow usage. And even a light Savings can ensure survival if the tool is a Swiss army knife that’s fit for many purposes.
*   **Awareness_cost** is the energy required for agents to know the tool exists, understand what it offers, and choose to reach for it. It’s the energy to get it into their training sets, or else energy you need to spend at inference time, as part of your precious prompting, to teach agents about your tool.
*   **Friction_cost** is the energy lost to errors, retries, and misunderstandings when actually using the tool. Agents will often give up and switch back to a less effective but more familiar/reliable tool if they are struggling with the interface on an ostensibly more efficient tool. They see the efficiency they’re losing in the fumbling, and they retreat to less efficient but more predictable methods. Conversely, if the tool is very low friction, agents will revel in it like panthers in catnip, as I’ll discuss in the Desire Paths section.
*   **H** is a human coefficient that factors in demand for human-created material. It’s a wildcard, but it will produce some strong survivors that don’t fit any of the efficiency criteria.

To be clear: this isn’t a proof, or real math, or anything like that. It’s just a visual aid, a mental model I use for thinking about software survival in the age of resource-limited super-intelligence.

I debated with Claude endlessly about this selection model, and Claude made me discard a bunch of interesting but less defensible claims. But in the end, I was able to convince Claude it’s a good model, and I aim to do the same with you. Let me know what you think by complaining that AI sucks on HN!

In the Survival Ratio model, the minimum viable ratio for survival is 1. If tool T saves tokens overall, and the agent knows about it, and it works smoothly, then T will have positive selection pressure. Conversely, a tool that doesn’t save tokens, or costs more to use (or to know about) than what it saves, will get selected against, sooner or later.

Your software’s survivability threshold floats above 1 when there’s competition. A useful tool with a ratio of 1.2 can get beaten by a competitor with a 2.5. Agent attention is going to become a key [battleground](https://www.ucl.ac.uk/bartlett/publications/2023/nov/algorithmic-attention-rents-theory-digital-platform-market-power), driving awareness cost higher. In a niche domain without much competition, like say DNA sequencing, any tool that saves a few tokens might be quickly noticed and see lots of use. But in crowded domains, awareness isn’t automatic, big mediocre players may have all the recognition, and you may have to pay extra to be noticed by agents. We’ll talk about different ways to accomplish this today, and hint at more to come.

As a framework, I think the Squirrel Selection Model is Good Enough: it’s better than what most C-suites are working with today. My model gives you six levers you can use for planning your software’s survival. Let’s go through them in turn. First we’ll talk about the two most powerful long-term levers, both of which are all about saving money.

Saving Cognition by Saving Tokens
---------------------------------

Your first two levers help maximize the Savings term in the numerator of the Survival Ratio. Let’s first talk about why these levers exist at all, in a world where AIs are superintelligent and can synthesize literally any software they want.

Coding agents can do complex work in their heads, so to speak, purely through inference on GPUs. But if you’ve ever seen, for instance, how they do multiplication, it’s as bad as a person using nothing but chickens. LLMs use composition of pattern-matching, not concise algorithms. For example, first the model might use a pattern to guess that the answer is roughly 94-ish. And then use another pattern-match to find the final digits of the answer, using a remembered lookup table.

It’s as Turing-complete as a Minecraft goat farm and it definitely gets the job done. But when they’re multiplying inline while working, the computation is happening in an _extremely_ inefficient substrate: the GPU layer at inference time. For arithmetic it’s far more efficient to be using CPU-based code, or tools like calculators. It turns out there are many kinds of computation that the LLM is better off delegating to tools.

Fortunately for everyone involved, agents are happy to use tools if they perceive that it’s going to save them some cognition. Call it laziness, but it’s Larry Wall’s “Three Great Virtues of a Programmer” laziness. It’s good laziness.

So coding agents can and do use tools, but they also write their own tools. For any given delegatable problem, an agent has a choice: they can reach for an existing tool, or they can write one.

If your goal is to get them to reach for your tool instead of writing their own, then you have two levers that can save cognition, which should make them prefer to use it. Assuming they know about it, which is Lever 4. All in good time. You must have the patience of Marv’s squirrel waiting outside that sliding glass door, and soon all the nuts will come your way.

Lever 1: Insight Compression
----------------------------

First lever: your software can make itself useful by compressing insights. The software industry has accumulated a lot of hard-won knowledge that would be expensive to rediscover. Many systems compress hard-won insights into reusable form.

There is no better example than Git. It’s not going anywhere. Sure, it’s not hard for an AI to build its own version control system. But Git’s model–the DAG of commits, refs as pointers, the index, the reflog — I’m already losing you, but that’s the point. Git represents decades of accumulated wisdom about how to track changes when multiple people are working on the same thing, changing their minds, making mistakes, and merging their work back together.

An AI reimplementing Git from first principles would have to re-traverse that entire intellectual history, burning tokens all the way. It would be economically irrational. Or as Marv’s chonko squirrel would put it, “nuts.”

The same principle applies broadly to many kinds of systems–e.g., databases, compilers, operating systems, workflow engines, monitoring. The older the better, in some ways. Kubernetes is complex because distributed systems are complex. Temporal provides durable execution because the alternative — building your own saga pattern with idempotent retries — is a daunting research project. These systems are, in a meaningful sense, crystallized cognition, a financial asset, very much like (as Brendan Hopper has observed) money is crystallized human labor.

I think the strong players in this category share a property: it would be flatly absurd to try to re-synthesize them, because of their sheer insight density. They either solve a genuinely hard problem, or they solve a common problem with genuine elegance. Why mess with success?

Insight compression can take many forms. AIs frequently call out this kind of compression when they encounter it. Claude has often referred to Gas Town’s cute character roles and verbs like `gt sling` as being a kind of compression: taking complex ideas and giving them concise and memorable forms. AIs genuinely seem to love to use tools that compress insights, as it gets them faster to their goals.

Lever 2: Substrate Efficiency
-----------------------------

As Claude put it, “Nobody is coming for grep.” It’s a great example of a tool that would _also_ be crazy to reinvent, because, like Lever 1, it saves a lot of tokens relative to the effort of using it.

But grep doesn’t compress any hard-won insights. In fact it’s pretty simple; Ken Thompson famously wrote grep in an afternoon. Grep saves cognition by doing it on a cheaper substrate: CPUs. Algorithmically, it also punches way above its weight class, doing a lot for very little effort. Pattern matching over text is a task where CPU beats GPU by orders of magnitude.

So it would be irrational from any perspective–economic, ecological, moral, or otherwise–to spin up inference to do what grep does. Similarly, LLMs will choose calculators over writing code if they’re available. Tools that enable this lever include parsers, complex transformers like ImageMagick, and many Unix CLI tools.

Your lever here is to save tokens by doing computations more cleverly. You can achieve that with a good algorithm, or by moving the compute to a cheaper substrate, such as CPUs, humans, or [chimpanzees](https://www.youtube.com/shorts/k-eltEACEQM).

Lever 3: Broad Utility
----------------------

This is the Usage term in the Survival Ratio. It basically amortizes your awareness cost and lowers the threshold for token savings. If you have a truly general-purpose token-saving tool, then it doesn’t really matter if it’s easy for AIs to recreate it. They’ll use the thing that’s everywhere. But how do you make your software be the “obvious” choice for agents?

It’s easy to point at Git and say, “Just be like Git. Be around forever, make sure everyone uses you for decades, and solve a much wider variety of problems than you originally set out to solve.” Same could be said of grep, really. It’s a bit silly; they are too high of a bar. I think a more useful practical example is Temporal, which, despite not being super well-known, is near-universally useful as agentic workflows take center focus in 2026.

Temporal has comparatively high awareness and friction costs, e.g. compared to (say) Postgres, which has been around a lot longer and has much more training data available. But Temporal is as broadly useful as PostgreSQL; just as Postgres can be used to store and query most datasets people care about, Temporal can be used to model and execute most workflows people care about. Temporal has all three levers so far: aggressive insight compression, masterful use of the compute substrate to solve complex problems, and it’s broadly useful. So no AI in its right mind is going to try to clone it for any serious work.

[Dolt](https://www.dolthub.com/) is another interesting example of software that’s ahead of its time. Gene Kim and I have been saying, “don’t use LLMs for production database access–only use agents in prod when you have Git as a backstop!” Well, what if your database was versioned with Git? Every single change?

Dolt is OSS that has been around for 8 years, and is only now finally finding its killer app with agent-based prod and devops workflows. With Dolt, agents can make mistakes in prod, and roll back (or forward) with the full power of Git. But they hadn’t solved the awareness problem when I first made Beads, or I’d have used Dolt from the start.

You can find problem spaces that will thrive by looking at what will change when agents are doing all the work. For instance, code search gets harder, as LLMs start producing 10x-100x as much code. Agents will need good search as much as humans ever did, and grep, for all its charms, does not scale. So code search engines _also_ have all of our first three levers: (1) they solve a nontrivial problem with lots of hard-to-discover edge cases, (2) they do it in a cheaper computation substrate than GPU inference, and (3) they have found a large, near-universal niche of “anything too big for grep.”

I find all this quite hopeful. There will be infrastructure opportunities galore. The Software 3.0 world is going to be filled with swarms of agents and meta-agents crawling over huge graphs of data, mining interesting insights. There will be a new attention economy, new aggregators to help us know what’s cool, and new channels for broadcasting what your software is capable of.

The more broadly useful you can make your software, the more agents will be able to use it. This can create a virtuous cycle by producing more training data. The new world of software will be big. Aim to build software that lots of agents prefer to use in lots of situations.

Lever 4: Publicity
------------------

Saving cognition isn’t enough on its own. You also need to solve the awareness problem somehow: the pre-sales problem. Agents have to know about you. Dolt was a great example of a tool with levers 1 to 3 but not 4: I’d have used for Beads sooner if Claude or I had known about it.

Awareness cost is the energy required for an agent to know your tool exists, to remember it when relevant, and to prefer it over alternatives. One way to pay it down is to build a great product, get really popular so everyone talks about you, and wait for community-provided training data to appear online for your product.

Or, you can do it the good old fashioned way, and throw money at the problem. You can put a bunch of money into building documentation about your product for agents. And you can maybe get some luck with advertising. But there’s a more direct solution.

An increasingly popular way to pay down the awareness cost is to work with representatives from OpenAI, Anthropic, Google and other frontier labs to help train their models on your tools. It’s a paid service, or so I’m told. I met a guy at a conference from OpenAI who does this for a living. He works with tool vendors to create evals that demonstrate how (and how not) to use the tool, and then their researchers adjust the training to improve the eval scores.

SEO for agents is on its way. I know nothing about it, but it’s coming. You might need to look at it. It may not be enough for you to focus on your Survival Ratio numerator. Being good isn’t enough for agents to choose you; you have to be familiar and trustworthy and known.

If you can’t afford deep-pockets spending to pre-train models on your tools, or to put your tools in discovery’s way (via Ads, aggregators, etc) for agents who are searching for solutions, then you’re going to have to rely on “post-sales energy” (Lever 5), which is making sure your tool is super agent-friendly.

If the agent has never heard of your tool, the best you can do is make it easy to use.

Lever 5: Minimizing Friction
----------------------------

If Awareness is a pre-sales problem, then Product Friction is a post-sales problem. Your agent may be perfectly aware that it has a useful tool, but even a small amount of friction may change its calculation.

Agents always act like they’re in a hurry, and if something appears to be failing for them, they will rapidly switch to trying workarounds. If they’re using your tool and they are having trouble getting it working correctly, they give up super fast. I’ve spoken with many of you at conferences and meetings where you described a tool you’d built, one that the agent swore up and down they’d use, and you just couldn’t get them to use it.

Conversely, if you build the tool to their tastes, then agents will use the hell out of it.

One way to approach this problem is with documentation. You’ve deferred spending energy on training until inference time, so you’re going to need to load up context with information about your tool: what it’s good for, why and when the agent would want to use it, and a quickstart guide, with pointers to easy-access follow-up docs.

This isn’t a bad approach. Agents can read a lot. You can use agents to produce highly information-dense documentation, and there’s probably a market for products to help you out with very large information stores.

How much documentation you need to do this depends on your tool. Gas Town has pages and pages of prompting because it’s not in anyone’s training data: it’s too new. So it expends a lot of energy bringing agents up to speed. That will improve as agents get training on being factory workers, which is inevitable now.

But there is a better approach: make your tool intuitive for agents. Getting agents using Beads requires much less prompting, because Beads now has 4 months of “Desire Paths” design, which I’ve talked about before. Beads has evolved a very complex command-line interface, with 100+ subcommands, each with many sub-subcommands, aliases, alternate syntaxes, and other affordances.

The complicated Beads CLI isn’t for humans; it’s for agents. What I did was make their hallucinations real, over and over, by implementing whatever I saw the agents trying to do with Beads, until nearly every guess by an agent is now correct. I’ve driven the friction cost term about as low as it can go. And I’m doing the same for Gas Town.

I actually got this idea from hallucination squatting, which Brendan Hopper told me about, where you reverse engineer a domain name that LLMs are hallucinating, register it, upload compromised artifacts, and the LLM downloads them the first time it hallucinates the incorrect site name. If even North Korean hackers understand Agent UX, then it’s probably time you did too.

Agent UX is incredibly important and I think most people are sleeping on it. You want your tool to be intuitive to agents. Not because you documented it really well; that’s not ideal. Ideally, your tool is either very similar to other tools they already know, or else it solves a problem exactly the way they like to think about it, and the documentation should just be reaffirming how the agents are hoping it will work.

Lever 6: The Human Coefficient
------------------------------

We’ve covered ways to save tokens, and ways to make your tool more palatable to agents. These are great survival strategies starting right now, this year, today. But it’s not the only way.

I think it’s already obvious to everyone that there will be software that thrives not because of token efficiency, but specifically because humans were involved somehow. This software’s value derives from human curation, social proof, creativity, physical presence, approval, whatever. It can be absurdly inefficient because it’s all about that human stink.

And so a human-curated playlist might beat an AI-generated one that’s just as good and far more efficient in energy terms. Games with real humans will usually win here, as almost nobody wants to play against AIs that are clearly better than humans. Social networks that exclude agents will be popular, etc.

That’s where the Human Coefficient (H) comes in. It’s a different selection pressure entirely — not efficiency, but human preference. You can still benefit from saving cognition, and use the first 5 levers. But there will be a large set of domains where people just prefer a human’s work, even when an AI can do “better.” And that’s your potential sixth lever.

For instance, maybe you decide that even though AIs will be the best teachers soon, some people will insist on human teachers. So you build something in that domain, and try to be cognizant of the other variables–savings, usage, awareness, friction.

Even with a high Human factor, your software is up against some stiff competition. In Karpathy’s world, agents can be anything to anyone. They can provide an infinite amount of bespoke content, and they’ll be addictive. You’ll have to work hard to stand out. If it were me, I’d focus on the other variables, which feel easier to control.

But it’s also clear that there will be a lot of terribly inefficient high-H software out there. It could be yours! Good luck.

The Case for Hope
-----------------

I did leave a lot of categories out of the discussion, ones that I think are in trouble, because there’s no sense in kicking them while they’re down. I think any software that’s intermediating between humans and AIs, or is trying to do any sort of “smart thing” that AIs will soon be able to do themselves, is in real trouble.

But there is so much software that needs to be written. Our demand for new software is insatiable and effectively infinite. We want to cure every disease, model every protein, explore every planet. Our ambition will always outstrip available cognition. Token costs will fall, but we’ll keep moving the frontier, generating more work than there are tokens to perform it.

Another reason for hopefulness is that we’ve already solved the attention problem several times before, from print media to the internet to social media and real-time ads and aggregators. This is just more of the same. You may even be able to benefit from tighter feedback loops–agents should quickly adopt your tool if it becomes known that it genuinely saves tokens, creating virtuous cycles.

Another is that desire paths clearly work, so you don’t need deep pockets for an OpenAI training budget for your tool. Just make your tool work the way agents want it to work. It takes a little time, but it really is a lather, rinse, repeat pattern.

Fourth, the human coefficient is real. People are going to start hating anything that reeks of agents; it has already begun. Lean into it, if you can. Build your software in a way that creates human connections and creativity, and then it’s just a good old-fashioned marketing problem.

And last, with six levers to work with, you have a lot of paths forward for survival. I hope this framework has been at least somewhat useful. It was originally framed around thermodynamics and tending towards lower energy states, but Chonko and I failed that exam even worse, so we went with evolution. But the model feels right to me, or at least close.

I choose to be hopeful. I think that a lot of humans will be building a lot of software in the coming years, and I intend to enjoy as much of that software as I possibly can. I wish you all luck in surviving whatever’s coming. Build something that would be crazy to re-synthesize. Make it easy to find. Make it easy to use. Then I think you’ve got a solid shot.

Meantime, I’ve gotta get back to Gas Town, and I’ll give you a post about that tomorrow. I know a lot of you have been breaking the first two rules of Gas Town, since I keep seeing it in the news. So I’ll get you some updates. Hang in there.

![Software Survival 3.0: The Six Levers](https://miro.medium.com/v2/resize:fit:1400/format:webp/1*_RutRrgdWDw0Z9NzD3uWLQ.jpeg)