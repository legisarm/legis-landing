---
name: color-audit
description: Audit OKLCH color token usage and flag violations (hex, Tailwind palette, raw values)
allowed-tools: Read, Glob, Grep, Bash
---

# Color Audit

Audit color usage for OKLCH design system compliance. Theme defined in `src/styles/theme.css` with `@theme inline` bridge for Tailwind 4.

## Approved Tokens

```tsx
// Backgrounds
bg-background    bg-card    bg-muted    bg-primary    bg-secondary    bg-accent    bg-destructive

// Text
text-foreground    text-muted-foreground    text-primary    text-card-foreground    text-destructive

// Borders
border-border    border-input    border-ring
```

## Forbidden Patterns

| Pattern | Fix |
|---------|-----|
| `text-[#3F303F]` | Use `text-foreground` |
| `bg-[#F2F2F5]` | Use `bg-muted` |
| `text-gray-600` | Use `text-muted-foreground` |
| `bg-gray-100` | Use `bg-muted` |
| `text-red-500` | Use `text-destructive` |
| `border-gray-200` | Use `border-border` |
| `bg-white` | Use `bg-background` or `bg-card` |

## Audit Process

### 1. Scan for arbitrary hex colors

```bash
grep -rn "\[#[0-9A-Fa-f]\+\]" src/ --include="*.tsx" --include="*.ts"
```

### 2. Scan for Tailwind palette colors

```bash
grep -rn "(text\|bg\|border)-(gray\|red\|blue\|green\|yellow\|purple\|pink\|orange)-[0-9]" src/ --include="*.tsx"
```

### 3. Scan for inline color styles

```bash
grep -rn "style=.*color" src/ --include="*.tsx"
```

### 4. Check CSS for non-OKLCH values

```bash
grep -rn "#[0-9A-Fa-f]\{3,8\}\|rgb(" src/styles/ --include="*.css"
```

## Semantic Mapping

| Element | Correct Token |
|---------|--------------|
| Page background | `bg-background` |
| Card surface | `bg-card` |
| Primary text | `text-foreground` |
| Secondary text | `text-muted-foreground` |
| Borders | `border-border` |
| Primary buttons | `bg-primary text-primary-foreground` |
| Danger buttons | `bg-destructive text-destructive-foreground` |
| Hover states | `bg-accent` |

## Theme Details

Soft purple-gray palette (hue 280), very low saturation (chroma 0.005–0.06). Light and dark modes defined in `src/styles/theme.css`.

Key values (light mode):
- Primary: `oklch(0.55 0.06 280)`
- Background: `oklch(0.98 0.005 280)`
- Foreground: `oklch(0.30 0.02 280)`
- Destructive: `oklch(0.62 0.15 15)`

## Output Format

```markdown
## Color Audit Report

### Summary
- Files scanned: X | Arbitrary hex: Y | Palette colors: Z | Mismatches: W

### Issues (by priority)
1. `file.tsx:line` — `text-[#hex]` → use `text-foreground`
```
