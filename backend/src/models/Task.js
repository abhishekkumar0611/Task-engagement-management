const mongoose = require("mongoose");

const taskSchema = new mongoose.Schema(
  {
    engagement: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Engagement",
      required: true,
    },

    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TaskTemplate",
      required: true,
    },

    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    assignee: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    reviewer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,

      enum: [
        "NOT_STARTED",
        "IN_PROGRESS",
        "WAITING_FOR_CLIENT",
        "READY_FOR_REVIEW",
        "CHANGES_REQUESTED",
        "COMPLETED",
      ],

      default: "NOT_STARTED",
    },

    submittedAt: {
      type: Date,
    },

    completedAt: {
      type: Date,
    },

    waitingReason: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

taskSchema.index({
  assignee: 1,
  status: 1,
  dueDate: 1,
});

taskSchema.index({
  status: 1,
  dueDate: 1,
});

taskSchema.index({
  engagement: 1,
  status: 1,
});

module.exports = mongoose.model("Task", taskSchema);