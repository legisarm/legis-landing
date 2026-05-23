# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Next.js 15 (App Router) admin dashboard for managing Armenian heritage sites and timeline events. OKLCH pastel theme, feature-based architecture. Internal tool — no i18n, hardcoded English.

## Commands

```bash
npm run dev          # Dev server (localhost:3000)
npm run build        # Production build (standalone) — also validates types
npm run lint         # Biome lint check (biome check src/)
npm run format       # Biome auto-format (biome check --fix src/)
```

No test framework. Validate changes with `npm run build`.

Biome config: 2-space indent, `lineWidth: 100`, double quotes, semicolons always.

## Deployment

- **Production**: Push to `master` → GitHub Actions → AWS Lambda + S3 + CloudFront
- **Staging**: Push to `development` → same pipeline, separate AWS resources
- CI uses `yarn install` / `yarn build` with Node 22
- Standalone output is zipped and deployed to Lambda; static assets synced to S3

## Architecture

### Directory Structure

```
src/
  app/
    (dashboard)/         # Authenticated routes (requireSession)
      overview/          # Dashboard overview
      sites/             # Sites CRUD (list, create, [id] detail/edit)
      timeline-events/   # Timeline events
    (public)/            # Login page
  features/              # Domain modules (auth, sites, timeline-events, users)
  components/
    ui/                  # Shadcn primitives (DO NOT modify)
    shared/              # App reusable (barrel via index.ts)
    common/              # Layout/shell (import by path)
  lib/                   # Domain-agnostic infra (http, auth, logger, utils)
  config/                # env.ts, navigation.ts, site.ts
  types/                 # common.ts (PaginatedResponse, ActionResult), enums.ts
  styles/                # theme.css (OKLCH color system)
public/
  assets/                # ALL static images and icons — required location
    favicons/            # favicon variants
    sites/               # site thumbnail images
    <feature>/           # other domain-specific assets
```

**Static assets rule**: Every image or icon file (PNG, JPG, WebP, SVG) must live under `public/assets/` or a subfolder. Nothing in `public/` root or inside `src/`. Reference in code as `src="/assets/<path>"` via `next/image`.

### Dependency Flow

```
app/ → features/ → lib/
 |         |
 +→ components/ (ui/, shared/, common/)
```

**Allowed**: `app/` → features, components, lib, config, types | `features/` → lib, config, types | `components/` → ui, lib | `lib/` → config only

**Forbidden**: lib ← features/app | features ← app | cross-feature imports

### Feature Module Convention (5 files each)

```
src/features/<name>/
  schema.ts    # Zod schemas + z.infer type exports
  types.ts     # Hand-written interfaces for API responses
  service.ts   # Service object using httpClient (not standalone fns)
  hooks.ts     # React Query hooks (inline keys, toast via sonner)
  index.ts     # Barrel: export * from each file
```

No `actions.ts` — all mutations go through hooks → service (client-side React Query). Server actions are not used.

### Import Conventions

```typescript
// Features — barrel
import { useItems, type ListItem } from "@/features/<name>";
// Shared — barrel
import { FormField, Pagination } from "@/components/shared";
// UI — direct path
import { Button } from "@/components/ui/button";
// Common — direct path
import { PageHeader } from "@/components/common/PageHeader";
// Lib — direct path
import { httpClient } from "@/lib/http.client";
// Types — direct path
import type { PaginatedResponse } from "@/types/common";
```

## Key Patterns

- **Services**: Object with async methods (`export const itemService = { ... }`) — see `.claude/skills/http/SKILL.md`
- **Query hooks**: Inline keys (`["items", filter]`), no centralized factory. `staleTime: 60s` — see `.claude/skills/tanstack/SKILL.md`
- **Mutations**: Toast on success/error (sonner), invalidate queries inside hooks, call service directly
- **Forms**: `react-hook-form` + `zodResolver` + shared `FormField` — see `.claude/skills/forms/SKILL.md`
- **Pages**: `"use client"`, `PageHeader`, loading with `<Skeleton>`
- **Confirmations**: `<ConfirmDialog>` from shared

## Responsiveness

- **Container utility**: Defined in `src/styles/theme.css` via `@utility container`. Applied to `<main>` in `DashboardShell` — provides responsive horizontal padding (1rem → 2.5rem → 5rem → 7.5rem at sm/xl/2xl). Use on any full-width wrapper.
- **Narrower content**: Add `max-w-4xl` (or similar) on inner divs for form/detail pages — no `mx-auto` needed since the container handles alignment.
- **Container queries**: Use `@container` + `@{size}:` variants for component-level responsiveness (e.g. list page filter bar).
- **Breakpoint utilities**: Use `sm:`, `md:`, `lg:` for show/hide and flex direction changes within components.

## Component Tiers

| Tier | Location | Import Style |
|------|----------|-------------|
| UI | `components/ui/` | Direct path (do not modify) |
| Shared | `components/shared/` | Barrel (`@/components/shared`) |
| Common | `components/common/` | Direct path |
| Route-private | `app/<route>/_components/` | Local |

## Authentication

Full details: `.claude/skills/auth/SKILL.md`

**Critical rules (always apply):**
- **Post-auth navigation**: `window.location.href` after login/logout — never `router.push()` (stale SSR cache)
- **Middleware**: Never redirect token-present users away from `/login` — causes 307 loop with `requireSession()`
- **`requireSession()`** in the dashboard layout is the authoritative gate — never rely solely on middleware

## HTTP Layer

Full details: `.claude/skills/http/SKILL.md`

**Critical rules (always apply):**
- `httpClient` / `serverHttpClient` auto-prepend `/api/admin/v1/` — service paths start with `/resource`
- Auth endpoints (`/api/v1/auth/*`) use bare `fetch` — no admin prefix, no token at login time
- Feature services always use `httpClient` (client-side); Server Components use `serverHttpClient`
- API spec: `docs/swagger.json` (OpenAPI 3.0)

## Theme (OKLCH Semantic Tokens)

Defined in `src/styles/theme.css`, bridged via `@theme inline`. Soft purple-gray palette (hue 280).

Use semantic classes only: `bg-primary`, `text-foreground`, `text-muted-foreground`, `bg-card`, `bg-muted`, `border-border`, `bg-destructive`, etc.

**Forbidden**: Tailwind palette colors (`text-gray-600`), arbitrary hex (`text-[#3F303F]`), raw OKLCH values in components.

## Skills (`.claude/skills/`)

Reference knowledge files for UI/styling tasks. **Read the relevant SKILL.md before** starting related work.

**After every code improvement** — if the change introduces, removes, or modifies a pattern, convention, file structure, or rule: update the corresponding skill(s) in `.claude/skills/` to match. Skills must always reflect the current codebase, not historical state.

| Skill | Path | Use When |
|-------|------|----------|
| **http** | `.claude/skills/http/SKILL.md` | Client vs server HTTP client, service objects, error handling, URL structure, uploads, typed responses |
| **auth** | `.claude/skills/auth/SKILL.md` | Login/logout, token lifecycle, session validation, refresh, route protection, invitation flow, UX |
| **tanstack** | `.claude/skills/tanstack/SKILL.md` | TanStack Query hooks, DataTable + Pagination, filter/pagination state, invalidation strategy |
| **forms** | `.claude/skills/forms/SKILL.md` | Building any form — field types, schemas, create/edit patterns, mutations, dynamic fields |
| **frontend-design** | `.agents/skills/frontend-design/SKILL.md` | Building new pages or components — design direction, aesthetics, layout decisions |
| **shadcn-ui** | `.agents/skills/shadcn-ui/SKILL.md` | Using shadcn/ui primitives, adding new UI components, form patterns with Radix |
| **tailwind-css-patterns** | `.agents/skills/tailwind-css-patterns/SKILL.md` | Styling with Tailwind utilities, responsive layouts, dark mode, animations |
| **responsive-patterns** | `.agents/skills/responsive-patterns/SKILL.md` | Container queries, fluid typography, mobile-first strategy, responsive grids |

Each skill folder may contain `references/` and `rules/` subdirectories with deeper detail — load those on demand when the SKILL.md references them.

## Map Setup

See `MAP_SETUP.md` for MapTiler/MapLibre configuration, geocoding, and tile providers.
