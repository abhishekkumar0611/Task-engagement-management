const Task = require("../models/Task");
const AuditLog = require("../models/AuditLog");
const Engagement = require("../models/Engagement");

const WORKFLOW = {
  NOT_STARTED: ["IN_PROGRESS"],
  IN_PROGRESS: ["WAITING_FOR_CLIENT", "READY_FOR_REVIEW"],
  WAITING_FOR_CLIENT: ["IN_PROGRESS"],
  READY_FOR_REVIEW: ["COMPLETED", "CHANGES_REQUESTED"],
  CHANGES_REQUESTED: ["IN_PROGRESS"],
  COMPLETED: [],
};

const isValidTransition = (fromStatus, toStatus) => {
  return WORKFLOW[fromStatus]?.includes(toStatus);
};

const updateTaskStatus = async ({
  taskId,
  userId,
  newStatus,
  note = "",
}) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  // Only assigned team member can update their task
  if (task.assignee.toString() !== userId.toString()) {
    const error = new Error(
      "You are not authorized to update this task"
    );
    error.statusCode = 403;
    throw error;
  }

  // Team member cannot directly mark task COMPLETED.
  if (newStatus === "COMPLETED") {
    const error = new Error(
      "Only the reviewer can mark a task as completed"
    );
    error.statusCode = 403;
    throw error;
  }

  if (!isValidTransition(task.status, newStatus)) {
    const error = new Error(
      `Invalid status transition: ${task.status} → ${newStatus}`
    );
    error.statusCode = 400;
    throw error;
  }

  const oldStatus = task.status;

  task.status = newStatus;

  if (newStatus === "READY_FOR_REVIEW") {
    task.submittedAt = new Date();
  }

  if (newStatus === "WAITING_FOR_CLIENT") {
    task.waitingReason = note;
  }

  if (newStatus === "IN_PROGRESS") {
    task.waitingReason = "";
  }

  await task.save();

  await AuditLog.create({
    task: task._id,
    actor: userId,
    action: "STATUS_CHANGED",
    fromStatus: oldStatus,
    toStatus: newStatus,
    note,
  });

  return task;
};

const reviewTask = async ({
  taskId,
  reviewerId,
  action,
  note = "",
}) => {
  const task = await Task.findById(taskId);

  if (!task) {
    const error = new Error("Task not found");
    error.statusCode = 404;
    throw error;
  }

  // Only assigned reviewer can review
  if (task.reviewer.toString() !== reviewerId.toString()) {
    const error = new Error(
      "You are not authorized to review this task"
    );
    error.statusCode = 403;
    throw error;
  }

  // Reviewer cannot approve work that is not ready
  if (task.status !== "READY_FOR_REVIEW") {
    const error = new Error(
      "Only tasks in READY_FOR_REVIEW can be reviewed"
    );
    error.statusCode = 400;
    throw error;
  }

  let newStatus;

  if (action === "APPROVE") {
    newStatus = "COMPLETED";
  } else if (action === "SEND_BACK") {
    newStatus = "CHANGES_REQUESTED";
  } else {
    const error = new Error(
      "Invalid review action. Use APPROVE or SEND_BACK"
    );
    error.statusCode = 400;
    throw error;
  }

  const oldStatus = task.status;

  task.status = newStatus;

  if (newStatus === "COMPLETED") {
    task.completedAt = new Date();
  }

  await task.save();

  await AuditLog.create({
    task: task._id,
    actor: reviewerId,
    action:
      action === "APPROVE"
        ? "TASK_APPROVED"
        : "TASK_SENT_BACK",
    fromStatus: oldStatus,
    toStatus: newStatus,
    note,
  });

  return task;
};

module.exports = {
  updateTaskStatus,
  reviewTask,
  isValidTransition,
};