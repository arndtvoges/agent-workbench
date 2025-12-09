# Documentation Standards for all Agents

All agents use Markdown files to create specifications, and document their work. All agents have to follow a specific folder/file structure:

./ (project root)
    /workbench
        /documentation <-- Created by `implement-spec` command if not exist yet
            /{YYMMDD}-{feature-slug} <-- Created by `implement-spec` command
                user-product-spec-{feature-slug}.md <-- Written by user, copied into here by `implement-spec` command
                user-technical-spec-{feature-slug}.md <-- Optionally written by user, copied into here by `implement-spec` command
                    /agent-written-specifications <-- Created by `implement-spec` command
                        agent-written-product-spec-{feature-slug}.md <-- Created by `product-spec-writer` agent
                        implementation-spec-{feature-slug}.md  <-- Created by `engineering-architect` agent
                    /completed-tickets-documentation <-- Created by `implement-spec` command
                        {phase}-{ticketnumber}-{feature-slug}-documentation.md  <-- Created by `implementation-engineer` agent
                        ... (one for each completed ticket)
