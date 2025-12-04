import express from 'express';
import {
  adminLogin,
  getAdminProfile,
  createAdmin
} from '../controllers/adminController.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

router.post('/login', adminLogin);
router.post('/create', createAdmin);
router.get('/me', protect, getAdminProfile);

export default router;
