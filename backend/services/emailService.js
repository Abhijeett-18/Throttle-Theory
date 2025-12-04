import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASSWORD) {
    console.warn('⚠️  Email credentials not configured. Email notifications will not work.');
    return null;
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });
};

// Send order confirmation email
export const sendOrderConfirmationEmail = async (order, userEmail) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    const itemsList = order.items.map(item => 
      `<tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <img src="${item.image}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 4px;">
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">
          <strong>${item.name}</strong><br>
          <span style="color: #666;">Size: ${item.size}</span>
        </td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: center;">${item.quantity}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">₹${item.price * item.quantity}</td>
      </tr>`
    ).join('');

    const mailOptions = {
      from: `"Throttle Theory" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `Order Confirmation - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .order-info { background: #fff; padding: 15px; margin: 20px 0; border-radius: 5px; }
            .table { width: 100%; border-collapse: collapse; background: #fff; margin: 20px 0; }
            .total-row { font-weight: bold; background: #f0f0f0; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>THROTTLE THEORY</h1>
              <p>Thank you for your order!</p>
            </div>
            
            <div class="content">
              <h2>Order Confirmed! 🎉</h2>
              <p>Hi ${order.shippingAddress.fullName},</p>
              <p>Your order has been successfully placed and is being processed.</p>
              
              <div class="order-info">
                <h3>Order Details</h3>
                <p><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod === 'upi' ? 'UPI Payment' : 'Cash on Delivery'}</p>
                <p><strong>Payment Status:</strong> ${order.paymentStatus === 'paid' ? '✅ Paid' : '⏳ Pending'}</p>
              </div>

              <h3>Items Ordered</h3>
              <table class="table">
                <thead>
                  <tr style="background: #f0f0f0;">
                    <th style="padding: 10px; text-align: left;">Image</th>
                    <th style="padding: 10px; text-align: left;">Product</th>
                    <th style="padding: 10px; text-align: center;">Qty</th>
                    <th style="padding: 10px; text-align: right;">Price</th>
                    <th style="padding: 10px; text-align: right;">Total</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsList}
                  <tr class="total-row">
                    <td colspan="4" style="padding: 15px; text-align: right;">Subtotal:</td>
                    <td style="padding: 15px; text-align: right;">₹${order.subtotal}</td>
                  </tr>
                  <tr class="total-row">
                    <td colspan="4" style="padding: 15px; text-align: right;">Shipping:</td>
                    <td style="padding: 15px; text-align: right; color: green;">FREE</td>
                  </tr>
                  <tr class="total-row" style="font-size: 18px;">
                    <td colspan="4" style="padding: 15px; text-align: right;">Total:</td>
                    <td style="padding: 15px; text-align: right;">₹${order.total}</td>
                  </tr>
                </tbody>
              </table>

              <div class="order-info">
                <h3>Shipping Address</h3>
                <p>
                  ${order.shippingAddress.fullName}<br>
                  ${order.shippingAddress.street}<br>
                  ${order.shippingAddress.city}, ${order.shippingAddress.state}<br>
                  PIN: ${order.shippingAddress.pincode}<br>
                  Phone: ${order.shippingAddress.phone}
                </p>
              </div>

              <div style="text-align: center;">
                <a href="http://localhost:5173/profile" class="button">Track Your Order</a>
              </div>

              <p style="margin-top: 30px; color: #666;">
                We'll send you a shipping confirmation email as soon as your order ships.
              </p>
            </div>

            <div class="footer">
              <p>Questions? Contact us at ${process.env.EMAIL_USER}</p>
              <p>&copy; ${new Date().getFullYear()} Throttle Theory. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending order confirmation email:', error.message);
  }
};

// Send order status update email
export const sendOrderStatusEmail = async (order, userEmail, newStatus) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    const statusMessages = {
      'confirmed': {
        subject: 'Order Confirmed',
        title: 'Your order has been confirmed! ✅',
        message: 'Great news! Your order has been confirmed and is being prepared for shipment.'
      },
      'shipped': {
        subject: 'Order Shipped',
        title: 'Your order is on its way! 🚚',
        message: 'Your order has been shipped and will arrive soon.'
      },
      'delivered': {
        subject: 'Order Delivered',
        title: 'Your order has been delivered! 📦',
        message: 'Your order has been successfully delivered. We hope you love your purchase!'
      },
      'cancelled': {
        subject: 'Order Cancelled',
        title: 'Your order has been cancelled',
        message: 'Your order has been cancelled. If you have any questions, please contact us.'
      }
    };

    const statusInfo = statusMessages[newStatus] || statusMessages['confirmed'];

    const mailOptions = {
      from: `"Throttle Theory" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: `${statusInfo.subject} - #${order._id.toString().slice(-8).toUpperCase()}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 20px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; }
            .status-box { background: #fff; padding: 20px; margin: 20px 0; border-radius: 5px; text-align: center; border-left: 4px solid #000; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>THROTTLE THEORY</h1>
            </div>
            
            <div class="content">
              <div class="status-box">
                <h2>${statusInfo.title}</h2>
                <p>${statusInfo.message}</p>
                <p style="margin-top: 20px;"><strong>Order ID:</strong> #${order._id.toString().slice(-8).toUpperCase()}</p>
                <p><strong>Order Date:</strong> ${new Date(order.createdAt).toLocaleDateString('en-IN', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}</p>
              </div>

              <div style="text-align: center;">
                <a href="http://localhost:5173/profile" class="button">View Order Details</a>
              </div>
            </div>

            <div class="footer">
              <p>Questions? Contact us at ${process.env.EMAIL_USER}</p>
              <p>&copy; ${new Date().getFullYear()} Throttle Theory. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Order status email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending order status email:', error.message);
  }
};

// Send welcome email
export const sendWelcomeEmail = async (userName, userEmail) => {
  const transporter = createTransporter();
  if (!transporter) return;

  try {
    const mailOptions = {
      from: `"Throttle Theory" <${process.env.EMAIL_USER}>`,
      to: userEmail,
      subject: 'Welcome to Throttle Theory! 🏍️',
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: #000; color: #fff; padding: 30px; text-align: center; }
            .content { background: #f9f9f9; padding: 30px; }
            .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
            .button { display: inline-block; padding: 12px 30px; background: #000; color: #fff; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .features { display: flex; flex-wrap: wrap; margin: 20px 0; }
            .feature { flex: 1; min-width: 150px; padding: 15px; text-align: center; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>THROTTLE THEORY</h1>
              <p style="font-size: 18px;">Welcome to the Crew!</p>
            </div>
            
            <div class="content">
              <h2>Hey ${userName}! 👋</h2>
              <p>Welcome to Throttle Theory - your destination for premium automotive apparel!</p>
              
              <p>We're thrilled to have you join our community of automotive enthusiasts. Get ready to elevate your style with our exclusive collection.</p>

              <div style="background: #fff; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <h3>What's Next?</h3>
                <ul style="text-align: left;">
                  <li>🛍️ Browse our latest collection</li>
                  <li>❤️ Add your favorites to wishlist</li>
                  <li>🚚 Enjoy free shipping on all orders</li>
                  <li>💳 Secure checkout with UPI or COD</li>
                </ul>
              </div>

              <div style="text-align: center;">
                <a href="http://localhost:5173/categories" class="button">Start Shopping</a>
              </div>

              <p style="margin-top: 30px; color: #666; text-align: center;">
                Follow us on social media for exclusive deals and new arrivals!
              </p>
            </div>

            <div class="footer">
              <p>Need help? Contact us at ${process.env.EMAIL_USER}</p>
              <p>&copy; ${new Date().getFullYear()} Throttle Theory. All rights reserved.</p>
            </div>
          </div>
        </body>
        </html>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`✅ Welcome email sent to ${userEmail}`);
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
  }
};
