# V3 Tasks — Admin Dashboard, Inventory, Notifications & API Integration

> Each task is sequenced by dependency. Backend tasks first, then frontend.

---

## Phase 1: Backend Foundation

### Task 1.1 — Seed Admin User
- [ ] Create `DataSeeder.java` (`ApplicationRunner`) in `auth.internal.service`
- [ ] On startup, check if `orlandoprestige@gmail.com` exists in `StaffRepository`
- [ ] If not, create Staff with BCrypt-hashed password `Orlando@Prestige0304`
- [ ] Create `ADMIN_CREDENTIALS.md` in `plan/v3/`
- **Files:** `DataSeeder.java`, `ADMIN_CREDENTIALS.md`

### Task 1.2 — Product Image Entity & Upload
- [ ] Create `ProductImage.java` entity (id, product_id FK, filename, contentType, filePath, displayOrder, createdAt)
- [ ] Create `ProductImageRepository.java`
- [ ] Add `@OneToMany List<ProductImage> images` to `Product.java`
- [ ] Add file upload config in `application.properties` (`spring.servlet.multipart.max-file-size=5MB`)
- [ ] Create `ProductImageService.java` (save image to `uploads/products/{id}/`, CRUD)
- [ ] Add endpoints to `ProductController`:
  - `POST /{id}/images` (multipart, STAFF)
  - `GET /{id}/images/{imageId}` (public, serves file)
  - `DELETE /{id}/images/{imageId}` (STAFF)
- [ ] Update `ProductDto` to include `List<ImageDto>` with URLs
- [ ] Update `SecurityConfig` to permit `GET /api/v1/catalog/products/*/images/*`
- **Files:** `ProductImage.java`, `ProductImageRepository.java`, `ProductImageService.java`, `Product.java`, `ProductController.java`, `ProductDto.java`, `SecurityConfig.java`, `application.properties`

### Task 1.3 — Stock Adjustment Endpoint
- [ ] Add `PATCH /api/v1/catalog/products/{id}/stock` to `ProductController`
- [ ] Request body: `{ "adjustment": int }` — `StockAdjustmentDto.java`
- [ ] Validate resulting stock >= 0
- [ ] Return updated `ProductDto`
- **Files:** `StockAdjustmentDto.java`, `ProductController.java`, `ProductService.java`

### Task 1.4 — Notification Module
- [ ] Create package `notifications` (following Spring Modulith convention)
- [ ] Create `Notification.java` entity
- [ ] Create `NotificationRepository.java`
- [ ] Create `NotificationService.java`
- [ ] Create `NotificationController.java` with endpoints:
  - `GET /api/v1/notifications` (authenticated)
  - `GET /api/v1/notifications/unread-count` (authenticated)
  - `PATCH /api/v1/notifications/{id}/read` (authenticated)
  - `PATCH /api/v1/notifications/read-all` (authenticated)
- [ ] Create `NotificationDto.java`
- [ ] Create event listeners:
  - Listen for `OrderSubmittedEvent` → notify all staff
  - Listen for order evaluation → notify customer
  - Listen for low stock → notify all staff
- [ ] Create `OrderEvaluatedEvent.java` in orders module
- [ ] Publish `OrderEvaluatedEvent` from `OrderService.evaluateOrder()`
- [ ] Update `SecurityConfig` to permit notification endpoints for authenticated users
- **Files:** `package-info.java`, `Notification.java`, `NotificationRepository.java`, `NotificationService.java`, `NotificationController.java`, `NotificationDto.java`, `NotificationEventListener.java`, `OrderEvaluatedEvent.java`

---

## Phase 2: Frontend Bug Fixes

### Task 2.1 — Fix Critical Bugs
- [ ] Fix `App.js`: import `Home` instead of `Dashboard`, rename route
- [ ] Wrap app with `CartProvider` in `App.js`
- [ ] Apply `ProtectedRoute` to `/cart`, `/orders`, `/profile` routes
- [ ] Apply `ProtectedRoute` with `adminOnly` to `/admin/*` routes
- [ ] Delete or fix `App.test.js`
- **Files:** `App.js`, `App.test.js`

---

## Phase 3: Frontend API Integration

### Task 3.1 — Product API Integration
- [ ] Delete `src/data/products.js` (hardcoded mock data)
- [ ] Create `src/services/productService.js` with functions:
  - `getProducts(category?)` → `GET /catalog/products`
  - `getProductById(id)` → `GET /catalog/products/{id}`
- [ ] Rewrite `ProductList.js` — fetch from API, display grid with images, category filter
- [ ] Update `ProductDetail.js` — fetch from API instead of mock data, display real images
- [ ] Update `Home.js` — featured products fetched from API
- **Files:** `productService.js`, `ProductList.js`, `ProductDetail.js`, `Home.js`

### Task 3.2 — Cart API Integration
- [ ] Create `src/services/cartService.js` with functions:
  - `getCart()`, `addItem(productId, qty)`, `updateItem(productId, qty)`, `removeItem(productId)`, `clearCart()`
- [ ] Update `CartContext.js` to use API when logged in, fallback to localStorage when guest
- [ ] Update `Cart.js` to use new context
- **Files:** `cartService.js`, `CartContext.js`, `Cart.js`

### Task 3.3 — Order API Integration
- [ ] Create `src/services/orderService.js`:
  - `submitOrder()`, `getMyOrders()`, `getAllPendingOrders()`, `evaluateOrder(id, approved, note)`
- [ ] Update `Orders.js` — fetch real orders from API
- [ ] Add checkout flow in `Cart.js` → call `submitOrder()` instead of `alert()`
- **Files:** `orderService.js`, `Orders.js`, `Cart.js`

---

## Phase 4: Admin Frontend

### Task 4.1 — Admin Layout & Dashboard
- [ ] Create `src/components/AdminSidebar.js` (sidebar nav for admin pages)
- [ ] Create `src/components/AdminLayout.js` (sidebar + main content area)
- [ ] Create `src/pages/admin/AdminDashboard.js` — summary cards, recent orders
- [ ] Create `src/services/adminService.js` — aggregation calls for dashboard stats
- **Files:** `AdminSidebar.js`, `AdminLayout.js`, `AdminDashboard.js`, `adminService.js`

### Task 4.2 — Admin Product Management
- [ ] Create `src/pages/admin/AdminProducts.js` — product table with CRUD actions
- [ ] Create `src/pages/admin/AdminProductForm.js` — add/edit product form with image upload
- [ ] Create `src/services/productAdminService.js`:
  - `createProduct(data)`, `updateProduct(id, data)`, `deleteProduct(id)`
  - `uploadProductImage(productId, file)`, `deleteProductImage(productId, imageId)`
- **Files:** `AdminProducts.js`, `AdminProductForm.js`, `productAdminService.js`

### Task 4.3 — Admin Order Management
- [ ] Create `src/pages/admin/AdminOrders.js` — order table with approve/reject actions
- [ ] Reuse `orderService.js` for API calls
- **Files:** `AdminOrders.js`

### Task 4.4 — Admin Inventory Management
- [ ] Create `src/pages/admin/AdminInventory.js` — inventory table with stock levels
- [ ] Create `src/services/inventoryService.js`:
  - `adjustStock(productId, adjustment)`
- [ ] Color-coded stock badges, inline adjustment controls
- **Files:** `AdminInventory.js`, `inventoryService.js`

---

## Phase 5: Notification System (Frontend)

### Task 5.1 — Notification Context & Service
- [ ] Create `src/services/notificationService.js`:
  - `getNotifications()`, `getUnreadCount()`, `markAsRead(id)`, `markAllAsRead()`
- [ ] Create `src/context/NotificationContext.js` — polls unread count every 30s
- **Files:** `notificationService.js`, `NotificationContext.js`

### Task 5.2 — Notification Bell & Dropdown
- [ ] Create `src/components/NotificationBell.js` — bell icon with badge count
- [ ] Create `src/components/NotificationPanel.js` — dropdown list of notifications
- [ ] Integrate into `Navbar.js`
- [ ] Wrap app with `NotificationProvider` in `App.js`
- **Files:** `NotificationBell.js`, `NotificationPanel.js`, `Navbar.js`, `App.js`

---

## Phase 6: Routing & Integration

### Task 6.1 — Wire All Routes in App.js
- [ ] Add admin routes under `/admin/*` with `ProtectedRoute adminOnly`
- [ ] Wrap with `AdminLayout` for admin pages
- [ ] Wrap with `NotificationProvider`
- [ ] Final route table matches design doc
- **Files:** `App.js`

---

## Execution Order

1. **1.1** → Seed admin user (backend)
2. **1.2** → Product images (backend)
3. **1.3** → Stock adjustment endpoint (backend)
4. **1.4** → Notification module (backend)
5. **2.1** → Fix frontend bugs
6. **3.1** → Product API integration
7. **3.2** → Cart API integration
8. **3.3** → Order API integration
9. **4.1** → Admin layout & dashboard
10. **4.2** → Admin product management
11. **4.3** → Admin order management
12. **4.4** → Admin inventory
13. **5.1** → Notification context & service
14. **5.2** → Notification bell & dropdown
15. **6.1** → Wire all routes
