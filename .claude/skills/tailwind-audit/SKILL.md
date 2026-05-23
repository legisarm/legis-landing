---
name: tailwind-audit
description: Audit Tailwind CSS usage for consistency and design system compliance
allowed-tools: Read, Glob, Grep, Bash
---

# Tailwind Audit

Audit Tailwind CSS usage for consistency. Project uses Tailwind v4 with OKLCH `@theme inline` in `src/styles/theme.css`.

## Audit Categories

### 1. Color Tokens

Use OKLCH semantic tokens, NOT Tailwind palette or arbitrary values:

```tsx
// Correct
text-foreground  text-muted-foreground  bg-background  bg-card  bg-muted  bg-primary  border-border

// Wrong
text-gray-600  bg-gray-100  border-gray-200  text-red-500  text-[#242233]  bg-[#F2F2F5]
```

### 2. Spacing

Use Tailwind spacing scale (4px increments):

```tsx
// Correct
p-4 md:p-6    gap-4    space-y-6    mb-8

// Wrong — arbitrary values
p-[18px]    gap-[25px]
```

Common admin patterns: page `space-y-6`, form fields `space-y-4`, card `p-6`, table cells `px-4 py-3`.

### 3. Typography

```tsx
// Page title
text-2xl font-semibold

// Section heading
text-lg font-medium

// Description
text-sm text-muted-foreground

// Table header
text-xs font-medium uppercase
```

Prefer `font-semibold` / `font-medium` over `font-bold`. Geist Sans is applied globally.

### 4. Borders & Radius

Cards: `rounded-lg border`. Inputs/buttons: `rounded-md`. Avoid `rounded-3xl` (marketing style).

### 5. Responsive

Mobile-first: base → `md:` → `lg:`. Verify grids have mobile breakpoints.

### 6. Anti-Patterns

- Conflicting classes: `p-4 p-6`
- Redundant: `flex flex-row` (flex-row is default)
- Unnecessary `!important`: `!text-foreground`
- Inline styles where Tailwind works

## Scan Commands

```bash
# Arbitrary colors
grep -rn "\[#[0-9A-Fa-f]\+\]" src/ --include="*.tsx"

# Tailwind palette colors
grep -rn "(text\|bg\|border)-(gray\|red\|blue\|green)-[0-9]" src/ --include="*.tsx"

# Arbitrary spacing
grep -rn "\[[0-9]\+px\]" src/ --include="*.tsx"

# Font weight issues
grep -rn "font-bold\|font-black" src/ --include="*.tsx"
```

## Output Format

```markdown
## Tailwind Audit Report

### Issues

**Critical — Token Violations**
1. `file.tsx:23` — `bg-[#3F303F]` → use `bg-primary`

**Medium — Inconsistencies**
2. `file.tsx:67` — `p-[18px]` → use `p-4` or `p-5`

**Low — Optimization**
3. `file.tsx:102` — Missing responsive breakpoint on grid
```
