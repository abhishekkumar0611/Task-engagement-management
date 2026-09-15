const Engagement = require("../models/Engagement");
const ServiceType = require("../models/ServiceType");
const TaskTemplate = require("../models/TaskTemplate");
const Task = require("../models/Task");

const getNextMonth = (periodKey) => {
  const [year, month] = periodKey
    .split("-")
    .map(Number);

  const date = new Date(
    year,
    month,
    1
  );

  return `${date.getFullYear()}-${String(
    date.getMonth() + 1
  ).padStart(2, "0")}`;
};

const generateNextPeriod = async (engagement) => {
  const service = await ServiceType.findById(
    engagement.serviceType
  );

  if (!service || service.frequency !== "MONTHLY") {
    return null;
  }

  const nextPeriod = getNextMonth(
    engagement.periodKey
  );

  const existing = await Engagement.findOne({
    client: engagement.client,
    serviceType: engagement.serviceType,
    periodKey: nextPeriod,
  });

  if (existing) {
    return existing;
  }

  const templates = await TaskTemplate.find({
    serviceType: engagement.serviceType,
  }).sort({
    position: 1,
  });

  if (!templates.length) {
    throw new Error(
      "No templates found for recurring service"
    );
  }

  const startDate = new Date(
    `${nextPeriod}-01`
  );

  const endDate = new Date(
    startDate.getFullYear(),
    startDate.getMonth() + 1,
    0
  );

  const nextEngagement =
    await Engagement.create({
      client: engagement.client,
      serviceType: engagement.serviceType,
      manager: engagement.manager,
      periodKey: nextPeriod,
      startDate,
      endDate,
      recurring: true,
    });

  // Use the previous engagement's task assignments
  const previousTasks =
    await Task.find({
      engagement: engagement._id,
    });

  const defaultAssignee =
    previousTasks[0]?.assignee;

  if (!defaultAssignee) {
    throw new Error(
      "No previous task assignee found"
    );
  }

  const tasks = templates.map((template) => {
    const dueDate = new Date(startDate);

    dueDate.setDate(
      dueDate.getDate() +
        template.defaultDays
    );

    return {
      engagement: nextEngagement._id,
      template: template._id,
      title: template.title,
      description: template.description,
      assignee: defaultAssignee,
      reviewer: engagement.manager,
      dueDate,
      status: "NOT_STARTED",
    };
  });

  await Task.insertMany(tasks);

  return nextEngagement;
};

module.exports = {
  generateNextPeriod,
};