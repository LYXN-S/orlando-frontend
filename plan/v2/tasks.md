# Orlando Frontend v2 — Tasks

## Phase 1: Foundation & Design System
- [ ] Update Tailwind config with v2 color palette (terracotta, olive, cream, espresso, warm sand, wine, etc.)
- [ ] Add Playfair Display font (Google Fonts) alongside Inter
- [ ] Create/update CSS custom properties for the warm color tokens
- [ ] Update `cn()` utility and any shared Tailwind classes
- [ ] Create Badge component (shadcn-style) for category tags and stock status

## Phase 2: Home Page
- [ ] Create `Home.js` page component
- [ ] Build Hero section — full-width image, overlay, headline, two CTA buttons
- [ ] Build "Shop by Category" section — 4×2 grid of category cards with icons
- [ ] Build "Featured Products" section — 3-column product card grid with placeholder items (Item 1–6)
- [ ] Build "Brand Story" section — centered text block on cream background
- [ ] Build Footer component — multi-column with logo, links, contact, social icons
- [ ] Update router: set `/` route to Home page
- [ ] Mobile responsive for all home sections

## Phase 3: Products Page
- [ ] Redesign `ProductList.js` with sidebar + grid layout
- [ ] Build category filter sidebar (radio buttons for each category)
- [ ] Build search bar (top of product grid)
- [ ] Build product card component matching v2 design (image placeholder, name, price, add-to-cart)
- [ ] Populate grid with placeholder items (Item 1, Item 2, ... Item N)
- [ ] Add "Add to Cart" button to each product card with success feedback animation
- [ ] Add pagination component
- [ ] Mobile: collapse sidebar into horizontal filter bar / dropdown
- [ ] Responsive grid: 3-col → 2-col → 1-col

## Phase 4: Product Detail Page
- [ ] Redesign `ProductDetail.js` with two-column layout
- [ ] Build breadcrumb navigation (Products > Item Name)
- [ ] Large product image (left) with placeholder
- [ ] Product info panel (right): name, category badge, price, quantity selector, add-to-cart, description
- [ ] Quantity selector component (decrement / value / increment)
- [ ] "You May Also Like" section — horizontal scroll of 4 related items
- [ ] Mobile: stack to single column

## Phase 5: Cart Page & Context
- [ ] Create CartContext with add, remove, update quantity, clear cart
- [ ] Persist cart to localStorage (survives page refresh)
- [ ] Redesign `Cart.js` — item list (left) + order summary (right, sticky)
- [ ] Cart item row: thumbnail, name, quantity adjuster, line total, remove button
- [ ] Order summary: subtotal calculation, shipping note, checkout button
- [ ] Checkout button: if not authenticated → redirect to `/login?redirect=/cart`
- [ ] Checkout button: if authenticated → proceed (placeholder for future order flow)
- [ ] "Login required" subtle note under checkout when not logged in
- [ ] Empty cart state: illustration + message + "Continue Shopping" link
- [ ] Cart icon in Navbar with item count badge

## Phase 6: Login Page
- [ ] Redesign `Login.js` with v2 warm split-screen layout
- [ ] Left panel: warm cream background, Playfair Display heading, clean form
- [ ] Terracotta pill-shaped sign-in button
- [ ] Right panel: background image with warm overlay, brand name + tagline
- [ ] Handle `?redirect=` query param — redirect after successful login
- [ ] Error handling: field-level validation + general error alert
- [ ] Loading state on submit
- [ ] Link to Register page
- [ ] Mobile: image panel becomes compact brand header

## Phase 7: Register Page
- [ ] Redesign `Register.js` with v2 warm split-screen layout
- [ ] Fields: firstName, lastName, email, password
- [ ] Password strength indicator bar (red → yellow → green)
- [ ] Inline field validation feedback
- [ ] Terracotta pill-shaped submit button
- [ ] On success: redirect to `/login` with success message
- [ ] Link to Login page
- [ ] Mobile responsive layout

## Phase 8: Navigation
- [ ] Redesign Navbar with v2 branding (Playfair Display logo, warm colors)
- [ ] Always show: Home, Products, Cart (with count badge)
- [ ] Logged out: show Login, Register
- [ ] Logged in: show Orders, Profile, Logout
- [ ] Mobile hamburger menu with slide-out drawer
- [ ] Active route highlighting

## Phase 9: Polish & UX
- [ ] Protected route wrapper for auth-required pages (Orders, Profile)
- [ ] Skeleton loading states with warm shimmer animation
- [ ] Toast notifications for add-to-cart, login success, errors
- [ ] "Add to Cart" button feedback — "✓ Added" for 1.5s
- [ ] Empty states for orders page, etc.
- [ ] Smooth page transitions
- [ ] Accessibility audit: keyboard navigation, focus states, ARIA labels, contrast
- [ ] Performance: lazy-load routes, optimize images, code splitting
