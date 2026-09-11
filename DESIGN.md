---
name: Sovereign Trust
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#44474c'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#75777d'
  outline-variant: '#c5c6cd'
  surface-tint: '#525f75'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#0e1c2f'
  on-primary-container: '#77849c'
  inverse-primary: '#bac7e1'
  secondary: '#295ea8'
  on-secondary: '#ffffff'
  secondary-container: '#80aefe'
  on-secondary-container: '#004083'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#2f1500'
  on-tertiary-container: '#c76c00'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#d6e3fe'
  primary-fixed-dim: '#bac7e1'
  on-primary-fixed: '#0e1c2f'
  on-primary-fixed-variant: '#3a475c'
  secondary-fixed: '#d6e3ff'
  secondary-fixed-dim: '#aac7ff'
  on-secondary-fixed: '#001b3e'
  on-secondary-fixed-variant: '#00458d'
  tertiary-fixed: '#ffdcc3'
  tertiary-fixed-dim: '#ffb77d'
  on-tertiary-fixed: '#2f1500'
  on-tertiary-fixed-variant: '#6e3900'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  display-lg:
    fontFamily: Public Sans
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em
  display-lg-mobile:
    fontFamily: Public Sans
    fontSize: 30px
    fontWeight: '700'
    lineHeight: 38px
    letterSpacing: -0.01em
  headline-lg:
    fontFamily: Public Sans
    fontSize: 28px
    fontWeight: '700'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-lg-mobile:
    fontFamily: Public Sans
    fontSize: 22px
    fontWeight: '700'
    lineHeight: 28px
  headline-md:
    fontFamily: Public Sans
    fontSize: 20px
    fontWeight: '600'
    lineHeight: 28px
  headline-sm:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-lg:
    fontFamily: Public Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 26px
  body-md:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 22px
  body-sm:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 18px
  label-lg:
    fontFamily: Public Sans
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Public Sans
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Public Sans
    fontSize: 11px
    fontWeight: '700'
    lineHeight: 14px
    letterSpacing: 0.04em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  gutter: 1.5rem
  margin: 2rem
  space-xs: 0.25rem
  space-sm: 0.5rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2.5rem
---

## Brand & Style

The design system projects institutional authority, rigorous precision, and accessibility for statutory Indian standardisation, conformity assessment, and laboratory accreditation. The target audience spans industrial manufacturers, testing laboratory scientists, legal certifiers, and Indian citizens verifying ISI/CRS marks and standards.

The visual style is **Corporate / Modern** anchored in institutional gravity. It combines sovereign sobriety with high-throughput technical efficiency: crisp geometric structures, clear categorical signposting, high-contrast legibility for complex alphanumeric standard codes (e.g., *IS 15658:2006*), and restrained saffron/ochre accents reserved strictly for purposeful verification states, critical statutory highlights, and formal credentials.

## Colors

The palette establishes statutory trust through deep, resolute blues grounded by functional neutrals and regulated semaphores.

### Functional Palette
- **Primary Navy (`#0B192C`)**: Used for top-level headers, primary interface frame, legal text, and authoritative action buttons. Sustained by dark utility variant `#1E3E62` for interactive active/hover states.
- **Secondary Trust Blue (`#1E56A0`)**: Applied to standard reference links, active query highlights, secondary buttons, tabs, and informational indicators. Deep variant `#163172` serves as high-contrast hover state.
- **Statutory Accent Saffron (`#D97706`)**: Reserved for verified certification seals, standard status flags, AI confidence metrics, and focus rings. High-alert variant `#EA580C` applied to imperative regulatory notices.
- **Regulated Forest Green (`#15803D`)**: Indicates certified compliance, active licenses, passed laboratory evaluations, and valid ISI marks. Dark tier `#166534` is used for high-contrast badge text against light green fills.
- **Deep Amber (`#B45309`)**: Indicates provisional certifications, audit notices, pending test schedules, and standard revisions.
- **Neutrals & Surfaces**: Background base `#FFFFFF` with secondary canvas `#F8FAFC` and surface container tier `#F1F5F9`. All card containers, structural borders, and dividers leverage clean slate `#E2E8F0`.

## Typography

The design system deploys **Public Sans** across all roles to achieve unmatched institutional neutrality, geometric clarity, and high legibility. It provides superior rendering for technical codes, tabular clause numbers, and multi-lingual Indian administrative layouts.

### Usage Standards
- **Standards & Clause Referencing**: All alphanumeric codes (such as IS/ISO numbers, Gazette notifications, and HS codes) use `font-variant-numeric: tabular-nums` to preserve vertical optical alignment in comparison tables.
- **Hierarchy Rules**: `display-lg` is reserved exclusively for primary statutory portals and dashboard titles. Standard legal text uses `body-md`, while sub-clauses, audit notes, and meta-stamps enforce `body-sm` or `label-sm`.
- **Text Contrast**: Standard body text enforces `#0B192C` on light surfaces for AAA-level legibility. Secondary labels and dates utilize `#475569`.

## Layout & Spacing

The layout model is built on an accessible, high-density 12-column fluid grid tailored to enterprise auditing, laboratory inspection sheets, and clause-by-clause standard viewers.

### Grid & Form Factors
- **Desktop (≥ 1280px)**: 12-column grid, `margin: 2.5rem`, `gutter: 1.5rem`. Maximum content container width capped at `1440px` for optimal scanning. Split-view clause panels utilize a 5:7 column distribution.
- **Tablet (768px – 1279px)**: 8-column grid, `margin: 1.5rem`, `gutter: 1rem`. Inspection sidebars collapse into persistent drawer panels.
- **Mobile (< 768px)**: 4-column grid, `margin: 1rem`, `gutter: 0.75rem`. Complex clause tables reformat into stacked evidence cards.

### Spacing Application
- Use `space-xs` (4px) for inline badge padding and badge-to-icon clearance.
- Use `space-sm` (8px) for input internal vertical padding and tight data list gaps.
- Use `space-md` (16px) for card body internal padding and form field group margins.
- Use `space-lg` (24px) for card-to-card structural gaps and dialog interior padding.
- Use `space-xl` (40px) for layout section divisions and statutory table headers.

## Elevation & Depth

This design system avoids decorative drop shadows and hyper-stylized lighting in favor of **structural containment, low-contrast slate outlines, and functional ambient depth**.

### Depth Layers
- **Base Canvas (Level 0)**: `#FFFFFF` or `#F8FAFC`, flat.
- **Structural Card / Container (Level 1)**: Flat `#FFFFFF` surface enclosed by a sharp 1px border (`#E2E8F0`). Elevated only on interactive focus/hover by an ambient, diffused shadow: `0 4px 12px -2px rgba(11, 25, 44, 0.06), 0 2px 4px -1px rgba(11, 25, 44, 0.03)`.
- **Flyouts, Menus & Verified Badges (Level 2)**: Crisp 1px border (`#CBD5E1`) paired with `0 10px 24px -4px rgba(11, 25, 44, 0.08), 0 4px 8px -2px rgba(11, 25, 44, 0.04)`.
- **Statutory Modals & Verification Overlays (Level 3)**: Centered container overlaying an institutional scrim (`#0B192C` with 60% opacity) backed by a 2px top sovereign stroke (`#D97706`) and depth shadow `0 20px 40px -8px rgba(11, 25, 44, 0.16)`.

## Shapes

The design system adopts a **Soft (Level 1)** geometric structure (`0.25rem` / 4px base radius) to convey rigor, standardisation, and official certification. 

- **Data Tables, Input Fields & Form Controls**: Standardized at `0.25rem` (4px).
- **Cards, Evidence Panes & Modals**: Soft radius at `0.5rem` (8px).
- **Status Tags, Micro Badges & License Pills**: Compact capsular treatment (`9999px`) to immediately distinguish verified statuses, standard classifications, and laboratory testing marks from structural containers.

## Components

### Buttons
- **Primary Statutory Action**: Background `#0B192C`, text `#FFFFFF`, border-radius 4px, height 40px, padding `0 16px`. Hover state: `#1E3E62`. Focus state: 2px offset ring in `#D97706`.
- **Secondary Technical Action**: Background `#FFFFFF`, 1px solid `#1E56A0`, text `#1E56A0`. Hover state: `#F1F5F9`.
- **Danger / Revocation Action**: Background `#FFFFFF`, 1px solid `#DC2626`, text `#DC2626`. Hover state: `#FEF2F2`.

### Trust Badges & Standard Chips
- **Certified / Compliant Chip**: Background `#DCFCE7`, border 1px solid `#86EFAC`, text `#166534`, typography `label-sm`. Features the official ISI/BIS verification icon on the leading edge.
- **Standard Clause Reference Chip**: Background `#F1F5F9`, border 1px solid `#CBD5E1`, text `#0B192C`, monospace numerals, 4px border radius.
- **Pending / Audit Notice**: Background `#FEF3C7`, border 1px solid `#FCD34D`, text `#B45309`.

### Input Fields & Search Bars
- Standard text input uses 40px height, background `#FFFFFF`, border 1px solid `#E2E8F0`, corner radius 4px, text `#0B192C`, and placeholder text `#94A3B8`.
- Focus state: border color `#1E56A0` with a 2px outward glow of `#D97706` (alpha 20%).
- Alphanumeric validation display: built-in mono-spaced format mask for Standard Code & License Number entry.

### Cards & Evidence Containers
- **Standard Card**: `#FFFFFF` fill, 1px solid `#E2E8F0`, 8px corner radius, internal padding `space-md`. Header features standard identification code left-aligned with status tag right-aligned.
- **AI Clause Citation / Evidence Card**: Elevated by a 3px left border in `#1E56A0` or `#D97706`, background `#F8FAFC`, containing verified statutory excerpts, confidence index, and cross-reference gazette links.

### Selection Controls (Checkboxes & Radios)
- Checkboxes: 16x16px, 1px solid `#94A3B8`, border radius 2px. Checked state: solid `#0B192C` with white checkmark.
- Radio buttons: 16x16px circular, `#94A3B8`. Selected state: `#1E56A0` active ring with `#1E56A0` center dot.

### Verification Banner (Statutory Header)
- Compact top-bar spanning full screen width with `#0B192C` background, 2px bottom accent in `#D97706`, high-contrast white text, presenting official Government of India / Bureau of Indian Standards identity signifiers.