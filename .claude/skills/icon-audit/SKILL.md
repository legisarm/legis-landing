---
name: icon-audit
description: Audit icon and image usage for consistency and accessibility
allowed-tools: Read, Glob, Grep, Bash
---

# Icon & Image Audit

Audit icon and image usage for consistency, correct sourcing, and accessibility.

## Icon System (Lucide React)

### Size Scale

| Context | Size | Usage |
|---------|------|-------|
| Small inline | `h-3 w-3` | Inline with small text |
| Table/badge | `h-4 w-4` | Table cells, badges, small buttons |
| Standard | `h-5 w-5` | Default buttons, nav items |
| Section | `h-6 w-6` | Section headers |

### Color Patterns

```tsx
// Inherit from parent (preferred)
<button className="text-muted-foreground hover:text-foreground">
  <Calendar className="h-4 w-4" />
</button>

// Explicit semantic color
<MapPin className="h-5 w-5 text-primary" />
```

### Checklist

- [ ] All icons from `lucide-react` (no custom SVGs unless necessary)
- [ ] Consistent sizing within same context
- [ ] `aria-label` on icon-only buttons
- [ ] Colors use semantic tokens (not `text-gray-*`)

## Image System (Next.js Image)

### Asset Location Rule

All static images and icons (SVG, PNG, JPG, WebP) must live under `public/assets/` or a nested subfolder:

```
public/assets/
  favicons/      # favicon variants
  sites/         # site thumbnail images
  icons/         # custom SVG icons (if Lucide lacks them)
  <feature>/     # any other domain-specific assets
```

**Forbidden**: placing images directly in `public/` root, `src/`, or any other directory.

### Checklist

- [ ] All static images are under `public/assets/` (or nested subfolder)
- [ ] All images use `next/image` (NOT `<img>`)
- [ ] Descriptive `alt` text
- [ ] `width` and `height` attributes set
- [ ] `object-cover` for consistent aspect ratios
- [ ] `priority` on above-the-fold images
- [ ] Fallback for missing thumbnails

## Scan Commands

```bash
# Custom SVGs (should use Lucide)
grep -rn "<svg" src/ --include="*.tsx"

# Raw img tags (should use next/image)
grep -rn "<img " src/ --include="*.tsx"

# Icon-only buttons without labels
grep -rn "onClick.*<.*Icon\|onClick.*className.*h-[0-9]" src/ --include="*.tsx"

# Images without alt text
grep -rn "<Image" src/ --include="*.tsx" -A 3 | grep -v "alt="

# Images NOT under public/assets/ (misplaced static files)
find public/ -maxdepth 1 -type f \( -name "*.png" -o -name "*.jpg" -o -name "*.webp" -o -name "*.svg" \)
```

## Output Format

```markdown
## Icon & Image Audit Report

### Issues

**Critical**
1. `file:line` — Missing alt text on Image → add `alt={description}`

**Medium**
1. `file:line` — Custom SVG icon → replace with Lucide `<IconName />`

**Low**
1. `file:line` — Inconsistent icon size → use `h-4 w-4` for table context
```
