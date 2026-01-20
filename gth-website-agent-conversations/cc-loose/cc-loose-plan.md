1. # goals
   we've got two goals with the plan we're creating:

   1. to create a website for gastownhall.ai website (more details coming) using gastown itself via the gt CLI
   2. to learn how to use gt for end-to-end scenarios (more details coming) using the docs and the gt --help itself

   # PREREQUISITE: Add This Folder as a Gas Town Rig

   Before any work can be done, this folder must be added to the Gas Town workspace:

   ```bash
   cd ~/gt
   gt rig add website-cc-loose https://github.com/gastownhall/website-cc-loose.git
   ```

   This is REQUIRED. Without this step, you cannot use gt commands to dispatch work.

   After adding the rig:
   - Work is dispatched via `gt sling <bead> website-cc-loose`
   - Polecats write code (not you)
   - Refinery merges to main and pushes to GitHub
   - You pull changes via `git pull origin main`

   DO NOT copy files manually. DO NOT write code directly. The only file you write is learnings.md.

   # gastownhall.ai
   The gastownhall.ai website should have the following features:
   - Create initial landing page:
     - Problem-oriented headline: "Gas Town is powerful but chaotic. We help you wrangle the chimps."
     - Links to Steve's essential posts
     - Discord invite (big button, call to action NOW)
     - X link
     - link to docs sub-page
   - Add a docs landing page from the gastown-docs folder that shows the overview docs with links to all of the sub-pages
     - IMPORTANT: create a tool that will shred the original docs md files into docs section of the site so that as the docs
       themselves evolve over time in the gastown repo, we can easily update the website and re-publish.
   - Add privacy-respecting analytics
   - Add robots.txt
   - Add llms.txt by first creating a script that creates it from the site contents
   - Add basic SEO meta tags
   - Create privacy policy page

   # gastown scenarios to explore
   - project initiation
   - creating a comprehensive plan (do we do that? do we use gt to do that? experiment!)
   - getting the plan into beads for execution (do we do that manually using the bd command? do we use the gt command to shred into beads? do we use the mayor to shred into beads?)
   - executing the plan to create the landing page
   - testing the page for good website characteristics, e.g. renders, looks good, all the links work, all the features have been implemented, etc.
   - reviewing the generated code for the scripts and the site itself to ensure that it's good quality with clear separation and
     reuse of styles, a consistent application of styles, CSS is well-written, JS (if any) is something we can be proud of, etc.

   # outputs
   1. the tested, reviewed implementation of gastownhall.ai in a top-level src folder as well as any build scripts needed to create a deploy folder for publication to gastownhall.ai
   2. a learnings.md file that lays out all of the learnings for the gastown scenarios -- these are key questions that we're trying to answer! I'm trying to learn how gastown works myself, so be thorough and show specific prose that details the WHY as well as the HOW and shows code snippets with working folders to execute them in relative to the project and/or rig folder as appropriate.

   # IMPORTANT
   THE GASTOWN LEARNINGS ARE THE MOST IMPORTANT PART -- WE'RE LEARNING HOW TO EXECUTE GASTOWN WORKFLOWS END-TO-END. ENSURE YOU CAPTURE THE HOW AND WHY FOR WHAT WORKED AND WHAT DIDN'T AND WHAT YOU LEARNED ALONG THE WAY. EXPLORE PATHS NOT EXPLICITLY MENTIONED IN THIS PLAN USING THE "GT --HELP" COMMAND. TRY NEW THINGS. FIGURE OUT THE BEST WAY TO USE GASTOWN. IF YOU WRITE ANY CODE YOURSELF, THEN YOU'VE FAILED. USE "GT" TO QUEUE UP AND EXECUTE AND CHECK WORK. FIGURE OUT HOW TO DO THAT! DON'T STOP UNTIL YOU'VE FIGURED THAT OUT!
