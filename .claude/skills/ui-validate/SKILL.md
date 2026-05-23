---
name: ui-validate
description: Validate UI components for design system compliance, spacing, and accessibility
argument-hint: "[component-path]"
allowed-tools: Read, Glob, Grep, Bash
---

# UI Validate

Validate UI components against the admin panel's design system and accessibility standards.

## Checklist

### 1. Design System

- [ ] Colors use OKLCH semantic tokens (not `text-gray-*`, not `bg-white`, not hex)
- [ ] Typography: `font-semibold` or `font-medium` (not `font-bold`)
- [ ] Components from correct source: shadcn from `ui/`, app-specific from `shared/`
- [ ] Forms use `<FormField>` from shared (not raw inputs)
- [ ] Toasts via `sonner` on mutations
- [ ] Confirmations via `<ConfirmDialog>` from shared

### 2. Spacing & Layout

- [ ] Page sections: `space-y-6`
- [ ] Form fields: `space-y-4`
- [ ] Card padding: `p-6`
- [ ] No arbitrary spacing values
- [ ] Consistent vertical rhythm

### 3. Admin Panel Patterns

- [ ] Page has `<PageHeader>` with title
- [ ] Loading states use `<Skeleton>`
- [ ] Empty states have clear message
- [ ] Delete actions use `<ConfirmDialog>`
- [ ] Tables use `<DataTable>` from shared

### 4. Responsive

- [ ] Mobile-first (base → `md:` → `lg:`)
- [ ] Tables scroll horizontally on mobile
- [ ] Forms stack vertically on mobile
- [ ] No horizontal page scroll

### 5. Accessibility

- [ ] Interactive elements have accessible labels
- [ ] Proper heading hierarchy (h1 → h2 → h3)
- [ ] `aria-label` on icon-only buttons
- [ ] Alt text on images
- [ ] Focus states visible
- [ ] Color contrast meets WCAG 2.1 (4.5:1)

### 6. Component Sources

```tsx
// Shadcn from ui/
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// App-specific from shared/
import { FormField, DataTable, Pagination } from "@/components/shared";

// Layout from common/
import { PageHeader } from "@/components/common/PageHeader";
```

## Process

1. Read the component
2. Run checklist systematically
3. Check sibling components for consistency
4. Report issues by priority with specific fixes

## Output Format

```markdown
## UI Validation Report: [ComponentName]

### Passing
- [items that pass]

### Issues Found

**Critical**:
1. file:line — description → fix

**Minor**:
1. file:line — description → fix
```
