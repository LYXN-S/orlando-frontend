# V4 Requirements — Role-Based Access, Super Admin, Permissions & Scrapbook Landing Page

## Overview

This version introduces a **permission-based admin system** with a **Super Admin** role, **strict role separation** between admin/staff and customer accounts, a redesigned **admin-only experience** (no cart, no customer pages), **user management with permissions**, and a new **scrapbook-style landing page** that tells the company's story.

---

## 1. Role & Permission System

### 1.1 Role Hierarchy
- **ROLE_SUPER_ADMIN** — Full system access. Can manage all users, grant/revoke admin permissions, create new admin accounts.
  - The seeded account `orlandoprestige@gmail.com` is the **only** Super Admin.
- **ROLE_STAFF** — Admin access limited to permissions granted by the Super Admin.
- **ROLE_CUSTOMER** — Customer-only access (shop, cart, orders, profile).

### 1.2 Admin Permissions (Granular)
Staff accounts have access **only** to the features permitted by the Super Admin. Available permissions:

| Permission Key         | Description                                      |
|------------------------|--------------------------------------------------|
| `MANAGE_PRODUCTS`      | Create, edit, delete products and product images  |
| `MANAGE_ORDERS`        | View and evaluate (approve/reject) orders         |
| `MANAGE_INVENTORY`     | View and adjust stock levels                      |
| `VIEW_DASHBOARD`       | View the admin dashboard overview                 |

The Super Admin has **all permissions implicitly** and additionally:
- `MANAGE_USERS` — View/manage all customers and staff accounts
- `MANAGE_PERMISSIONS` — Grant/revoke staff permissions
- `CREATE_ADMIN` — Create new staff/admin accounts

### 1.3 Account Separation Rules
- **Admin/Staff accounts** (ROLE_STAFF, ROLE_SUPER_ADMIN):
  - Can ONLY access admin pages (dashboard, products, orders, inventory, users, profile).
  - **Cannot** browse the shop, add items to cart, or place orders.
  - No cart functionality. No customer-facing pages.
  - After login, redirected to `/admin` dashboard.
- **Customer accounts** (ROLE_CUSTOMER):
  - Can ONLY access customer pages (home, shop, product detail, cart, orders, profile).
  - **Cannot** access any admin pages.
  - After login, redirected to `/` homepage or previous page.

---

## 2. Super Admin — User Management

### 2.1 Customer Management
- View all registered customers (list with search/filter).
- View customer details (name, email, registration date, order count).
- Soft-delete (deactivate) customer accounts.

### 2.2 Staff Management
- View all staff accounts (list with search/filter).
- Create new staff accounts (first name, last name, email, temporary password).
- Edit staff permissions (grant/revoke individual permissions via checkboxes).
- Soft-delete (deactivate) staff accounts.
- View each staff member's current permissions.

### 2.3 Backend Requirements
- New `Permission` entity linked to Staff (many-to-many or JSON column).
- New REST endpoints for user management (Super Admin only):
  - `GET /api/v1/admin/users/customers` — list all customers
  - `GET /api/v1/admin/users/staff` — list all staff
  - `POST /api/v1/admin/users/staff` — create new staff account
  - `PATCH /api/v1/admin/users/staff/{id}/permissions` — update permissions
  - `DELETE /api/v1/admin/users/staff/{id}` — soft-delete staff
  - `DELETE /api/v1/admin/users/customers/{id}` — soft-delete customer
- New endpoint to get current user's permissions:
  - `GET /api/v1/auth/me` — returns user profile + permissions (for frontend routing)

---

## 3. Admin Experience Redesign

### 3.1 Admin Pages (Staff & Super Admin)
All admin pages are under `/admin/*` and require authentication + admin role.

| Page                  | Route                          | Required Permission     |
|-----------------------|--------------------------------|-------------------------|
| Dashboard             | `/admin`                       | `VIEW_DASHBOARD`        |
| Product Management    | `/admin/products`              | `MANAGE_PRODUCTS`       |
| Add/Edit Product      | `/admin/products/new`, `/:id/edit` | `MANAGE_PRODUCTS`   |
| Order Management      | `/admin/orders`                | `MANAGE_ORDERS`         |
| Inventory Management  | `/admin/inventory`             | `MANAGE_INVENTORY`      |
| User Management       | `/admin/users`                 | Super Admin only        |
| Profile               | `/admin/profile`               | All admin roles         |

### 3.2 Admin Sidebar Navigation
- Sidebar shows only the pages the current user has permission to access.
- Super Admin sees all pages including User Management.
- Regular staff see only their permitted pages + profile.

### 3.3 Admin Dashboard
- Summary cards showing stats for each area the admin has permission to view.
- If an admin only has `MANAGE_ORDERS`, dashboard shows only order-related stats.

### 3.4 No Cart / No Shopping for Admins
- Cart icon hidden from navbar for admin users.
- Admin users cannot hit cart or order-placement endpoints (backend enforced).
- Attempting to visit `/cart`, `/orders`, `/products/:id` as admin redirects to `/admin`.

---

## 4. Scrapbook-Style Landing Page

### 4.1 Design Concept
The homepage (`/`) is redesigned as a **scrapbook/story-driven** layout telling the story of Orlando Prestige:
- Warm, handcrafted aesthetic with layered elements (torn paper edges, tape, stamps, handwritten fonts).
- Sections laid out like a scrapbook album — not a typical e-commerce grid.
- Parallax scrolling or subtle animations for engagement.

### 4.2 Sections
1. **Hero** — Full-width scrapbook-style cover with brand name, tagline, and featured image. Background textured like craft paper or linen.
2. **Our Story** — Narrative section with photos, handwritten-style typography, and a personal backstory about the company.
3. **Featured Collection** — A curated set of products displayed like pinned polaroid photos on a corkboard or taped into a scrapbook.
4. **Craftsmanship** — Close-up product images with overlay text describing quality, materials, and process.
5. **Testimonials** — Customer quotes styled as handwritten notes or postcards.
6. **Call to Action** — "Visit Our Shop" button linking to `/products`.

### 4.3 Visual Elements
- Background textures: kraft paper, linen, wood grain.
- Decorative elements: washi tape, paper clips, stamps, torn edges, polaroid frames.
- Typography: mix of serif (for headings) and handwritten/script fonts (for accents).
- Color palette: warm earth tones (cream, brown, terracotta) with the existing primary gold/espresso brand colors.

---

## 5. Login Flow Changes

### 5.1 Role-Based Redirect After Login
- **Customer** → redirect to `/` (homepage) or `?redirect=` param
- **Staff / Super Admin** → redirect to `/admin` (dashboard)

### 5.2 JWT Token Changes
- JWT now includes `permissions` claim (array of permission strings) for staff/super admin.
- Frontend stores permissions alongside role for conditional rendering.

### 5.3 Auth/Me Endpoint
- New `GET /api/v1/auth/me` returning:
  ```json
  {
    "userId": 1,
    "email": "admin@example.com",
    "role": "ROLE_SUPER_ADMIN",
    "firstName": "Orlando",
    "lastName": "Prestige",
    "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_INVENTORY", "VIEW_DASHBOARD", "MANAGE_USERS", "MANAGE_PERMISSIONS", "CREATE_ADMIN"]
  }
  ```
- Called on app load (if token exists) to hydrate user state with permissions.

---

## 6. Notification System Updates

### 6.1 Permission-Aware Notifications
- Notifications are only shown to users who have the relevant permission.
  - Order notifications → only staff with `MANAGE_ORDERS` permission.
  - Low stock notifications → only staff with `MANAGE_INVENTORY` permission.
- Super Admin receives all notification types.
- Customer notifications unchanged (order status updates).

---

## 7. Summary of Account Capabilities

| Capability               | Customer | Staff (with perm) | Super Admin |
|--------------------------|----------|--------------------|-------------|
| Browse shop / home       | ✅       | ❌                 | ❌          |
| Add to cart              | ✅       | ❌                 | ❌          |
| Place orders             | ✅       | ❌                 | ❌          |
| View own orders          | ✅       | ❌                 | ❌          |
| View admin dashboard     | ❌       | ✅ (VIEW_DASHBOARD)| ✅          |
| Manage products          | ❌       | ✅ (MANAGE_PRODUCTS)| ✅         |
| Manage orders            | ❌       | ✅ (MANAGE_ORDERS) | ✅          |
| Manage inventory         | ❌       | ✅ (MANAGE_INVENTORY)| ✅        |
| Manage users             | ❌       | ❌                 | ✅          |
| Create admin accounts    | ❌       | ❌                 | ✅          |
| Manage permissions       | ❌       | ❌                 | ✅          |
| View notifications       | ✅ (own) | ✅ (by permission) | ✅ (all)   |
