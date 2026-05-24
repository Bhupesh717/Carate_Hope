# Laravel Backend API & Database Specification

This document provides a detailed specification for developing the Laravel 11 backend for the **CarateHope** application. It aligns with the Next.js frontend admin layout and types, specifying the database schema, relational models, API endpoints, file uploads, and includes a master prompt for AI-driven Laravel generation.

---

## 1. Database Schema & Migrations

Below are the database table definitions aligned with the frontend types: `AdminUser`, `Banner`, `AdminCategory`, `AdminProduct`, `Coupon`, `Order`, `OrderItem`, and `AppUser`.

### A. `admins` (Admin Users)
Stores credential details of store administrators.
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `name`: `string`
  * `email`: `string` (Unique, Index)
  * `password`: `string` (Hashed)
  * `role`: `enum('admin', 'super_admin')` (Default: `'admin'`)
  * `avatar`: `string` (Nullable)
  * `created_at` / `updated_at`: `timestamps`

### B. `banners` (Homepage Slides)
Stores banners shown on the main page slider.
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `image`: `mediumText` / `string` (Stores uploaded image URL path or base64 if needed)
  * `badge`: `string` (Nullable, e.g. "SUMMER SALE")
  * `title`: `string`
  * `description`: `text` (Nullable)
  * `status`: `enum('active', 'inactive')` (Default: `'active'`)
  * `created_at` / `updated_at`: `timestamps`

### C. `categories` (Product Categories)
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `name`: `string`
  * `slug`: `string` (Unique, Index)
  * `image`: `string` (Nullable)
  * `description`: `text` (Nullable)
  * `parent_id`: `unsignedBigInteger` (Nullable, Foreign Key referencing `categories.id` with `onDelete('cascade')`)
  * `status`: `enum('active', 'inactive')` (Default: `'active'`)
  * `created_at` / `updated_at`: `timestamps`

### D. `products` (Jewelry Products)
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `name`: `string`
  * `sku`: `string` (Unique, Index)
  * `category_id`: `unsignedBigInteger` (Foreign Key referencing `categories.id`, `onDelete('restrict')`)
  * `price`: `decimal(12,2)` (Store price in rupees)
  * `discount_price`: `decimal(12,2)` (Nullable)
  * `stock_qty`: `integer` (Default: `0`)
  * `description`: `text` (Nullable)
  * `is_featured`: `boolean` (Default: `false`)
  * `status`: `enum('active', 'inactive')` (Default: `'active'`)
  * `created_at` / `updated_at`: `timestamps`

### E. `product_images` (Product Images Gallery)
Supports multiple image uploads per product (Max 5 recommended).
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `product_id`: `unsignedBigInteger` (Foreign Key referencing `products.id` with `onDelete('cascade')`)
  * `image_path`: `string` (URL or file system path)
  * `is_primary`: `boolean` (Default: `false`, sets primary cover image)
  * `created_at` / `updated_at`: `timestamps`

### F. `coupons` (Discount Codes)
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `code`: `string` (Unique, Index, e.g. "GOLD25")
  * `discount_type`: `enum('percentage', 'fixed')` (Default: `'percentage'`)
  * `discount_value`: `decimal(10,2)`
  * `expiry_date`: `dateTime`
  * `usage_limit`: `integer` (Default: `100`)
  * `usage_count`: `integer` (Default: `0`)
  * `status`: `enum('active', 'inactive')` (Default: `'active'`)
  * `created_at` / `updated_at`: `timestamps`

### G. `users` (App Registered Customers)
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `name`: `string`
  * `email`: `string` (Unique, Index)
  * `password`: `string` (Hashed, Nullable for guest purchases)
  * `phone`: `string` (Nullable)
  * `avatar`: `string` (Nullable)
  * `status`: `enum('active', 'inactive')` (Default: `'active'`)
  * `created_at` / `updated_at`: `timestamps`

### H. `orders` (Checkout Placements)
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `user_id`: `unsignedBigInteger` (Nullable, Foreign Key referencing `users.id`, `onDelete('set null')`)
  * `customer_name`: `string` (Snapshotted name at time of order)
  * `customer_email`: `string`
  * `customer_phone`: `string`
  * `total_amount`: `decimal(12,2)`
  * `payment_status`: `enum('paid', 'unpaid', 'refunded')` (Default: `'unpaid'`)
  * `order_status`: `enum('pending', 'processing', 'shipped', 'delivered', 'cancelled')` (Default: `'pending'`)
  * `created_at` / `updated_at`: `timestamps`

### I. `order_items` (Ordered Products Snapshot)
* **Fields:**
  * `id`: `unsignedBigInteger` (Primary Key, Auto-Increment)
  * `order_id`: `unsignedBigInteger` (Foreign Key referencing `orders.id` with `onDelete('cascade')`)
  * `product_id`: `unsignedBigInteger` (Nullable, Foreign Key referencing `products.id`, `onDelete('set null')`)
  * `product_name`: `string` (Snapshot of product name)
  * `product_image`: `string` (Snapshot of product cover image)
  * `quantity`: `integer` (Default: `1`)
  * `price`: `decimal(12,2)` (Price at purchase time)
  * `created_at` / `updated_at`: `timestamps`

---

## 2. API Endpoints Specification

All JSON API routes must be prefixed with `/api` and return standardized envelopes:
```json
{
  "success": true,
  "data": { ... }
}
```

### A. Admin Authentication & Profiles (Sanctum Protected)
* `POST /api/admin/login` (Public)
  * **Payload:** `{"email": "admin@example.com", "password": "..."}`
  * **Response:** Returns API Token (`token`) and user object (`{id, name, email, role, avatar}`).
* `POST /api/admin/logout` (Protected)
  * **Response:** `{"success": true, "message": "Tokens revoked"}`
* `GET /api/admin/me` (Protected)
  * **Response:** Returns current authenticated admin profile data.

### B. Admin Dashboard Statistics
* `GET /api/admin/dashboard/stats` (Protected)
  * **Response:** Returns data counting counts for active products, categories, orders, users, coupons, and total revenue. Also includes monthly revenue datasets and order status distributions for charts.

### C. Admin CRUD Routes (Sanctum Protected)
All CRUD resources must support: List, Show, Create, Update, Delete, and a separate Toggle-Status route (PATCH).

#### 1. Banners (`/api/admin/banners`)
* `GET /` -> List all banners sorted by `created_at` desc.
* `POST /` -> Create banner. Accepts base64 image strings (saves to storage and writes public path). Defaults status to `active`.
* `PUT /{id}` -> Update banner details.
* `DELETE /{id}` -> Remove banner.
* `PATCH /{id}/toggle-status` -> Toggles status field between `'active'` and `'inactive'`.

#### 2. Categories (`/api/admin/categories`)
* `GET /` -> List categories.
* `POST /` -> Create category. Auto-slugifies the category name. Status defaults to `'active'`.
* `PUT /{id}` -> Update category.
* `DELETE /{id}` -> Delete category.
* `PATCH /{id}/toggle-status` -> Toggles status.

#### 3. Products (`/api/admin/products`)
* `GET /` -> List products with category relations.
* `POST /` -> Create product. Expects `images` array (handles base64 file processing, designating `images[0]` as `is_primary`). Status defaults to `'active'`.
* `PUT /{id}` -> Update product details & primary/gallery images list.
* `DELETE /{id}` -> Remove product.
* `PATCH /{id}/toggle-status` -> Toggles active/inactive.
* `PATCH /{id}/toggle-featured` -> Toggles `is_featured` boolean.

#### 4. Coupons (`/api/admin/coupons`)
* `GET /` -> List coupons.
* `POST /` -> Create coupon. Capitalizes coupon code. Status defaults to `'active'`.
* `PUT /{id}` -> Update coupon.
* `DELETE /{id}` -> Delete coupon.
* `PATCH /{id}/toggle-status` -> Toggles status.

#### 5. Orders (`/api/admin/orders`)
* `GET /` -> List orders.
* `GET /{id}` -> View order details including child items list.
* `PATCH /{id}/status` -> Expects `{"status": "processing"}` to update order status.

#### 6. Users/Customers (`/api/admin/users`)
* `GET /` -> List users with calculated aggregations `orderCount` and `totalSpent` (sum of paid orders).
* `PATCH /{id}/toggle-status` -> Toggles customer account status.
* `DELETE /{id}` -> Deletes user profile.

### D. Public/Frontend Endpoints (Public APIs)
* `GET /api/public/banners` -> Returns all active banners (`status = 'active'`).
* `GET /api/public/categories` -> Returns all active categories.
* `GET /api/public/products` -> Paginated active products. Query parameters: `category_id`, `search` (by SKU or Name), `featured=true`, `sort_by` (`price_asc`, `price_desc`, `newest`).
* `GET /api/public/products/{slug_or_id}` -> Fetches details of a single product with gallery images.
* `POST /api/public/coupons/validate` -> Validates a coupon. Expects `{"code": "..."}`. Returns coupon details (discount amount, type) if active and expiry date is valid.
* `POST /api/public/orders/checkout` -> Places order. Expects customer info, items array (`[{product_id, quantity}]`), discount code. Updates product inventory stocks, applies discount, creates order, and returns Order ID.

---

## 3. Base64 Upload Helper (Laravel Implementation)

Since the frontend uploads images as base64 data URLs (e.g. `data:image/png;base64,...`), here is a standard Laravel helper to handle storage conversion:

```php
namespace App\Helpers;

use Illuminate\Support\Str;
use Illuminate\Support\Facades\Storage;

class ImageHelper
{
    public static function uploadBase64($base64String, $folder = 'uploads')
    {
        if (preg_match('/^data:image\/(\w+);base64,/', $base64String, $type)) {
            // Grab base64 data and extension
            $data = substr($base64String, strpos($base64String, ',') + 1);
            $ext = strtolower($type[1]); // png, jpg, jpeg, gif
            
            if (!in_array($ext, ['jpg', 'jpeg', 'png', 'gif', 'svg'])) {
                throw new \Exception('Invalid image type.');
            }
            
            $data = base64_decode($data);
            if ($data === false) {
                throw new \Exception('Base64 decode failed.');
            }
            
            $filename = Str::random(20) . '.' . $ext;
            $path = "$folder/$filename";
            
            Storage::disk('public')->put($path, $data);
            
            // Return public URL path
            return Storage::disk('public')->url($path);
        }
        
        // If it is already a URL string, return it as-is
        return $base64String;
    }
}
```

---

## 4. Master Laravel Codebase Generator Prompt

Copy the prompt below to generate your Laravel backend code automatically using any AI model:

```text
You are an expert Laravel developer. Build a complete Laravel 11 REST API backend for the "CarateHope" e-commerce application based on the following specifications.

### Project Settings
- Language: PHP 8.2+
- Framework: Laravel 11 (api skeleton)
- Database: MySQL
- Auth: Laravel Sanctum for API token authentication
- Code Standards: Single Responsibility, service/repository patterns where useful, and standard Laravel Controllers.

### 1. Database Migrations
Create migrations with appropriate datatypes, unique keys, nullability, cascading options, and indexes:
- `admins` (id, name, email unique, password, role: enum('admin', 'super_admin') default 'admin', avatar, timestamps)
- `banners` (id, image text, badge string nullable, title, description text nullable, status: enum('active', 'inactive') default 'active', timestamps)
- `categories` (id, name, slug unique, image nullable, description text nullable, parent_id nullable references categories.id with cascade, status: enum('active', 'inactive') default 'active', timestamps)
- `products` (id, name, sku unique, category_id references categories.id with restrict, price decimal(12,2), discount_price decimal(12,2) nullable, stock_qty integer default 0, description text nullable, is_featured boolean default false, status: enum('active', 'inactive') default 'active', timestamps)
- `product_images` (id, product_id references products.id with cascade, image_path, is_primary boolean default false, timestamps)
- `coupons` (id, code unique, discount_type enum('percentage', 'fixed') default 'percentage', discount_value decimal(10,2), expiry_date datetime, usage_limit integer default 100, usage_count integer default 0, status: enum('active', 'inactive') default 'active', timestamps)
- `users` (id, name, email unique, password nullable, phone nullable, avatar nullable, status: enum('active', 'inactive') default 'active', timestamps)
- `orders` (id, user_id nullable references users.id with set null, customer_name, customer_email, customer_phone, total_amount decimal(12,2), payment_status enum('paid', 'unpaid', 'refunded') default 'unpaid', order_status enum('pending', 'processing', 'shipped', 'delivered', 'cancelled') default 'pending', timestamps)
- `order_items` (id, order_id references orders.id with cascade, product_id nullable references products.id with set null, product_name, product_image, quantity integer default 1, price decimal(12,2), timestamps)

### 2. Base64 Upload Helper
Create `App\Helpers\ImageHelper` containing a method `uploadBase64($base64String, $folder)` that detects base64 strings (using regex `data:image/x;base64`), decodes the data, generates a random file name with the correct extension, saves it using the `public` storage disk, and returns the asset's public URL. If the string is already a valid HTTP URL, it should return it as-is.

### 3. Models and Relationships
Generate Models with proper `$fillable` attributes and relations:
- `Admin`
- `Banner`
- `Category` (belongsTo parent, hasMany children, hasMany products)
- `Product` (belongsTo category, hasMany product_images)
- `ProductImage` (belongsTo product)
- `Coupon`
- `User` (hasMany orders)
- `Order` (belongsTo user, hasMany order_items)
- `OrderItem` (belongsTo order, belongsTo product)

### 4. Admin Controllers & API Endpoints (Sanctum Protected, routes mapped in routes/api.php)
Implement JSON controllers supporting the following admin endpoints:
- `POST /admin/login` -> authenticates email/password against `admins` table. Returns Sanctum token.
- `POST /admin/logout` -> revokes authenticated token.
- `GET /admin/me` -> returns profile of current admin.
- `GET /admin/dashboard/stats` -> returns stats (total counts for products, categories, orders, users, coupons, and total revenue; and datasets formatted for recharts: monthly revenue history and order status distribution).
- CRUD resource endpoints with custom Status togglers (`PATCH /{id}/toggle-status`) for:
  - Banners (uses ImageHelper, defaults to 'active' on create)
  - Categories (uses ImageHelper, auto-slugifies name, defaults to 'active' on create)
  - Products (handles multiple uploads inside `images` array with primary logic, defaults to 'active' on create, includes `PATCH /{id}/toggle-featured`)
  - Coupons (capitalizes code, defaults to 'active' on create)
  - Users (Customers list, status toggler, delete)
  - Orders (Show, List, and `PATCH /{id}/status` to update order status)

### 5. Public API Endpoints (Not Auth Protected, routes in routes/api.php)
- `GET /public/banners` -> lists active banners.
- `GET /public/categories` -> lists active categories.
- `GET /public/products` -> paginated list of active products. Supports query filtering by name/sku (`search`), category ID, and sorting parameters (`price_asc`, `price_desc`, `newest`).
- `GET /public/products/{id}` -> returns product details with images list.
- `POST /public/coupons/validate` -> checks validation of code: checks status is active, expiry date is in future, and usage limit is not exceeded. Returns details.
- `POST /public/orders/checkout` -> handles placement of a new order: decreases inventory stocks, checks coupons, stores customer details under a guest/registered profile, creates order items snapshots, and returns order ID. Wrap the database operations inside a Transaction block.

Generate all necessary migrations, models, requests, helpers, and controllers. Ensure validation rules are strict and API responses are consistently formatted.
```
