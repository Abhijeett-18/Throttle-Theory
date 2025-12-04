import express from 'express';
import {
  createOrder,
  getUserOrders,
  getOrderById,
  updateOrderStatus,
  getAllOrders
} from '../controllers/orderController.js';
import { protect, admin } from '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getUserOrders)
  .post(protect, createOrder);

router.get('/admin/all', protect, admin, getAllOrders);

router.route('/:id')
  .get(protect, getOrderById);

router.put('/:id/status', protect, admin, updateOrderStatus);

export default router;
