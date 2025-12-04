import express from 'express';
import { protect } from '../middleware/auth.js';
import {
  createRazorpayOrder,
  verifyPayment,
  getRazorpayKey
} from '../controllers/paymentController.js';

const router = express.Router();

// Public route to get Razorpay key
router.get('/key', getRazorpayKey);

// Protected routes
router.post('/create-order', protect, createRazorpayOrder);
router.post('/verify', protect, verifyPayment);

export default router;
