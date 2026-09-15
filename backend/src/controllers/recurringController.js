const Engagement = require("../models/Engagement");
const {
  generateNextPeriod,
} = require("../services/recurringService");

const generate = async (req, res, next) => {
  try {
    const engagement =
      await Engagement.findById(
        req.params.id
      );

    if (!engagement) {
      return res.status(404).json({
        message: "Engagement not found",
      });
    }

    if (
      req.user.role === "MANAGER" &&
      engagement.manager.toString() !==
        req.user._id.toString()
    ) {
      return res.status(403).json({
        message:
          "You are not authorized to generate this engagement",
      });
    }

    if (!engagement.recurring) {
      return res.status(400).json({
        message:
          "This engagement is not recurring",
      });
    }

    const nextEngagement =
      await generateNextPeriod(
        engagement
      );

    res.status(201).json({
      success: true,
      message:
        "Next recurring engagement generated successfully",
      engagement: nextEngagement,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  generate,
};