const mongoose = require("mongoose");

const Engagement = require("../models/Engagement");
const Task = require("../models/Task");
const TaskTemplate = require("../models/TaskTemplate");
const Client = require("../models/Client");
const ServiceType = require("../models/ServiceType");
const User = require("../models/User");

const createEngagement = async ({
  clientId,
  serviceTypeId,
  managerId,
  periodKey,
  startDate,
  endDate,
  recurring,
  defaultAssigneeId,
}) => {
  const session = await mongoose.startSession();

  try {
    let createdEngagement;
    let createdTasks = [];

    await session.withTransaction(async () => {
      // 1. Validate client
      const client = await Client.findOne({
        _id: clientId,
        isActive: true,
      }).session(session);

      if (!client) {
        const error = new Error("Client not found or inactive");
        error.statusCode = 404;
        throw error;
      }

      // 2. Validate service
      const service = await ServiceType.findOne({
        _id: serviceTypeId,
        isActive: true,
      }).session(session);

      if (!service) {
        const error = new Error("Service type not found or inactive");
        error.statusCode = 404;
        throw error;
      }

      // 3. Validate manager
      const manager = await User.findOne({
        _id: managerId,
        role: "MANAGER",
        isActive: true,
      }).session(session);

      if (!manager) {
        const error = new Error("Manager not found or inactive");
        error.statusCode = 404;
        throw error;
      }

      // 4. Validate assignee
      const assignee = await User.findOne({
        _id: defaultAssigneeId,
        role: "TEAM_MEMBER",
        isActive: true,
      }).session(session);

      if (!assignee) {
        const error = new Error("Team member assignee not found or inactive");
        error.statusCode = 404;
        throw error;
      }

      // 5. Check duplicate engagement
      const existingEngagement = await Engagement.findOne({
        client: clientId,
        serviceType: serviceTypeId,
        periodKey,
      }).session(session);

      if (existingEngagement) {
        const error = new Error(
          "Engagement already exists for this client, service and period"
        );

        error.statusCode = 409;
        throw error;
      }

      // 6. Get task templates
      const templates = await TaskTemplate.find({
        serviceType: serviceTypeId,
      })
        .sort({ position: 1 })
        .session(session);

      if (!templates.length) {
        const error = new Error(
          "No task templates configured for this service"
        );

        error.statusCode = 400;
        throw error;
      }

      // 7. Create engagement
      const engagement = await Engagement.create(
        [
          {
            client: clientId,
            serviceType: serviceTypeId,
            manager: managerId,
            periodKey,
            startDate,
            endDate,
            recurring:
              recurring !== undefined
                ? recurring
                : service.frequency === "MONTHLY",
          },
        ],
        { session }
      );

      createdEngagement = engagement[0];

      // 8. Generate tasks from templates
      const taskDocuments = templates.map((template) => {
        const dueDate = new Date(startDate);

        dueDate.setDate(
          dueDate.getDate() + template.defaultDays
        );

        return {
          engagement: createdEngagement._id,
          template: template._id,
          title: template.title,
          description: template.description,
          assignee: defaultAssigneeId,
          reviewer: managerId,
          dueDate,
          status: "NOT_STARTED",
        };
      });

      createdTasks = await Task.insertMany(taskDocuments, {
        session,
      });
    });

    return {
      engagement: createdEngagement,
      tasks: createdTasks,
    };
  } finally {
    await session.endSession();
  }
};

module.exports = {
  createEngagement,
};