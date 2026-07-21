const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middleware/auth");

/**
 * GET /api/auth/me
 * Get current user profile
 */
router.get("/me", authMiddleware, authController.getProfile);

/**
 * PUT /api/auth/me
 * Update current user profile
 */
router.put("/me", authMiddleware, authController.updateProfile);

/**
 * GET /api/auth/addresses
 * List current user's addresses
 */
router.get("/addresses", authMiddleware, authController.listAddresses);

/**
 * POST /api/auth/addresses
 * Create address for current user
 */
router.post("/addresses", authMiddleware, authController.createAddress);

/**
 * PUT /api/auth/addresses/:id
 * Update address
 */
router.put("/addresses/:id", authMiddleware, authController.updateAddress);

/**
 * DELETE /api/auth/addresses/:id
 * Delete address
 */
router.delete("/addresses/:id", authMiddleware, authController.deleteAddress);

module.exports = router;
