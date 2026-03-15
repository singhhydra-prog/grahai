# GrahAI Design Tokens - Quick Reference

## Color System

### Primary Palette
```
Background (Primary): #0A0E1A
Background (Secondary): #0F172A
Background (Tertiary): #1a1f35
Background (Hover): #2a3555

Accent (Primary): #D4A054 (Gold)
Accent (Secondary): #B87333 (Copper)

Text (Primary): #F1F5F9 (Off-white)
Text (Secondary): #94A3B8 (Muted gray)
Text (Tertiary): #475569 (Further muted)
```

### Semantic Colors (Planets)
```
Sun:      #D4A054 (Gold)
Moon:     #E8E8E8 (Silver)
Mars:     #CC3333 (Deep Red)
Mercury:  #22D3EE (Cyan)
Jupiter:  #6B21A8 (Deep Purple)
Venus:    #EC4899 (Soft Pink)
Saturn:   #4B5563 (Gray-Blue)
Rahu:     #475569 (Shadow Gray)
Ketu:     #64748B (Darker Shadow)

Status Colors:
Success:  #10B981 (Emerald - aspects)
Warning:  #F59E0B (Amber - alerts)
Error:    #EF4444 (Red - critical)
Info:     #3B82F6 (Blue - information)
```

## Typography

### Font Families
```
Display (Headings, dasha labels):
  Primary: EB Garamond (serif)
  Fallback: Garamond, Georgia, serif

UI (Labels, buttons, navigation):
  Primary: Inter (sans-serif)
  Fallback: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif

Body (Reading, descriptions):
  Primary: Roboto (sans-serif)
  Fallback: Inter, -apple-system, sans-serif
```

### Font Sizes & Weights
```
H1: 32px, bold (font-weight: 700)
H2: 24px, semibold (font-weight: 600)
H3: 18px, medium (font-weight: 500)
H4: 16px, medium (font-weight: 500)

Body: 14px, regular (font-weight: 400)
Small: 12px, regular (font-weight: 400)
Label: 14px, medium (font-weight: 500)
Overline: 12px, semibold (font-weight: 600), letter-spacing: +0.5px
```

### Line Heights
```
Headings: 1.2
Body (reading): 1.6
UI Labels: 1.4
```

## Spacing System (8px Base)
```
xs:  4px  (not recommended for general spacing)
sm:  8px
md:  16px (standard padding, gaps)
lg:  24px
xl:  32px
2xl: 40px
3xl: 48px
4xl: 56px
5xl: 64px
```

### Common Component Spacing
```
Card Padding:        16px (sm padding on all sides)
Card Margin:         16px (md gap between cards)
Modal Padding:       24px (lg padding for breathing room)
Section Margin Top:  32px (xl for visual breaks)
Section Margin Bottom: 32px
Form Input Gap:      16px (md spacing between inputs)
Button Height:       44px (touch target minimum)
```

## Shadows & Elevation

### Depth Levels
```
None:    no shadow
sm:      0 1px 2px 0 rgba(212, 160, 84, 0.05)  [subtle gold tint]
md:      0 4px 6px -1px rgba(0, 0, 0, 0.1),
         0 2px 4px -1px rgba(0, 0, 0, 0.06)
lg:      0 10px 15px -3px rgba(0, 0, 0, 0.1),
         0 4px 6px -2px rgba(0, 0, 0, 0.05)
xl:      0 20px 25px -5px rgba(0, 0, 0, 0.1),
         0 10px 10px -5px rgba(0, 0, 0, 0.04)
2xl:     0 25px 50px -12px rgba(0, 0, 0, 0.25)

Gold Glow (Premium Feature Emphasis):
         box-shadow: 0 0 16px rgba(212, 160, 84, 0.3)
```

## Border Radius

```
None:    0px
sm:      2px   (subtle, for charts, icons)
md:      4px   (standard, buttons, inputs)
lg:      8px   (rounded corners, modals, cards)
full:    9999px (completely round, badges, profile pics)

Recommended Usage:
- Chart components: 0-2px (maintains precision aesthetic)
- Buttons: 4px
- Cards: 4-8px
- Modals: 8px
- Toggle switches: full
```

## Animations & Transitions

### Timing Functions
```
ease-in-out: cubic-bezier(0.4, 0, 0.2, 1)      [standard, recommended]
ease-out: cubic-bezier(0.0, 0, 0.2, 1)         [entrances]
ease-in: cubic-bezier(0.4, 0, 1, 1)            [exits]
ease-linear: linear                             [progress indicators, timelines]
```

### Standard Durations
```
instant:  0ms
fast:     100ms  (button feedback, micro-interactions)
normal:   200-300ms  (UI transitions, chart interactions)
slow:     500-600ms  (context changes, modal opens)
slower:   800-1000ms  (data load reveals, complex animations)
```

### Animation Sequences
```
Button Tap Feedback:        100ms ease-in-out scale(0.95→1.0)
Chart Planet Highlight:     200-250ms ease-in-out (dim others to 0.3 opacity)
Dasha Period Expansion:     300ms ease-out-cubic (height increase + child fade-in)
Page Transition:            200-300ms fade + slide-up 12px
Modal Open:                 300ms ease-out-cubic slide-from-bottom
Loading Skeleton Shimmer:   1500ms linear left-to-right shimmer
```

## Interactive Components

### Buttons

#### Primary (Gold)
```
Background: #D4A054
Text: #0A0E1A
Border: none
Height: 44px (mobile), 40px (desktop)
Padding: 0 16px
Radius: 4px
Font: 14px, medium weight

States:
- Default: background #D4A054
- Hover: background #C99644 (darker)
- Active: background #D4A054, scale 0.98
- Disabled: opacity 0.5, cursor not-allowed
- Focus: ring 2px #D4A054, ring-offset 2px #0A0E1A
```

#### Secondary (Outline)
```
Background: transparent
Border: 2px #D4A054
Text: #D4A054
Height: 44px
Padding: 0 16px
Radius: 4px

States:
- Hover: background rgba(212, 160, 84, 0.1)
- Active: background rgba(212, 160, 84, 0.2)
```

### Input Fields
```
Background: #1a1f35
Border: 1px #2a3555
Text: #F1F5F9
Placeholder: #94A3B8
Height: 44px
Padding: 12px 16px
Radius: 4px

Focus:
- Border: 2px #D4A054
- Outline: none
- Box-shadow: 0 0 8px rgba(212, 160, 84, 0.2)

Error:
- Border: 2px #EF4444
- Background: rgba(239, 68, 68, 0.05)
```

### Cards
```
Background: #0F172A (light layer on #0A0E1A)
Border: none (or 1px #2a3555 subtle)
Padding: 16px
Radius: 4-8px
Shadow: md

Hover:
- Background: #1a1f35
- Shadow: lg
```

### Modals
```
Backdrop: rgba(0, 0, 0, 0.5) [dark overlay]
Panel Background: #0F172A
Border: 1px #2a3555
Radius: 8px
Padding: 24px
Shadow: 2xl
Max-width: 480px (on desktop)
```

## Chart-Specific Design Tokens

### Birth Chart Wheel
```
Background: transparent (or subtle gradient)
Outer Ring (Zodiac): 
  - Stroke: #D4A054, 1px
  - Text: #F1F5F9, 12px
  - Divisions: every 30° (zodiac signs)

House Divisions:
  - Stroke: #2a3555, 1.5px (subtle)
  - Labels: #94A3B8, 12px

Planets:
  - Glyph size: 20-24px (active), 16-18px (passive)
  - Tap highlight: 2px glow ring in planet color
  - Inactive (dimmed): opacity 0.3

Aspect Lines:
  - Conjunction: #D4A054, 1.5px
  - Trine/Sextile: #10B981, 1.5px
  - Square/Opposition: #EF4444, 1.5px
  - Opacity: 0.6 (default), 1.0 (highlighted)
```

### Dasha Timeline
```
Container: horizontal scrollable (max-width: 100%, min-height: 120px)
Background: #1a1f35
Padding: 16px vertical

Mahadasha Bar:
  - Height: 56px
  - Background: gradient from planet color + darker
  - Border-radius: 2px
  - Text: period name + dates (white, 12px)
  - Margin-bottom: 8px

Antardasha Bar:
  - Height: 32px
  - Background: planet color at 70% opacity
  - Text: 10px (smaller)
  - Nested within Mahadasha

Current Period Emphasis:
  - Glow: box-shadow 0 0 16px rgba(212, 160, 84, 0.4)
  - Ring: 2px border in planet color

Progress Indicator:
  - Height: 2px, full width
  - Background: linear gradient (past→current→future)
  - Marker at current: gold dot, 6px diameter
```

## Responsive Breakpoints

```
xs: 320px   (small phones)
sm: 375px   (standard phones - iPhone SE, baseline)
md: 428px   (large phones - iPhone Pro Max)
lg: 768px   (tablets)
xl: 1024px  (desktops)
2xl: 1440px (large desktops)
```

### Responsive Adjustments
```
Mobile (xs-md):
  - Card padding: 16px
  - Section margin: 24px
  - Font sizes: reduced 1-2px
  - Line heights: 1.5 (tighter for space)
  - Chart: full-width, single column

Tablet (lg):
  - Card padding: 20px
  - Section margin: 32px
  - Font sizes: standard
  - Line heights: 1.6
  - Chart: 2-column or side-by-side layout

Desktop (xl+):
  - Card padding: 24px
  - Section margin: 40px
  - Font sizes: +1-2px for breathing room
  - Line heights: 1.7
  - Chart: multi-panel layout
  - Max-width containers: 1200px centered
```

## Accessibility Standards

```
Contrast Ratios:
  - Primary text on background: 4.5:1 minimum (WCAG AA)
  - GrahAI #F1F5F9 on #0A0E1A: ~15:1 ✓ (excellent)
  - Gold accents #D4A054 on dark: validate at 4.5:1 for text

Touch Targets:
  - Minimum: 44x44px (iOS, Android standard)
  - Recommended: 48x48px (more forgiving)
  - Padding: 8px around interactive elements if smaller

Focus States:
  - Outline: 2px in accent color
  - Outline-offset: 2px
  - Visible on keyboard navigation

Motion:
  - Respect prefers-reduced-motion: reduce
  - Provide toggle in Settings
  - Keep essential feedback, remove decorative animations
```

## Implementation Checklist

- [ ] Color palette exported to design tool (Figma, XD, etc.)
- [ ] Font files imported (EB Garamond, Inter, Roboto)
- [ ] Component library created with all variants
- [ ] Spacing utility scale generated (8px base)
- [ ] Shadow definitions applied to all elevation levels
- [ ] Animation timing functions defined in code/CSS
- [ ] Responsive breakpoints configured
- [ ] Accessibility colors tested with aXe/Lighthouse
- [ ] Dark mode tested across devices (brightness, true black vs. dark navy)
- [ ] Haptic feedback patterns mapped (iOS/Android)

## File Locations (When Implemented)

```
design/
├── colors.json              # Color definitions
├── typography.json          # Font system
├── spacing.json             # 8px grid scale
├── animations.css           # Timing functions & sequences
├── components/
│   ├── button.css
│   ├── card.css
│   ├── chart-wheel.css
│   ├── dasha-timeline.css
│   └── ...
└── responsive.css           # Breakpoint utilities
```

