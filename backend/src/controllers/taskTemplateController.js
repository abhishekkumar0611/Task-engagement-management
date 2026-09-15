const TaskTemplate = require("../models/TaskTemplate");
const ServiceType = require("../models/ServiceType");

const getTemplates = async (
  req,
  res,
  next
) => {
  try {
    const templates =
      await TaskTemplate.find({
        serviceType:
          req.params.serviceId,
      }).sort({
        position: 1,
      });

    res.json({
      success: true,
      templates,
    });
  } catch (error) {
    next(error);
  }
};

const createTemplate = async (
  req,
  res,
  next
) => {
  try {
    const {
      title,
      description,
      defaultDays,
      position,
    } = req.body;

    if (
      !title ||
      position === undefined
    ) {
      return res.status(400).json({
        message:
          "Title and position are required",
      });
    }

    const service =
      await ServiceType.findById(
        req.params.serviceId
      );

    if (!service) {
      return res.status(404).json({
        message:
          "Service type not found",
      });
    }

    const template =
      await TaskTemplate.create({
        serviceType: service._id,
        title,
        description,
        defaultDays:
          defaultDays ?? 7,
        position,
      });

    res.status(201).json({
      success: true,
      message:
        "Task template created successfully",
      template,
    });
  } catch (error) {
    next(error);
  }
};

const updateTemplate = async (
  req,
  res,
  next
) => {
  try {
    const template =
      await TaskTemplate.findByIdAndUpdate(
        req.params.id,
        req.body,
        {
          new: true,
          runValidators: true,
        }
      );

    if (!template) {
      return res.status(404).json({
        message:
          "Task template not found",
      });
    }

    res.json({
      success: true,
      message:
        "Task template updated successfully",
      template,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTemplates,
  createTemplate,
  updateTemplate,
};