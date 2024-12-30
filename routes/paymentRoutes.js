// razorpayRoutes.js
const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/paymentController');

// Route to create a Razorpay payment order
router.post('/create-order-gold', razorpayController.createGoldPaymentOrder);
router.post('/create-order-diamond', razorpayController.createDiamondPaymentOrder);


// Route to verify Razorpay payment signature
router.post('/verify-payment', razorpayController.verifyPayment);

module.exports = router;
