const ServiceType = require("../models/ServiceType");
const TaskTemplate = require("../models/TaskTemplate");

const getServices = async (
  req,
  res,
  next
) => {
  try {
    const services =
      await ServiceType.find({
        isActive: true,
      }).sort({ name: 1 });

    res.json({
      success: true,
      services,
    });
  } catch (error) {
    next(error);
  }
};

const getServiceById = async (
  req,
  res,
  next
) => {
  try {
    const service =
      await ServiceType.findById(
        req.params.id
      );

    if (!service) {
      return res.status(404).json({
        message: "Service type not found",
      });
    }

    const templates =
      await TaskTemplate.find({
        serviceType: service._id,
      }).sort({
        position: 1,
      });

    res.json({
      success: true,
      service,
      templates,
    });
  } catch (error) {
    next(error);
  }
};

const createService = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      frequency,
    } = req.body;

    if (!name || !frequency) {
      return res.status(400).json({
        message:
          "Name and frequency are required",
      });
    }

    const validFrequencies = [
      "ONE_TIME",
      "MONTHLY",
    ];

    if (
      !validFrequencies.includes(
        frequency
      )
    ) {
      return res.status(400).json({
        message: "Invalid frequency",
      });
    }

    const existing =
      await ServiceType.findOne({
        name,
      });

    if (existing) {
      return res.status(409).json({
        message:
          "Service type already exists",
      });
    }

    const service =
      await ServiceType.create({
        name,
        frequency,
      });

    res.status(201).json({
      success: true,
      message:
        "Service type created successfully",
      service,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getServices,
  getServiceById,
  createService,
};