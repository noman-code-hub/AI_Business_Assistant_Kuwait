# AI Business Assistant Kuwait — Design System

> **Phase:** UI / UX Design Foundation Only  
> **Stack foundation:** Shadcn UI + Tailwind CSS + Inter  
> **References:** HubSpot · Salesforce Lightning · GoHighLevel · Notion · Linear · Stripe

---

## 1. Design Principles

| Principle | Application |
|-----------|-------------|
| **Modern** | Clean surfaces, restrained color, crisp type |
| **Professional** | Enterprise density without clutter |
| **Minimal** | One primary action per view; progressive disclosure |
| **Enterprise** | Tables, filters, bulk actions, keyboard paths |
| **Luxury** | Soft elevation, refined spacing, glass accents |
| **Fast** | Skeletons, optimistic UI cues, instant nav |
| **Responsive** | Mobile-first collapse; desktop power-user density |
| **Bilingual** | Full LTR (EN) + RTL (AR) parity |

---

## 2. Color Palette

### Brand & Semantic

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-primary` | `#2563EB` | Primary CTAs, active nav, links, focus rings |
| `--color-primary-hover` | `#1D4ED8` | Primary hover |
| `--color-primary-muted` | `#DBEAFE` | Soft primary backgrounds |
| `--color-secondary` | `#0F172A` | Headings, sidebar (light), dark surfaces |
| `--color-accent` | `#14B8A6` | Highlights, AI accents, secondary CTAs |
| `--color-accent-muted` | `#CCFBF1` | Soft accent fills |
| `--color-success` | `#10B981` | Success, paid, completed |
| `--color-warning` | `#F59E0B` | Warning, pending, trial |
| `--color-danger` | `#EF4444` | Errors, destructive, overdue |
| `--color-info` | `#2563EB` | Informational (aligned to primary) |

### Neutral Gray Scale

| Token | Light | Usage |
|-------|-------|-------|
| `--gray-50` | `#F8FAFC` | App background |
| `--gray-100` | `#F1F5F9` | Subtle sections |
| `--gray-200` | `#E2E8F0` | Borders, dividers |
| `--gray-300` | `#CBD5E1` | Input borders |
| `--gray-400` | `#94A3B8` | Placeholders |
| `--gray-500` | `#64748B` | Secondary text |
| `--gray-600` | `#475569` | Body muted |
| `--gray-700` | `#334155` | Body |
| `--gray-800` | `#1E293B` | Strong body |
| `--gray-900` | `#0F172A` | Headings (= secondary) |

### Surface Tokens (Light)

```
--bg-app:            #F8FAFC
--bg-surface:        #FFFFFF
--bg-surface-raised: #FFFFFF
--bg-muted:          #F1F5F9
--bg-sidebar:        #0F172A
--bg-sidebar-hover:  #1E293B
--bg-glass:          rgba(255,255,255,0.72)
--border-default:    #E2E8F0
--border-strong:     #CBD5E1
--text-primary:      #0F172A
--text-secondary:    #64748B
--text-inverse:      #F8FAFC
--text-sidebar:      #CBD5E1
--text-sidebar-active: #FFFFFF
```

### Surface Tokens (Dark)

```
--bg-app:            #020617
--bg-surface:        #0F172A
--bg-surface-raised: #1E293B
--bg-muted:          #1E293B
--bg-sidebar:        #020617
--bg-sidebar-hover:  #0F172A
--bg-glass:          rgba(15,23,42,0.72)
--border-default:    #1E293B
--border-strong:     #334155
--text-primary:      #F8FAFC
--text-secondary:    #94A3B8
--text-inverse:      #0F172A
--text-sidebar:      #94A3B8
--text-sidebar-active: #FFFFFF
```

### Status Chip Colors

| Status | BG (light) | Text |
|--------|------------|------|
| Active / Paid / Won | `#D1FAE5` | `#065F46` |
| Pending / Draft | `#FEF3C7` | `#92400E` |
| Overdue / Lost | `#FEE2E2` | `#991B1B` |
| New / Open | `#DBEAFE` | `#1E40AF` |
| AI | `#CCFBF1` | `#0F766E` |

---

## 3. Typography

**Font family:** `Inter` (Latin) + `IBM Plex Sans Arabic` (Arabic)  
Load via Google Fonts / self-host. Fallbacks: `system-ui, sans-serif`.

| Token | Size | Line | Weight | Usage |
|-------|------|------|--------|-------|
| `display` | 36px / 2.25rem | 1.2 | 700 | Auth heroes, rare |
| `h1` | 30px / 1.875rem | 1.25 | 700 | Page titles |
| `h2` | 24px / 1.5rem | 1.3 | 600 | Section titles |
| `h3` | 20px / 1.25rem | 1.35 | 600 | Card titles |
| `h4` | 16px / 1rem | 1.4 | 600 | Subsections |
| `body` | 14px / 0.875rem | 1.5 | 400 | Default UI text |
| `body-lg` | 16px / 1rem | 1.5 | 400 | Descriptions |
| `caption` | 12px / 0.75rem | 1.4 | 400 | Meta, timestamps |
| `overline` | 11px / 0.6875rem | 1.3 | 600 | Labels (uppercase optional) |
| `mono` | 13px | 1.4 | 500 | API keys, IDs |

**Responsive type:** drop one step on mobile (`h1` → 24px, `h2` → 20px).

---

## 4. Spacing System (8px)

| Token | Value |
|-------|-------|
| `space-0` | 0 |
| `space-1` | 4px |
| `space-2` | 8px |
| `space-3` | 12px |
| `space-4` | 16px |
| `space-5` | 20px |
| `space-6` | 24px |
| `space-8` | 32px |
| `space-10` | 40px |
| `space-12` | 48px |
| `space-16` | 64px |

**Page padding:** Desktop `32px`, Tablet `24px`, Mobile `16px`  
**Card padding:** `24px` (desktop), `16px` (mobile)  
**Stack gaps:** sections `24–32px`, form fields `16px`, inline `8px`

---

## 5. Border Radius

| Token | Value | Usage |
|-------|-------|-------|
| `radius-sm` | 6px | Inputs, chips |
| `radius-md` | 10px | Buttons, small cards |
| `radius-lg` | 14px | Cards, modals |
| `radius-xl` | 20px | Auth panels, hero cards |
| `radius-full` | 9999px | Avatars, pills |

---

## 6. Elevation & Glass

| Level | Shadow | Usage |
|-------|--------|-------|
| `shadow-xs` | `0 1px 2px rgba(15,23,42,0.04)` | Inputs |
| `shadow-sm` | `0 1px 3px rgba(15,23,42,0.06), 0 1px 2px rgba(15,23,42,0.04)` | Cards |
| `shadow-md` | `0 4px 12px rgba(15,23,42,0.08)` | Dropdowns, popovers |
| `shadow-lg` | `0 12px 32px rgba(15,23,42,0.12)` | Modals, drawers |
| `shadow-glow` | `0 0 0 3px rgba(37,99,235,0.25)` | Focus |

**Glassmorphism** (navbar sticky, command palette, auth aside overlays):

```css
background: var(--bg-glass);
backdrop-filter: blur(12px) saturate(140%);
border: 1px solid rgba(226, 232, 240, 0.6);
```

Use sparingly — never on dense data tables.

---

## 7. Grid System

| Breakpoint | Width | Columns | Gutter |
|------------|-------|---------|--------|
| `xs` | < 640px | 4 | 16px |
| `sm` | ≥ 640px | 4 | 16px |
| `md` | ≥ 768px | 8 | 20px |
| `lg` | ≥ 1024px | 12 | 24px |
| `xl` | ≥ 1280px | 12 | 24px |
| `2xl` | ≥ 1536px | 12 | 32px |

**Content max width:** `1440px` centered inside dashboard main.  
**Sidebar:** `264px` expanded / `72px` collapsed (icons).

---

## 8. Icons

- Library: **Lucide React** (Shadcn default)
- Default size: `16px` (inline), `20px` (nav), `24px` (empty states)
- Stroke: `1.75`
- Color: inherits `currentColor`
- Always pair icon + label in primary nav (tooltip when collapsed)

---

## 9. Motion & Interaction

| Token | Duration | Easing |
|-------|----------|--------|
| `fast` | 120ms | `ease-out` |
| `normal` | 200ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` |
| `slow` | 320ms | `cubic-bezier(0.2, 0.8, 0.2, 1)` |

**Allowed animations:**

- Sidebar collapse width
- Modal / drawer enter-exit (Framer Motion)
- Toast slide
- Page fade (subtle, optional)
- Skeleton shimmer
- Hover lift on actionable cards (`translateY(-1px)` + shadow-md)

**Forbidden:** bouncing, endless decorative loops, heavy parallax.

---

## 10. Hover / Focus / Active

| State | Treatment |
|-------|-----------|
| Hover (button primary) | `#1D4ED8`, slight brightness |
| Hover (row) | `bg-muted` |
| Hover (nav item) | `bg-sidebar-hover` |
| Focus visible | `2px` ring primary + offset `2px` |
| Active / pressed | Scale `0.98` (buttons) |
| Disabled | Opacity `0.5`, `pointer-events: none` |

---

## 11. Accessibility

- WCAG 2.1 AA contrast minimum
- Visible focus rings always (never `outline: none` without replacement)
- Hit targets ≥ `44×44` on mobile
- `aria-label` on icon-only buttons
- Tables: proper `<th>` / scope
- Modals: focus trap + `Esc` close
- Live regions for toasts
- Respect `prefers-reduced-motion`
- RTL: logical properties (`ps`/`pe`/`ms`/`me`, `start`/`end`)

---

## 12. Density Modes

| Mode | Row height | Use |
|------|------------|-----|
| Comfortable | 52px | Default CRM |
| Compact | 40px | Power users / reports |

User preference in Settings → Appearance.

---

## 13. Dark / Light Mode

- Toggle in Navbar (sun/moon)
- Persist in `localStorage` + user profile
- System preference as initial default
- Charts use theme-aware series colors
- Sidebar stays dark in light mode (Stripe/Linear hybrid) — optional setting: “Match theme”

**Default recommendation:** Dark sidebar + light content (enterprise CRM look).

---

## 14. RTL (Arabic)

- `dir="rtl"` on `<html>` when locale = `ar`
- Mirror sidebar to the right
- Flip chevrons, breadcrumbs, timeline axes
- Keep numbers/LTR tokens in `dir="ltr"` spans (phones, emails, amounts)
- Inter + IBM Plex Sans Arabic stack

---

## 15. Shadcn Mapping

| Design component | Shadcn base |
|------------------|-------------|
| Button | `Button` |
| Input / Textarea / Select | `Input`, `Textarea`, `Select` |
| Card | `Card` |
| Table | `Table` |
| Dialog / Sheet | `Dialog`, `Sheet` |
| Dropdown | `DropdownMenu` |
| Tabs | `Tabs` |
| Accordion | `Accordion` |
| Avatar | `Avatar` |
| Badge | `Badge` |
| Toast | `sonner` or hot-toast wrapper |
| Calendar / Date picker | `Calendar` + `Popover` |
| Skeleton | `Skeleton` |
| Separator | `Separator` |
| Tooltip | `Tooltip` |
| Switch / Checkbox | `Switch`, `Checkbox` |

All custom components wrap Shadcn — never fork styles randomly.

---

## 16. File Locations

```
apps/web/src/styles/tokens.css
apps/web/src/styles/themes.css
apps/web/src/design-system/
docs/design/
```
