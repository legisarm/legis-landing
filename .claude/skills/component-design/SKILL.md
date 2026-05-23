---
name: component-design
description: Guide component creation with correct tier placement and design system usage
argument-hint: "[component-name]"
allowed-tools: Read, Write, Bash, Glob, Grep
---

# Component Design

Design and implement UI components following admin panel conventions.

## Tier Decision

| Tier | Location | When | Import Style |
|------|----------|------|-------------|
| `ui/` | `components/ui/` | Shadcn primitive (DO NOT modify) | Direct path |
| `shared/` | `components/shared/` | Reusable across pages | Barrel (`@/components/shared`) |
| `common/` | `components/common/` | Layout/shell | Direct path |
| Route-private | `app/<route>/_components/` | Page-specific | Local |

## Existing Shared Components

Check before creating:

- `FormField` — Discriminated union: text, email, password, number, textarea, select, checkbox, switch
- `DataTable` — Generic data table wrapper
- `Pagination` — Page navigation controls
- `ConfirmDialog` — Confirmation with action
- `LocationPicker` — MapLibre map with geocoding

## Design System

### Colors (OKLCH semantic tokens)

```tsx
text-foreground          // Primary text
text-muted-foreground    // Secondary text
bg-background            // Page bg
bg-card                  // Card surface
bg-muted                 // Subtle bg
bg-primary text-primary-foreground    // Primary buttons
bg-destructive text-destructive-foreground  // Danger
```

### Typography (Geist Sans, applied globally)

```tsx
text-2xl font-semibold   // Page title
text-lg font-medium      // Section heading
text-sm text-muted-foreground  // Description
```

### Admin Patterns

```tsx
// Card
<div className="rounded-lg border bg-card p-6">{/* ... */}</div>

// Page layout
<div className="space-y-6">
  <PageHeader title="Title" description="Desc" />
  {/* Content */}
</div>
```

For form patterns, see `.claude/skills/forms/SKILL.md`.

## Component Template

```tsx
"use client";

import { Button } from "@/components/ui/button";

interface MyComponentProps {
  title: string;
  onAction?: () => void;
}

export function MyComponent({ title, onAction }: MyComponentProps) {
  return (
    <div className="rounded-lg border bg-card p-6">
      <h3 className="text-lg font-medium text-foreground">{title}</h3>
      {onAction && (
        <Button onClick={onAction} size="sm">Action</Button>
      )}
    </div>
  );
}
```

## State

- Local UI → `useState`
- Forms → `react-hook-form` + `zodResolver`
- Server data → React Query hooks from `features/`
- No Zustand, no Redux

## After Creating

1. Add to `shared/index.ts` barrel if shared component
2. `npx biome check --write src/`
3. `npm run build`
