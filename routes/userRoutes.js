const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');


/**
 * @swagger
 * /user/{id}:
 *   get:
 *     summary: Retrieve a user by their ID.
 *     tags:
 *       - Users
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
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
 *     security:
 *       - BearerAuth: []
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
 * /adr-bank/{userId}:
 *   put:
 *     summary: Update user address and bank details.
 *     tags:
 *       - User Profile
 *     security:
 *       - BearerAuth: []
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
 *     summary: Update user KYC details with Aadhaar number, PAN number, and images.
 *     tags:
 *       - User Profile
 *     security:
 *       - BearerAuth: []
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
 *               aadhaar_number:
 *                 type: string
 *                 description: Aadhaar card number.
 *               pan_number:
 *                 type: string
 *                 description: PAN card number.
 *               aadhaar:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Aadhaar card image files (can include front, back, or multiple images).
 *               pan:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: PAN card image files (can include front, back, or multiple images).
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
 *                 kyc:
 *                   type: object
 *                   properties:
 *                     aadhaar_number:
 *                       type: string
 *                       example: "123456789012"
 *                     pan_number:
 *                       type: string
 *                       example: "ABCDE1234F"
 *                     aadhaar_images:
 *                       type: integer
 *                       example: 2
 *                     pan_images:
 *                       type: integer
 *                       example: 2
 *       400:
 *         description: Bad request due to missing or invalid data.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Aadhaar number, PAN number, and at least one image for both are required"
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

router.get('/kyc/:userId', UserController.getKYC);

router.get("/kyc/image/:fileId", UserController.getKYCImage);
module.exports = router;