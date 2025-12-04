import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const adminSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
  createdAt: { type: Date, default: Date.now }
});

const Admin = mongoose.model('Admin', adminSchema);

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Hash password
    const salt = await bcrypt.genSalt(12);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    // Create admin
    const admin = await Admin.create({
      username: 'admin',
      email: 'admin@throttletheory.com',
      password: hashedPassword
    });

    console.log('✅ Admin created successfully!');
    console.log('Email:', admin.email);
    console.log('Password: admin123');
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

createAdmin();
