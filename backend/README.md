# Throttle Theory Backend

Node.js + Express + MongoDB Atlas backend for Throttle Theory e-commerce.

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. MongoDB Atlas Setup
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account or sign in
3. Create a new cluster (free tier M0 is perfect for development)
4. Click "Connect" → "Connect your application"
5. Copy the connection string

### 3. Environment Variables
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Update the `.env` file:
   ```
   MONGODB_URI=mongodb+srv://your_username:your_password@cluster0.xxxxx.mongodb.net/throttle-theory?retryWrites=true&w=majority
   JWT_SECRET=generate_a_strong_random_secret_here
   FRONTEND_URL=http://localhost:5173
   ```

### 4. Run the Server

**Development mode (with auto-reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints (Coming Soon)

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/:id` - Update product (admin)
- `DELETE /api/products/:id` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order
- `GET /api/orders/:id` - Get order details

## Project Structure
```
backend/
├── models/           # MongoDB models
│   ├── User.js
│   ├── Product.js
│   └── Order.js
├── routes/           # API routes
├── middleware/       # Custom middleware
├── controllers/      # Route controllers
├── config/           # Configuration files
├── .env             # Environment variables (create this)
├── .env.example     # Example env file
├── server.js        # Main server file
└── package.json
```

## Next Steps
1. Set up MongoDB Atlas and add connection string to `.env`
2. Create API routes for auth, products, and orders
3. Set up Cloudinary for image uploads
4. Connect frontend to backend APIs
