# V4 Design — Role-Based Access, Super Admin, Permissions & Scrapbook Landing Page

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          React Frontend                                  │
│                                                                          │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────────┐  ┌─────────┐  │
│  │  Public      │  │  Customer    │  │  Admin (Staff)    │  │ Shared  │  │
│  │  Pages       │  │  Pages       │  │  Pages            │  │         │  │
│  │             │  │              │  │                   │  │ Navbar  │  │
│  │ Home        │  │ Cart         │  │ Dashboard         │  │ Footer  │  │
│  │ (scrapbook) │  │ Orders       │  │ Products CRUD     │  │ Notif   │  │
│  │ Shop        │  │ Profile      │  │ Orders Review     │  │ Bell    │  │
│  │ Product     │  │              │  │ Inventory         │  │ Protect │  │
│  │ Login       │  │              │  │ User Mgmt (SA)    │  │ Route   │  │
│  │ Register    │  │              │  │ Profile           │  │         │  │
│  └─────────────┘  └──────────────┘  └───────────────────┘  └─────────┘  │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │                     Services / Context                              ││
│  │  api.js │ AuthContext │ CartContext │ NotifContext │ PermissionCtx   ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  Role-Based Routing:                                                     │
│    ROLE_CUSTOMER  → /  /products  /cart  /orders  /profile               │
│    ROLE_STAFF     → /admin/*  (only permitted pages)                     │
│    ROLE_SUPER_ADMIN → /admin/*  (all pages + user management)            │
└───────────────────────────────┬──────────────────────────────────────────┘
                                │ REST API (JSON + Multipart)
┌───────────────────────────────┴──────────────────────────────────────────┐
│                       Spring Boot Backend                                │
│                                                                          │
│  Modules: shared │ auth │ catalog │ customers │ cart │ orders │ notifs   │
│                                                                          │
│  ┌──────────────────────────────────────────────────────────────────────┐│
│  │ V4 Changes:                                                         ││
│  │  • Permission entity & StaffPermission join table                   ││
│  │  • ROLE_SUPER_ADMIN role for seeded admin                           ││
│  │  • GET /auth/me endpoint (returns permissions)                      ││
│  │  • Admin user management endpoints (super admin only)               ││
│  │  • JWT includes permissions[] claim                                 ││
│  │  • Cart/order endpoints reject admin roles                          ││
│  └──────────────────────────────────────────────────────────────────────┘│
│                                                                          │
│  PostgreSQL (orlandodb on port 5441)                                     │
│  File storage: /uploads/products/ (local filesystem)                     │
└──────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Design

### 2.1 Permission Model

**New Enum: `Permission`**
```java
public enum Permission {
    VIEW_DASHBOARD,
    MANAGE_PRODUCTS,
    MANAGE_ORDERS,
    MANAGE_INVENTORY,
    MANAGE_USERS,        // Super Admin only
    MANAGE_PERMISSIONS,  // Super Admin only
    CREATE_ADMIN         // Super Admin only
}
```

**New Join Table: `staff_permissions`**
```
staff_permissions
├── staff_id      BIGINT FK → staff(id)
├── permission    VARCHAR NOT NULL
└── PK(staff_id, permission)
```

**Staff Entity Updated:**
```java
@Entity
public class Staff extends SoftDeletableEntity {
    Long id;
    String firstName;
    String lastName;
    String email;
    String passwordHash;
    boolean superAdmin;  // NEW — true only for orlandoprestige@gmail.com

    @ElementCollection(fetch = FetchType.EAGER)
    @CollectionTable(name = "staff_permissions", joinColumns = @JoinColumn(name = "staff_id"))
    @Column(name = "permission")
    @Enumerated(EnumType.STRING)
    Set<Permission> permissions = new HashSet<>();
}
```

**Super Admin Logic:**
- `superAdmin = true` → has ALL permissions implicitly (no need to store in join table).
- Regular staff → only has permissions explicitly granted in `staff_permissions`.
- When checking permissions: `staff.isSuperAdmin() || staff.getPermissions().contains(permission)`.

### 2.2 Role Changes

**Three roles in JWT:**
| Role                | Assigned To                  | JWT `role` claim        |
|---------------------|------------------------------|-------------------------|
| Super Admin         | Seeded admin only            | `ROLE_SUPER_ADMIN`      |
| Staff               | Created by Super Admin       | `ROLE_STAFF`            |
| Customer            | Self-registered users        | `ROLE_CUSTOMER`         |

**Login Flow Update:**
```
AuthService.login(email, password):
  1. Check CustomerFacade → if found → return JWT with ROLE_CUSTOMER
  2. Check StaffRepository → if found:
     a. if staff.isSuperAdmin() → return JWT with ROLE_SUPER_ADMIN + ALL permissions
     b. else → return JWT with ROLE_STAFF + staff.getPermissions()
  3. Exception("Invalid credentials")
```

**JWT Claims Updated:**
```json
{
  "sub": "admin@example.com",
  "userId": 1,
  "role": "ROLE_SUPER_ADMIN",
  "permissions": ["VIEW_DASHBOARD", "MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_INVENTORY", "MANAGE_USERS", "MANAGE_PERMISSIONS", "CREATE_ADMIN"]
}
```

### 2.3 Auth/Me Endpoint

**New endpoint: `GET /api/v1/auth/me`** (authenticated)

Response:
```json
{
  "userId": 1,
  "email": "orlandoprestige@gmail.com",
  "firstName": "Orlando",
  "lastName": "Prestige",
  "role": "ROLE_SUPER_ADMIN",
  "permissions": ["VIEW_DASHBOARD", "MANAGE_PRODUCTS", "MANAGE_ORDERS", "MANAGE_INVENTORY", "MANAGE_USERS", "MANAGE_PERMISSIONS", "CREATE_ADMIN"]
}
```
- For customers: `permissions` is empty array `[]`.
- For staff: `permissions` contains only granted permissions.
- For super admin: `permissions` contains all permissions.

### 2.4 Admin User Management Endpoints

All require `ROLE_SUPER_ADMIN`:

| Method | Path | Description |
|--------|------|-------------|
| GET | `/api/v1/admin/users/customers` | List all customers (paginated) |
| GET | `/api/v1/admin/users/customers/{id}` | Get customer detail |
| DELETE | `/api/v1/admin/users/customers/{id}` | Soft-delete customer |
| GET | `/api/v1/admin/users/staff` | List all staff |
| GET | `/api/v1/admin/users/staff/{id}` | Get staff detail + permissions |
| POST | `/api/v1/admin/users/staff` | Create new staff account |
| PATCH | `/api/v1/admin/users/staff/{id}/permissions` | Update staff permissions |
| DELETE | `/api/v1/admin/users/staff/{id}` | Soft-delete staff |

**Create Staff Request:**
```json
{
  "firstName": "Jane",
  "lastName": "Doe",
  "email": "jane@orlando.com",
  "password": "TempPass@123",
  "permissions": ["MANAGE_PRODUCTS", "VIEW_DASHBOARD"]
}
```

**Update Permissions Request:**
```json
{
  "permissions": ["MANAGE_PRODUCTS", "MANAGE_ORDERS", "VIEW_DASHBOARD"]
}
```

### 2.5 Access Control Enforcement (Backend)

**Cart endpoints** — reject admin roles:
```java
@PreAuthorize("hasRole('CUSTOMER')")
// Applied to: POST/PUT/DELETE /api/v1/cart/**
```

**Order placement** — customer only:
```java
@PreAuthorize("hasRole('CUSTOMER')")
// Applied to: POST /api/v1/orders
```

**Admin endpoints** — check specific permission:
```java
@PreAuthorize("hasRole('SUPER_ADMIN') or hasRole('STAFF') and @permissionChecker.has(#auth, 'MANAGE_PRODUCTS')")
// Applied to product CRUD endpoints
```

**Permission Checker Bean:**
```java
@Component("permissionChecker")
public class PermissionChecker {
    public boolean has(Authentication auth, String permission) {
        // Extract permissions from JWT claims or load from DB
        // Super admin always returns true
    }
}
```

### 2.6 DataSeeder Update

```java
// Seed logic:
Staff admin = new Staff();
admin.setEmail("orlandoprestige@gmail.com");
admin.setPasswordHash(bCrypt.encode("Orlando@Prestige0304"));
admin.setFirstName("Orlando");
admin.setLastName("Prestige");
admin.setSuperAdmin(true);  // NEW
// No need to set permissions — super admin has all implicitly
```

---

## 3. Frontend Design

### 3.1 Routing Structure

```
PUBLIC ROUTES (no auth required):
  /                         → Home — Scrapbook landing page
  /products                 → ProductList / Shop
  /products/:id             → ProductDetail
  /login                    → Login
  /register                 → Register

CUSTOMER ROUTES (ROLE_CUSTOMER only):
  /cart                     → Cart
  /orders                   → Customer Orders
  /profile                  → Customer Profile

ADMIN ROUTES (ROLE_STAFF / ROLE_SUPER_ADMIN with permissions):
  /admin                    → Admin Dashboard     [VIEW_DASHBOARD]
  /admin/products           → Product Management  [MANAGE_PRODUCTS]
  /admin/products/new       → Add Product         [MANAGE_PRODUCTS]
  /admin/products/:id/edit  → Edit Product        [MANAGE_PRODUCTS]
  /admin/orders             → Order Management    [MANAGE_ORDERS]
  /admin/inventory          → Inventory           [MANAGE_INVENTORY]
  /admin/users              → User Management     [Super Admin only]
  /admin/users/customers    → Customer List       [Super Admin only]
  /admin/users/staff        → Staff List          [Super Admin only]
  /admin/users/staff/new    → Create Staff        [Super Admin only]
  /admin/profile            → Admin Profile       [All admin roles]
```

### 3.2 Route Protection Components

**`ProtectedRoute` Updated:**
```jsx
// Props: children, customerOnly, adminOnly, requiredPermission
// Logic:
//   - No user → redirect to /login
//   - customerOnly + admin user → redirect to /admin
//   - adminOnly + customer user → redirect to /
//   - requiredPermission + user lacks it → redirect to /admin (access denied)
//   - superAdmin → always passes permission checks
```

### 3.3 Admin Layout with Sidebar

```
┌─────────────────────────────────────────────────┐
│  Admin Navbar (logo, notif bell, profile menu)  │
├────────────┬────────────────────────────────────┤
│  Sidebar   │                                    │
│            │     Main Content Area              │
│  📊 Dash   │                                    │
│  📦 Prods  │     [Route-dependent content]      │
│  📋 Orders │                                    │
│  📈 Stock  │                                    │
│  👥 Users  │     (only Super Admin)             │
│  ─────     │                                    │
│  👤 Profile│                                    │
│  🚪 Logout │                                    │
│            │                                    │
└────────────┴────────────────────────────────────┘
```

- Sidebar menu items shown **only if** the user has the required permission.
- Super Admin sees all items, regular staff see only permitted items.
- Sidebar collapses to icons on smaller screens.

### 3.4 Admin Navbar (Separate from Customer Navbar)

- No cart icon.
- No shop links (Home, Products).
- Shows: logo, notification bell, profile dropdown (name, logout).
- Minimal — admin focuses on management.

### 3.5 User Management Pages (Super Admin)

**Users Overview (`/admin/users`):**
- Tabs: Customers | Staff
- Search bar, count badges

**Customer List (`/admin/users/customers`):**
- Table: Name, Email, Registered, Orders, Status (Active/Deactivated), Actions
- Actions: View details, Deactivate

**Staff List (`/admin/users/staff`):**
- Table: Name, Email, Permissions (badges), Status, Actions
- Actions: Edit permissions, Deactivate
- "Create Staff Account" button

**Create Staff (`/admin/users/staff/new`):**
- Form: First Name, Last Name, Email, Temporary Password
- Permission checkboxes: ☑ View Dashboard, ☑ Manage Products, ☐ Manage Orders, ☐ Manage Inventory

**Edit Staff Permissions:**
- Modal or inline: Permission checkboxes
- Save → PATCH `/admin/users/staff/{id}/permissions`

### 3.6 Login Flow Changes

```
After successful login:
  if (role === 'ROLE_CUSTOMER') {
    navigate(redirectParam || '/');
  } else {
    // ROLE_STAFF or ROLE_SUPER_ADMIN
    navigate('/admin');
  }
```

### 3.7 AuthContext Enhancement

```javascript
// State: { user: { token, role, userId, email, firstName, permissions[] } }
// On login:
//   1. POST /auth/login → get { token, role, userId }
//   2. GET /auth/me → get { email, firstName, lastName, permissions }
//   3. Store merged data in state + localStorage
// Helper: hasPermission(permissionKey) → boolean
//   - superAdmin (ROLE_SUPER_ADMIN) → always true
//   - staff → check permissions array
//   - customer → always false
```

---

## 4. Scrapbook Landing Page Design

### 4.1 Visual Concept

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│     ╔═══════════════════════════════════════╗           │
│     ║                                       ║ ← tape   │
│     ║    O R L A N D O  P R E S T I G E     ║           │
│     ║                                       ║           │
│     ║    "Where every piece tells a story"  ║           │
│     ╚═══════════════════════════════════════╝           │
│                                                        │
│  ┌──────────────┐                                      │  ← kraft paper bg
│  │  📸 Polaroid  │  ── Our Story ──                    │
│  │  (founder)   │  "It all began with a passion       │
│  │              │   for craftsmanship..."              │
│  └──────────────┘                                      │
│                                                        │
│    ┌────┐  ┌────┐  ┌────┐  ┌────┐                      │  ← Featured pinned
│    │ 📸 │  │ 📸 │  │ 📸 │  │ 📸 │   "Our Collection"  │     polaroids
│    └────┘  └────┘  └────┘  └────┘                      │
│                                                        │
│  ── Craftsmanship ──                                   │
│  Close-up images with overlay text                     │
│                                                        │
│  ┌─────────────────────────────────────────┐           │  ← Postcard styled
│  │ "Amazing quality!" — Customer Jane      │           │     testimonials
│  └─────────────────────────────────────────┘           │
│                                                        │
│  ╔═════════════════════════════════════════╗            │
│  ║      [ Visit Our Shop → ]               ║           │  ← CTA
│  ╚═════════════════════════════════════════╝            │
│                                                        │
│  ── Footer ──                                          │
└────────────────────────────────────────────────────────┘
```

### 4.2 Component Breakdown

| Component | Description |
|-----------|-------------|
| `ScrapbookHero` | Full-width hero with textured background, brand name in serif + script, tagline, decorative tape/stamp elements |
| `OurStory` | Alternating text + polaroid-framed images telling the company narrative |
| `FeaturedCollection` | Product cards styled as polaroids pinned/taped to a cork or kraft background. Fetches 4-6 featured products from API |
| `CraftsmanshipSection` | Full-bleed images with overlaid text on materials, quality, process |
| `TestimonialsSection` | Customer quotes in handwritten font, styled as postcards or notes |
| `ScrapbookCTA` | Centered call-to-action with "Visit Our Shop" button |

### 4.3 CSS / Styling Approach
- **Fonts:** Keep existing serif font for headings + add a handwritten/script Google Font (e.g., `Caveat` or `Dancing Script`) for accent text.
- **Textures:** CSS background images for kraft paper, linen textures (small optimized assets in `/public/textures/`).
- **Decorations:** CSS pseudo-elements and small SVG/PNG assets for tape, paper clips, torn edges.
- **Polaroid frames:** CSS-only with white padding, slight rotation, and box-shadow.
- **Animations:** Subtle `IntersectionObserver`-based fade-in/slide-in on scroll.
- **Colors:** Extend Tailwind config with scrapbook palette: `kraft`, `linen`, `terracotta`, `aged-paper`.

---

## 5. Notification System Updates

### 5.1 Permission-Aware Delivery

| Notification Type      | Delivered To                              |
|------------------------|-------------------------------------------|
| `ORDER_SUBMITTED`      | Staff with `MANAGE_ORDERS` + Super Admin  |
| `ORDER_APPROVED/REJECTED` | The customer who placed the order      |
| `LOW_STOCK`            | Staff with `MANAGE_INVENTORY` + Super Admin |

**Backend Change:**
- `NotificationService.createStaffBroadcast()` → now checks staff permissions before creating notifications.
- Super Admin always receives all notification types.

---

## 6. Data Flow / Sequence Diagrams

### 6.1 Admin Login Flow
```
Admin → POST /auth/login { email, password }
  ← { token, role: "ROLE_SUPER_ADMIN", userId: 1 }
Admin → GET /auth/me (with Bearer token)
  ← { userId, email, firstName, lastName, role, permissions: [...] }
Frontend stores: { token, role, userId, permissions }
Frontend redirects to /admin
```

### 6.2 Super Admin Creates Staff
```
Super Admin → POST /admin/users/staff
  { firstName, lastName, email, password, permissions: ["MANAGE_PRODUCTS", "VIEW_DASHBOARD"] }
  ← 201 Created { id: 5, ... }
  → Staff row created with permissions in join table
  → New staff can login and see only Products + Dashboard
```

### 6.3 Permission Check on Page Load
```
Staff visits /admin/orders
  → Frontend checks: user.permissions.includes('MANAGE_ORDERS')
  → If no: redirect to /admin (or show "Access Denied")
  → If yes: render AdminOrders, call GET /api/v1/orders (backend also checks permission)
```
