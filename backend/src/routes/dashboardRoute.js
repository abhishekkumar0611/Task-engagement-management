const express = require("express");

const {
  getDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize(
    "ADMIN",
    "MANAGER",
    "TEAM_MEMBER"
  ),
  getDashboard
);

module.exports = router;