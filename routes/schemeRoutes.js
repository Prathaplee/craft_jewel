// routes/schemeRoutes.js
const express = require('express');
const router = express.Router();
const SchemeController = require('../controllers/schemeController');

/**
 * @swagger
 * /createscheme:
 *   post:
 *     summary: Creates a new scheme
 *     description: This endpoint allows you to create a new scheme with details such as name, type, amount, weight, and description. 
 *     operationId: createScheme
 *     tags:
 *       - Scheme
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheme_name:
 *                 type: string
 *                 description: The name of the scheme.
 *                 example: "Gold Plan"
 *               scheme_type:
 *                 type: string
 *                 enum: ["diamond", "gold"]
 *                 description: The type of the scheme (either "diamond" or "gold").
 *                 example: "gold"
 *               min_amount:
 *                 type: number
 *                 description: The minimum subscription amount for the scheme.
 *                 example: 1000
 *               max_amount:
 *                 type: number
 *                 description: The maximum subscription amount for the scheme.
 *                 example: 5000
 *               duration:
 *                 type: number
 *                 description: The duration of the scheme in months.
 *                 example: 12
 *               scheme_description:
 *                 type: string
 *                 description: A brief description of the scheme.
 *                 example: "This is a premium gold subscription plan."
 *               is_weight_or_amount:
 *                 type: string
 *                 enum: ["weight", "amount"]
 *                 description: Flag indicating if the scheme is based on weight or amount. (Only applies to gold schemes).
 *                 example: "weight"
 *               min_weight:
 *                 type: number
 *                 description: The minimum weight for the scheme (if the scheme is based on weight).
 *                 example: 5
 *               max_weight:
 *                 type: number
 *                 description: The maximum weight for the scheme (if the scheme is based on weight).
 *                 example: 50
 *     responses:
 *       201:
 *         description: Scheme created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier of the created scheme.
 *                   example: "60c72b2f9f1b2c001f98f1b9"
 *                 scheme_name:
 *                   type: string
 *                   description: The name of the scheme.
 *                   example: "Gold Plan"
 *                 scheme_type:
 *                   type: string
 *                   description: The type of the scheme (either "diamond" or "gold").
 *                   example: "gold"
 *                 min_amount:
 *                   type: number
 *                   description: The minimum subscription amount for the scheme.
 *                   example: 1000
 *                 max_amount:
 *                   type: number
 *                   description: The maximum subscription amount for the scheme.
 *                   example: 5000
 *                 duration:
 *                   type: number
 *                   description: The duration of the scheme in months.
 *                   example: 12
 *                 scheme_description:
 *                   type: string
 *                   description: A brief description of the scheme.
 *                   example: "This is a premium gold subscription plan."
 *                 is_weight_or_amount:
 *                   type: string
 *                   description: Flag indicating if the scheme is based on weight or amount. (Only applies to gold schemes).
 *                   example: "weight"
 *                 min_weight:
 *                   type: number
 *                   description: The minimum weight for the scheme (if the scheme is based on weight).
 *                   example: 5
 *                 max_weight:
 *                   type: number
 *                   description: The maximum weight for the scheme (if the scheme is based on weight).
 *                   example: 50
 *       400:
 *         description: Bad request. Invalid input, such as an invalid scheme type or missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "scheme_type is required and must be a string."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error creating scheme"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.post('/createscheme', SchemeController.createScheme);

/**
 * @swagger
 * /getAllscheme:
 *   get:
 *     summary: Retrieves all available schemes
 *     description: This endpoint fetches all the available schemes from the database, including their details such as scheme name, type, amounts, weight limits, and description.
 *     operationId: getSchemes
 *     tags:
 *       - Scheme
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: A list of all available schemes.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   _id:
 *                     type: string
 *                     description: The unique identifier for the scheme.
 *                     example: "60c72b2f9f1b2c001f98f1b9"
 *                   scheme_name:
 *                     type: string
 *                     description: The name of the scheme.
 *                     example: "Gold Plan"
 *                   scheme_type:
 *                     type: string
 *                     enum: ["diamond", "gold"]
 *                     description: The type of the scheme.
 *                     example: "gold"
 *                   min_amount:
 *                     type: number
 *                     description: The minimum amount for the scheme.
 *                     example: 1000
 *                   max_amount:
 *                     type: number
 *                     description: The maximum amount for the scheme.
 *                     example: 5000
 *                   is_weight_or_amount:
 *                     type: string
 *                     enum: ["weight", "amount"]
 *                     description: Whether the scheme is based on weight or amount (only for gold schemes).
 *                     example: "weight"
 *                   min_weight:
 *                     type: number
 *                     description: The minimum weight for the scheme (if based on weight).
 *                     example: 5
 *                   max_weight:
 *                     type: number
 *                     description: The maximum weight for the scheme (if based on weight).
 *                     example: 50
 *                   duration:
 *                     type: number
 *                     description: The duration of the scheme in months.
 *                     example: 12
 *                   scheme_description:
 *                     type: string
 *                     description: A brief description of the scheme.
 *                     example: "This is a premium gold subscription plan."
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching schemes"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.get('/getAllscheme', SchemeController.getSchemes);

/**
 * @swagger
 * /getscheme/{id}:
 *   get:
 *     summary: Retrieves a specific scheme by its ID
 *     description: This endpoint fetches a specific scheme from the database using the provided scheme ID.
 *     operationId: getScheme
 *     tags:
 *       - Scheme
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the scheme.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9f1b2c001f98f1b9"
 *     responses:
 *       200:
 *         description: A specific scheme details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the scheme.
 *                   example: "60c72b2f9f1b2c001f98f1b9"
 *                 scheme_name:
 *                   type: string
 *                   description: The name of the scheme.
 *                   example: "Gold Plan"
 *                 scheme_type:
 *                   type: string
 *                   enum: ["diamond", "gold"]
 *                   description: The type of the scheme.
 *                   example: "gold"
 *                 min_amount:
 *                   type: number
 *                   description: The minimum amount for the scheme.
 *                   example: 1000
 *                 max_amount:
 *                   type: number
 *                   description: The maximum amount for the scheme.
 *                   example: 5000
 *                 is_weight_or_amount:
 *                   type: string
 *                   enum: ["weight", "amount"]
 *                   description: Whether the scheme is based on weight or amount (only for gold schemes).
 *                   example: "weight"
 *                 min_weight:
 *                   type: number
 *                   description: The minimum weight for the scheme (if based on weight).
 *                   example: 5
 *                 max_weight:
 *                   type: number
 *                   description: The maximum weight for the scheme (if based on weight).
 *                   example: 50
 *                 duration:
 *                   type: number
 *                   description: The duration of the scheme in months.
 *                   example: 12
 *                 scheme_description:
 *                   type: string
 *                   description: A brief description of the scheme.
 *                   example: "This is a premium gold subscription plan."
 *       404:
 *         description: Scheme not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Scheme not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error fetching scheme"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.get('/getscheme/:id', SchemeController.getScheme);

/**
 * @swagger
 * /updatescheme/{id}:
 *   put:
 *     summary: Updates an existing scheme by its ID
 *     description: This endpoint updates an existing scheme's details using the provided scheme ID and data in the request body.
 *     operationId: updateScheme
 *     tags:
 *       - Scheme
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the scheme to be updated.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9f1b2c001f98f1b9"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               scheme_name:
 *                 type: string
 *                 description: The name of the scheme.
 *                 example: "Gold Plan Updated"
 *               scheme_type:
 *                 type: string
 *                 enum: ["diamond", "gold"]
 *                 description: The type of the scheme. Can be 'diamond' or 'gold'.
 *                 example: "diamond"
 *               min_amount:
 *                 type: number
 *                 description: The minimum amount for the scheme.
 *                 example: 1500
 *               max_amount:
 *                 type: number
 *                 description: The maximum amount for the scheme.
 *                 example: 7000
 *               is_weight_or_amount:
 *                 type: string
 *                 enum: ["weight", "amount"]
 *                 description: Whether the scheme is based on weight or amount (only for gold schemes).
 *                 example: "amount"
 *               min_weight:
 *                 type: number
 *                 description: The minimum weight for the scheme (if based on weight).
 *                 example: 5
 *               max_weight:
 *                 type: number
 *                 description: The maximum weight for the scheme (if based on weight).
 *                 example: 50
 *               duration:
 *                 type: number
 *                 description: The duration of the scheme in months.
 *                 example: 12
 *               scheme_description:
 *                 type: string
 *                 description: A brief description of the scheme.
 *                 example: "This is an updated description for the premium gold plan."
 *     responses:
 *       200:
 *         description: The updated scheme details.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                   description: The unique identifier for the scheme.
 *                   example: "60c72b2f9f1b2c001f98f1b9"
 *                 scheme_name:
 *                   type: string
 *                   description: The name of the scheme.
 *                   example: "Gold Plan Updated"
 *                 scheme_type:
 *                   type: string
 *                   enum: ["diamond", "gold"]
 *                   description: The type of the scheme.
 *                   example: "diamond"
 *                 min_amount:
 *                   type: number
 *                   description: The minimum amount for the scheme.
 *                   example: 1500
 *                 max_amount:
 *                   type: number
 *                   description: The maximum amount for the scheme.
 *                   example: 7000
 *                 is_weight_or_amount:
 *                   type: string
 *                   enum: ["weight", "amount"]
 *                   description: Whether the scheme is based on weight or amount (only for gold schemes).
 *                   example: "amount"
 *                 min_weight:
 *                   type: number
 *                   description: The minimum weight for the scheme (if based on weight).
 *                   example: 5
 *                 max_weight:
 *                   type: number
 *                   description: The maximum weight for the scheme (if based on weight).
 *                   example: 50
 *                 duration:
 *                   type: number
 *                   description: The duration of the scheme in months.
 *                   example: 12
 *                 scheme_description:
 *                   type: string
 *                   description: A brief description of the scheme.
 *                   example: "This is an updated description for the premium gold plan."
 *       400:
 *         description: Bad Request - Invalid `scheme_type` provided.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Invalid scheme_type. Allowed values are diamond or gold."
 *       404:
 *         description: Scheme not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Scheme not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error updating scheme"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.put('/updatescheme/:id', SchemeController.updateScheme);

/**
 * @swagger
 * /deletescheme/{id}:
 *   delete:
 *     summary: Deletes a specific scheme by ID
 *     description: This endpoint deletes a scheme based on its unique ID.
 *     operationId: deleteScheme
 *     tags:
 *       - Scheme
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: id
 *         in: path
 *         description: The unique identifier of the scheme to be deleted.
 *         required: true
 *         schema:
 *           type: string
 *           example: "60c72b2f9f1b2c001f98f1b9"
 *     responses:
 *       200:
 *         description: Scheme deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Scheme deleted successfully"
 *       404:
 *         description: Scheme not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Scheme not found"
 *       500:
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting scheme"
 *                 error:
 *                   type: string
 *                   example: "Error details"
 */
router.delete('/deletescheme/:id', SchemeController.deleteScheme);

module.exports = router;