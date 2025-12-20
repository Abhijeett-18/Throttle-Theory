# 🏍️ Throttle Theory

**Throttle Theory** is a full-stack MERN e-commerce platform for automotive apparel. Built with modern web technologies, it features a complete shopping experience with payment integration, email notifications, and an admin dashboard.

![MERN Stack](https://img.shields.io/badge/Stack-MERN-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-Express-green?style=for-the-badge&logo=node.js)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green?style=for-the-badge&logo=mongodb)

## ✨ Features

### 🛍️ Customer Features
- **Product Catalog** - Browse by categories (T-Shirts, Caps, Jackets, Bottoms, Accessories)
- **Shopping Cart** - Add/remove items, update quantities
- **Wishlist** - Save favorite products
- **User Authentication** - Secure register/login with JWT
- **Checkout System** - Complete order flow with address management
- **Payment Gateway** - UPI payments via Razorpay (Test & Live modes)
- **Cash on Delivery** - Alternative payment option
- **Email Notifications** - Welcome, order confirmation, status updates
- **Order Tracking** - View order history and status
- **Responsive Design** - Mobile, tablet, and desktop optimized

### 👨‍💼 Admin Features
- **Dashboard** - Overview with statistics
- **Product Management** - Add, edit, delete, mark best sellers
- **Order Management** - Update order status (Processing → Confirmed → Shipped → Delivered)
- **User Management** - View registered users
- **Image Upload** - Cloudinary integration

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library
- **React Router** - Client-side routing
- **Context API** - State management (Auth, Cart, Wishlist, Toast)
- **Tailwind CSS** - Utility-first styling
- **Vite** - Build tool and dev server

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB Atlas** - Cloud database
- **Mongoose** - ODM for MongoDB
- **JWT** - Authentication tokens
- **Bcrypt** - Password hashing

### Integrations
- **Razorpay** - Payment processing (UPI, Cards)
- **Nodemailer** - Email notifications
- **Cloudinary** - Image hosting and management

## 📁 Project Structure

```
throttle/
├── backend/
│   ├── controllers/        # Business logic
│   ├── models/             # Database schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Auth, validation
│   ├── services/           # Email service
│   ├── server.js           # Entry point
│   └── .env                # Environment variables
├── src/
│   ├── components/         # Reusable UI components
│   ├── pages/              # Route pages
│   ├── context/            # Global state
│   ├── services/           # API calls
│   └── data/               # Static data
└── public/                 # Static assets
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB Atlas account
- Razorpay account (for payments)
- Gmail account (for emails)

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Abhijeett-18/Throttle-Theory.git
cd Throttle-Theory
```

2. **Install dependencies**
```bash
# Frontend
npm install

# Backend
cd backend
npm install
```

3. **Configure environment variables**

Create `backend/.env` file:
```env
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=your_mongodb_connection_string

# Authentication
JWT_SECRET=your_jwt_secret_key

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Razorpay (Get from https://dashboard.razorpay.com)
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email (Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_gmail_app_password
```

4. **Run the application**

```bash
# Terminal 1 - Backend
cd backend
npm start

# Terminal 2 - Frontend (new terminal)
npm run dev
```

5. **Access the application**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:5000`

## 📧 Email Setup

1. Enable 2-Factor Authentication in Gmail
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Use the 16-character password in `.env`
4. See `EMAIL_SETUP.md` for detailed instructions

## 💳 Payment Setup

1. Sign up at https://dashboard.razorpay.com
2. Get Test Mode API keys
3. Update `.env` with credentials
4. Test with UPI ID: `success@razorpay`
5. See `RAZORPAY_SETUP.md` for detailed instructions

## 🔐 Admin Access

To create an admin account:

```bash
cd backend
node createAdmin.js
```

Follow the prompts to set up admin credentials.

## 📚 API Documentation

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get user profile
- `PUT /api/auth/profile` - Update profile

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get single product
- `POST /api/products` - Create product (Admin)
- `PUT /api/products/:id` - Update product (Admin)
- `DELETE /api/products/:id` - Delete product (Admin)

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID
- `GET /api/orders/admin/all` - Get all orders (Admin)
- `PUT /api/orders/:id/status` - Update order status (Admin)

### Payment
- `GET /api/payment/key` - Get Razorpay public key
- `POST /api/payment/create-order` - Create payment order
- `POST /api/payment/verify` - Verify payment signature

## 🎨 Features in Detail

### Cart & Wishlist
- Persists in localStorage
- Updates in real-time
- Shows item count badges
- Authentication required for actions

### Order Flow
1. Add products to cart
2. Proceed to checkout
3. Fill/update shipping address
4. Choose payment method (UPI/COD)
5. For UPI: Razorpay modal opens
6. Complete payment
7. Order confirmed
8. Email sent automatically

### Email Notifications
- **Welcome Email** - On registration
- **Order Confirmation** - With itemized details
- **Status Updates** - Confirmed, Shipped, Delivered

## 🔒 Security Features

- Password hashing with bcrypt
- JWT authentication
- Protected admin routes
- Payment signature verification
- Input validation on models
- CORS configuration

## 📱 Responsive Design

Optimized for all devices:
- Mobile: 320px - 640px
- Tablet: 640px - 1024px
- Desktop: 1024px+

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Abhijeet Singh**
- GitHub: [@Abhijeett-18](https://github.com/Abhijeett-18)
- Email: abhijeet3318@gmail.com

## 🙏 Acknowledgments

- React documentation
- MongoDB Atlas
- Razorpay API
- Tailwind CSS
- Cloudinary

## 📞 Support

For issues or questions, please open an issue on GitHub or contact abhijeet3318@gmail.com

---

**⭐ If you like this project, please give it a star!**
