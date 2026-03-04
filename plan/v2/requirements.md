# Orlando Frontend v2 — Requirements

## Overview
Orlando is an Italian gourmet food e-commerce storefront. The app showcases premium Mediterranean products — tomatoes, pasta, olive oils, truffles, wines, infused oils, legumes, and specialty vinegars. The frontend is built with React and connects to a Spring Boot backend API. v2 focuses on a public-facing shopping experience with a compelling home page, product browsing with add-to-cart, and gated checkout requiring authentication.

## Product Categories (Design Reference)
These categories inform the visual design, color palette, and overall branding. Actual product data will come from the backend API; placeholder items (Item 1, Item 2, etc.) are used during development.

| Category | Example Products |
|---|---|
| Tomatoes | Whole Peeled, Chopped/Diced, Cherry, Crushed, Passata Sauce, Double Concentrate Paste |
| Pasta | Spaghetti, Linguine, Penne Rigate, Fusilli, Fettuccine, Rigatoni, Lasagne, Capellini |
| Olive Oils | Extra Virgin, Pomace, Gourmet EVOO, Regular Olive Oil, Mediterranean Blended, Sunflower |
| Truffles | Fresh Whole/Sliced, Sauce, Paté, Paste, Zest, Butter, Drizzle |
| Wines | Primitivo, Lambrusco, Moscato, Barbera, Negroamaro, Falanghina, Aglianico, Greco di Tufo, Nero d'Avola, Cabernet |
| Infused Oils | White Truffle, Black Truffle, Spicy, Lemon, Rosemary, Basil, Garlic, Mushroom, Onion, Sundried Tomatoes |
| Legumes & Beans | White Beans, Baked Beans, Chickpeas, Green Peas, Lentils, Red Kidney, Borlotti, Mixed Vegetables |
| Vinegar | Apple Cider Vinegar Unfiltered with "The Mother" |

## Pages & Routes

| Route | Page | Auth Required | Description |
|---|---|---|---|
| `/` | Home | No | Landing page — hero, featured categories, brand story |
| `/products` | Product List | No | Browse all products, filter by category, add to cart |
| `/products/:id` | Product Detail | No | Full product view with add-to-cart |
| `/cart` | Cart | No (view) / Yes (checkout) | View cart freely; checkout button redirects to login if unauthenticated |
| `/login` | Login | No | Sign in with email + password |
| `/register` | Register | No | Create a new account |
| `/orders` | Orders | Yes | View past orders (post-checkout) |
| `/profile` | Profile | Yes | Manage account details |

## Authentication Flow
- **Login**: `POST /api/v1/auth/login` → `{ token, role, userId }`
  - JWT stored in localStorage via AuthContext
  - Redirect to previous page (or home) on success
- **Register**: `POST /api/v1/auth/register`
  - Fields: firstName, lastName, email, password
  - Password: min 8 chars, 1 uppercase, 1 lowercase, 1 digit, 1 special char (`@$!%*?&`)
  - On success, redirect to login with success message
- **Logout**: Clear localStorage, redirect to home
- **JWT**: Sent as `Authorization: Bearer <token>` on authenticated requests

## Cart Behavior
- Users can browse products and add items to cart **without logging in**
- Cart state is stored in React context (persisted to localStorage)
- Viewing the cart does **not** require authentication
- Clicking "Checkout" checks auth state:
  - **Authenticated** → proceed to checkout/order placement
  - **Not authenticated** → redirect to `/login` with a return URL so the user comes back to cart after login
- Cart survives page refresh (localStorage persistence)
- Cart merging after login is out of scope for v2

## Navigation
- Navbar visible on all pages
- Always show: Home, Products
- Show Cart icon with item count badge (always visible)
- Show Login / Register when logged out
- Show Orders, Profile, Logout when logged in
- Mobile: hamburger menu with slide-out drawer

## Placeholder Products
During development, products are displayed as:
- **Item 1**, **Item 2**, **Item 3**, ... **Item N**
- Each item has: name, price, image placeholder, category, description placeholder
- Real product data will be fetched from the backend API in a future phase

## Tech Stack
- React 19 + React Router 7
- Tailwind CSS
- shadcn/ui components (Radix UI primitives + Tailwind)
- Axios with JWT interceptor
- Create React App (react-scripts 5.0.1)
- `REACT_APP_API_URL` → `http://localhost:8080/api/v1`

## Non-Functional Requirements
- Mobile-first responsive design
- Accessible (WCAG AA)
- Fast initial load — lazy-load routes and images
- Consistent design language across all pages
