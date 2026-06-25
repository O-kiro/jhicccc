# Design System Inspired by MetaMask

## 1. Visual Theme & Atmosphere

MetaMask's design system embraces a modern, crypto-native aesthetic that balances accessibility with technological sophistication. The visual language combines bold, expressive typography with a vibrant accent color palette that communicates trust, security, and innovation in the decentralized finance space. The design system prioritizes clarity and user control, leveraging generous whitespace, high-contrast elements, and animated gradient accents to create an engaging yet professional interface. Dark neutrals anchor the design while bright, saturated accent colors (`#E5FFC3`, `#EAC2FF`, `#CCE7FF`) add energy and guide user attention through interactive flows.

**Key Characteristics:**

- Bold, variable typography system with strong visual hierarchy
- High contrast between neutral dark (`#0A0A0A`) and bright accent colors
- Generous whitespace and breathing room around critical elements
- Rounded button treatments (`50%` and `100px` radius) for approachability
- Gradient and layered accent colors to communicate multi-chain environments
- Clear distinction between primary interactive surfaces and background
- Crypto-forward aesthetic with technical sophistication

## 2. Color Palette & Roles

### Primary

- **Dark Canvas** (`#0A0A0A`): Primary text color, dominant interface background, and core structural element. Used 385 times across the system.
- **MetaMask Teal** (`#013330`): Deep, trust-inducing teal used as primary accent and brand identifier. Secondary to pure black but establishes MetaMask's distinct identity. Used 64 times.

### Accent Colors

- **Lime Highlight** (`#E5FFC3`): Vibrant lime-green accent for high-energy CTAs and attention-grabbing elements. Represents optimism and forward momentum. Used 56 times.
- **Purple Gradient** (`#EAC2FF`): Soft lavender-purple accent for blockchain and token-related elements. Creates visual distinction for Ethereum and smart contract contexts. Used 37 times.
- **Blue Gradient** (`#CCE7FF`): Light blue accent for secondary highlights and layered depth. Supports multi-chain narrative. Used 32 times.
- **Deep Purple** (`#3D065F`): Rich, saturated purple for contrast text and secondary accents. Used 20 times.
- **Brown Accent** (`#661800`): Warm, earthy brown for tertiary highlights and badge elements. Used 18 times.

### Interactive

- **Primary CTA Blue** (`#4362D1`): Saturated, actionable blue for primary buttons and call-to-action elements. Used 11 times.
- **Neon Purple** (`#D075FF`): Bright, vivid purple for hover states and interactive feedback. Draws attention without overwhelming. Used 11 times.

### Neutral Scale

- **Pure White** (`#FFFFFF`): Clean, neutral background and text overlay on dark contexts. Used 325 times.
- **Pure Black** (`#000000`): Maximum contrast text and icon color. Used sparingly for critical labels. Used 23 times.
- **Light Gray** (`#EBEBEB`): Subtle divider and soft background component separations. Used 15 times.
- **Steel Gray** (`#C8CEDA`): Muted text for secondary content and de-emphasized UI elements. Used 13 times.
- **Medium Gray** (`#B0B0B0`): Link colors and tertiary text. Used 7 times.
- **Charcoal** (`#252525`): Dark text on light backgrounds for improved readability. Used 6 times.
- **Light Steel** (`#BFBFBF`): Input borders and subtle separators. Used 4 times.

### Surface & Borders

- **White Surface** (`#FFFFFF`): Primary card and container background. Clean, inviting surfaces for content.
- **Dark Surface** (`#0A0A0A`): Deep background for modal overlays and elevated surfaces in light-mode contexts.
- **Border Default** (`#C8CEDA`): Subtle, non-intrusive borders for form inputs and card boundaries.

### Semantic / Status

- **Warning Yellow** (`#BAF24A`): High-visibility yellow-green for warnings, alerts, and important notifications. Used 10 times.

## 3. Typography Rules

### Font Family

**Primary Display Font:** MMPolyVariable (`font-family: 'MMPolyVariable', sans-serif`). Fallback: `'Segoe UI', 'Helvetica Neue', sans-serif`

**Secondary Font:** MMSansVariable (`font-family: 'MMSansVariable', sans-serif`). Fallback: `'Open Sans', 'Arial', sans-serif`

**Tertiary Font:** MMEuclidCircularB (`font-family: 'MMEuclidCircularB', sans-serif`). Fallback: `'Circular', 'Trebuchet MS', sans-serif`

**System Font:** Helvetica (`font-family: 'Helvetica', 'Arial', sans-serif`). Fallback: `sans-serif`

### Hierarchy

| Role | Font | Size | Weight | Line Height | Letter Spacing | Notes |
|------|------|------|--------|------------|---------------|----|
| Display / H1 | MMPolyVariable | 160px | 400 | 160px | 0px | Hero headlines, brand statements |
| Heading H2 | MMSansVariable | 32px | 400 | 40px | 0px | Major section titles |
| Heading H3 | MMEuclidCircularB | 16px | 500 | 24px | 0px | Subheadings, card titles |
| Body | MMEuclidCircularB | 16px | 400 | 20px | 0px | Primary content, paragraph text |
| Body Small | Helvetica | 16px | 400 | 16px | 0px | Secondary labels, metadata |
| Button / Label | MMEuclidCircularB | 13.33px | 400 | normal | 0px | Interactive elements, button text |
| Link | MMEuclidCircularB | 16px | 400 | 20px | 0px | Navigation links, inline actions |

### Principles

- **Hierarchy through scale:** Use MMPolyVariable for display to create maximum visual impact; transition to MMSansVariable for structured hierarchies.
- **Variable weights:** Rely primarily on 400 weight for clarity; use 500 and 700 weights sparingly for emphasis and buttons.
- **Readable line heights:** Minimum `1.25x` multiplier on font size to ensure comfortable reading; prefer `1.5x` for body text.
- **Generosity with space:** Large display type (160px) commands ample whitespace; medium heading sizes (32px) pair with balanced padding.
- **Accessible contrast:** All text maintains minimum 4.5:1 contrast ratio against backgrounds; dark text (`#0A0A0A`) on light backgrounds, light text (`#FFFFFF`) on dark.

## 4. Component Stylings

### Buttons

#### Primary Button (Large CTA)
- **Background:** `#FFFFFF`
- **Text Color:** `#4362D1`
- **Font Family:** MMEuclidCircularB
- **Font Size:** 16px
- **Font Weight:** 700
- **Padding:** `8px 12px`
- **Border Radius:** `4px`
- **Border:** `1px solid #FFFFFF`
- **Height:** 34px
- **Line Height:** 16px
- **Box Shadow:** `none`
- **Hover State:** Background `#E5FFC3`, text `#4362D1`
- **Active State:** Background `#D075FF`, text `#FFFFFF`

#### Secondary Button (Ghost / Outlined)
- **Background:** `rgba(0, 0, 0, 0)`
- **Text Color:** `#0A0A0A`
- **Font Family:** Helvetica
- **Font Size:** 13.33px
- **Font Weight:** 400
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** `0px none`
- **Height:** 40px
- **Width:** 40px
- **Line Height:** normal
- **Box Shadow:** `none`
- **Hover State:** Text `#4362D1`, slight scale increase
- **Active State:** Text `#D075FF`

#### Icon Button (Circular)
- **Background:** `#FFFFFF`
- **Text Color:** `#4362D1`
- **Font Family:** MMEuclidCircularB
- **Font Size:** 13.33px
- **Font Weight:** 400
- **Padding:** `0px`
- **Border Radius:** `50%`
- **Border:** `2px solid #FFFFFF`
- **Height:** 20px
- **Width:** 20px
- **Line Height:** normal
- **Box Shadow:** `none`
- **Hover State:** Background `#E5FFC3`, text `#013330`

### Cards & Containers

#### Standard Card
- **Background:** `#FFFFFF`
- **Text Color:** `#0A0A0A`
- **Padding:** `24px` to `44px`
- **Border Radius:** `16px`
- **Border:** `0px none`
- **Box Shadow:** `rgb(204, 204, 204) 0px 0px 2px 2px`
- **Gap Between Elements:** `16px` to `32px`

#### Featured Card (Brown Accent)
- **Background:** `rgba(0, 0, 0, 0)` with `1px solid #661800` border
- **Text Color:** `#661800`
- **Font Family:** MMSansVariable
- **Font Size:** 24px
- **Font Weight:** 400
- **Padding:** `28px 44px`
- **Border Radius:** `12px`
- **Line Height:** 36px
- **Box Shadow:** `none`

#### Dark Overlay Card
- **Background:** `rgba(0, 0, 0, 0.85)`
- **Text Color:** `#FFFFFF`
- **Padding:** `44px 52px`
- **Border Radius:** `16px`
- **Border:** `1px solid rgba(255, 255, 255, 0.1)`
- **Box Shadow:** `rgb(233, 237, 246) 0px 0px 0px 5px inset`

### Inputs & Forms

#### Large Search / Text Input
- **Background:** `#FFFFFF`
- **Text Color:** `#3D065F`
- **Font Family:** MMEuclidCircularB
- **Font Size:** 16px
- **Font Weight:** 500
- **Padding:** `33px 44px`
- **Border Radius:** `40px`
- **Border:** `0px none`
- **Height:** 66px
- **Box Shadow:** `none`
- **Placeholder Color:** `#C8CEDA`
- **Focus State:** Border `2px solid #4362D1`, shadow `0px 0px 8px rgba(67, 98, 209, 0.2)`

#### Standard Text Input
- **Background:** `#FFFFFF`
- **Text Color:** `#0A0A0A`
- **Font Family:** MMEuclidCircularB
- **Font Size:** 13.33px
- **Font Weight:** 400
- **Padding:** `8px 12px`
- **Border Radius:** `4px`
- **Border:** `1px solid #C1C1C1`
- **Height:** 40px
- **Line Height:** normal
- **Box Shadow:** `none`
- **Focus State:** Border `2px solid #4362D1`, background `#FFFFFF`
- **Error State:** Border `2px solid #BAF24A`

#### Checkbox / Radio
- **Size:** `16px × 16px`
- **Border Radius:** `3px` (checkbox), `50%` (radio)
- **Background:** `#FFFFFF`
- **Border:** `1px solid #C8CEDA`
- **Checked State:** Background `#4362D1`, border `1px solid #4362D1`

### Navigation

#### Header Navigation
- **Background:** `rgba(0, 0, 0, 0)` (transparent)
- **Text Color:** `#0A0A0A`
- **Font Family:** MMEuclidCircularB
- **Font Size:** 16px
- **Font Weight:** 400
- **Padding:** `16px 32px`
- **Height:** 42px
- **Gap Between Items:** `32px`
- **Line Height:** 36px
- **Hover State:** Text color `#4362D1`, underline `2px solid #4362D1`
- **Active State:** Text color `#4362D1`, border-bottom `3px solid #4362D1`

#### Link (Secondary)
- **Background:** `rgba(0, 0, 0, 0)`
- **Text Color:** `#B0B0B0`
- **Font Family:** MMEuclidCircularB
- **Font Size:** 16px
- **Font Weight:** 400
- **Padding:** `0px`
- **Border Radius:** `0px`
- **Border:** `0px none`
- **Line Height:** 20px
- **Hover State:** Text `#4362D1`, text-decoration `underline`
- **Active State:** Text `#013330`

### Badges & Labels

#### Badge / Tag
- **Background:** `#E5FFC3`
- **Text Color:** `#013330`
- **Font Size:** 12px
- **Font Weight:** 500
- **Padding:** `4px 12px`
- **Border Radius:** `3px`
- **Border:** `0px none`

#### Status Badge (Warning)
- **Background:** `#BAF24A`
- **Text Color:** `#000000`
- **Font Size:** 12px
- **Font Weight:** 600
- **Padding:** `6px 12px`
- **Border Radius:** `4px`
- **Border:** `1px solid rgba(0, 0, 0, 0.1)`

## 5. Layout Principles

### Spacing System

**Base Unit:** `4px`

**Spacing Scale:**
- `4px`: Micro adjustments, internal component spacing
- `8px`: Tight spacing between compact elements, form field gaps
- `12px`: Small content separation, badge padding
- `16px`: Standard gap between components, navigation item spacing
- `20px`: Medium content blocks, list item spacing
- `24px`: Card internal padding, section spacing
- `28px`: Large component padding, subsection margins
- `32px`: Major section separation, vertical rhythm
- `44px`: Large card padding, hero section interior
- `52px`: Extra-large padding for prominent cards
- `64px`: XL gap between major sections
- `100px`: Maximum padding for hero and showcase sections

**Usage Context:**
- Micro (`4px`, `8px`): Form inputs, button padding, icon spacing
- Small (`12px`, `16px`): Card headers, list items, tight layouts
- Medium (`20px`, `24px`, `28px`): Default section separation, card padding
- Large (`32px`, `44px`): Hero sections, feature cards, prominent content blocks
- XL (`52px`, `64px`, `100px`): Full-width sections, hero backgrounds

### Grid & Container

**Max Width:** `1200px` for content containers on desktop

**Column Strategy:** 12-column flexible grid for desktop; reflow to single column on mobile

**Section Patterns:**
- Hero: Full viewport width, `100px` padding top/bottom, centered text
- Feature grid: 2–3 columns on desktop, `32px` gap between cards
- Content section: Max `1000px` width, `64px` vertical spacing
- Footer: Full width, `32px` padding, multi-column layout on desktop

### Whitespace Philosophy

MetaMask's design emphasizes generous whitespace to create visual breathing room and reduce cognitive load. Large display type (160px) is surrounded by substantial negative space. Content sections are separated by minimum `32px` gaps, expanding to `64px` for major transitions. Cards maintain internal padding of `24px` to `44px` depending on content density. This abundance of whitespace conveys stability, trust, and intentional design—critical for a crypto wallet interface where users require clarity.

### Border Radius Scale

- `3px`: Badges, small indicator elements, checkbox inputs
- `4px`: Standard buttons, form inputs, small cards
- `12px`: Medium cards, modals
- `16px`: Large feature cards, prominent containers
- `40px`: Pill-shaped inputs, large rounded buttons
- `50%`: Circular icon buttons, avatar containers
- `70px`: Extra-large circular elements, brand avatars
- `100px`: Fully rounded pill buttons, large CTA containers

## 6. Depth & Elevation

| Level | Treatment | Use |
|-------|-----------|-----|
| Flat (Base) | No shadow | Body backgrounds, primary surfaces |
| Elevated (1) | `rgb(204, 204, 204) 0px 0px 2px 2px` | Cards, containers, modal backgrounds |
| Elevated (2) | `rgb(233, 237, 246) 0px 0px 0px 5px inset` | Focused inputs, premium card interiors |
| Hover (Interactive) | `0px 4px 12px rgba(0, 0, 0, 0.12)` | Card hover states, lifted buttons |
| Focus (Interactive) | `0px 0px 0px 3px rgba(67, 98, 209, 0.2)` | Form focus states, keyboard navigation |
| Overlay (Modal) | `0px 16px 48px rgba(0, 0, 0, 0.25)` | Modals, popovers, dropdown menus |

**Shadow Philosophy:** MetaMask uses subtle, restrained shadows to create gentle layering without overwhelming the interface. The system employs inset shadows for focused inputs to communicate depth inward (user engagement), and small external shadows for cards to lift them slightly above the background. Modal and overlay shadows are more pronounced to establish clear visual hierarchy and modal context. Shadows use warm, neutral grays (`#CCCCCC`, `#E9EDF6`) to maintain the clean, approachable aesthetic.

## 7. Do's and Don'ts

### Do

- **Use `#0A0A0A` as the primary text color** on light backgrounds for maximum readability and brand consistency.
- **Apply generous padding** (`24px` minimum) inside cards and containers to maintain breathing room and reduce visual density.
- **Pair large display type (160px)** with substantial whitespace to create impact and visual hierarchy.
- **Use accent colors (`#E5FFC3`, `#EAC2FF`, `#CCE7FF`) strategically** to draw attention to CTAs and multi-chain interactions.
- **Maintain 4.5:1 contrast ratios** between text and backgrounds for accessibility compliance.
- **Apply rounded borders (`16px`, `40px`) to cards and buttons** to reinforce the modern, approachable brand personality.
- **Use `#4362D1` for all primary interactive elements** (buttons, links, form focus states) for consistency.
- **Leverage the MMPolyVariable font at 160px** for hero headlines to maximize brand recognition.
- **Create clear visual hierarchy** through font size, weight (400 → 500 → 700), and color contrast rather than shadows.
- **Include `16px` to `32px` gaps** between major UI elements to support scanning and reduce cognitive load.

### Don't

- **Don't use pure black (`#000000`)** as a background or primary text color; reserve it for critical labels only.
- **Don't apply shadows heavier than `8px` blur radius** on standard components; keep shadows subtle and warm-toned.
- **Don't mix fonts unnecessarily.** Stick to MMPolyVariable (display), MMSansVariable (headings), MMEuclidCircularB (body/UI), and Helvetica (labels).
- **Don't use accent colors for body text.** Limit `#E5FFC3`, `#EAC2FF`, `#CCE7FF` to highlights, badges, and CTAs.
- **Don't reduce padding below `12px`** in cards or containers; maintain breathing room.
- **Don't apply border-radius smaller than `3px`** on interactive elements; minimum `4px` for buttons and inputs.
- **Don't create button text smaller than 13.33px;** prioritize legibility and touch targets.
- **Don't combine multiple accent colors in a single component.** Use one accent per card or section to maintain focus.
- **Don't use `#B0B0B0` or lighter grays for critical information;** reserve light grays for secondary labels and de-emphasized content.
- **Don't overcrowd layouts;** each major section should be separated by minimum `32px` vertical spacing, expanding to `64px` between distinct content areas.

## 8. Responsive Behavior

### Breakpoints

| Name | Width | Key Changes |
|------|-------|------------|
| Mobile | 320px–479px | Single column, `16px` padding, stacked navigation, `80px` display font |
| Tablet | 480px–767px | 2-column grid, `20px` padding, collapsible nav, `100px` display font |
| Desktop | 768px–1199px | 3-column grid, `32px` padding, full horizontal nav, `120px` display font |
| Large Desktop | 1200px+ | 4-column grid, `44px` padding, full nav with dropdown, `160px` display font |

### Touch Targets

- **Minimum interactive element size:** `44px × 44px` on mobile, `40px × 40px` on desktop
- **Button padding mobile:** `12px 16px` minimum
- **Icon size mobile:** `24px × 24px` (tappable area `44px × 44px`)
- **Link underline:** Visible on mobile (`:active` and `:hover`); show on hover on desktop
- **Form input height mobile:** `48px` (increased from `40px` for comfortable tapping)

### Collapsing Strategy

**Mobile (320px–479px):**
- Stack all cards vertically, maintain `16px` gaps
- Collapse horizontal navigation to hamburger menu icon (`24px × 24px`)
- Reduce display font from `160px` to `80px` for hero headlines
- Single-column layout for all content sections
- Reduce padding inside cards from `44px` to `20px`
- Stack button groups vertically with `12px` gaps

**Tablet (480px–767px):**
- Display font increases to `100px`
- Two-column card grids with `20px` gaps
- Horizontal navigation remains collapsed; show in drawer overlay
- Padding adjusts to `24px` inside containers
- Input fields maintain full width with `20px` padding

**Desktop (768px+):**
- Full navigation bar displays horizontally
- Display font reaches full size (`160px` on 1200px+)
- Multi-column layouts activate (2–3 columns based on section)
- Padding and spacing reach full scale (`32px` to `100px`)
- Form inputs can constrain to sensible widths (`400px` to `541px`)

## 9. Agent Prompt Guide

### Quick Color Reference

- **Primary CTA:** Primary CTA Blue (`#4362D1`) for buttons and interactive states
- **Accent Highlights:** Lime Highlight (`#E5FFC3`), Purple Gradient (`#EAC2FF`), Blue Gradient (`#CCE7FF`) for energetic, attention-grabbing elements
- **Background:** Pure White (`#FFFFFF`) for cards; Dark Canvas (`#0A0A0A`) for text and primary UI
- **Heading Text:** Dark Canvas (`#0A0A0A`) on light backgrounds
- **Body Text:** Dark Canvas (`#0A0A0A`)
- **Secondary Text / Links:** Medium Gray (`#B0B0B0`)
- **Borders & Inputs:** Border Default (`#C8CEDA`) or Steel Gray (`#C8CEDA`)
- **Warnings / Alerts:** Warning Yellow (`#BAF24A`)
- **Trust / Brand:** MetaMask Teal (`#013330`)

### Iteration Guide

1. **Typography First:** Establish hierarchy using MMPolyVariable (160px display), MMSansVariable (32px headings), MMEuclidCircularB (16px body). Match font weight progression: 400 (default) → 500 (emphasis) → 700 (strong CTA).

2. **Color Hierarchy:** Apply Dark Canvas (`#0A0A0A`) as primary text on white surfaces. Use Primary CTA Blue (`#4362D1`) exclusively for interactive elements. Reserve accent colors (`#E5FFC3`, `#EAC2FF`, `#CCE7FF`) for highlights and CTAs only—never for body text.

3. **Spacing Consistency:** Implement `4px` base unit scaling. All gaps between major sections: minimum `32px`, expanding to `64px` for major transitions. Card padding: `24px` to `44px`. Never collapse spacing below `12px` in user-facing UI.

4. **Elevation Subtly:** Use inset shadow `rgb(233, 237, 246) 0px 0px 0px 5px inset` for focused inputs (indicates engagement). Apply external shadow `rgb(204, 204, 204) 0px 0px 2px 2px` to cards (lifts surface). Avoid shadows exceeding `8px` blur radius on standard components.

5. **Button Consistency:** All primary buttons use `#FFFFFF` background with `#4362D1` text. Apply `4px` border-radius to rectangular buttons, `50%` to icon buttons. Hover state: shift background to `#E5FFC3` with text remaining `#4362D1`. Active state: background `#D075FF`, text `#FFFFFF`.

6. **Responsive Adaptation:** Display font scales: `80px` (mobile) → `100px` (tablet) → `120px` (desktop) → `160px` (large desktop). Padding adjusts: `16px` (mobile) → `20px` (tablet) → `32px` (desktop). Touch targets remain `44px` minimum on mobile; form inputs increase to `48px` height on small screens.

7. **Contrast & Accessibility:** Maintain 4.5:1 text-to-background contrast. Dark text (`#0A0A0A`) on light backgrounds; light text (`#FFFFFF`) on dark surfaces. Test all interactive states for sufficient color differentiation (not relying on color alone).

8. **Border Radius Application:** Use `3px` for badges and small indicators, `4px` for inputs and buttons, `12px` for medium cards, `16px` for feature cards, `40px` for pill inputs, `50%` for circular avatars, `100px` for oversized pill buttons.

9. **Whitespace Breathing:** Surround display type (160px+) with substantial negative space (`44px` minimum). Feature cards maintain `24px` internal padding minimum. Always separate major content sections by `32px` vertically; expand to `64px` between distinct feature blocks.

10. **Interactive Feedback:** All interactive elements must communicate state through color shift, scale (slight `1.02x` scale on hover), or border highlight. Focus state always includes `3px` inset border or outline in Primary CTA Blue (`#4362D1`). Never rely on shadow alone for interactivity indication.