# V3 Design — Admin Dashboard, Inventory, Notifications & API Integration

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        React Frontend                           │
│                                                                 │
│  ┌──────────┐  ┌──────────────┐  ┌──────────┐  ┌────────────┐  │
│  │  Public   │  │   Customer   │  │  Admin    │  │ Shared     │  │
│  │  Pages    │  │   Pages      │  │  Pages    │  │ Components │  │
│  │          │  │              │  │           │  │            │  │
│  │ Home     │  │ Cart         │  │ Dashboard │  │ Navbar     │  │
│  │ Shop     │  │ Orders       │  │ Products  │  │ Footer     │  │
│  │ Product  │  │ Profile      │  │ Orders    │  │ Notif Bell │  │
│  │ Login    │  │              │  │ Inventory │  │ Protected  │  │
│  │ Register │  │              │  │           │  │ Route      │  │
│  └──────────┘  └──────────────┘  └──────────┘  └────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────────┐│
│  │                    Services / Context                       ││
│  │  api.js  │  AuthContext  │  CartContext  │  NotifContext    ││
│  └─────────────────────────────────────────────────────────────┘│
└────────────────────────────┬────────────────────────────────────┘
                             │ REST API (JSON + Multipart)
┌────────────────────────────┴────────────────────────────────────┐
│                    Spring Boot Backend                           │
│                                                                 │
│  Modules: auth │ catalog │ customers │ cart │ orders │ notifs   │
│                                                                 │
│  ┌────────────────────────────────────────────────────────────┐ │
│  │ New: notifications module + ProductImage entity + Seeder   │ │
│  └────────────────────────────────────────────────────────────┘ │
│                                                                 │
│  PostgreSQL (orlandodb on port 5441)                            │
│  File storage: /uploads/products/ (local filesystem)            │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Backend Design

### 2.1 Admin Seed (`DataSeeder`)
- `ApplicationRunner` bean that runs on startup.
- Checks if `orlandoprestige@gmail.com` exists in `staff` table.
- If not, inserts with BCrypt-hashed password.
- Idempotent — safe to run multiple times.

### 2.2 Product Images

**New Entity: `ProductImage`**
```
product_images
├── id            BIGSERIAL PK
├── product_id    BIGINT FK → products
├── filename      VARCHAR NOT NULL
├── content_type  VARCHAR NOT NULL
├── file_path     VARCHAR NOT NULL
├── display_order INT DEFAULT 0
└── created_at    TIMESTAMP
```

**Storage Strategy:**
- Images stored on local filesystem under `uploads/products/{productId}/`.
- Served via a dedicated controller endpoint (public).
- Max file size: 5MB per image.
- Allowed types: JPEG, PNG, WebP.

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/api/v1/catalog/products/{id}/images` | STAFF | Upload image (multipart) |
| GET | `/api/v1/catalog/products/{id}/images/{imageId}` | Public | Serve image file |
| DELETE | `/api/v1/catalog/products/{id}/images/{imageId}` | STAFF | Delete image |

**`ProductDto` Updated:**
```json
{
  "id": 1,
  "name": "Leather Bag",
  "description": "...",
  "sku": "LB-001",
  "price": 299.99,
  "stockQuantity": 50,
  "category": "Bags",
  "images": [
    { "id": 1, "url": "/api/v1/catalog/products/1/images/1", "displayOrder": 0 }
  ]
}
```

### 2.3 Inventory Stock Endpoint

**New Endpoint:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| PATCH | `/api/v1/catalog/products/{id}/stock` | STAFF | Adjust stock quantity |

**Request Body:**
```json
{ "adjustment": 25 }
```
Positive = add stock, negative = remove stock. Validates resulting quantity >= 0.

### 2.4 Notification Module

**Entity: `Notification`**
```
notifications
├── id            BIGSERIAL PK
├── user_id       BIGINT NOT NULL
├── user_role     VARCHAR NOT NULL   -- STAFF or CUSTOMER
├── type          VARCHAR NOT NULL   -- NEW_ORDER, LOW_STOCK, ORDER_EVALUATED
├── title         VARCHAR NOT NULL
├── message       TEXT NOT NULL
├── is_read       BOOLEAN DEFAULT FALSE
├── reference_id  BIGINT             -- order ID or product ID
├── created_at    TIMESTAMP
```

**Endpoints:**
| Method | Path | Auth | Description |
|--------|------|------|-------------|
| GET | `/api/v1/notifications` | Auth'd | Get notifications (newest first) |
| GET | `/api/v1/notifications/unread-count` | Auth'd | Get unread count |
| PATCH | `/api/v1/notifications/{id}/read` | Auth'd | Mark single as read |
| PATCH | `/api/v1/notifications/read-all` | Auth'd | Mark all as read |

**Event-Driven Creation:**
- `OrderSubmittedEvent` → Create notification for all staff ("New order #X from Customer Y")
- `OrderEvaluatedEvent` → Create notification for customer ("Your order #X was approved/rejected")
- `LowStockEvent` → Create notification for all staff ("Product X is low on stock (N remaining)")
  - Triggered when stock drops below threshold (default: 10) after order approval.

---

## 3. Frontend Design

### 3.1 Routing Structure

```
/                       → Home (public)
/products               → ProductList / Shop (public)
/products/:id           → ProductDetail (public)
/login                  → Login (public)
/register               → Register (public)
/cart                   → Cart (customer, protected)
/orders                 → Orders (customer, protected)
/profile                → Profile (customer, protected)
/admin                  → Admin Dashboard (staff, protected)
/admin/products         → Admin Product Management (staff, protected)
/admin/products/new     → Admin Add Product (staff, protected)
/admin/products/:id/edit→ Admin Edit Product (staff, protected)
/admin/orders           → Admin Order Management (staff, protected)
/admin/inventory        → Admin Inventory (staff, protected)
```

### 3.2 Admin Layout

Admin pages use a sidebar layout:
```
┌────────────────────────────────────────────┐
│  Navbar (with notification bell)           │
├──────────┬─────────────────────────────────┤
│ Sidebar  │  Main Content Area              │
│          │                                 │
│ Dashboard│  [Dynamic based on route]       │
│ Products │                                 │
│ Orders   │                                 │
│ Inventory│                                 │
│          │                                 │
│          │                                 │
└──────────┴─────────────────────────────────┘
```

### 3.3 Admin Dashboard Page
- Summary cards:
  - Total Products (count)
  - Pending Orders (count)
  - Low Stock Alerts (count of products with stock < 10)
  - Total Revenue (sum of approved orders)
- Recent orders table (last 5 pending)
- Quick-action buttons: "Add Product", "View Orders"

### 3.4 Admin Product Management
- Table with columns: Image thumbnail, Name, SKU, Price, Stock, Category, Actions
- Actions: Edit, Delete
- "Add Product" button → form with:
  - Name, Description, SKU, Price, Stock Quantity, Category
  - Image upload (drag-and-drop or file picker, multiple images, preview)
- Edit form: same fields, pre-populated, can add/remove images

### 3.5 Admin Order Management
- Table: Order ID, Customer, Items, Total, Status, Date, Actions
- Actions: View details, Approve (with optional note), Reject (with required note)
- Filter by status (Pending, Approved, Rejected)

### 3.6 Admin Inventory
- Table: Product, SKU, Category, Current Stock, Status
- Status badges: "In Stock" (green, >25), "Low Stock" (yellow, 10-25), "Critical" (red, <10)
- Inline stock adjustment: +/- buttons or input field
- Search/filter by name, category, stock status

### 3.7 Notification Panel (Navbar)
- Bell icon in navbar with unread count badge (red circle)
- Click → dropdown panel (max-height scrollable)
- Each notification: icon, title, message, relative timestamp, read/unread indicator
- "Mark all as read" link at top
- Click notification → navigate to relevant page (order detail, product, etc.)
- Polls `GET /notifications/unread-count` every 30 seconds
- Full list fetched on dropdown open

### 3.8 Cart Context → API-Backed
- Replace localStorage `CartContext` with API-backed operations:
  - `fetchCart()` → `GET /api/v1/cart`
  - `addItem(productId, quantity)` → `POST /api/v1/cart/items`
  - `updateItem(productId, quantity)` → `PUT /api/v1/cart/items/{productId}`
  - `removeItem(productId)` → `DELETE /api/v1/cart/items/{productId}`
  - `clearCart()` → `DELETE /api/v1/cart`
- Fallback to localStorage for guest users (not logged in).

---

## 4. Data Flow Diagrams

### 4.1 Admin Adds Product with Image
```
Admin → [Product Form] → POST /catalog/products (JSON)
                        → Response: { id: 5, ... }
Admin → [Image Upload]  → POST /catalog/products/5/images (multipart)
                        → Response: { id: 1, url: "/api/v1/catalog/products/5/images/1" }
```

### 4.2 Order Lifecycle with Notifications
```
Customer → POST /orders (submit from cart)
  → Order created (PENDING_EVALUATION)
  → OrderSubmittedEvent published
  → Notification created for ALL staff users
  → Staff sees bell badge increment

Staff → PATCH /orders/{id}/evaluate { approved: true }
  → Order status → APPROVED
  → Stock decremented
  → If stock < threshold → LowStockEvent → Notification for staff
  → OrderEvaluatedEvent → Notification for customer
```

### 4.3 Notification Polling
```
Frontend (every 30s) → GET /notifications/unread-count
  → Response: { count: 3 }
  → Update bell badge

User clicks bell → GET /notifications
  → Response: [ { id, type, title, message, isRead, createdAt, referenceId }, ... ]
  → Render dropdown list
```
