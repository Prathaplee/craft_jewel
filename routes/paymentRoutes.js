// razorpayRoutes.js
const express = require('express');
const router = express.Router();
const razorpayController = require('../controllers/paymentController');

// Route to create a Razorpay payment order
/**
 * @swagger
 * /create-order-gold:
 *   post:
 *     summary: Create a payment order for a gold subscription.
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription_id
 *               - amount
 *             properties:
 *               subscription_id:
 *                 type: string
 *                 description: The ID of the gold subscription.
 *               amount:
 *                 type: number
 *                 description: The amount to be paid (in INR).
 *     responses:
 *       200:
 *         description: Payment order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gold Payment order created successfully
 *                 razorpay_response:
 *                   type: object
 *                   description: The full Razorpay order response.
 *                 subscription_id:
 *                   type: string
 *                   description: The ID of the gold subscription.
 *                   example: "64f3b73d5a2c3e001a7e2c84"
 *                 currency:
 *                   type: string
 *                   example: INR
 *                 amount:
 *                   type: number
 *                   description: The payment amount (in original currency units).
 *                   example: 1500
 *                 order_receipt:
 *                   type: string
 *                   description: The receipt ID generated for the order.
 *                   example: receipt_64f3b73d5a2c3e001a7e2c84
 *                 scheme_type:
 *                   type: string
 *                   description: The scheme type for the subscription.
 *                   example: gold
 *       400:
 *         description: Invalid request or subscription type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid subscription type. Expected 'gold', received 'silver'.
 *       404:
 *         description: Subscription or scheme not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Gold Subscription not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

router.post('/create-order-gold', razorpayController.createGoldPaymentOrder);

/**
 * @swagger
 * /create-order-diamond:
 *   post:
 *     summary: Create a payment order for a diamond subscription.
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscription_id
 *               - amount
 *               - weight
 *             properties:
 *               subscription_id:
 *                 type: string
 *                 description: The ID of the diamond subscription.
 *               amount:
 *                 type: number
 *                 description: The amount to be paid (in INR).
 *               weight:
 *                 type: number
 *                 description: The weight associated with the diamond subscription.
 *     responses:
 *       200:
 *         description: Payment order created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Diamond Payment order created successfully
 *                 razorpay_response:
 *                   type: object
 *                   description: The full Razorpay order response.
 *                 subscription_id:
 *                   type: string
 *                   description: The ID of the diamond subscription.
 *                   example: "63f29a7f89b4bc0e3d5b8e9a"
 *                 currency:
 *                   type: string
 *                   example: INR
 *                 amount:
 *                   type: number
 *                   description: The payment amount (in original currency units).
 *                   example: 1000
 *                 order_receipt:
 *                   type: string
 *                   description: The receipt ID generated for the order.
 *                   example: receipt_63f29a7f89b4bc0e3d5b8e9a
 *                 scheme_type:
 *                   type: string
 *                   description: The scheme type for the subscription.
 *                   example: diamond
 *       400:
 *         description: Invalid request or scheme type.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Invalid scheme type for Diamond Subscription
 *       404:
 *         description: Subscription not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Diamond Subscription not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post('/create-order-diamond', razorpayController.createDiamondPaymentOrder);

/**
 * @swagger
 * /verify-payment:
 *   post:
 *     summary: Verify Razorpay Payment
 *     description: This endpoint verifies a payment made through Razorpay for a subscription (Gold or Diamond).
 *     tags:
 *       - Payment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               subscription_id:
 *                 type: string
 *                 description: The unique identifier of the subscription.
 *                 example: '60a77bba1b1e5a001f8d365f'
 *               payment_id:
 *                 type: string
 *                 description: The Razorpay payment ID.
 *                 example: 'pay_Jjv9wXE24FkLqU'
 *               order_id:
 *                 type: string
 *                 description: The Razorpay order ID.
 *                 example: 'order_Jjv9vYbXsQkAoc'
 *               signature:
 *                 type: string
 *                 description: The Razorpay signature for verification.
 *                 example: '12345abcde67890fghij12345klmnopqrstu12345vwxyz'
 *               amount:
 *                 type: number
 *                 format: float
 *                 description: The amount paid for the subscription.
 *                 example: 5000.75
 *     responses:
 *       200:
 *         description: Payment verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verified successfully
 *                 subscription:
 *                   type: object
 *                   description: The updated subscription details.
 *       400:
 *         description: Payment verification failed or invalid request data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Payment verification failed
 *       404:
 *         description: Subscription not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Subscription not found
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */

// Route to verify Razorpay payment signature
router.post('/verify-payment', razorpayController.verifyPayment);

module.exports = router;
