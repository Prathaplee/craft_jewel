const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

/**
 * @swagger
 * /signup:
 *   post:
 *     summary: Create a new user account
 *     description: Register a new user by providing the necessary details.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Unique username for the user
 *                 example: johndoe
 *               fullname:
 *                 type: string
 *                 description: Full name of the user
 *                 example: John Doe
 *               phonenumber:
 *                 type: string
 *                 description: User's phone number
 *                 example: "1234567890"
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User created successfully
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: 64f0c5d9d8b3d12f9b645a4a
 *                     username:
 *                       type: string
 *                       example: johndoe
 *                     fullname:
 *                       type: string
 *                       example: John Doe
 *                     phonenumber:
 *                       type: string
 *                       example: "+1234567890"
 *                     email:
 *                       type: string
 *                       example: johndoe@example.com
 *                     role:
 *                       type: string
 *                       example: user
 *                     referralCode:
 *                       type: string
 *                       example: REF123
 *       400:
 *         description: Bad request - User already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: User already exists
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal server error
 */
router.post('/signup', UserController.signup);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: Send OTP to the user's phone number for login.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phonenumber:
 *                 type: string
 *                 example: "9876543210"
 *                 description: The user's phone number.
 *     responses:
 *       200:
 *         description: OTP sent successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP sent successfully"
 *                 otp:
 *                   type: string
 *                   example: "123456"
 *       400:
 *         description: Bad Request - Missing phone number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number is required"
 *       404:
 *         description: Account not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Account not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "Twilio phone number is not configured in environment variables."
 */

router.post('/login', UserController.login);

/**
 * @swagger
 * /verify-otp:
 *   post:
 *     summary: Verify the OTP for a user.
 *     tags:
 *       - Authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phonenumber:
 *                 type: string
 *                 description: The user's phone number.
 *                 example: "9876543210"
 *               otp:
 *                 type: string
 *                 description: The OTP sent to the user's phone.
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: OTP verified successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "OTP verified successfully"
 *       400:
 *         description: Missing phone number or OTP in the request body.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Phone number and OTP are required"
 *       401:
 *         description: Invalid OTP provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid OTP"
 *       404:
 *         description: User not found for the given phone number.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal server error"
 *                 error:
 *                   type: string
 *                   example: "An unexpected error occurred"
 */

router.post('/verify-otp', UserController.verifyOtp);

module.exports = router;
