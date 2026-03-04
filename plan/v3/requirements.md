# V3 Requirements — Admin Dashboard, Inventory, Notifications & API Integration

## Overview

This version introduces the **Admin Dashboard** with full product management (including image uploads), **Inventory Management** with stock tracking, a **Notification Panel** (Facebook-style dropdown), and **full API integration** to replace all hardcoded/mock product data in the frontend.

---

## 1. Admin Dashboard

### 1.1 Admin User Seeding
- A default admin (staff) user must be seeded on application startup.
- **Credentials:**
  - Email: `orlandoprestige@gmail.com`
  - Password: `Orlando@Prestige0304`
- See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md) for documentation.

### 1.2 Admin Pages (Frontend)
- **Dashboard Overview** — summary cards: total products, pending orders, low-stock alerts.
- **Product Management** — CRUD table for products; admin can add/edit/delete products with images.
- **Order Management** — view all pending orders, approve/reject with notes.
- **Inventory Management** — view stock levels, update stock quantities, low-stock indicators.
- **Notification Panel** — dropdown in navbar (FB-style) showing new orders, low-stock alerts, etc.

### 1.3 Access Control
- All admin pages must be behind `ProtectedRoute` with `adminOnly` enforcement.
- Only users with role `ROLE_STAFF` can access admin pages.

---

## 2. Product Image Uploads

### 2.1 Backend
- Products must support one or more images.
- New entity `ProductImage` linked to `Product` (1:N).
- REST endpoint `POST /api/v1/catalog/products/{id}/images` — multipart file upload (staff only).
- REST endpoint `DELETE /api/v1/catalog/products/{id}/images/{imageId}` — remove image (staff only).
- Images served via `GET /api/v1/catalog/products/{id}/images/{imageId}` (public).
- `ProductDto` includes list of image URLs.
- `CreateProductDto` extended (or separate upload step after creation).

### 2.2 Frontend
- Admin product form includes image upload with preview.
- Shop pages display actual product images from backend.

---

## 3. Inventory Management

### 3.1 Backend
- Stock tracked via `Product.stockQuantity` (already exists).
- New endpoint `PATCH /api/v1/catalog/products/{id}/stock` — adjust stock (staff only).
- When an order is approved, stock is decremented (already exists via `decrementStock`).
- Low-stock threshold: configurable, default = 10.

### 3.2 Frontend
- Admin inventory page showing all products with stock levels.
- Color-coded stock indicators (red < 10, yellow 10-25, green > 25).
- Inline stock adjustment.

---

## 4. Notification System

### 4.1 Backend
- New `notifications` module with `Notification` entity.
- Notifications created on events: new order submitted, low stock reached, order evaluated.
- REST endpoints:
  - `GET /api/v1/notifications` — get user's notifications (paginated, newest first).
  - `PATCH /api/v1/notifications/{id}/read` — mark as read.
  - `PATCH /api/v1/notifications/read-all` — mark all as read.
  - `GET /api/v1/notifications/unread-count` — get unread count.

### 4.2 Frontend
- Navbar bell icon with unread count badge.
- Click opens dropdown panel (like Facebook notifications).
- Shows notification text, timestamp, read/unread state.
- "Mark all as read" button.
- Polling every 30 seconds for new notifications (or WebSocket in future).

---

## 5. Full API Integration (Remove Hardcoded Data)

### 5.1 Products
- Remove `src/data/products.js` (hardcoded mock data).
- `ProductList` page fetches from `GET /api/v1/catalog/products`.
- `ProductDetail` page fetches from `GET /api/v1/catalog/products/{id}`.
- Category filtering via `?category=` query param.

### 5.2 Cart
- Replace localStorage cart with backend cart API:
  - `GET /api/v1/cart`
  - `POST /api/v1/cart/items`
  - `PUT /api/v1/cart/items/{productId}`
  - `DELETE /api/v1/cart/items/{productId}`
  - `DELETE /api/v1/cart`

### 5.3 Orders
- Implement order placement via `POST /api/v1/orders`.
- Implement order history via `GET /api/v1/orders/my`.

---

## 6. Bug Fixes Required

- Fix `App.js` importing nonexistent `Dashboard` — should import `Home`.
- Wrap app with `CartProvider` in `App.js`.
- Apply `ProtectedRoute` to authenticated routes (`/cart`, `/orders`, `/profile`).
- Fix `App.test.js` or remove broken test.

---

## Admin Credentials

| Field    | Value                        |
|----------|------------------------------|
| Email    | orlandoprestige@gmail.com    |
| Password | Orlando@Prestige0304         |

> These credentials are seeded automatically on backend startup. See [ADMIN_CREDENTIALS.md](./ADMIN_CREDENTIALS.md).
