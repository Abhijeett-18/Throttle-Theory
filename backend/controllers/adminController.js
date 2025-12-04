import Admin from '../models/Admin.js';
import jwt from 'jsonwebtoken';

// Generate JWT Token
const generateToken = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: '30d'
  });
};

// @desc    Admin login
// @route   POST /api/admin/login
// @access  Public
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for admin
    const admin = await Admin.findOne({ email }).select('+password');
    if (!admin) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // Check password
    const isPasswordMatch = await admin.comparePassword(password);
    if (!isPasswordMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    res.status(200).json({
      success: true,
      data: {
        _id: admin._id,
        username: admin.username,
        email: admin.email,
        isAdmin: true,
        token: generateToken(admin._id)
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get admin profile
// @route   GET /api/admin/me
// @access  Private/Admin
export const getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: admin
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Create admin (Only for initial setup)
// @route   POST /api/admin/create
// @access  Public (Should be protected in production)
export const createAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if admin exists
    const adminExists = await Admin.findOne({ email });
    if (adminExists) {
      return res.status(400).json({
        success: false,
        message: 'Admin already exists with this email'
      });
    }

    // Create admin
    const admin = await Admin.create({
      username,
      email,
      password
    });

    if (admin) {
      res.status(201).json({
        success: true,
        data: {
          _id: admin._id,
          username: admin.username,
          email: admin.email,
          isAdmin: true,
          token: generateToken(admin._id)
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
