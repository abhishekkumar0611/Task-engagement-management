const mongoose = require("mongoose");

const taskTemplateSchema = new mongoose.Schema(
  {
    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },

    title: {
      type: String,
      required: true,
      trim: true,
    },

    description: {
      type: String,
      default: "",
    },

    defaultDays: {
      type: Number,
      default: 7,
      min: 0,
    },

    position: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

taskTemplateSchema.index(
  {
    serviceType: 1,
    position: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "TaskTemplate",
  taskTemplateSchema
);