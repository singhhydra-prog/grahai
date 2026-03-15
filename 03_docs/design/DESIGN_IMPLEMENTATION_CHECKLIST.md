# GrahAI Premium Design - Implementation Checklist

## Overview
This checklist guides the implementation of GrahAI's premium Vedic astrology design system. Reference the full design analysis (GRAHAI_PREMIUM_DESIGN_ANALYSIS.md) and design tokens (DESIGN_TOKENS.md) alongside this checklist.

---

## Phase 1: Design System Foundation (Weeks 1-2)

### Color System
- [ ] Export hex color values to code (CSS variables, design tokens JSON)
- [ ] Set up dark theme (#0A0E1A base) in application
- [ ] Test gold accent (#D4A054) contrast against backgrounds
  - [ ] Validate 4.5:1 contrast for text on dark background
  - [ ] Create variants: hover (#C99644), active (#CC9944)
- [ ] Define planet colors in constant file (Sun, Moon, Mars, Mercury, Jupiter, Venus, Saturn, Rahu, Ketu)
- [ ] Create background layer variants (#0F172A, #1a1f35, #2a3555)
- [ ] Test color palette on multiple devices (phone, tablet, desktop)
- [ ] Ensure OLED screens don't show true black (use #0A0E1A not #000000)

### Typography System
- [ ] Import font families:
  - [ ] EB Garamond or Playfair Display (serif headings)
  - [ ] Inter (UI labels and modern body)
  - [ ] Roboto (body reading text)
- [ ] Configure font sizes and weights:
  - [ ] H1: 32px bold
  - [ ] H2: 24px semibold
  - [ ] H3: 18px medium
  - [ ] Body: 14px regular
  - [ ] Small: 12px regular
  - [ ] Labels: 14px medium
- [ ] Set line heights:
  - [ ] Headings: 1.2
  - [ ] Body: 1.6
  - [ ] UI labels: 1.4
- [ ] Test readability on various screen sizes
- [ ] Adjust font sizes for mobile (14px → 12px if needed for space)

### Spacing System
- [ ] Set base grid to 8px
- [ ] Create spacing scale constants:
  - [ ] sm (8px)
  - [ ] md (16px)
  - [ ] lg (24px)
  - [ ] xl (32px)
  - [ ] 2xl (40px)
  - [ ] 3xl (48px)
- [ ] Apply spacing to common layouts:
  - [ ] Cards: 16px padding
  - [ ] Modals: 24px padding
  - [ ] Sections: 32px margin top/bottom
- [ ] Verify all elements align to 8px grid (use design tool grid overlay)

### Shadow & Elevation
- [ ] Define shadow levels:
  - [ ] sm: subtle gold-tinted shadow
  - [ ] md: standard card shadow
  - [ ] lg: elevated card on hover
  - [ ] xl: prominent cards
  - [ ] 2xl: full-screen modals
- [ ] Create gold glow shadow for premium features
- [ ] Test shadows on various dark backgrounds (ensure visibility)
- [ ] Implement shadow classes/utilities in code

### Border Radius
- [ ] Set radius values:
  - [ ] sm (2px) for charts and icons
  - [ ] md (4px) for buttons and inputs
  - [ ] lg (8px) for modals and cards
- [ ] Apply consistently across UI elements
- [ ] Keep chart components sharp (0-2px) for precision aesthetic

---

## Phase 2: Component Library (Weeks 2-3)

### Primary Components

#### Buttons
- [ ] **Primary Button (Gold)**
  - [ ] Background: #D4A054, text: #0A0E1A
  - [ ] Height: 44px (mobile), 40px (desktop)
  - [ ] States: default, hover, active, disabled, focus
  - [ ] Add ripple/scale animation (100ms)
  - [ ] Haptic feedback on tap (iOS: light impact, Android: vibration)
  
- [ ] **Secondary Button (Outline)**
  - [ ] Border: 2px #D4A054, text: #D4A054
  - [ ] Hover: subtle background color change
  - [ ] Maintain 44px touch target
  
- [ ] **Disabled State**
  - [ ] Opacity 0.5, cursor: not-allowed
  - [ ] No hover effects

#### Input Fields
- [ ] Standard input
  - [ ] Background: #1a1f35, border: 1px #2a3555
  - [ ] Focus: border 2px #D4A054, shadow glow
  - [ ] Placeholder text: #94A3B8
  - [ ] Padding: 12px 16px
  
- [ ] Error state
  - [ ] Border: 2px #EF4444
  - [ ] Background tint: rgba(239, 68, 68, 0.05)
  
- [ ] Success state
  - [ ] Border: 2px #10B981
  - [ ] Checkmark icon

#### Cards
- [ ] Background: #0F172A with subtle 1px border (#2a3555)
- [ ] Padding: 16px
- [ ] Radius: 4-8px
- [ ] Shadow: md (default), lg (hover)
- [ ] Hover effect: background shift to #1a1f35
- [ ] Optional: left accent bar (4px) for visual interest

#### Modals & Sheets
- [ ] Dark backdrop: rgba(0, 0, 0, 0.5)
- [ ] Panel: #0F172A background, 1px border
- [ ] Padding: 24px
- [ ] Radius: 8px
- [ ] Shadow: 2xl
- [ ] Open animation: slide from bottom (300ms)
- [ ] Close button: X icon in top-right
- [ ] Keyboard escape key closes modal

#### Forms
- [ ] Input groups with labels
- [ ] Error messages: #EF4444, 12px
- [ ] Helper text: #94A3B8, 12px
- [ ] Required indicator: gold asterisk
- [ ] Validation feedback immediate (no delay)

### Chart-Specific Components

#### Birth Chart Wheel
- [ ] Circular SVG container (responsive to viewport)
- [ ] Outer ring (zodiac):
  - [ ] 360° with 12 sections (30° each)
  - [ ] Stroke: #D4A054, 1px
  - [ ] Sign labels: white text, 12px, serif font
  - [ ] Degree markers: thin lines at 5°/10° intervals
  
- [ ] Inner rings (houses):
  - [ ] 12 house divisions
  - [ ] Stroke: #2a3555, 1.5px (subtle)
  - [ ] House numbers (1-12) centered in each house
  - [ ] Optional: support multiple house systems (Placidus, Whole Sign)
  
- [ ] Planets:
  - [ ] Glyphs (☉ ☽ ♂ etc.) at zodiac positions
  - [ ] Glyph size: 20-24px
  - [ ] Color by planet (Sun=gold, Moon=silver, etc.)
  - [ ] Tap to highlight: 2px glow ring, dim other planets
  - [ ] Show interpretations popup on tap
  
- [ ] Aspect lines:
  - [ ] Conjunction: gold (#D4A054)
  - [ ] Trine/Sextile: green (#10B981)
  - [ ] Square/Opposition: red (#EF4444)
  - [ ] Opacity: 0.6 default, 1.0 highlighted
  - [ ] Tap to show aspect details
  
- [ ] Interactions:
  - [ ] Pinch-to-zoom support
  - [ ] Pan/drag to explore
  - [ ] Load animation: staggered rings + planets (300-500ms)
  - [ ] Toggle between chart types (D1, D9, D10, etc.)
  - [ ] Skeleton screen during load

#### Dasha Timeline
- [ ] Horizontal scrollable container
- [ ] Background: #1a1f35, padding: 16px vertical
- [ ] Mahadasha bars:
  - [ ] Height: 56px
  - [ ] Gradient background (planet color + darker)
  - [ ] Rounded corners: 2px
  - [ ] Text: white, 12px (period name + dates)
  - [ ] Proportional width to duration
  
- [ ] Antardasha bars (nested):
  - [ ] Height: 32px
  - [ ] Background: planet color at 70% opacity
  - [ ] Text: 10px (smaller)
  - [ ] Expandable on tap for Pratyantar Dasha
  
- [ ] Current period emphasis:
  - [ ] Glow: 0 0 16px rgba(212, 160, 84, 0.4)
  - [ ] Border: 2px in planet color
  - [ ] Pulse animation (2s loop, subtle)
  
- [ ] Progress indicator:
  - [ ] Top progress bar (2px height)
  - [ ] Gradient: grayscale past → gold current → grayscale future
  - [ ] Current marker: 6px gold dot
  
- [ ] Interactivity:
  - [ ] Tap bar to show detailed info popup
  - [ ] Scroll horizontally for timeline (past → future)
  - [ ] Optional: swipe gestures for navigation

#### Planetary Positions Table
- [ ] Columns: Planet | Sign | House | Degree | Aspects
- [ ] Left accent bar (4px) in planet color
- [ ] Right-aligned numeric values
- [ ] Subtle row dividers (#2a3555)
- [ ] Hover: background shift to #1a1f35
- [ ] Tap planet to highlight in chart wheel (linked interaction)

---

## Phase 3: Animations & Interactions (Weeks 3-4)

### Timing & Easing
- [ ] Define animation timing functions in code
  - [ ] ease-in-out: cubic-bezier(0.4, 0, 0.2, 1) [standard]
  - [ ] ease-out: cubic-bezier(0.0, 0, 0.2, 1) [entrances]
  - [ ] ease-in: cubic-bezier(0.4, 0, 1, 1) [exits]
  - [ ] linear [progress bars, timelines]
  
- [ ] Duration standards:
  - [ ] 100ms: button feedback
  - [ ] 200-300ms: UI transitions, chart interactions
  - [ ] 300ms: modal opens, dasha expansion
  - [ ] 500-600ms: context changes
  - [ ] 800-1000ms: data load reveals

### Micro-Interactions

#### Button Feedback
- [ ] Tap feedback: scale(0.95 → 1.0) over 100ms
- [ ] Haptic: light impact on iOS, vibration on Android
- [ ] Visual confirmation: color shift or glow

#### Chart Interactions
- [ ] Tap planet:
  - [ ] Highlight selected: 2px glow ring
  - [ ] Dim others: opacity 0.3
  - [ ] Show interpretations: fade-in popup
  - [ ] Timing: 200-250ms ease-in-out
  - [ ] Haptic: light success feedback
  
- [ ] Tap aspect:
  - [ ] Brighten line: opacity 1.0
  - [ ] Scale slightly: 1.05x
  - [ ] Show details: expandable popup
  - [ ] Timing: 200ms

#### Loading States
- [ ] Skeleton screen:
  - [ ] Grayscale wireframe of chart structure
  - [ ] Shimmer animation left-to-right (1500ms, linear)
  - [ ] Fill in order: rings → houses → planets
  
- [ ] Progress indicators:
  - [ ] Show for data loads >2s
  - [ ] Thin bar at top (not intrusive)
  - [ ] Or subtle spinner with gold accent
  
- [ ] Data reveal:
  - [ ] After load, fade-in chart (300-500ms)
  - [ ] Stagger planet animations (100-150ms between each)

#### Transitions
- [ ] Screen transitions:
  - [ ] Fade + slight upward slide (200-300ms)
  - [ ] Avoid bounce (not premium)
  
- [ ] Modal open:
  - [ ] Slide from bottom (300ms, ease-out-cubic)
  - [ ] Backdrop fade-in (same timing)
  
- [ ] Dasha expansion:
  - [ ] Height increase with easing (200-300ms)
  - [ ] Child elements fade-in staggered (100ms between)

### Haptic Feedback (Mobile)

#### iOS Implementation (UIImpactFeedbackGenerator)
- [ ] Light impact: Chart planet tap, navigation
- [ ] Medium impact: Dasha period toggle
- [ ] Success: Premium feature unlock

#### Android Implementation (Vibrator API)
- [ ] Light tick: 3-5ms pulse
- [ ] Medium: 10-15ms pulse
- [ ] Success: 3 escalating taps (5ms, 10ms, 15ms)

---

## Phase 4: Responsive Design (Weeks 4-5)

### Breakpoints
- [ ] xs: 320px (small phones—minimum, rare)
- [ ] sm: 375px (standard phones—iPhone SE, baseline)
- [ ] md: 428px (large phones—iPhone Pro Max)
- [ ] lg: 768px (tablets)
- [ ] xl: 1024px (desktops)
- [ ] 2xl: 1440px (large desktops)

### Mobile Adjustments (xs-md)
- [ ] Typography: reduce 1-2px for space
- [ ] Line height: 1.5 (tighter spacing)
- [ ] Padding: 16px (cards, modals)
- [ ] Margins: 24px (sections)
- [ ] Chart: full-width, single column
- [ ] Dasha timeline: horizontal scroll with overflow
- [ ] Touch targets: maintain 44-48px minimum

### Tablet Adjustments (lg)
- [ ] Typography: standard sizes
- [ ] Line height: 1.6
- [ ] Padding: 20px
- [ ] Margins: 32px
- [ ] Layout: 2-column or side-by-side (chart + details)
- [ ] Multi-panel: show chart + planetary table simultaneously

### Desktop Adjustments (xl+)
- [ ] Typography: +1-2px for breathing room
- [ ] Line height: 1.7
- [ ] Padding: 24px
- [ ] Margins: 40px
- [ ] Layout: multi-panel (chart, details, sidebar)
- [ ] Max-width containers: 1200px centered
- [ ] Sidebar: collapsible on demand

### Testing Devices
- [ ] iPhone SE (375px baseline)
- [ ] iPhone Pro Max (428px large)
- [ ] iPad 10-inch (768px tablet)
- [ ] iPad Pro 12.9" (1024px+)
- [ ] Desktop: 1440px wide
- [ ] Test landscape orientation (mobile & tablet)

---

## Phase 5: Accessibility (Week 5)

### Color Contrast
- [ ] Primary text vs. background:
  - [ ] Minimum 4.5:1 WCAG AA (tested)
  - [ ] GrahAI #F1F5F9 on #0A0E1A = ~15:1 ✓
  
- [ ] Gold accents:
  - [ ] Validate #D4A054 on dark backgrounds
  - [ ] Ensure 4.5:1 for text-as-button
  
- [ ] Status colors:
  - [ ] Red (#EF4444), Green (#10B981) tested for contrast
  
- [ ] Test with tools: aXe, WAVE, Lighthouse

### Touch Targets
- [ ] All interactive elements: minimum 44x44px
- [ ] Recommended: 48x48px (more forgiving)
- [ ] Padding: 8px around smaller elements
- [ ] Chart planets: 32px touch area (with invisible padding)
- [ ] Timeline bars: tappable entire height

### Focus States
- [ ] Visible on keyboard navigation
- [ ] Outline: 2px in accent color (#D4A054)
- [ ] Outline-offset: 2px for clarity
- [ ] Test tab navigation through all controls

### Motion & Animation
- [ ] Respect `prefers-reduced-motion` media query
- [ ] Provide settings toggle: "Disable animations"
- [ ] Keep meaningful animations (feedback), remove decorative
- [ ] Test on devices with reduced motion enabled

### Icons & Symbols
- [ ] Planet glyphs accompanied by text labels
- [ ] Status icons paired with color + text
- [ ] Don't rely on color alone for meaning
- [ ] Ensure sufficient size (16px minimum for interactive icons)

### Testing Devices
- [ ] iPhone with reduced motion enabled
- [ ] Android device with animation scale = 0.5x
- [ ] Screen reader testing (iOS VoiceOver, Android TalkBack)
- [ ] Keyboard-only navigation
- [ ] Color blindness simulator (red-green, blue-yellow)

---

## Phase 6: Performance & Optimization (Week 6)

### Chart Performance
- [ ] Birth chart loads <3 seconds
- [ ] Smooth 60fps interactions on mid-range devices (Snapdragon 778+, A14+)
- [ ] Test pinch-zoom smoothness
- [ ] Optimize SVG rendering (reduce path complexity if needed)

### Animation Performance
- [ ] Use `will-change` sparingly (transform, opacity only)
- [ ] Test on low-end devices (frame rate monitor)
- [ ] Reduce particle effects or disable on low-power mode
- [ ] Use requestAnimationFrame for custom animations

### Bundle Size
- [ ] Monitor JavaScript bundle growth
- [ ] Tree-shake unused icon fonts
- [ ] Lazy-load chart visualization library if large
- [ ] Compress images and assets

### Dark Mode OLED
- [ ] Use #0A0E1A not #000000 (battery consumption)
- [ ] Test on OLED devices (brightness, black level)
- [ ] Adjust shadows for true black (may not be visible)

---

## Phase 7: Testing & Quality Assurance (Week 7)

### Design QA
- [ ] [ ] Visual consistency audit (all buttons match, spacing aligned)
- [ ] [ ] Color contrast audit (aXe, WAVE)
- [ ] [ ] Touch target audit (44px minimum)
- [ ] [ ] Animation timing audit (not too fast, not too slow)
- [ ] [ ] Responsive testing (all breakpoints)
- [ ] [ ] Dark mode appearance (various screens)
- [ ] [ ] Icon consistency (all use same style, weight)

### Functional Testing
- [ ] [ ] Chart calculations accurate (verify with astrological references)
- [ ] [ ] All interactions respond smoothly (no lag)
- [ ] [ ] Animations don't stutter on target devices
- [ ] [ ] Timezone handling correct (test multiple regions)
- [ ] [ ] Data persistence (birth info saved correctly)

### Device Testing
- [ ] iOS (latest 3 versions):
  - [ ] iPhone SE (small)
  - [ ] iPhone 14/15 (standard)
  - [ ] iPhone 14/15 Pro Max (large)
  - [ ] iPad (tablet)
  
- [ ] Android (Android 11+):
  - [ ] Mid-range (Snapdragon 778+)
  - [ ] Flagship (Snapdragon 8+ Gen 1)
  - [ ] Tablet (Samsung Galaxy Tab)
  
- [ ] Test on real devices (not just emulators)

### Beta Testing (50-200 users)
- [ ] A/B test dark mode variations (is #0A0E1A too dark?)
- [ ] Measure engagement (time on chart, dasha interactions)
- [ ] Gather feedback on animation speed
- [ ] Track premium conversion rate (target: 15-25%)
- [ ] Identify pain points in onboarding

---

## Phase 8: Launch Preparation (Week 8)

### App Store Assets
- [ ] App icon: 1024x1024px (with gold accent preview)
- [ ] Screenshots: 5-8 featuring premium design
  - [ ] Chart wheel screenshot
  - [ ] Dasha timeline
  - [ ] Premium features unlock
  - [ ] Daily insights
  
- [ ] App preview video (30 seconds):
  - [ ] Show chart loading animation
  - [ ] Tap planet interaction
  - [ ] Dasha timeline exploration
  
- [ ] Description: Emphasize design quality and Vedic accuracy
- [ ] Keywords: "Vedic astrology," "birth chart," "kundli," "dasha timeline"

### Marketing Materials
- [ ] Website: showcase premium design aesthetic
- [ ] Social media: highlight visual polish
- [ ] Press kit: include high-res screenshots
- [ ] Brand guide: ensure consistency across channels

### Documentation
- [ ] Design system handoff (Figma file + tokens)
- [ ] Component library documentation
- [ ] Animation specifications
- [ ] Accessibility guidelines for future updates
- [ ] Performance budget (if applicable)

---

## Post-Launch Monitoring

### Analytics
- [ ] Track feature usage:
  - [ ] Which divisional charts most viewed?
  - [ ] Dasha timeline interaction rate?
  - [ ] Tap-to-highlight adoption?
  
- [ ] Monitor performance:
  - [ ] Chart load times (target <3s)
  - [ ] Animation frame rate (target ≥55fps)
  - [ ] Crash rate (target <0.1%)
  
- [ ] Measure engagement:
  - [ ] Daily active users (DAU)
  - [ ] Session duration
  - [ ] Premium conversion rate

### User Feedback
- [ ] In-app ratings and reviews
- [ ] Crash reports and errors
- [ ] Feature requests
- [ ] Design feedback (animations, colors, layout)

### Iterative Improvements
- [ ] Quarterly design reviews
- [ ] Update dark mode if needed (user feedback)
- [ ] Refine animation timing based on usage
- [ ] Add new chart types based on astrologer feedback
- [ ] Performance optimizations as usage scales

---

## Sign-Off

When all phases are complete:
- [ ] Design system complete and documented
- [ ] All components built and tested
- [ ] Animations smooth and purposeful
- [ ] Accessibility audit: 0 WCAG violations
- [ ] Performance: <3s chart load, ≥55fps animations
- [ ] Beta testing: 100+ users, positive feedback
- [ ] Ready for launch

**Design Lead Sign-Off:** _________________ Date: _______

**Engineering Lead Sign-Off:** _________________ Date: _______

---

## References
- Full Design Analysis: GRAHAI_PREMIUM_DESIGN_ANALYSIS.md
- Design Tokens: DESIGN_TOKENS.md
- Component Specs: (Design tool Figma file)
- Accessibility Guidelines: WCAG 2.1 AA

