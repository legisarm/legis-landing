---
name: architecture-review
description: Review codebase for architecture compliance (dependency flow, feature structure, patterns)
allowed-tools: Read, Glob, Grep, Bash
---

# Architecture Review

Analyze code structure and ensure compliance with feature-based architecture.

## Dependency Flow

```
app/ → features/ → lib/
 |         |
 +→ components/ (ui/, shared/, common/)
```

**Allowed**: `app/` → features, components, lib, config, types | `features/` → lib, config, types | `components/` → ui, lib | `lib/` → config only

**Forbidden**: lib ← features/app | features ← app | cross-feature imports

## Review Process

### 1. Check Import Dependencies

```bash
# Cross-feature imports (forbidden)
grep -r "from '@/features/" src/features/ --include="*.ts" --include="*.tsx" | grep -v "index"

# App imports in features (forbidden)
grep -r "from '@/app" src/features/

# Feature imports in lib (forbidden)
grep -r "from '@/features" src/lib/
```

### 2. Validate Feature Structure

Each feature must have exactly 5 files:

| File | Must contain |
|------|-------------|
| `schema.ts` | Zod schemas, camelCase names, `z.infer` exports at bottom |
| `types.ts` | Hand-written interfaces for API responses |
| `service.ts` | Service object (`export const xService = { ... }`), uses `httpClient` |
| `hooks.ts` | React Query hooks, inline query keys, toast on mutations, calls service directly |
| `index.ts` | `export * from` for each file |

No `actions.ts` — mutations call services client-side via React Query. Server actions are not used.

**Anti-patterns**:
- NO `actions.ts`, `data.ts`, `mappers.ts`, `utils.ts` in features
- NO query key factories (use inline `["items", filter]`)
- NO cross-feature imports
- NO standalone exported functions in service (must be object methods)

### 3. Component Organization

| Tier | Location | Rule |
|------|----------|------|
| `ui/` | `components/ui/` | Shadcn only — DO NOT modify |
| `shared/` | `components/shared/` | App reusable, barrel via `index.ts` |
| `common/` | `components/common/` | Layout/shell, import by direct path |
| Route-private | `app/<route>/_components/` | Page-specific |

### 4. Static Assets

All static images and icons must be under `public/assets/` or a nested subfolder (e.g. `public/assets/favicons/`, `public/assets/sites/`). Nothing in `public/` root or `src/`.

Reference in code as `/assets/<path>` or via `next/image` with `src="/assets/<path>"`.

### 5. State Management

- React Query for server state
- `useState` for local UI state
- `react-hook-form` for forms
- NO Zustand, NO Redux

### 6. API Integration

All API calls must go through `httpClient`/`serverHttpClient`. No direct `fetch()` in features.

## Output Format

```markdown
## Architecture Review Report

### Summary
- Feature structure: Compliant / Issues found
- Dependency flow: Clean / Violations detected
- Component organization: Proper / Needs improvement

### Issues by Priority

**Critical** — Dependency violations, cross-feature imports
**Medium** — Missing files, wrong patterns
**Low** — Naming, minor structural issues

Each issue: file:line, description, fix suggestion
```
