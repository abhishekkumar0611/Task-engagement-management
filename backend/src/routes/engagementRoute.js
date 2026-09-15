const express = require("express");

const {
  create,
  getEngagements,
  getEngagementById,
} = require("../controllers/engagementController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

// Admin + Manager can create engagements
router.post(
  "/",
  protect,
  authorize("ADMIN", "MANAGER"),
  create
);

// Admin + Manager can view engagements
router.get(
  "/",
  protect,
  authorize("ADMIN", "MANAGER"),
  getEngagements
);

// Admin + Manager can view one engagement
router.get(
  "/:id",
  protect,
  authorize("ADMIN", "MANAGER"),
  getEngagementById
);

module.exports = router;