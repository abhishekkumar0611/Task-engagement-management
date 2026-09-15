const Engagement = require("../models/Engagement");
const User = require("../models/User");
const Client = require("../models/Client");
const ServiceType = require("../models/ServiceType");

const {
  createEngagement,
} = require("../services/engagementService");

const create = async (req, res, next) => {
  try {
    const {
      clientId,
      serviceTypeId,
      managerId,
      periodKey,
      startDate,
      endDate,
      recurring,
      defaultAssigneeId,
    } = req.body;

    if (
      !clientId ||
      !serviceTypeId ||
      !periodKey ||
      !startDate ||
      !endDate ||
      !defaultAssigneeId
    ) {
      return res.status(400).json({
        message:
          "clientId, serviceTypeId, periodKey, startDate, endDate and defaultAssigneeId are required",
      });
    }

    // Manager can only create engagements under themselves.
    let selectedManagerId = req.user._id;

    // Admin can choose a manager.
    if (req.user.role === "ADMIN") {
      if (!managerId) {
        return res.status(400).json({
          message: "managerId is required for admin",
        });
      }

      selectedManagerId = managerId;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
      return res.status(400).json({
        message: "Invalid startDate or endDate",
      });
    }

    if (start > end) {
      return res.status(400).json({
        message: "startDate cannot be after endDate",
      });
    }

    const result = await createEngagement({
      clientId,
      serviceTypeId,
      managerId: selectedManagerId,
      periodKey,
      startDate: start,
      endDate: end,
      recurring,
      defaultAssigneeId,
    });

    res.status(201).json({
      success: true,
      message: "Engagement created and tasks generated successfully",
      engagement: result.engagement,
      tasks: result.tasks,
    });
  } catch (error) {
    next(error);
  }
};

const getEngagements = async (req, res, next) => {
  try {
    const filter = {};

    // Managers see their own engagements.
    if (req.user.role === "MANAGER") {
      filter.manager = req.user._id;
    }

    const engagements = await Engagement.find(filter)
      .populate("client", "name email phone")
      .populate("serviceType", "name frequency")
      .populate("manager", "name email role")
      .sort({ startDate: -1 });

    res.json({
      success: true,
      count: engagements.length,
      engagements,
    });
  } catch (error) {
    next(error);
  }
};

const getEngagementById = async (req, res, next) => {
  try {
    const engagement = await Engagement.findById(req.params.id)
      .populate("client", "name email phone")
      .populate("serviceType", "name frequency")
      .populate("manager", "name email role");

    if (!engagement) {
      return res.status(404).json({
        message: "Engagement not found",
      });
    }

    // Manager authorization
    if (
      req.user.role === "MANAGER" &&
      engagement.manager._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "You are not authorized to view this engagement",
      });
    }

    res.json({
      success: true,
      engagement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  create,
  getEngagements,
  getEngagementById,
};