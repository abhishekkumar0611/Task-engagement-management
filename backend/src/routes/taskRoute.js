const express = require("express");

const {
  getMyTasks,
  getManagedTasks,
  getTaskById,
  changeStatus,
  review,
  assignTask,
  updateDueDate,
  getTaskHistory,
} = require("../controllers/taskController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();


// Get manager/admin tasks
router.get(
  "/",
  protect,
  authorize("ADMIN", "MANAGER"),
  getManagedTasks
);


// Team member's own tasks
router.get(
  "/my",
  protect,
  authorize("TEAM_MEMBER"),
  getMyTasks
);


// View single task
router.get(
  "/:id",
  protect,
  authorize(
    "ADMIN",
    "MANAGER",
    "TEAM_MEMBER"
  ),
  getTaskById
);


// Assign/Reassign task
router.patch(
  "/:id/assign",
  protect,
  authorize("ADMIN", "MANAGER"),
  assignTask
);


// Update due date
router.patch(
  "/:id/due-date",
  protect,
  authorize("ADMIN", "MANAGER"),
  updateDueDate
);


// Team member updates status
router.patch(
  "/:id/status",
  protect,
  authorize("TEAM_MEMBER"),
  changeStatus
);


// Manager reviews task
router.post(
  "/:id/review",
  protect,
  authorize("MANAGER"),
  review
);


// Task history
router.get(
  "/:id/history",
  protect,
  authorize(
    "ADMIN",
    "MANAGER",
    "TEAM_MEMBER"
  ),
  getTaskHistory
);

module.exports = router;