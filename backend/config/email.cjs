const nodemailer = require('nodemailer');

// Create transporter
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Send email function
const sendEmail = async (options) => {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: options.to,
      subject: options.subject,
      html: options.html
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: ' + info.messageId);
    return { success: true, message: 'Email sent successfully' };
  } catch (error) {
    if (error.code === 'EAUTH') {
        console.warn('Nodemailer warning: Gmail credentials not configured. Email skipped.');
    } else {
        console.error('Email error:', error);
    }
    return { success: false, message: error.message };
  }
};

// Email templates
const emailTemplates = {
  welcome: (name) => ({
    subject: 'Welcome to Our E-commerce Platform!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Welcome ${name}! 🎉</h2>
        <p style="color: #666; line-height: 1.6;">
          Thank you for registering on our e-commerce platform. Your account has been successfully created and you can now start shopping!
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/login" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Start Shopping
          </a>
        </div>
        <p style="color: #999; font-size: 14px; text-align: center;">
          If you didn't create this account, please ignore this email.
        </p>
      </div>
    `
  }),

  login: (name) => ({
    subject: 'New Login to Your Account',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; text-align: center;">Login Alert 🔐</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name}, we noticed a new login to your account. If this was you, no action is needed.
        </p>
        <p style="color: #666; line-height: 1.6;">
          If this wasn't you, please secure your account immediately.
        </p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/profile" style="background: #dc3545; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Secure Account
          </a>
        </div>
      </div>
    `
  }),

  orderPlaced: (name, orderId, total) => ({
    subject: 'Order Confirmation - Thank You!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #28a745; text-align: center;">Order Confirmed! 🛒</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name}, your order has been successfully placed!
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 10px 0 0 0; color: #333;"><strong>Total Amount:</strong> $${total}</p>
          <p style="margin: 10px 0 0 0; color: #666;">We'll send you updates as your order progresses.</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/my-orders" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            Track Order
          </a>
        </div>
      </div>
    `
  }),

  orderStatusUpdate: (name, orderId, status) => ({
    subject: `Order Status Update - ${orderId}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #007bff; text-align: center;">Order Status Update 📦</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name}, your order status has been updated.
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 10px 0 0 0; color: #333;"><strong>New Status:</strong> <span style="color: #28a745;">${status}</span></p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/my-orders" style="background: #007bff; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Order Details
          </a>
        </div>
      </div>
    `
  }),

  sellerOrder: (name, orderId, customerName) => ({
    subject: 'New Order Received! 🎉',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #28a745; text-align: center;">New Order! 🛒</h2>
        <p style="color: #666; line-height: 1.6;">
          Hi ${name}, you have received a new order from ${customerName}.
        </p>
        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0; color: #333;"><strong>Order ID:</strong> ${orderId}</p>
          <p style="margin: 10px 0 0 0; color: #666;">Please prepare this order for shipping.</p>
        </div>
        <div style="text-align: center; margin: 30px 0;">
          <a href="http://localhost:5173/seller-dashboard" style="background: #28a745; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; display: inline-block;">
            View Orders
          </a>
        </div>
      </div>
    `
  })
  
};
const sendInvoice = async (req, res) => {
  const { order } = req.body;

  // send email logic here
};

module.exports = { sendEmail, emailTemplates, sendInvoice };
