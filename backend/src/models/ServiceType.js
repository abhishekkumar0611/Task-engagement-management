const mongoose = require("mongoose");

const serviceTypeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    frequency: {
      type: String,
      enum: ["ONE_TIME", "MONTHLY"],
      required: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("ServiceType", serviceTypeSchema);