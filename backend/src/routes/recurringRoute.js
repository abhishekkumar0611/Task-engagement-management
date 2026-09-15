const express = require("express");

const {
  generate,
} = require("../controllers/recurringController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/:id/generate-next",
  protect,
  authorize("ADMIN", "MANAGER"),
  generate
);

module.exports = router;