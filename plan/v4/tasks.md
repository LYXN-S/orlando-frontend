# V4 Tasks — Role-Based Access, Super Admin, Permissions & Scrapbook Landing Page

---

## Phase 1: Backend — Permission Model & Role Changes

### Task 1.1: Create Permission Enum
- **File:** `auth/internal/domain/Permission.java`
- **Details:**
  - Create `Permission` enum with values: `VIEW_DASHBOARD`, `MANAGE_PRODUCTS`, `MANAGE_ORDERS`, `MANAGE_INVENTORY`, `MANAGE_USERS`, `MANAGE_PERMISSIONS`, `CREATE_ADMIN`
- **Estimate:** 10 min
- **Status:** ❌ Not Started

### Task 1.2: Update Staff Entity with Permissions & Super Admin Flag
- **File:** `auth/internal/domain/Staff.java`
- **Details:**
  - Add `boolean superAdmin` field (default `false`)
  - Add `Set<Permission> permissions` with `@ElementCollection`, backed by `staff_permissions` join table
  - Add helper: `hasPermission(Permission p)` → returns `true` if `superAdmin || permissions.contains(p)`
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 1.3: Update DataSeeder for Super Admin
- **File:** `auth/internal/service/DataSeeder.java`
- **Details:**
  - Set `admin.setSuperAdmin(true)` on the seeded `orlandoprestige@gmail.com` account
  - No permissions need to be explicitly added (super admin has all implicitly)
- **Estimate:** 5 min
- **Status:** ❌ Not Started

### Task 1.4: Update JwtService — Add Permissions Claim
- **File:** `auth/internal/service/JwtService.java`
- **Details:**
  - `generateToken(userId, email, role, permissions)` → add `permissions` claim as string list
  - `extractPermissions(token)` → returns `List<String>`
  - Super admin role: use `ROLE_SUPER_ADMIN` instead of `ROLE_STAFF`
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 1.5: Update AuthService — Login Logic
- **File:** `auth/internal/service/AuthService.java`
- **Details:**
  - When staff logs in, check `isSuperAdmin()`:
    - `true` → role = `ROLE_SUPER_ADMIN`, permissions = all Permission values
    - `false` → role = `ROLE_STAFF`, permissions = staff.getPermissions()
  - Include permissions in JWT via updated `JwtService.generateToken()`
  - Update `LoginResponseDto` to include `permissions` array
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 1.6: Update JwtAuthFilter — Extract Permissions
- **File:** `auth/internal/filter/JwtAuthFilter.java`
- **Details:**
  - Extract `permissions` list from JWT claims
  - Create `GrantedAuthority` entries for both role AND each permission
  - Update `AuthenticatedUser` record to include `List<String> permissions`
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 1.7: Create PermissionChecker Bean
- **File:** `auth/internal/service/PermissionChecker.java`
- **Details:**
  - `@Component("permissionChecker")`
  - Method: `boolean has(Authentication auth, String permission)`
  - Returns `true` if user is super admin OR has the specific permission
  - Used in `@PreAuthorize` SpEL expressions
- **Estimate:** 15 min
- **Status:** ❌ Not Started

---

## Phase 2: Backend — Auth/Me Endpoint

### Task 2.1: Create GET /auth/me Endpoint
- **File:** `auth/internal/presentation/controller/AuthController.java`
- **DTOs:** `UserProfileResponseDto.java`
- **Details:**
  - Authenticated endpoint returning: `{ userId, email, firstName, lastName, role, permissions[] }`
  - Reads user ID from JWT, loads from Customer or Staff accordingly
  - For customers: permissions = []
  - For staff: permissions from DB (or all if super admin)
- **Estimate:** 30 min
- **Status:** ❌ Not Started

---

## Phase 3: Backend — Admin User Management Endpoints

### Task 3.1: Create Staff Management Endpoints (Super Admin Only)
- **File:** `auth/internal/presentation/controller/AdminUserController.java`
- **DTOs:** `CreateStaffRequestDto`, `UpdatePermissionsRequestDto`, `StaffResponseDto`
- **Details:**
  - `GET /api/v1/admin/users/staff` — list all staff (paginated)
  - `GET /api/v1/admin/users/staff/{id}` — get staff detail + permissions
  - `POST /api/v1/admin/users/staff` — create staff account with permissions
  - `PATCH /api/v1/admin/users/staff/{id}/permissions` — update permissions
  - `DELETE /api/v1/admin/users/staff/{id}` — soft-delete staff
  - All protected with `@PreAuthorize("hasRole('SUPER_ADMIN')")`
- **Estimate:** 60 min
- **Status:** ❌ Not Started

### Task 3.2: Create Customer Management Endpoints (Super Admin Only)
- **File:** `auth/internal/presentation/controller/AdminUserController.java` (or separate controller)
- **DTOs:** `CustomerResponseDto`
- **Details:**
  - `GET /api/v1/admin/users/customers` — list all customers (paginated)
  - `GET /api/v1/admin/users/customers/{id}` — get customer detail
  - `DELETE /api/v1/admin/users/customers/{id}` — soft-delete customer
  - All protected with `@PreAuthorize("hasRole('SUPER_ADMIN')")`
- **Estimate:** 30 min
- **Status:** ❌ Not Started

---

## Phase 4: Backend — Access Control Enforcement

### Task 4.1: Restrict Cart & Order Endpoints to Customers Only
- **Files:** `cart/internal/presentation/controller/CartController.java`, `orders/internal/presentation/controller/OrderController.java`
- **Details:**
  - Add `@PreAuthorize("hasRole('CUSTOMER')")` to:
    - All cart endpoints (add/remove/clear/get)
    - Order creation endpoint (POST /orders)
  - Order listing (GET /orders) for customers shows their orders
  - Order listing for staff/super admin shows all orders (already built in v3)
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 4.2: Add Permission Checks to Existing Admin Endpoints
- **Files:** Product, order-review, inventory controllers
- **Details:**
  - Product CRUD: `@PreAuthorize("hasRole('SUPER_ADMIN') or @permissionChecker.has(authentication, 'MANAGE_PRODUCTS')")`
  - Order review: `@PreAuthorize("hasRole('SUPER_ADMIN') or @permissionChecker.has(authentication, 'MANAGE_ORDERS')")`
  - Inventory: `@PreAuthorize("hasRole('SUPER_ADMIN') or @permissionChecker.has(authentication, 'MANAGE_INVENTORY')")`
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 4.3: Update SecurityConfig Public Endpoints
- **File:** `auth/SecurityConfig.java`
- **Details:**
  - Ensure `/api/v1/auth/me` requires authentication
  - Ensure `/api/v1/admin/**` requires `ROLE_STAFF` or `ROLE_SUPER_ADMIN`
  - Keep existing public endpoints (login, register, catalog GETs)
- **Estimate:** 10 min
- **Status:** ❌ Not Started

---

## Phase 5: Backend — Notification Permission-Awareness

### Task 5.1: Update Notification Service for Permission-based Delivery
- **File:** `notifications/internal/service/NotificationService.java`
- **Details:**
  - `createStaffBroadcast()` → check staff permissions before creating notification
  - ORDER_SUBMITTED notifications → only staff with MANAGE_ORDERS + super admin
  - LOW_STOCK notifications → only staff with MANAGE_INVENTORY + super admin
  - Modify staff query to join permissions table
- **Estimate:** 25 min
- **Status:** ❌ Not Started

---

## Phase 6: Frontend — Auth / Permission Infrastructure

### Task 6.1: Update AuthContext with Permissions
- **File:** `context/AuthContext.js`
- **Details:**
  - After login, call `GET /auth/me` to fetch full profile + permissions
  - Store `permissions[]` in auth state alongside token, role, userId
  - Add helper: `hasPermission(key)` → super admin always true, staff checks array
  - Add helpers: `isAdmin()`, `isCustomer()`, `isSuperAdmin()`
  - Update localStorage to persist permissions
- **Estimate:** 30 min
- **Status:** ❌ Not Started

### Task 6.2: Create PermissionGate Component
- **File:** `components/PermissionGate.js`
- **Details:**
  - `<PermissionGate permission="MANAGE_PRODUCTS">...</PermissionGate>`
  - Conditionally renders children if user has the permission (or is super admin)
  - Used in sidebar, pages, and action buttons
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 6.3: Update ProtectedRoute Component
- **File:** `components/ProtectedRoute.js`
- **Details:**
  - Add `customerOnly` prop — if admin tries to access, redirect to `/admin`
  - Add `requiredPermission` prop — checks permission, redirects on failure
  - Admin users accessing `/` redirect to `/admin` automatically
  - Customer users accessing `/admin/*` redirect to `/`
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 6.4: Update Login Page Redirect Logic
- **File:** `pages/Login.js`
- **Details:**
  - After login: if customer → navigate to `/` (or redirect param), if admin → navigate to `/admin`
- **Estimate:** 10 min
- **Status:** ❌ Not Started

---

## Phase 7: Frontend — Admin Layout & Sidebar

### Task 7.1: Create AdminLayout Component
- **File:** `layouts/AdminLayout.js`
- **Details:**
  - Wrapper layout for all `/admin/*` routes
  - Contains: AdminNavbar (top) + Sidebar (left) + `<Outlet/>` (main)
  - No cart icon, no shop links
  - Responsive: sidebar collapses to hamburger/icons on mobile
- **Estimate:** 40 min
- **Status:** ❌ Not Started

### Task 7.2: Create AdminSidebar Component
- **File:** `components/AdminSidebar.js`
- **Details:**
  - Menu items: Dashboard, Products, Orders, Inventory, Users (SA only), Profile, Logout
  - Each item wrapped in `PermissionGate` — only shown if user has required permission
  - Active state highlight based on current route
  - Icons from lucide-react
- **Estimate:** 30 min
- **Status:** ❌ Not Started

### Task 7.3: Create AdminNavbar Component
- **File:** `components/AdminNavbar.js`
- **Details:**
  - Logo (links to /admin, not /)
  - Notification bell
  - Profile dropdown (name, role badge, logout)
  - No cart icon, no shop navigation
  - Mobile hamburger toggles sidebar
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 7.4: Update App.js Routing Structure
- **File:** `App.js`
- **Details:**
  - Nest admin routes under `<Route element={<AdminLayout/>}>` 
  - Customer routes keep existing `Navbar` + `Footer` layout
  - Public routes accessible to all (but admin auto-redirects to /admin after login)
  - Route structure:
    ```
    /               → Home (scrapbook)
    /products       → ProductList
    /products/:id   → ProductDetail
    /login          → Login
    /register       → Register
    /cart           → ProtectedRoute(customerOnly) → Cart
    /orders         → ProtectedRoute(customerOnly) → Orders
    /profile        → ProtectedRoute(customerOnly) → CustomerProfile
    /admin          → ProtectedRoute(adminOnly) → AdminLayout
      index         → AdminDashboard [VIEW_DASHBOARD]
      products      → AdminProducts [MANAGE_PRODUCTS]
      products/new  → AdminProductForm [MANAGE_PRODUCTS]
      products/:id/edit → AdminProductForm [MANAGE_PRODUCTS]
      orders        → AdminOrders [MANAGE_ORDERS]
      inventory     → AdminInventory [MANAGE_INVENTORY]
      users/*       → UserManagement [SUPER_ADMIN only]
      profile       → AdminProfile [all admin]
    ```
- **Estimate:** 30 min
- **Status:** ❌ Not Started

---

## Phase 8: Frontend — User Management Pages (Super Admin)

### Task 8.1: Create User Management Services
- **File:** `services/adminUserService.js`
- **Details:**
  - `getCustomers(page, search)` → GET /admin/users/customers
  - `getCustomer(id)` → GET /admin/users/customers/{id}
  - `deactivateCustomer(id)` → DELETE /admin/users/customers/{id}
  - `getStaff(page, search)` → GET /admin/users/staff
  - `getStaffMember(id)` → GET /admin/users/staff/{id}
  - `createStaff(data)` → POST /admin/users/staff
  - `updatePermissions(id, permissions)` → PATCH /admin/users/staff/{id}/permissions
  - `deactivateStaff(id)` → DELETE /admin/users/staff/{id}
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 8.2: Create User Management Overview Page
- **File:** `pages/admin/AdminUsers.js`
- **Details:**
  - Tabs: Customers | Staff
  - Search bar, total count badges
  - Routes to customer or staff list based on tab
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 8.3: Create Customer List Page
- **File:** `pages/admin/AdminCustomers.js`
- **Details:**
  - Table: Name, Email, Registered Date, Orders Count, Status, Actions
  - Search/filter, pagination
  - Deactivate action with confirmation dialog
- **Estimate:** 30 min
- **Status:** ❌ Not Started

### Task 8.4: Create Staff List Page
- **File:** `pages/admin/AdminStaff.js`
- **Details:**
  - Table: Name, Email, Permissions (as colored badges), Status, Actions
  - "Create Staff Account" button → links to form
  - Edit permissions (modal or inline), Deactivate with confirmation
- **Estimate:** 30 min
- **Status:** ❌ Not Started

### Task 8.5: Create Staff Account Form
- **File:** `pages/admin/AdminStaffForm.js`
- **Details:**
  - Fields: First Name, Last Name, Email, Temporary Password
  - Permission checkboxes with descriptions
  - Validation: email format, required fields, password strength
  - On submit: POST /admin/users/staff → redirect to staff list
- **Estimate:** 25 min
- **Status:** ❌ Not Started

### Task 8.6: Create Permission Editor Modal
- **File:** `components/PermissionEditorModal.js`
- **Details:**
  - Modal with checkboxes for each permission
  - Permission descriptions inline
  - Save → PATCH /admin/users/staff/{id}/permissions
  - Toast on success
- **Estimate:** 20 min
- **Status:** ❌ Not Started

---

## Phase 9: Frontend — Scrapbook Landing Page

### Task 9.1: Add Scrapbook Assets & Fonts
- **Details:**
  - Add Google Font `Caveat` (handwritten) in index.html
  - Add texture images: kraft-paper.jpg, linen.jpg to /public/textures/
  - Add small PNG/SVG assets: tape.png, paper-clip.svg, torn-edge.svg
  - Extend tailwind.config.js with scrapbook palette colors: kraft, linen, terracotta, aged-paper
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 9.2: Create ScrapbookHero Component
- **File:** `components/scrapbook/ScrapbookHero.js`
- **Details:**
  - Full-width hero with kraft paper texture background
  - Brand name in serif + handwritten tagline
  - Decorative tape/stamp CSS elements
  - Gentle scroll-down indicator
- **Estimate:** 25 min
- **Status:** ❌ Not Started

### Task 9.3: Create OurStory Section
- **File:** `components/scrapbook/OurStory.js`
- **Details:**
  - Alternating layout: text left / image right, then reverse
  - Polaroid-framed images (CSS: white padding, rotation, box-shadow)
  - Company narrative paragraphs in casual serif + accent script
  - Fade-in animations on scroll (IntersectionObserver)
- **Estimate:** 30 min
- **Status:** ❌ Not Started

### Task 9.4: Create FeaturedCollection Section
- **File:** `components/scrapbook/FeaturedCollection.js`
- **Details:**
  - Fetch 4-6 featured products from catalog API
  - Display as polaroid-style cards pinned to cork background
  - Slight random rotation per card (CSS transforms)
  - Click navigates to /products/:id
- **Estimate:** 25 min
- **Status:** ❌ Not Started

### Task 9.5: Create CraftsmanshipSection
- **File:** `components/scrapbook/CraftsmanshipSection.js`
- **Details:**
  - Full-bleed image with overlaid text
  - Typography emphasis on materials & quality story
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 9.6: Create TestimonialsSection
- **File:** `components/scrapbook/TestimonialsSection.js`
- **Details:**
  - Customer quotes styled as handwritten postcards
  - Slight tilt, drop-shadow, handwritten font (Caveat)
  - Static content (hardcoded testimonials for now)
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 9.7: Create ScrapbookCTA Section
- **File:** `components/scrapbook/ScrapbookCTA.js`
- **Details:**
  - Centered call-to-action with "Visit Our Shop" button
  - Styled consistently with scrapbook aesthetic
  - Links to /products
- **Estimate:** 10 min
- **Status:** ❌ Not Started

### Task 9.8: Assemble Home Page with Scrapbook Sections
- **File:** `pages/Home.js`
- **Details:**
  - Replace existing Home content with scrapbook sections in order:
    ScrapbookHero → OurStory → FeaturedCollection → CraftsmanshipSection → TestimonialsSection → ScrapbookCTA
  - Full-page immersive layout (no sidebar, standard Navbar + Footer)
- **Estimate:** 15 min
- **Status:** ❌ Not Started

---

## Phase 10: Frontend — Account Separation Polish

### Task 10.1: Remove Cart/Shop Access for Admin Users
- **Files:** `components/Navbar.js`, `context/CartContext.js`
- **Details:**
  - Navbar: hide Cart icon, Shop link for admin users
  - CartContext: skip initialization for admin roles (no cart state)
  - If admin navigates to /cart or /orders, redirect to /admin
- **Estimate:** 15 min
- **Status:** ❌ Not Started

### Task 10.2: Create Admin Profile Page
- **File:** `pages/admin/AdminProfile.js`
- **Details:**
  - Display: name, email, role badge, permissions list
  - Edit name (not email/role)
  - Change password form
  - Super admin sees additional info (total users managed)
- **Estimate:** 25 min
- **Status:** ❌ Not Started

### Task 10.3: Update NotificationBell for Admin Context
- **File:** `components/NotificationBell.js`
- **Details:**
  - Admin notifications: order submissions, low stock, user actions
  - Customer notifications: order status updates
  - Same component, different data based on role
  - Click notification → navigate to relevant admin page (or customer page)
- **Estimate:** 15 min
- **Status:** ❌ Not Started

---

## Phase 11: Testing & Verification

### Task 11.1: Backend — Test Permission System
- **Details:**
  - Login as super admin → verify JWT contains all permissions
  - Create staff via API → verify login returns only assigned permissions
  - Staff tries endpoint they lack permission for → expect 403
  - Admin tries cart/order creation → expect 403
  - Customer tries admin endpoint → expect 403
- **Estimate:** 30 min
- **Status:** ❌ Not Started

### Task 11.2: Frontend — Test Role-Based Routing
- **Details:**
  - Login as customer → can access cart, orders, profile; cannot access /admin/*
  - Login as staff → redirected to /admin; can access permitted pages only
  - Login as super admin → can access all admin pages + user management
  - Sidebar shows only permitted items per role
- **Estimate:** 20 min
- **Status:** ❌ Not Started

### Task 11.3: Frontend Build Verification
- **Details:**
  - Run `npx react-scripts build` — fix all errors
  - Fix lint warnings (unused imports, etc.)
  - Verify scrapbook page renders correctly
- **Estimate:** 15 min
- **Status:** ❌ Not Started

---

## Summary

| Phase | Description | Tasks | Est. Total |
|-------|-------------|-------|------------|
| 1 | Permission Model & Role Changes | 1.1–1.7 | ~100 min |
| 2 | Auth/Me Endpoint | 2.1 | ~30 min |
| 3 | Admin User Management Endpoints | 3.1–3.2 | ~90 min |
| 4 | Access Control Enforcement | 4.1–4.3 | ~45 min |
| 5 | Notification Permission-Awareness | 5.1 | ~25 min |
| 6 | Auth / Permission Infrastructure (FE) | 6.1–6.4 | ~75 min |
| 7 | Admin Layout & Sidebar (FE) | 7.1–7.4 | ~120 min |
| 8 | User Management Pages (FE) | 8.1–8.6 | ~140 min |
| 9 | Scrapbook Landing Page (FE) | 9.1–9.8 | ~160 min |
| 10 | Account Separation Polish (FE) | 10.1–10.3 | ~55 min |
| 11 | Testing & Verification | 11.1–11.3 | ~65 min |
| **Total** | | **35 tasks** | **~905 min (~15 hrs)** |
