const Task = require("../models/Task");
const AuditLog = require("../models/AuditLog");

const {
  updateTaskStatus,
  reviewTask,
} = require("../services/taskService");

// Get logged-in team member's tasks
const getMyTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({
      assignee: req.user._id,
    })
      .populate("engagement", "periodKey startDate endDate")
      .populate("template", "title position")
      .populate("reviewer", "name email")
      .populate({
        path: "engagement",
        populate: [
          {
            path: "client",
            select: "name email",
          },
          {
            path: "serviceType",
            select: "name frequency",
          },
        ],
      })
      .sort({ dueDate: 1 });

    res.json({
      success: true,
      count: tasks.length,
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// Get a single task
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate("assignee", "name email role")
      .populate("reviewer", "name email role")
      .populate("template", "title position")
      .populate({
        path: "engagement",
        populate: [
          {
            path: "client",
            select: "name email phone",
          },
          {
            path: "serviceType",
            select: "name frequency",
          },
        ],
      });

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Team member can only see their own task
    if (
      req.user.role === "TEAM_MEMBER" &&
      task.assignee._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this task",
      });
    }

    // Manager can only see tasks they review
    if (
      req.user.role === "MANAGER" &&
      task.reviewer._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this task",
      });
    }

    res.json({
      success: true,
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Team member updates task status
const changeStatus = async (req, res, next) => {
  try {
    const { status, note } = req.body;

    if (!status) {
      return res.status(400).json({
        message: "status is required",
      });
    }

    const task = await updateTaskStatus({
      taskId: req.params.id,
      userId: req.user._id,
      newStatus: status,
      note,
    });

    res.json({
      success: true,
      message: "Task status updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Manager reviews task
const review = async (req, res, next) => {
  try {
    const { action, note } = req.body;

    const task = await reviewTask({
      taskId: req.params.id,
      reviewerId: req.user._id,
      action,
      note,
    });

    res.json({
      success: true,
      message:
        action === "APPROVE"
          ? "Task approved successfully"
          : "Task sent back for changes",
      task,
    });
  } catch (error) {
    next(error);
  }
};

// Audit history
const getTaskHistory = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      req.user.role === "TEAM_MEMBER" &&
      task.assignee.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this history",
      });
    }

    if (
      req.user.role === "MANAGER" &&
      task.reviewer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this history",
      });
    }

    const history = await AuditLog.find({
      task: task._id,
    })
      .populate("actor", "name email role")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: history.length,
      history,
    });
  } catch (error) {
    next(error);
  }
};

const getManagedTasks = async (
  req,
  res,
  next
) => {
  try {
    const page = Math.max(
      Number(req.query.page) || 1,
      1
    );

    const limit = Math.min(
      Number(req.query.limit) || 20,
      100
    );

    const skip = (page - 1) * limit;

    const filter = {};

    if (req.user.role === "MANAGER") {
      filter.reviewer = req.user._id;
    }

    if (req.query.status) {
      filter.status = req.query.status;
    }

    if (req.query.assignee) {
      filter.assignee =
        req.query.assignee;
    }

    const [tasks, total] =
      await Promise.all([
        Task.find(filter)
          .populate(
            "assignee",
            "name email"
          )
          .populate(
            "reviewer",
            "name email"
          )
          .populate({
            path: "engagement",
            populate: [
              {
                path: "client",
                select: "name email",
              },
              {
                path: "serviceType",
                select:
                  "name frequency",
              },
            ],
          })
          .sort({
            dueDate: 1,
          })
          .skip(skip)
          .limit(limit),

        Task.countDocuments(filter),
      ]);

    res.json({
      success: true,
      tasks,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(
          total / limit
        ),
      },
    });
  } catch (error) {
    next(error);
  }
};

const assignTask = async (req, res, next) => {
  try {
    const { assigneeId } = req.body;

    if (!assigneeId) {
      return res.status(400).json({
        message: "assigneeId is required",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Manager can only manage their own task
    if (
      req.user.role === "MANAGER" &&
      task.reviewer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to assign this task",
      });
    }

    const assignee = await User.findOne({
      _id: assigneeId,
      role: "TEAM_MEMBER",
      isActive: true,
    });

    if (!assignee) {
      return res.status(404).json({
        message:
          "Active team member not found",
      });
    }

    const previousAssignee = task.assignee;

    task.assignee = assigneeId;

    await task.save();

    await AuditLog.create({
      task: task._id,
      actor: req.user._id,
      action: "TASK_ASSIGNED",
      note: `Task assigned to ${assignee.name}`,
    });

    res.json({
      success: true,
      message: "Task assigned successfully",
      previousAssignee,
      task,
    });
  } catch (error) {
    next(error);
  }
};

const updateDueDate = async (req, res, next) => {
  try {
    const { dueDate } = req.body;

    if (!dueDate) {
      return res.status(400).json({
        message: "dueDate is required",
      });
    }

    const newDueDate = new Date(dueDate);

    if (Number.isNaN(newDueDate.getTime())) {
      return res.status(400).json({
        message: "Invalid dueDate",
      });
    }

    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    // Manager can only update their tasks
    if (
      req.user.role === "MANAGER" &&
      task.reviewer.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to update this task",
      });
    }

    const oldDueDate = task.dueDate;

    task.dueDate = newDueDate;

    await task.save();

    await AuditLog.create({
      task: task._id,
      actor: req.user._id,
      action: "DUE_DATE_UPDATED",
      note: `Due date changed from ${oldDueDate.toISOString()} to ${newDueDate.toISOString()}`,
    });

    res.json({
      success: true,
      message: "Due date updated successfully",
      task,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getMyTasks,
  getTaskById,
  changeStatus,
  review,
  getTaskHistory,
  getManagedTasks,
  assignTask,
  updateDueDate
};