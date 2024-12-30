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
 *       - Users
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
 * /user/{id}:
 *   get:
 *     summary: Retrieve a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *     responses:
 *       200:
 *         description: User retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f1c6f7eec63b0012345678"
 *                 name:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 phone:
 *                   type: string
 *                   example: "9876543210"
 *       404:
 *         description: User not found.
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

router.get('/user/:id', UserController.getUser);


/**
 * @swagger
 * /user/{id}:
 *   put:
 *     summary: Update a user's information by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "john_doe"
 *               fullname:
 *                 type: string
 *                 example: "John Doe"
 *               email:
 *                 type: string
 *                 example: "john.doe@example.com"
 *               phonenumber:
 *                 type: string
 *                 example: "9876543210"
 *     responses:
 *       200:
 *         description: User updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   example: "64f1c6f7eec63b0012345678"
 *                 username:
 *                   type: string
 *                   example: "john_doe"
 *                 fullname:
 *                   type: string
 *                   example: "John Doe"
 *                 email:
 *                   type: string
 *                   example: "john.doe@example.com"
 *                 phonenumber:
 *                   type: string
 *                   example: "9876543210"
 *       404:
 *         description: User not found.
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

router.put('/user/:id', UserController.updateUser);

/**
 * @swagger
 * /user/{id}:
 *   delete:
 *     summary: Delete a user by their ID.
 *     tags:
 *       - Users
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The unique ID of the user to delete.
 *     responses:
 *       200:
 *         description: User deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User deleted successfully"
 *       404:
 *         description: User not found.
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

router.delete('/user/:id', UserController.deleteUser);


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


/**
 * @swagger
 * /adr-bank/{userId}:
 *   put:
 *     summary: Update user address and bank details.
 *     tags:
 *       - User Profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose profile needs to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               address:
 *                 type: object
 *                 required:
 *                   - street
 *                   - city
 *                   - state
 *                   - pincode
 *                 properties:
 *                   street:
 *                     type: string
 *                     description: Street name of the address.
 *                     example: "123 Main St"
 *                   city:
 *                     type: string
 *                     description: City name.
 *                     example: "Los Angeles"
 *                   state:
 *                     type: string
 *                     description: State name.
 *                     example: "California"
 *                   pincode:
 *                     type: string
 *                     description: Postal code.
 *                     example: "90001"
 *               bank_details:
 *                 type: object
 *                 required:
 *                   - account_number
 *                   - ifsc_code
 *                   - bank_name
 *                 properties:
 *                   account_number:
 *                     type: string
 *                     description: Bank account number.
 *                     example: "1234567890"
 *                   ifsc_code:
 *                     type: string
 *                     description: IFSC code of the bank.
 *                     example: "SBIN0001234"
 *                   bank_name:
 *                     type: string
 *                     description: Name of the bank.
 *                     example: "State Bank of India"
 *     responses:
 *       200:
 *         description: Profile updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Profile updated successfully"
 *                 user:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       description: User's ID.
 *                       example: "64a1f39d1234567890123456"
 *                     username:
 *                       type: string
 *                       description: User's username.
 *                       example: "john_doe"
 *                     email:
 *                       type: string
 *                       description: User's email address.
 *                       example: "john.doe@example.com"
 *                     phone_number:
 *                       type: string
 *                       description: User's phone number.
 *                       example: "9876543210"
 *                     referral_code:
 *                       type: string
 *                       description: User's referral code.
 *                       example: "ABC123"
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "123 Main St"
 *                         city:
 *                           type: string
 *                           example: "Los Angeles"
 *                         state:
 *                           type: string
 *                           example: "California"
 *                         pincode:
 *                           type: string
 *                           example: "90001"
 *                     bank_details:
 *                       type: object
 *                       properties:
 *                         account_number:
 *                           type: string
 *                           example: "1234567890"
 *                         ifsc_code:
 *                           type: string
 *                           example: "SBIN0001234"
 *                         bank_name:
 *                           type: string
 *                           example: "State Bank of India"
 *       400:
 *         description: Validation error for missing or incomplete input.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Address and bank details are required"
 *       404:
 *         description: User not found.
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

router.put('/adr-bank/:userId', UserController.updateProfile);


/**
 * @swagger
 * /update-kyc/{userId}:
 *   put:
 *     summary: Update user KYC details with Aadhaar and PAN images.
 *     tags:
 *       - User Profile
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the user whose KYC details need to be updated.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               aadharImage:
 *                 type: string
 *                 format: binary
 *                 description: Aadhaar card image file.
 *               panImage:
 *                 type: string
 *                 format: binary
 *                 description: PAN card image file.
 *     responses:
 *       200:
 *         description: KYC updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "KYC updated successfully"
 *                 aadhar_image:
 *                   type: string
 *                   example: "Stored in database"
 *                 pan_image:
 *                   type: string
 *                   example: "Stored in database"
 *       400:
 *         description: Bad request due to missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Both Aadhaar image and PAN image are required"
 *       404:
 *         description: User not found.
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
 */

router.put('/update-kyc/:userId', UserController.updateKYC);

module.exports = router;