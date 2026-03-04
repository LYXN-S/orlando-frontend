# Orlando Frontend v2 — Design System

## Design Philosophy
Orlando sells premium Italian and Mediterranean food products — pasta, tomatoes, olive oils, truffles, wines, infused oils, and legumes. The design should feel **warm, rustic-elegant, and artisanal** — evoking an Italian countryside market with modern e-commerce polish. Think sun-drenched terracotta, olive groves, and hand-crafted quality.

- Warm and inviting, not sterile
- Clean layout with generous whitespace
- Photography-forward (large product/hero imagery)
- Tactile feel — subtle textures, warm shadows, rounded elements
- Accessible (WCAG AA) and mobile-first

## Color Palette

| Token | Value | Usage |
|---|---|---|
| Primary | `#8B5E3C` (warm brown/terracotta) | Buttons, CTAs, accents |
| Primary Hover | `#6F4A2E` (darker terracotta) | Button hover states |
| Primary Light | `#FBF5EF` (warm cream) | Subtle backgrounds, hero overlays |
| Accent | `#6B7F3A` (olive green) | Category badges, highlights, secondary buttons |
| Accent Hover | `#566832` (darker olive) | Secondary button hover |
| Background | `#FEFCF9` (warm off-white) | Page background |
| Card | `#FFFFFF` | Card/panel surfaces |
| Foreground | `#2D1F14` (deep espresso) | Primary text |
| Muted | `#8C7B6B` (warm grey) | Secondary text, captions |
| Border | `#E8DDD1` (warm sand) | Borders, dividers |
| Destructive | `#C0392B` (deep red) | Errors, out-of-stock |
| Wine | `#722F37` (burgundy) | Wine category accent |
| Success | `#27AE60` | Success states, in-stock badge |

## Typography
- **Heading Font**: Playfair Display (Google Fonts) — serif, elegant, Italian feel
- **Body Font**: Inter (Google Fonts) — clean, readable sans-serif
- Headings: Playfair Display Bold, tight tracking
- Body: Inter Regular, line-height 1.6
- Prices: Inter SemiBold, slightly larger than body
- **Scale**: text-sm (captions) → text-base (body) → text-xl (subheads) → text-3xl (section heads) → text-5xl (hero)

## Layout — Home Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo] ORLANDO      Home  Products  Cart(3) Login  │
├─────────────────────────────────────────────────────┤
│                                                     │
│            ░░░░░ HERO IMAGE ░░░░░                   │
│         (Italian pantry / table scene)              │
│                                                     │
│      "Authentic Italian Flavors,                    │
│       Delivered to Your Door"                       │
│                                                     │
│           [ SHOP NOW ]  [ OUR STORY ]               │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│            SHOP BY CATEGORY                         │
│                                                     │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│   │ 🍅   │  │ 🍝   │  │ 🫒   │  │ 🍷   │          │
│   │Tomato │  │Pasta │  │Oils  │  │Wine  │          │
│   └──────┘  └──────┘  └──────┘  └──────┘          │
│   ┌──────┐  ┌──────┐  ┌──────┐  ┌──────┐          │
│   │ 🍄   │  │ 🌿   │  │ 🫘   │  │ 🫙   │          │
│   │Truffle│  │Infused│  │Legume│  │Vinegar│         │
│   └──────┘  └──────┘  └──────┘  └──────┘          │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│            FEATURED PRODUCTS                        │
│                                                     │
│   ┌──────────┐ ┌──────────┐ ┌──────────┐          │
│   │  [img]   │ │  [img]   │ │  [img]   │          │
│   │ Item 1   │ │ Item 2   │ │ Item 3   │          │
│   │ $XX.XX   │ │ $XX.XX   │ │ $XX.XX   │          │
│   │[Add Cart]│ │[Add Cart]│ │[Add Cart]│          │
│   └──────────┘ └──────────┘ └──────────┘          │
│                                                     │
│            [ VIEW ALL PRODUCTS → ]                  │
│                                                     │
├─────────────────────────────────────────────────────┤
│                                                     │
│    "From Italian Farms to Your Table"               │
│    Brief brand story / quality promise              │
│    [ LEARN MORE ]                                   │
│                                                     │
├─────────────────────────────────────────────────────┤
│  ORLANDO  │ Quick Links │ Contact │ Social          │
│  © 2026   │ Products    │ Email   │ f  ig  t        │
│           │ About       │ Phone   │                 │
└─────────────────────────────────────────────────────┘
```

- **Hero**: Full-width image (warm, styled Italian food scene). Dark overlay with white text. Two CTA buttons.
- **Categories**: 4-column grid (2-col on mobile) of clickable cards with subtle hover lift. Each card has an icon/image and category name.
- **Featured Products**: 3-column grid (1-col mobile, 2-col tablet). Product card with image, name, price, add-to-cart button.
- **Brand Story**: Centered text block on warm cream background with call to action.
- **Footer**: Multi-column with logo, links, contact info, social icons.

## Layout — Products Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo] ORLANDO       Home  Products  Cart(3) Login │
├─────────────────────────────────────────────────────┤
│                                                     │
│  OUR PRODUCTS                        [Search...]    │
│                                                     │
│  ┌─────────┐  ┌─────────────────────────────────┐  │
│  │ FILTERS │  │ ┌────────┐ ┌────────┐ ┌────────┐│  │
│  │         │  │ │ [img]  │ │ [img]  │ │ [img]  ││  │
│  │ Category│  │ │ Item 1 │ │ Item 2 │ │ Item 3 ││  │
│  │ ○ All   │  │ │ $XX.XX │ │ $XX.XX │ │ $XX.XX ││  │
│  │ ○ Tomato│  │ │[+ Cart]│ │[+ Cart]│ │[+ Cart]││  │
│  │ ○ Pasta │  │ └────────┘ └────────┘ └────────┘│  │
│  │ ○ Oils  │  │ ┌────────┐ ┌────────┐ ┌────────┐│  │
│  │ ○ Wine  │  │ │ [img]  │ │ [img]  │ │ [img]  ││  │
│  │ ○ Truffl│  │ │ Item 4 │ │ Item 5 │ │ Item 6 ││  │
│  │ ○ Infusd│  │ │ $XX.XX │ │ $XX.XX │ │ $XX.XX ││  │
│  │ ○ Legume│  │ │[+ Cart]│ │[+ Cart]│ │[+ Cart]││  │
│  │ ○ Vinegr│  │ └────────┘ └────────┘ └────────┘│  │
│  │         │  │                                   │  │
│  │ Price   │  │         Page 1 2 3 ...            │  │
│  │ [---|--]│  │                                   │  │
│  │         │  └─────────────────────────────────┘  │
│  └─────────┘                                       │
└─────────────────────────────────────────────────────┘
```

- **Left sidebar** (hidden on mobile, becomes top filter bar): Category radio buttons, price range slider
- **Product grid**: 3 columns (2 on tablet, 1 on mobile)
- **Product card**: Image (4:3 ratio with warm grey placeholder), product name, price, "Add to Cart" button
- **Search bar**: Top right, filters products by name
- **Pagination**: Bottom center

## Layout — Product Detail Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo] ORLANDO       Home  Products  Cart(3) Login │
├─────────────────────────────────────────────────────┤
│                                                     │
│  Products > Item 1                (breadcrumb)      │
│                                                     │
│  ┌───────────────┐  ┌────────────────────────────┐ │
│  │               │  │ Item 1                     │ │
│  │  [Product     │  │ Category: Pasta            │ │
│  │   Image]      │  │                            │ │
│  │               │  │ $XX.XX                     │ │
│  │               │  │                            │ │
│  │               │  │ Qty: [ - ] 1 [ + ]         │ │
│  │               │  │                            │ │
│  │               │  │ [ ADD TO CART ]             │ │
│  │               │  │                            │ │
│  │               │  │ Description placeholder    │ │
│  └───────────────┘  │ text goes here...          │ │
│                      └────────────────────────────┘ │
│                                                     │
│  ── YOU MAY ALSO LIKE ──────────────────────────    │
│  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐      │
│  │ Item 5 │ │ Item 8 │ │ Item 12│ │ Item 20│      │
│  └────────┘ └────────┘ └────────┘ └────────┘      │
└─────────────────────────────────────────────────────┘
```

- **Two-column** layout (stacks on mobile)
- Left: large product image
- Right: name, category badge (olive green), price, quantity selector, add-to-cart button, description
- Below: "You May Also Like" — 4-item horizontal scroll of related products

## Layout — Cart Page

```
┌─────────────────────────────────────────────────────┐
│  [Logo] ORLANDO       Home  Products  Cart(3) Login │
├─────────────────────────────────────────────────────┤
│                                                     │
│  YOUR CART (3 items)                                │
│                                                     │
│  ┌─────────────────────────────────┐ ┌───────────┐ │
│  │ [img] Item 1    Qty [1]  $X.XX │ │ SUMMARY   │ │
│  │       [Remove]                  │ │           │ │
│  │─────────────────────────────────│ │ Subtotal  │ │
│  │ [img] Item 3    Qty [2]  $X.XX │ │ $XX.XX    │ │
│  │       [Remove]                  │ │           │ │
│  │─────────────────────────────────│ │ Shipping  │ │
│  │ [img] Item 7    Qty [1]  $X.XX │ │ Calculated│ │
│  │       [Remove]                  │ │ at checkout│
│  └─────────────────────────────────┘ │           │ │
│                                      │ ───────── │ │
│                                      │ [CHECKOUT]│ │
│                                      │           │ │
│                                      │ * Login   │ │
│                                      │ required  │ │
│                                      └───────────┘ │
│                                                     │
│  [ ← CONTINUE SHOPPING ]                           │
└─────────────────────────────────────────────────────┘
```

- **Cart items list** (left) + **Order summary** (right, sticky on desktop)
- Each item row: thumbnail, name, quantity adjuster, line total, remove button
- Summary: subtotal, shipping note, checkout button
- If not logged in: subtle note under checkout button — "You'll need to log in to complete your order"
- Checkout button redirects to `/login?redirect=/cart` if unauthenticated
- Empty cart state: illustration + "Your cart is empty" + link to products

## Layout — Login Page

```
┌──────────────────┬────────────────────────────────┐
│                  │                                │
│   WELCOME BACK   │                                │
│                  │    Background Image            │
│   Email          │    (olive grove / vineyard)    │
│   [___________]  │                                │
│                  │                                │
│   Password       │       ORLANDO                  │
│   [___________]  │       Authentic Italian        │
│                  │       Flavors                   │
│   [ SIGN IN ]    │                                │
│                  │                                │
│   Don't have an  │                                │
│   account?       │                                │
│   Sign Up →      │                                │
│                  │                                │
└──────────────────┴────────────────────────────────┘
```

- **Split-screen** layout matching v1 concept but with warm color scheme
- **Left panel (45%)**: Warm cream background, form with terracotta accents
  - Organic curved right edge
  - Playfair Display heading
  - Clean inputs with warm border
  - Terracotta pill-shaped sign-in button
  - Link to register page
- **Right panel (55%)**: Full-bleed background image — olive grove, vineyard, or rustic Italian kitchen
  - Dark warm overlay (semi-transparent espresso)
  - Brand name + tagline in Playfair Display
- **Mobile**: Image panel becomes compact header with brand name; form takes full width

## Layout — Register Page

```
┌──────────────────┬────────────────────────────────┐
│                  │                                │
│ CREATE ACCOUNT   │                                │
│                  │    Background Image            │
│ First Name       │    (pasta / kitchen scene)     │
│ [___________]    │                                │
│ Last Name        │                                │
│ [___________]    │       ORLANDO                  │
│ Email            │       Join the Family           │
│ [___________]    │                                │
│ Password         │                                │
│ [___________]    │                                │
│                  │                                │
│ [ CREATE ACCOUNT]│                                │
│                  │                                │
│ Already have an  │                                │
│ account? Sign In │                                │
│                  │                                │
└──────────────────┴────────────────────────────────┘
```

- Same split-screen structure as Login
- Password field includes strength indicator bar (red → yellow → green)
- Validation feedback inline on each field

## Component Library (shadcn/ui)

| Component | Usage |
|---|---|
| Button | Primary (terracotta), Secondary (olive), Ghost, Outline variants |
| Input | Form fields — warm border, terracotta focus ring |
| Label | Form labels — Inter medium weight |
| Card | Product cards, category cards, cart items, order summaries |
| Checkbox | Terms of service, filter toggles |
| Alert | Error/success banners |
| Separator | Section dividers — warm sand color |
| Badge | Category tags, item count, stock status |

## Product Card Design

```
┌──────────────────┐
│ ┌──────────────┐ │
│ │              │ │  ← Image area (4:3 ratio, rounded-lg)
│ │  [Product    │ │     Warm grey (#E8DDD1) placeholder
│ │   Image]     │ │     Subtle hover zoom effect
│ │              │ │
│ └──────────────┘ │
│                  │
│  Category        │  ← Olive green badge
│  Item Name       │  ← Playfair Display, semibold
│  $XX.XX          │  ← Inter semibold, espresso color
│                  │
│  [ + Add to Cart]│  ← Terracotta outline button, fills on hover
│                  │
└──────────────────┘
```

- Rounded corners (`rounded-xl`), subtle warm shadow
- Hover: slight lift (`hover:-translate-y-1`), shadow increase, image zoom
- Transition: smooth 200ms on all hover states

## Spacing & Layout
- Page max-width: `max-w-7xl` centered with `mx-auto`
- Section padding: `py-16 px-4 md:px-8`
- Card padding: `p-6`, `rounded-xl`, `shadow-md`
- Grid gaps: `gap-6` (products), `gap-8` (categories)
- Form spacing: `space-y-5` between fields

## Interaction States
- **Buttons**: Hover lift + background darkening + shadow increase
- **Inputs**: `border-warm-sand` → `ring-2 ring-terracotta/30` on focus
- **Cards**: Hover lift + shadow grow + image subtle zoom
- **Links**: Terracotta underline on hover
- **Loading**: Skeleton placeholders with warm shimmer animation
- **Add to Cart**: Brief success animation — button text changes to "✓ Added" for 1.5s
- **Errors**: Warm red border on invalid fields, alert banner for general errors
- **Empty states**: Warm illustration + friendly message + CTA button
