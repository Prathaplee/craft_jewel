// Load environment variables from .env file
require('dotenv').config();

// Initialize Razorpay with environment variables
const Razorpay = require('razorpay');

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID, // Access Razorpay key_id from the .env file
  key_secret: process.env.RAZORPAY_KEY_SECRET, // Access Razorpay key_secret from the .env file
});
