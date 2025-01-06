const express = require('express');
const router = express.Router();
const ReferralController = require('../controllers/ReferralController');

/**
 * @swagger
 * /getReferralOne/{referralCode}:
 *   get:
 *     summary: Retrieve a list of users referred by a specific referral code.
 *     tags:
 *       - Referral
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: referralCode
 *         required: true
 *         schema:
 *           type: string
 *         description: The referral code to search for referred users.
 *         example: "ABC123"
 *     responses:
 *       200:
 *         description: Referral list retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Referral list retrieved successfully"
 *                 referredUsers:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "64e3f0c4f8bfc6a123456789"
 *                       username:
 *                         type: string
 *                         example: "john_doe"
 *                       fullname:
 *                         type: string
 *                         example: "John Doe"
 *                       email:
 *                         type: string
 *                         example: "john.doe@example.com"
 *                       phonenumber:
 *                         type: string
 *                         example: "+1234567890"
 *                       referralCode:
 *                         type: string
 *                         example: "ABC123"
 *       404:
 *         description: No users found with the specified referral code.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No users found with this referral code"
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
 *                   example: "Error details"
 */
router.get('/getReferralOne/:id', ReferralController.getReferralList);


router.get('/getAllReferral', ReferralController.getAllReferralList);

module.exports = router;