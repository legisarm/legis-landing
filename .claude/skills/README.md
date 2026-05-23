# Claude Code Skills for Armenian Heritage Map

This folder contains specialized AI skills designed to improve code quality, maintain architecture consistency, and streamline UI development while **saving AI tokens** and following **best practices**.

## Available Skills

### 🎨 UI & Design

#### `ui-validate.md`
**Purpose**: Comprehensive UI validation for overlapping, spacing, design system compliance, and accessibility.

**Use when**:
- Reviewing existing components
- Before committing UI changes
- Checking for layout issues
- Ensuring design system compliance

**Example usage**:
> "Validate the UI in src/app/map/_components/MapSidePanel.tsx"

**What it checks**:
- Visual overlapping & z-index conflicts
- Spacing consistency (Tailwind scale)
- Design system colors (plum, dark-text, etc.)
- Responsive design patterns
- Accessibility (a11y)
- Component best practices

---

#### `tailwind-audit.md`
**Purpose**: Audit and fix Tailwind CSS class usage for consistency, performance, and design system compliance.

**Use when**:
- Finding arbitrary values (colors, spacing)
- Checking design token usage
- Ensuring responsive patterns
- Removing shadows (flat design)
- Fixing typography (font-medium)

**Example usage**:
> "Audit Tailwind classes in the map components"

**What it checks**:
- Arbitrary values ([#hex], [Npx])
- Design token usage (plum vs purple-X)
- Spacing scale compliance (4px increments)
- Typography patterns (font-medium, not bold)
- Responsive breakpoints (mobile-first)
- Shadow usage (should be none)
- Border radius consistency
- Interaction states (hover, focus)

---

#### `color-audit.md`
**Purpose**: Audit color usage for design system compliance and consistency.

**Use when**:
- Migrating from legacy colors
- Ensuring brand consistency
- Checking contrast ratios
- Finding arbitrary color values

**Example usage**:
> "Run a color audit on all component files"

**What it finds**:
- Legacy color usage (tuff-primary, basalt-text, etc.)
- Arbitrary hex values (should use tokens)
- Semantic mismatches (wrong color for context)
- Contrast ratio issues

---

#### `component-design.md`
**Purpose**: Design and implement UI components following project architecture and design system.

**Use when**:
- Creating new components
- Need guidance on component structure
- Deciding where to place components
- Applying design system patterns

**Example usage**:
> "Help me design a new FilterDropdown component"

**What it provides**:
- Component location guidance (ui/shared/common)
- Design system application (colors, typography, spacing)
- Internationalization patterns
- Responsive design templates
- State management decisions

---

#### `icon-image-optimize.md`
**Purpose**: Audit and optimize icon and image usage.

**Use when**:
- Checking icon consistency
- Optimizing image performance
- Finding missing alt text
- Auditing image sizes

**Example usage**:
> "Audit icons and images across the app"

**What it checks**:
- Icon consistency (Lucide React usage)
- Image optimization (next/image patterns)
- Alt text for accessibility
- Asset organization
- File sizes and performance

---

### 🏗️ Architecture & Code Quality

#### `architecture-review.md`
**Purpose**: Analyze code structure and ensure feature-based architecture compliance.

**Use when**:
- Reviewing feature structure
- Checking dependency flow
- Finding architectural violations
- Ensuring separation of concerns

**Example usage**:
> "Review the architecture of the sites feature"

**What it checks**:
- Feature structure (schema, types, service, data, hooks)
- Dependency flow (app → features → lib)
- Cross-feature imports (not allowed)
- Component organization
- State management boundaries

---

#### `refactor-smart.md`
**Purpose**: Refactor code with minimal changes, maximum impact.

**Use when**:
- Improving existing code
- Consolidating duplicates
- Extracting business logic
- Simplifying components

**Example usage**:
> "Help me refactor the map filtering logic"

**What it provides**:
- Refactoring patterns (extract, consolidate, simplify)
- Impact analysis (how many files affected)
- Step-by-step execution plan
- Validation checklist

---

#### `feature-scaffold.md`
**Purpose**: Quickly scaffold new features following project architecture.

**Use when**:
- Creating a new feature
- Need template structure
- Want consistent feature organization

**Example usage**:
> "Scaffold a new 'favorites' feature"

**What it creates**:
- Complete feature structure (schema, types, service, data, hooks)
- Query keys
- Translation keys
- Barrel exports (index.ts)

---

## How to Use Skills

### Method 1: Direct Request
Simply describe what you need in natural language:

```
"Validate the UI in the MapSidePanel component"
→ Uses ui-validate.md automatically
```

```
"I need a new 'reviews' feature for sites"
→ Uses feature-scaffold.md to create structure
```

### Method 2: Explicit Skill Reference
Mention the skill name directly:

```
"Use the color-audit skill to check all components"
```

```
"Apply the component-design skill to help me create a SearchBar"
```

### Method 3: Combine Skills
Use multiple skills for comprehensive work:

```
"Scaffold a 'notifications' feature, then validate the UI components"
→ Uses feature-scaffold.md + ui-validate.md
```

```
"Review the timeline feature architecture, then audit its colors"
→ Uses architecture-review.md + color-audit.md
```

## Benefits of These Skills

### 🪙 **Token Efficiency**
- Skills reference existing docs instead of re-reading them
- Use targeted Grep/Glob searches instead of scanning entire codebase
- Provide focused, actionable output
- Avoid unnecessary file reads

### ✅ **Quality Assurance**
- Comprehensive validation checklists
- Automated pattern detection
- Design system enforcement
- Architecture compliance checks

### ⚡ **Speed**
- Quick scaffolding templates
- Pre-defined refactoring patterns
- Systematic audit processes
- Copy-paste ready code examples

### 📚 **Best Practices**
- Follow project architecture (feature-based)
- Adhere to design system (Figma March 2026)
- Enforce accessibility (a11y)
- Maintain type safety (Zod schemas)

## Common Workflows

### 🆕 Creating a New Feature
1. `feature-scaffold.md` - Scaffold structure
2. `architecture-review.md` - Verify compliance
3. `component-design.md` - Design UI components
4. `ui-validate.md` - Validate final UI

### 🎨 UI Development
1. `component-design.md` - Design component
2. `color-audit.md` - Check colors match design system
3. `icon-image-optimize.md` - Optimize assets
4. `ui-validate.md` - Final validation

### 🔧 Refactoring
1. `architecture-review.md` - Identify issues
2. `refactor-smart.md` - Plan and execute refactor
3. `ui-validate.md` - Ensure UI still compliant

### 🔍 Code Review
1. `architecture-review.md` - Check structure
2. `color-audit.md` - Verify design system
3. `ui-validate.md` - Check UI quality
4. `icon-image-optimize.md` - Audit assets

## Tips for Maximum Effectiveness

1. **Be Specific**: Reference exact files or components
   - ✅ "Validate UI in src/app/map/page.tsx"
   - ❌ "Check the map page"

2. **Combine Skills**: Use multiple skills for comprehensive reviews
   - "Review architecture and validate UI for the timeline feature"

3. **Iterate**: Use skills after making changes
   - Create component → ui-validate → fix issues → validate again

4. **Reference CLAUDE.md**: Skills work best with project context
   - Skills reference CLAUDE.md automatically for consistency

5. **Use for Learning**: Read skills to understand patterns
   - Skills document best practices for the project

## Skill Maintenance

To keep skills effective:

- **Update when architecture changes**: If project structure evolves, update skills
- **Add new skills**: Create new skills for recurring tasks
- **Remove outdated patterns**: Keep skills in sync with current best practices
- **Contribute improvements**: Enhance skills based on real usage

## Questions?

These skills are designed to work seamlessly with Claude Code. Simply describe your task, and the AI will automatically apply the most relevant skills to help you efficiently and effectively.

For project-specific patterns, see:
- `/CLAUDE.md` - Project instructions
- `/.claude/ARCHITECTURE.md` - Architecture details
- `/.claude/PATTERNS.md` - Code patterns
- `/.claude/WORKFLOW.md` - Development workflow
