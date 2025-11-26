# 🛒 E-Commerce Backend (Node.js + Express + MySQL)

This project is a RESTful backend API for a full-featured e-commerce application.
It is built using Node.js, Express, and MySQL, and follows MVC architecture with modular controllers, models, routes, and utilities.

## 🚀 Features Implemented
### ✅ User Authentication
* User Registration
* User Login (JWT Token)
* User Logout (token handled on frontend)
* Input validation and error handling

### ✅ Category Management
* Add Category
* Update Category
* Soft Delete Category
* Fetch Categories
* Fetch Category By ID
* Used for product filtering

### ✅ Product Management
* Add Product
* Update Product (with optional image update)
* Delete Product
* Fetch Product List (with pagination, search, category filter, price range filter)
* Fetch Product By ID
* Multer integration for image uploads
* Input validation and error responses
* Dynamic SQL query builder for filtering

### ✅ Cart System
* Add Item to Cart
* Update Cart Item Quantity
* Remove Cart Item
* Get Cart Items for a User
* Automatically handles:
  - Product existence
  - User existence
  - Stock validation
  - Incrementing quantity if item already exists
  - All cart operations belong to a specific user

✅ Checkout Process
* Validates all items in cart
* Checks product availability
* Calculates:
  - Subtotal
  - Shipping fee
  - Total amount
* Begins a transaction for:
  - Creating order
  - Creating order items
  - Updating product stock
  - Clearing cart
* Rollback on error
* Commit on success

### ✅ Order Management
* Create order (via checkout)
* Create order items
* Stock deduction
* Clearing user cart after checkout

### ✅ Global Error Handler
* Centralized error catching with next(error)
* Supports custom error types and status codes
* Utility function: generateException(type, message, statusCode)
* Ensures consistent error response structure

## 🛠️ Tech Stack
* Layer	Technology
* Runtime	Node.js
* Framework	Express.js
* Database	MySQL + mysql2
* Authentication	JWT
* File Upload	Multer
* Environment Config	dotenv
* Architecture	MVC with Services/Utilities
* Error Handling	Centralized middleware
  
## 📦 Project Structure
```
/src
 ├── controllers
 │    ├── auth.controller.js
 │    ├── product.controller.js
 │    ├── category.controller.js
 │    ├── cart.controller.js
 │    └── order.controller.js
 │
 ├── models
 │    ├── user.model.js
 │    ├── product.model.js
 │    ├── category.model.js
 │    ├── cart.model.js
 │    └── order.model.js
 │
 ├── routes
 │    ├── auth.routes.js
 │    ├── product.routes.js
 │    ├── category.routes.js
 │    ├── cart.routes.js
 │    └── order.routes.js
 │
 ├── middlewares
 │    ├── errorHandler.js
 │    └── multer.js
 │
 ├── utils
 │    ├── generateException.js
 │    └── db.js
 │
 └── app.js
```

## 🔧 Installation & Setup
1. Clone the repository
  ```bash
  git clone https://github.com/your-repo/ecommerce-backend.git
  cd ecommerce-backend
  ```

2. Install dependencies
  ```bash
  npm install
  ```

4. Create your .env file
 ```bash
  HOST=localhost
  USER=root
  DBPASSWORD=yourpassword
  DATABASE=ecommerce
  JWT_SECRET=your_jwt_secret
  PORT=5000
  ```

6. Start the server
npm start

📚 API Overview
Authentication
Method	Endpoint	Description
POST	/auth/register	Register new user
POST	/auth/login	Login user
POST	/auth/logout	(frontend handles token removal)
Categories
Method	Endpoint	Description
GET	/category	Get all categories
GET	/category/:id	Get category by ID
POST	/category	Add new category
PUT	/category/:id	Update category
DELETE	/category/:id	Soft delete
Products
Method	Endpoint	Description
GET	/product	Fetch products (pagination, search, category filter)
GET	/product/:id	Fetch product by ID
POST	/product	Add product
PUT	/product/:id	Update product
DELETE	/product/:id	Delete product
Cart
Method	Endpoint	Description
GET	/cart/:userId	Get cart items
POST	/cart	Add item to cart
PUT	/cart	Update cart item quantity
DELETE	/cart/:userId/:cartId	Delete item from cart
Checkout & Orders
Method	Endpoint	Description
POST	/checkout	Complete checkout
GET	/orders/:userId	Fetch user orders
🔒 Error Response Format

All errors follow a consistent structure:

{
  "error": true,
  "message": "Invalid user id.",
  "statusCode": 400
}

🧪 Testing Your Backend

You can test using:

Postman

Thunder Client (VS Code)

Insomnia

SQL tools like MySQL Workbench / DBeaver

Supports full testing of:

Product management

Authentication

Cart operations

Checkout + transaction

File uploads via Multer

📌 Future Improvements (Optional)

Email verification

Refresh tokens

Failed orders handling

Admin dashboard

Reviews & ratings

Coupon system

Payment gateway integration
