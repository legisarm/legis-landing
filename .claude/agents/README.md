# AI Agents Directory

This folder contains specialized AI agent definitions for the Armenian Heritage Map project. Each agent is a domain expert with specific responsibilities, interaction rules, and output formats designed for **maximum token efficiency** and **code quality**.

---

## 📋 **Agent Roster**

### 🏗️ **Architecture & Structure**

#### 1. **ARCHITECT.md** - The Component Architect
**Role**: Senior Frontend Architect (Next.js 15+ / React 19)
**Expertise**: Production-ready component generation following feature-based architecture
**Invocation**: Component creation, architectural decisions, component organization
**Output**: Complete TypeScript components with shadcn/ui integration

#### 2. **STRUCTURE_ANALYST.md** - The Structure Analyst
**Role**: Senior Software Architect & Code Organization Specialist
**Expertise**: Feature-based architecture enforcement, dependency flow validation
**Invocation**: Architecture reviews, structural violations, module organization
**Output**: Violation reports with file:line references and remediation steps

---

### 🎨 **UI & Design System**

#### 3. **AUDITOR.md** - The Tailwind Auditor
**Role**: Senior CSS Refactoring Specialist (Tailwind 4.0+)
**Expertise**: Tailwind class optimization, design token enforcement
**Invocation**: Tailwind class audits, arbitrary value elimination
**Output**: Refactored components with optimized className strings

#### 4. **COLOR_GUARDIAN.md** - The Color Guardian
**Role**: Senior Design System Enforcement Specialist
**Expertise**: Color token compliance, legacy color migration
**Invocation**: Color audits, design system migration from legacy tokens
**Output**: Components using approved design tokens (plum, dark-text, etc.)

#### 5. **INSPECTOR.md** - The Layout & Alignment Inspector
**Role**: Senior Visual QA & CSS Layout Specialist
**Expertise**: Overlap detection, flex/grid alignment, z-index conflicts
**Invocation**: Visual bug fixes, layout issues, element overlapping
**Output**: Corrected components with proper alignment and spacing

#### 6. **STRATEGIST.md** - The Responsive Strategist
**Role**: Senior Mobile-First Design Expert
**Expertise**: Responsive design, mobile-first patterns, breakpoint optimization
**Invocation**: Responsive audits, mobile optimization, touch target compliance
**Output**: Mobile-first responsive components with fluid layouts

#### 7. **ASSET_OPTIMIZER.md** - The Asset Optimizer
**Role**: Senior Performance & Accessibility Specialist (Icons & Images)
**Expertise**: Lucide React icons, Next.js Image optimization, alt text compliance
**Invocation**: Icon/image audits, performance optimization, accessibility checks
**Output**: Optimized components with proper image and icon usage

---

### 🔧 **Code Quality & Refactoring**

#### 8. **REFACTOR_SPECIALIST.md** - The Refactor Specialist
**Role**: Senior Code Refactoring Engineer
**Expertise**: Minimal-change refactoring, behavior preservation, anti-pattern elimination
**Invocation**: Code refactoring, duplicate elimination, prop drilling fixes
**Output**: Surgically refactored code with preserved functionality

#### 9. **FEATURE_BUILDER.md** - The Feature Builder
**Role**: Senior Feature Architecture Specialist
**Expertise**: Feature scaffolding, schema-first development, React Query integration
**Invocation**: New feature creation, feature structure setup
**Output**: Complete feature modules (schema → types → service → data → hooks → index)

---

## 🎯 **How to Use Agents**

### **Invocation Pattern**

Agents are invoked by describing the task that matches their expertise:

```
"Audit Tailwind classes in the MapSidePanel component"
→ Automatically uses AUDITOR (Tailwind Auditor)

"Check for color violations across all components"
→ Automatically uses COLOR_GUARDIAN

"Scaffold a new 'comments' feature"
→ Automatically uses FEATURE_BUILDER

"Review the sites feature architecture"
→ Automatically uses STRUCTURE_ANALYST
```

### **Multi-Agent Workflows**

Complex tasks can use multiple agents sequentially:

```
1. FEATURE_BUILDER: "Scaffold a 'reviews' feature"
2. STRUCTURE_ANALYST: "Validate the feature structure"
3. AUDITOR: "Audit Tailwind classes in review components"
4. COLOR_GUARDIAN: "Check color compliance"
5. ASSET_OPTIMIZER: "Optimize icons and images"
```

---

## 🔑 **Agent Design Principles**

All agents follow these core principles:

### 1. **Token Efficiency**
- ✅ **No Preamble**: Start immediately with output
- ✅ **No Summary**: Skip explanations unless requested
- ✅ **Direct Output**: 95% of tokens in code blocks
- ✅ **Contextual Diffs**: Output only changed sections for large files

### 2. **Output Consistency**
Each agent provides:
1. **File Path**: Exact location of code
2. **Code Block**: Complete, copy-pasteable implementation
3. **Impact Note** (if multi-file): Files affected count

### 3. **Quality Standards**
- ✅ Biome-compliant formatting
- ✅ TypeScript type safety
- ✅ Design system compliance (plum colors, Montserrat font)
- ✅ i18n usage (next-intl)
- ✅ Accessibility (a11y) compliance

---

## 📊 **Agent Capability Matrix**

| Task | Primary Agent | Supporting Agents |
|------|---------------|-------------------|
| New component | ARCHITECT | AUDITOR, COLOR_GUARDIAN |
| New feature | FEATURE_BUILDER | STRUCTURE_ANALYST |
| Color migration | COLOR_GUARDIAN | AUDITOR |
| Tailwind cleanup | AUDITOR | COLOR_GUARDIAN, STRATEGIST |
| Layout fixes | INSPECTOR | AUDITOR, STRATEGIST |
| Responsive design | STRATEGIST | AUDITOR, INSPECTOR |
| Icon/image optimization | ASSET_OPTIMIZER | - |
| Code refactoring | REFACTOR_SPECIALIST | STRUCTURE_ANALYST |
| Architecture review | STRUCTURE_ANALYST | - |

---

## 🛠️ **Common Workflows**

### **Workflow 1: Create New Feature**
```
1. FEATURE_BUILDER → Scaffold feature structure
2. STRUCTURE_ANALYST → Validate architecture
3. ARCHITECT → Create UI components
4. AUDITOR → Optimize Tailwind classes
5. COLOR_GUARDIAN → Verify design tokens
6. ASSET_OPTIMIZER → Optimize assets
```

### **Workflow 2: UI Component Development**
```
1. ARCHITECT → Generate component
2. AUDITOR → Optimize Tailwind
3. COLOR_GUARDIAN → Check colors
4. STRATEGIST → Add responsive patterns
5. INSPECTOR → Fix alignment
6. ASSET_OPTIMIZER → Optimize icons/images
```

### **Workflow 3: Code Refactoring**
```
1. STRUCTURE_ANALYST → Identify violations
2. REFACTOR_SPECIALIST → Execute refactor
3. AUDITOR → Clean up styling
4. COLOR_GUARDIAN → Verify tokens
```

### **Workflow 4: Design System Migration**
```
1. COLOR_GUARDIAN → Migrate colors
2. AUDITOR → Update Tailwind classes
3. ASSET_OPTIMIZER → Update icons
4. STRATEGIST → Verify responsive
5. INSPECTOR → Fix layouts
```

---

## 📖 **Agent Invocation Examples**

### Architecture & Structure
```
"Create a new UserProfile component for the dashboard"  → ARCHITECT
"Review the timeline feature structure"                → STRUCTURE_ANALYST
"Scaffold a notifications feature"                     → FEATURE_BUILDER
```

### UI & Design
```
"Audit Tailwind classes in MapControls"                → AUDITOR
"Check for legacy colors in all components"            → COLOR_GUARDIAN
"Fix overlapping elements in the header"               → INSPECTOR
"Make the SiteCard component responsive"               → STRATEGIST
"Optimize icons in the navigation"                     → ASSET_OPTIMIZER
```

### Code Quality
```
"Refactor the map filtering logic"                     → REFACTOR_SPECIALIST
"Extract duplicated site card logic"                   → REFACTOR_SPECIALIST
"Check for cross-feature imports"                      → STRUCTURE_ANALYST
```

---

## 🎓 **Best Practices**

### **1. Be Specific**
```
✅ "Audit Tailwind classes in src/app/map/_components/MapSidePanel.tsx"
❌ "Check the map page"
```

### **2. One Agent Per Task**
```
✅ "Audit colors" → COLOR_GUARDIAN
❌ "Fix everything" → Too broad
```

### **3. Sequential Workflows**
```
✅ Create → Validate → Optimize (3 agents sequentially)
❌ Create+Validate+Optimize (1 agent trying to do all)
```

### **4. Trust the Agent**
```
✅ Accept the output and iterate if needed
❌ Second-guess architectural decisions in the output
```

---

## 🔄 **Agent Maintenance**

### **When to Update Agents**
- ✅ Project architecture changes (e.g., new folder structure)
- ✅ Design system updates (e.g., new color tokens)
- ✅ Technology upgrades (e.g., Next.js 16, Tailwind 5)
- ✅ New patterns established (e.g., new component types)

### **How to Update Agents**
1. Identify the affected agent(s)
2. Update the relevant sections (Principles, Standards, Patterns)
3. Update examples to reflect new patterns
4. Test with sample invocations

---

## 📚 **Related Documentation**

- **Skills**: See `/.claude/skills/` for detailed implementation guides
- **Architecture**: See `/.claude/ARCHITECTURE.md` for project structure
- **Patterns**: See `/.claude/PATTERNS.md` for code patterns
- **Workflow**: See `/.claude/WORKFLOW.md` for development processes

---

## 🚀 **Quick Start**

To use an agent, simply describe your task in natural language:

```
"I need to create a new search feature with autocomplete"
→ FEATURE_BUILDER will scaffold the feature structure

"The map controls are overlapping the sidebar"
→ INSPECTOR will fix the layout

"Replace all legacy colors with design tokens"
→ COLOR_GUARDIAN will migrate the colors
```

The AI will automatically select and invoke the appropriate agent(s) based on your request!
