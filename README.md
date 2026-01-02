# Minimart Backend

This is the backend server for the Minimart e-commerce website.

## Setup Instructions

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:
```
PORT=5000
MONGODB_URI=mongodb://localhost:27017/minimart
JWT_SECRET=your_jwt_secret_key_here
STRIPE_SECRET_KEY=your_stripe_secret_key_here
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret_here
```

3. Start the development server:
```bash
npm run dev
```

## API Endpoints

### Authentication
- POST /api/auth/register - Register a new user
- POST /api/auth/login - Login user

### Products
- GET /api/products - Get all products
- GET /api/products/:id - Get single product
- POST /api/products - Create product (admin only)
- PUT /api/products/:id - Update product (admin only)
- DELETE /api/products/:id - Delete product (admin only)
- POST /api/products/:id/reviews - Add review

### Cart
- GET /api/cart - Get cart
- POST /api/cart/add - Add to cart
- PUT /api/cart/update/:productId - Update cart item quantity
- DELETE /api/cart/remove/:productId - Remove from cart
- DELETE /api/cart/clear - Clear cart

### Orders
- POST /api/orders - Create order
- GET /api/orders/my-orders - Get user orders
- GET /api/orders/:id - Get single order
- PUT /api/orders/:id/status - Update order status (admin only)

### Payment
- POST /api/payment/create-payment-intent - Create payment intent
- POST /api/payment/webhook - Handle Stripe webhook

## Technologies Used
- Node.js
- Express.js
- MongoDB
- JWT for authentication
- Stripe for payments 