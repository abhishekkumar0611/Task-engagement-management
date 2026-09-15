const mongoose = require("mongoose");

const engagementSchema = new mongoose.Schema(
  {
    client: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Client",
      required: true,
    },

    serviceType: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "ServiceType",
      required: true,
    },

    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    periodKey: {
      type: String,
      required: true,
    },

    startDate: {
      type: Date,
      required: true,
    },

    endDate: {
      type: Date,
      required: true,
    },

    recurring: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

engagementSchema.index(
  {
    client: 1,
    serviceType: 1,
    periodKey: 1,
  },
  {
    unique: true,
  }
);

module.exports = mongoose.model(
  "Engagement",
  engagementSchema
);