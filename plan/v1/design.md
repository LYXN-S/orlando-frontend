# Orlando Frontend — Design System

## Design Philosophy
- Clean, modern, and minimal
- Consistent spacing and typography
- Accessible (WCAG AA contrast, focus states, ARIA labels)
- Mobile-first responsive design

## Color Palette
| Token | Value | Usage |
|---|---|---|
| Primary | `#0d9488` (teal-600) | Buttons, links, accents |
| Primary Hover | `#0f766e` (teal-700) | Button hover states |
| Primary Light | `#ccfbf1` (teal-100) | Subtle backgrounds |
| Background | `#f8fafc` (slate-50) | Page background |
| Card | `#ffffff` | Card/panel surfaces |
| Foreground | `#0f172a` (slate-900) | Primary text |
| Muted | `#64748b` (slate-500) | Secondary text |
| Border | `#e2e8f0` (slate-200) | Borders, dividers |
| Destructive | `#ef4444` (red-500) | Errors, warnings |

## Typography
- Font: Inter (Google Fonts) with system fallbacks
- Headings: Bold, tight letter-spacing
- Body: Regular weight, comfortable line height (1.6)

## Layout — Login Page (Reference Design)
Split-screen layout inspired by the provided mockup:

```
┌──────────────────┬────────────────────────┐
│                  │                        │
│   SIGN IN        │                        │
│                  │   Background Image     │
│   [icon] email   │   (ocean/water)        │
│   [icon] password│                        │
│                  │                        │
│   ☑ terms        │     ORLANDO            │
│   [SIGN IN]      │     YOUR SHOPPING      │
│                  │     DESTINATION         │
│   f G t          │                        │
│   Don't have...  │                        │
│                  │                        │
└──────────────────┴────────────────────────┘
```

- **Left panel (45%)**: White background, contains the form
  - Organic/curved right edge overlapping the image
  - Icon-prefixed underline-style inputs
  - Teal gradient pill button
  - Social login icons (Facebook, Google, Twitter)
- **Right panel (55%)**: Full-bleed background image with teal overlay
  - Brand name + tagline at bottom center
- **Mobile**: Stacks vertically, image panel becomes compact header

## Component Library (shadcn/ui)
Using shadcn/ui pattern — Radix UI primitives + Tailwind styling:

| Component | Usage |
|---|---|
| Button | Sign in, Sign up, Logout, Add to cart |
| Input | Email, password, search fields |
| Label | Form field labels |
| Card | Auth panels, product cards, order items |
| Checkbox | Terms of service agreement |
| Alert | Error/success messages |
| Separator | Visual dividers |

## Spacing Scale
- Consistent use of Tailwind spacing: `p-4`, `gap-6`, `mb-8`, etc.
- Cards: `p-8` padding, `rounded-xl` corners, `shadow-lg`
- Form gaps: `space-y-4` between fields

## Interaction States
- Buttons: hover lift + shadow increase
- Inputs: border color transition on focus (teal ring)
- Links: color transition on hover
- Loading: disabled state with spinner text
- Errors: red border on invalid fields, alert banner for general errors
