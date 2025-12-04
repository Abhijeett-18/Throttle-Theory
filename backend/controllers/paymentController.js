import Razorpay from 'razorpay';
import crypto from 'crypto';
import Order from '../models/Order.js';

// Initialize Razorpay instance
let razorpay = null;

const initializeRazorpay = () => {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    console.warn('⚠️  Razorpay credentials not configured. UPI payments will not work.');
    return null;
  }
  
  if (!razorpay) {
    razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });
    console.log('✅ Razorpay initialized successfully');
  }
  
  return razorpay;
};

// @desc    Create Razorpay order
// @route   POST /api/payment/create-order
// @access  Private
export const createRazorpayOrder = async (req, res) => {
  try {
    const razorpayInstance = initializeRazorpay();
    
    if (!razorpayInstance) {
      return res.status(503).json({
        success: false,
        message: 'Payment service not configured. Please contact support.'
      });
    }

    const { amount, currency = 'INR' } = req.body;

    if (!amount) {
      return res.status(400).json({
        success: false,
        message: 'Amount is required'
      });
    }

    const options = {
      amount: Math.round(amount * 100), // Razorpay expects amount in paise
      currency,
      receipt: `receipt_${Date.now()}`
    };

    const order = await razorpayInstance.orders.create(options);

    res.status(200).json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Razorpay order creation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create payment order',
      error: error.message
    });
  }
};

// @desc    Verify Razorpay payment
// @route   POST /api/payment/verify
// @access  Private
export const verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderId
    } = req.body;

    // Verify signature
    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // Payment is verified
      // Update order with payment details
      if (orderId) {
        const order = await Order.findById(orderId);
        if (order) {
          order.paymentStatus = 'paid';
          order.paymentDetails = {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature
          };
          await order.save();
        }
      }

      res.status(200).json({
        success: true,
        message: 'Payment verified successfully',
        data: {
          razorpay_order_id,
          razorpay_payment_id
        }
      });
    } else {
      res.status(400).json({
        success: false,
        message: 'Invalid payment signature'
      });
    }
  } catch (error) {
    console.error('Payment verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Payment verification failed',
      error: error.message
    });
  }
};

// @desc    Get Razorpay key
// @route   GET /api/payment/key
// @access  Public
export const getRazorpayKey = async (req, res) => {
  if (!process.env.RAZORPAY_KEY_ID) {
    return res.status(503).json({
      success: false,
      message: 'Payment service not configured'
    });
  }
  
  res.status(200).json({
    success: true,
    key: process.env.RAZORPAY_KEY_ID
  });
};
