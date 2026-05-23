---
name: refactor
description: Plan minimal-change refactors that respect architecture and preserve behavior
argument-hint: "[target-area]"
allowed-tools: Read, Glob, Grep, Bash
---

# Smart Refactor

Refactor code with minimal changes, maximum impact, and strict architecture adherence.

## Principles

1. **Minimal change, maximum impact** — change only what's necessary
2. **Preserve behavior** — refactoring must not alter functionality
3. **Follow architecture** — respect feature-based structure and dependency flow
4. **Validate with build** — no test framework; verify with `npm run build`

## When Justified

- Dependency flow violation (e.g., `lib/` importing from `features/`)
- Duplicate logic across 3+ locations
- Cross-feature imports
- Business logic in components (should be in hooks/service)
- API schema changed, types no longer match

## When NOT Justified

- Code works but "could be cleaner"
- Adding types to code you didn't write
- Extracting a helper used only once
- "Future-proofing"

## Common Refactors

### Extract Logic to Feature Hook

Move API calls and state from components into feature hooks using React Query.

### Consolidate Duplicates

Merge similar components into a single shared component with props for variation.

### Move Inline API Calls to Service

All `httpClient` calls should be in `service.ts`, not in components or hooks directly.

### Remove Dead Code

Unused exports, commented-out code, unused type definitions — safe to remove (git history preserves them).

## High-Risk Areas

Refactor carefully — many consumers:
- `src/features/sites/` — most complex feature
- `src/components/shared/FormField.tsx` — used in every form
- `src/lib/http.client.ts` — imported by all services
- `src/app/(dashboard)/layout.tsx` — affects all dashboard pages

## Process

### 1. Analyze Impact

```bash
# Find all usages before changing
grep -rn "import.*from.*<module>" src/ --include="*.ts" --include="*.tsx"
```

- Small impact (<3 files) → refactor directly
- Medium (3-5 files) → create checklist
- Large (>5 files) → use Plan mode

### 2. Execute

Make smallest possible change → verify with `npm run build` → next change.

### 3. Validate

```bash
npx biome check --write src/
npm run build
```

### 4. Update Skills

After any refactor that changes a pattern, convention, or file structure — update the corresponding skill(s) in `.claude/skills/` to reflect the new approach. Skills must stay in sync with the actual codebase so future work is guided by current patterns, not stale ones.

## Anti-Patterns

- Don't over-abstract one-time use cases
- Don't introduce new patterns (project uses React Query, don't add SWR)
- Don't change behavior during refactor
