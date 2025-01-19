const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController');

/**
 * @swagger
 * /subscribe-gold:
 *   post:
 *     summary: Create a Gold Subscription
 *     description: This endpoint is used to create a gold subscription for the user based on the selected scheme and payment details.
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - user_id
 *               - scheme_id
 *               - payment_type
 *               - amount
 *               - weight
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The unique identifier of the user.
 *                 example: "60d8f7a2f3f3f7001e8f6b7c"
 *               scheme_id:
 *                 type: string
 *                 description: The unique identifier of the subscription scheme.
 *                 example: "60d8f7a2f3f3f7001e8f6b7d"
 *               payment_type:
 *                 type: string
 *                 enum:
 *                   - online
 *                   - cash
 *                 description: The payment type used for the subscription.
 *                 example: "online"
 *               amount:
 *                 type: number
 *                 description: The amount for the gold subscription if the scheme requires amount.
 *                 example: 50000
 *               weight:
 *                 type: number
 *                 description: The weight of gold for the gold subscription if the scheme requires weight.
 *                 example: 10
 *     responses:
 *       201:
 *         description: Gold subscription created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gold subscription created successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "60d8f7a2f3f3f7001e8f6b7c"
 *                     scheme_id:
 *                       type: string
 *                       example: "60d8f7a2f3f3f7001e8f6b7d"
 *                     payment_type:
 *                       type: string
 *                       enum:
 *                         - online
 *                         - cash
 *                       example: "online"
 *                     initial_amount:
 *                       type: number
 *                       example: 50000
 *                     weight:
 *                       type: number
 *                       example: 10
 *                     subscribe_status:
 *                       type: string
 *                       enum:
 *                         - waiting
 *                         - active
 *                         - cancelled
 *                       example: "waiting"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-30T10:30:00Z"
 *       400:
 *         description: Invalid input data or validation errors.
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
 *                   example: "An error occurred while creating the subscription"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.post('/subscribe-gold', subscriptionController.createGoldSubscription);

/**
 * @swagger
 * /subscribe-diamond:
 *   post:
 *     summary: Create a new Diamond subscription
 *     description: Creates a new Diamond subscription for a user after validating the KYC, scheme type, and initial amount.
 *     operationId: createDiamondSubscription
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       description: The subscription data for the Diamond scheme.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               user_id:
 *                 type: string
 *                 description: The ID of the user subscribing to the Diamond scheme.
 *                 example: "60c72b2f9f1b2c001f98f1b2"
 *               scheme_id:
 *                 type: string
 *                 description: The ID of the Diamond scheme the user wants to subscribe to.
 *                 example: "60c72b2f9f1b2c001f98f1b3"
 *               payment_type:
 *                 type: string
 *                 description: The method of payment for the subscription.
 *                 enum: ["online", "cash"]
 *                 example: "online"
 *               initial_amount:
 *                 type: number
 *                 description: The initial payment amount for the subscription.
 *                 example: 1000.0
 *     responses:
 *       201:
 *         description: Diamond subscription created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Diamond subscription created successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "60c72b2f9f1b2c001f98f1b2"
 *                     scheme_id:
 *                       type: string
 *                       example: "60c72b2f9f1b2c001f98f1b3"
 *                     payment_type:
 *                       type: string
 *                       example: "online"
 *                     initial_amount:
 *                       type: number
 *                       example: 1000.0
 *                     payment_status:
 *                       type: string
 *                       example: "pending"
 *                     subscribe_status:
 *                       type: string
 *                       example: "waiting"
 *                     created_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-30T10:00:00Z"
 *       400:
 *         description: Bad Request (e.g., invalid user ID, KYC not completed, or invalid scheme ID).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while creating the subscription"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */

router.post('/subscribe-diamond', subscriptionController.createDiamondSubscription);

/**
 * @swagger
 * /update-goldsubscribe/{subscription_id}:
 *   put:
 *     summary: Update an existing Gold Subscription
 *     description: This endpoint is used to update an existing gold subscription based on the provided subscription ID. Admins can also update the `isVerifiedKyc` status of the user associated with the subscription.
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The unique identifier of the gold subscription to be updated.
 *         schema:
 *           type: string
 *           example: "60d8f7a2f3f3f7001e8f6b7c"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subscribe_status
 *             properties:
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 description: The due date for the subscription.
 *                 example: "2025-12-30T00:00:00Z"
 *               subscribe_status:
 *                 type: string
 *                 enum:
 *                   - waiting
 *                   - active
 *                   - cancelled
 *                 description: The updated subscription status.
 *                 example: "active"
 *               isVerifiedKyc:
 *                 type: boolean
 *                 description: Whether the user's KYC is verified.
 *                 example: true
 *     responses:
 *       200:
 *         description: Gold subscription updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gold subscription updated successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60d8f7a2f3f3f7001e8f6b7c"
 *                     subscribe_status:
 *                       type: string
 *                       enum:
 *                         - waiting
 *                         - active
 *                         - cancelled
 *                       example: "active"
 *                     initial_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-01-19T10:00:00Z"
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-19T10:00:00Z"
 *                     due_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-30T00:00:00Z"
 *                     user_id:
 *                       type: string
 *                       example: "60d8f7a2f3f3f7001e8f6b7c"
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                       example: "60d8f7a2f3f3f7001e8f6b7c"
 *                     isVerifiedKyc:
 *                       type: boolean
 *                       description: Whether the user's KYC is verified.
 *                       example: true
 *       400:
 *         description: Subscription not found or failed to update.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Gold subscription not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the Gold subscription"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.put('/update-goldsubscribe/:subscription_id', subscriptionController.updateGoldSubscription);


/**
 * @swagger
 * /update-diamondsubscribe/{subscription_id}:
 *   put:
 *     summary: Updates a Diamond subscription
 *     description: Updates the subscription details such as the subscription status, due date, initial date, end date, and optionally the user's KYC verification status for the given Diamond subscription ID.
 *     operationId: updateDiamondSubscription
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: subscription_id
 *         in: path
 *         required: true
 *         description: The ID of the Diamond subscription to be updated.
 *         schema:
 *           type: string
 *           example: "60c72b2f9f1b2c001f98f1b4"
 *     requestBody:
 *       description: The updated subscription data.
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               due_date:
 *                 type: string
 *                 format: date-time
 *                 description: The updated due date of the subscription.
 *                 example: "2025-12-30T00:00:00Z"
 *               subscribe_status:
 *                 type: string
 *                 description: The updated subscription status (e.g., active, waiting, cancelled).
 *                 example: "active"
 *               isVerifiedKyc:
 *                 type: boolean
 *                 description: Optional. Allows the admin to update the user's KYC verification status.
 *                 example: true
 *     responses:
 *       200:
 *         description: Diamond subscription updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Diamond subscription updated successfully"
 *                 subscription:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "60c72b2f9f1b2c001f98f1b4"
 *                     subscribe_status:
 *                       type: string
 *                       example: "active"
 *                     initial_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-30T00:00:00Z"
 *                     end_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-11-30T00:00:00Z"
 *                     due_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-12-30T00:00:00Z"
 *                 user:
 *                   type: object
 *                   properties:
 *                     user_id:
 *                       type: string
 *                       example: "60c72b2f9f1b2c001f98f1b3"
 *                     isVerifiedKyc:
 *                       type: boolean
 *                       example: true
 *       400:
 *         description: Bad request, failed to update the subscription or KYC status.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Failed to update Diamond subscription"
 *       404:
 *         description: Subscription not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Diamond subscription not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating the Diamond subscription"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.put('/update-diamondsubscribe/:subscription_id', subscriptionController.updateDiamondSubscription);


/**
 * @swagger
 * /subscribe-report:
 *   get:
 *     summary: Retrieves the subscription report for Gold and Diamond subscriptions
 *     description: Fetches the report containing all Gold and Diamond subscriptions.
 *     operationId: getSubscriptionReport
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Subscription report retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription report retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     gold:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b2"
 *                           user_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b3"
 *                           scheme_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b4"
 *                           payment_type:
 *                             type: string
 *                             example: "credit_card"
 *                           initial_amount:
 *                             type: number
 *                             example: 1000.0
 *                           subscribe_status:
 *                             type: string
 *                             example: "active"
 *                           payment_status:
 *                             type: string
 *                             example: "completed"
 *                     diamond:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b5"
 *                           user_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b6"
 *                           scheme_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b7"
 *                           payment_type:
 *                             type: string
 *                             example: "bank_transfer"
 *                           initial_amount:
 *                             type: number
 *                             example: 5000.0
 *                           subscribe_status:
 *                             type: string
 *                             example: "pending"
 *                           payment_status:
 *                             type: string
 *                             example: "pending"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching the subscription report"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.get('/subscribe-report', subscriptionController.getSubscriptionReport);

/**
 * @swagger
 * /subscribe-report-user/{user_id}:
 *   get:
 *     summary: Retrieves the subscription report for a specific user
 *     description: Fetches the report containing all Gold and Diamond subscriptions for the specified user by their user_id.
 *     operationId: getSubscriptionReportUser
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: user_id
 *         in: path
 *         required: true
 *         description: The ID of the user whose subscriptions are to be fetched.
 *         schema:
 *           type: string
 *           example: "60c72b2f9f1b2c001f98f1b8"
 *     responses:
 *       200:
 *         description: Subscription report for the user retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Subscription report retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     gold:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b2"
 *                           user_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b3"
 *                           scheme_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b4"
 *                           payment_type:
 *                             type: string
 *                             example: "credit_card"
 *                           initial_amount:
 *                             type: number
 *                             example: 1000.0
 *                           subscribe_status:
 *                             type: string
 *                             example: "active"
 *                           payment_status:
 *                             type: string
 *                             example: "completed"
 *                     diamond:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b5"
 *                           user_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b6"
 *                           scheme_id:
 *                             type: string
 *                             example: "60c72b2f9f1b2c001f98f1b7"
 *                           payment_type:
 *                             type: string
 *                             example: "bank_transfer"
 *                           initial_amount:
 *                             type: number
 *                             example: 5000.0
 *                           subscribe_status:
 *                             type: string
 *                             example: "pending"
 *                           payment_status:
 *                             type: string
 *                             example: "pending"
 *       400:
 *         description: User ID is required or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User ID is required"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching the subscription report"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.get('/subscribe-report-user/:user_id', subscriptionController.getSubscriptionReporUser);

/**
 * @swagger
 * /pending_requests:
 *   get:
 *     summary: Retrieve all pending subscription requests with user details.
 *     tags:
 *       - Subscription
 *     security:
 *       - BearerAuth: []
 *     description: Fetch all subscription requests with `subscribe_status` set to `waiting`, and for each request, retrieve the associated user details.
 *     responses:
 *       200:
 *         description: List of pending requests with user details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Pending requests retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "subscriptionId1"
 *                       subscribe_status:
 *                         type: string
 *                         example: "waiting"
 *                       user_id:
 *                         type: string
 *                         example: "userId1"
 *                       userDetails:
 *                         type: object
 *                         properties:
 *                           _id:
 *                             type: string
 *                             example: "userId1"
 *                           name:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john@example.com"
 *                           message:
 *                             type: string
 *                             example: "User not found"
 *       404:
 *         description: No pending requests found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "No pending requests found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while fetching the pending requests"
 *                 error:
 *                   type: string
 *                   example: "Database connection failed"
 */
router.get('/pending_requests', subscriptionController.getPendingRequests);

module.exports = router;
