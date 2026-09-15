const Task = require("../models/Task");

const getDashboard = async (req, res, next) => {
  try {
    const filter = {};

    if (req.user.role === "TEAM_MEMBER") {
      filter.assignee = req.user._id;
    }

    if (req.user.role === "MANAGER") {
      filter.reviewer = req.user._id;
    }

    const now = new Date();

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    const [
      openTasks,
      overdueTasks,
      dueToday,
      waitingForClient,
      waitingForReview,
    ] = await Promise.all([
      Task.countDocuments({
        ...filter,
        status: {
          $nin: ["COMPLETED"],
        },
      }),

      Task.countDocuments({
        ...filter,
        status: {
          $nin: ["COMPLETED"],
        },
        dueDate: {
          $lt: now,
        },
      }),

      Task.countDocuments({
        ...filter,
        status: {
          $nin: ["COMPLETED"],
        },
        dueDate: {
          $gte: startOfToday,
          $lte: endOfToday,
        },
      }),

      Task.countDocuments({
        ...filter,
        status: "WAITING_FOR_CLIENT",
      }),

      Task.countDocuments({
        ...filter,
        status: "READY_FOR_REVIEW",
      }),
    ]);

    res.json({
      success: true,
      dashboard: {
        openTasks,
        overdueTasks,
        dueToday,
        waitingForClient,
        waitingForReview,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboard,
};