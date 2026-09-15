const express = require("express");

const {
  getUsers,
  createUser,
  updateUser,
  getTeamMembers
} = require("../controllers/userController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getUsers
);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createUser
);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  updateUser
);

router.get(
  "/team-members",
  protect,
  authorize("ADMIN", "MANAGER"),
  getTeamMembers
);

module.exports = router;