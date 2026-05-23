# Skill Trigger Index

Use this file to deterministically map user intent to project skills before coding.

## Routing Order

1. Match request against this index.
2. Load matching `.agents/skills/.../SKILL.md` first.
3. Load matching `.claude/skills/.../SKILL.md` second.
4. If both exist, follow `.agents` first, then apply `.claude` constraints.
5. If no direct match, fall back to broad architecture/refactor skills.

## Trigger Map

### UI, Components, Styling

- `frontend`, `landing page`, `component UI`, `redesign`, `polish UI`
  - `.agents/skills/frontend-design/SKILL.md`
  - `.claude/skills/frontend-design/SKILL.md`
- `tailwind`, `utilities`, `responsive css`, `layout`, `spacing`, `typography`
  - `.agents/skills/tailwind-css-patterns/SKILL.md`
- `tailwind audit`, `tailwind consistency`, `token misuse`
  - `.claude/skills/tailwind-audit/SKILL.md`
- `shadcn`, `dialog`, `popover`, `table`, `form ui component library`
  - `.agents/skills/shadcn-ui/SKILL.md`
- `responsive`, `mobile`, `tablet`, `breakpoint`, `container query`
  - `.agents/skills/responsive-patterns/SKILL.md`
  - `.claude/skills/responsive-patterns/SKILL.md`
- `component architecture`, `design system tier`, `where component belongs`
  - `.claude/skills/component-design/SKILL.md`
- `figma`, `implement design`, `pixel perfect`, `design handoff`
  - `.claude/skills/implement-design/SKILL.md`

### Quality And UI Compliance

- `validate ui`, `design compliance`, `spacing check`, `a11y check`
  - `.claude/skills/ui-validate/SKILL.md`
- `color audit`, `oklch`, `color token`
  - `.claude/skills/color-audit/SKILL.md`
- `icon audit`, `image consistency`, `asset consistency`
  - `.claude/skills/icon-audit/SKILL.md`

### Testing

- `playwright`, `e2e`, `flaky test`, `test login`, `responsive test`
  - `.agents/skills/playwright-testing/SKILL.md`
  - `.claude/skills/playwright-testing/SKILL.md`

### Forms, Auth, Data, Infra

- `form`, `validation`, `zod`, `react-hook-form`
  - `.claude/skills/forms/SKILL.md`
- `auth`, `login`, `signup`, `session`, `permissions`
  - `.claude/skills/auth/SKILL.md`
- `http`, `api client`, `fetch wrapper`, `request layer`
  - `.claude/skills/http/SKILL.md`
- `tanstack`, `query`, `mutation`, `cache invalidation`
  - `.claude/skills/tanstack/SKILL.md`

### Architecture And Refactors

- `scaffold feature`, `new module`, `module skeleton`
  - `.claude/skills/scaffold/SKILL.md`
- `refactor`, `clean up`, `restructure`, `simplify module`
  - `.claude/skills/refactor/SKILL.md`
- `architecture review`, `layering`, `dependency flow`, `compliance`
  - `.claude/skills/architecture-review/SKILL.md`

## Multi-Skill Bundles

Use these bundles when requests span concerns:

- New UI feature: `frontend-design` + `component-design` + `tailwind-css-patterns`
- UI from design: `implement-design` + `frontend-design` + `ui-validate`
- Styling fix: `tailwind-css-patterns` + `tailwind-audit` + `color-audit`
- Responsive bug: `responsive-patterns` + `playwright-testing` + `ui-validate`
- Feature refactor: `refactor` + `architecture-review` (+ domain skill)

## Deterministic Tie-Breaking

When multiple matches exist:

1. Exact technology mention beats generic wording.
2. Explicit user intent beats inferred intent.
3. More specific skill beats broader skill.
4. `.agents` skill beats `.claude` counterpart for implementation order.
