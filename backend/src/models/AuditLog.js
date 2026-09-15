const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    task: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Task",
      required: true,
    },

    actor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    action: {
      type: String,
      required: true,
    },

    fromStatus: {
      type: String,
    },

    toStatus: {
      type: String,
    },

    note: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

auditLogSchema.index({
  task: 1,
  createdAt: -1,
});

module.exports = mongoose.model(
  "AuditLog",
  auditLogSchema
);