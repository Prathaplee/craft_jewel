const express = require('express');
const router = express.Router();
const versionController = require('../controllers/versionController');

/**
 * @swagger
 * /get-version:
 *   get:
 *     summary: Retrieve the application version information.
 *     tags:
 *       - Version
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Version information retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version information retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     version:
 *                       type: string
 *                       example: "1.0.0"
 *                     release_date:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-01-01T10:00:00Z"
 *       404:
 *         description: Version information not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version information not found"
 *       500:
 *         description: An error occurred while retrieving version information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while retrieving version information"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */
router.get('/get-version', versionController.getVersion); 

/**
 * @swagger
 * /set-version:
 *   post:
 *     summary: Set or update application version details.
 *     tags:
 *       - Version
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               current_version:
 *                 type: string
 *                 description: The current version of the application.
 *                 example: "1.0.1"
 *               mandatory_version:
 *                 type: string
 *                 description: The mandatory version required for the application.
 *                 example: "1.0.0"
 *     responses:
 *       200:
 *         description: Version information updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Version information updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     current_version:
 *                       type: string
 *                       example: "1.0.1"
 *                     mandatory_version:
 *                       type: string
 *                       example: "1.0.0"
 *                     updated_at:
 *                       type: string
 *                       format: date-time
 *                       example: "2024-12-31T12:00:00Z"
 *       400:
 *         description: Invalid input, missing required fields.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Both current_version and mandatory_version are required"
 *       500:
 *         description: An error occurred while updating version information.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "An error occurred while updating version information"
 *                 error:
 *                   type: string
 *                   example: "Error message details"
 */

router.post('/set-version', versionController.setVersion); // Set or update version info
router.get('/check-update-version', versionController.checkUpdate); // The checkUpdate API compares the version query parameter against the current_version and mandatory_version to determine the update type.

module.exports = router;
