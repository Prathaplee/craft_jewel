const express = require('express');
const router = express.Router();
const rateController = require('../controllers/rateController');

/**
 * @swagger
 * /get-rates:
 *   get:
 *     summary: Retrieve the current rates.
 *     tags:
 *       - Rates
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rates retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rates retrieved successfully"
 *                 data:
 *                   type: object
 *                   description: The rates data.
 *                   properties:
 *                     rate:
 *                       type: number
 *                       description: The rate value.
 *                       example: 1.23
 *       500:
 *         description: Error retrieving rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error retrieving rates"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */

router.get('/get-rates', rateController.getRates); 

/**
 * @swagger
 * /set-rates:
 *   post:
 *     summary: Create or update the gold and silver rates.
 *     tags:
 *       - Rates
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               gold_rate:
 *                 type: number
 *                 description: The rate for gold.
 *                 example: 1800
 *               silver_rate:
 *                 type: number
 *                 description: The rate for silver.
 *                 example: 25
 *     responses:
 *       200:
 *         description: Rates saved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rates saved successfully"
 *                 data:
 *                   type: object
 *                   description: The saved or updated rates.
 *                   properties:
 *                     gold_rate:
 *                       type: number
 *                       example: 1800
 *                     silver_rate:
 *                       type: number
 *                       example: 25
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-30T12:30:00Z"
 *       400:
 *         description: Invalid input data. gold_rate and silver_rate are required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "gold_rate and silver_rate are required"
 *       500:
 *         description: Error saving rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error saving rates"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.post('/set-rates', rateController.createOrUpdateRates); 

/**
 * @swagger
 * /delete-rates:
 *   delete:
 *     summary: Delete all rates from the system.
 *     tags:
 *       - Rates
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Rates deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Rates deleted successfully"
 *       500:
 *         description: Error deleting rates.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error deleting rates"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.delete('/delete-rates', rateController.deleteRates);

module.exports = router;
