<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

# Local Skill And Agent Policy

Always prefer project-local skills and agent instructions over generic behavior.

## Skill Discovery Order

Before implementation, inspect these paths in order and load any relevant `SKILL.md`:

1. `.agents/skills/**/SKILL.md`
2. `.claude/skills/**/SKILL.md`

Always consult `.agents/SKILL_TRIGGER_INDEX.md` first to decide which skills to load.

If multiple skills apply, follow the most specific one first, then combine guidance.

## Mandatory Skill-First Workflow

For every non-trivial request:

1. Identify likely skill triggers from the user request.
2. Match triggers using `.agents/SKILL_TRIGGER_INDEX.md`.
3. Open matching skill docs from `.agents/skills/` and `.claude/skills/`.
4. Follow those instructions before proposing or writing code.

Do not skip this process just because a solution seems obvious.

## Priority Rules

- Project rules in this file win over default behavior.
- Instructions from relevant `SKILL.md` files win over generic coding preferences.
- When two skills conflict, prefer:
  1. Repo-local skill (`.agents/skills`) over mirrored/global equivalent.
  2. More specific domain skill over broad general skill.

## Verification Checklist (Every Task)

Before final response, confirm:

- At least one relevant skill was considered for the request category.
- Any required checks/tests from that skill were run (or explain why not).
- Changes follow the architecture/style constraints from loaded skills.
