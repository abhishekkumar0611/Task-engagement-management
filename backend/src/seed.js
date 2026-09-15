require("dotenv").config();

const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");

const User = require("./models/User");
const Client = require("./models/Client");
const ServiceType = require("./models/ServiceType");
const TaskTemplate = require("./models/TaskTemplate");

const seed = async () => {
  await connectDB();

  await Promise.all([
    User.deleteMany({}),
    Client.deleteMany({}),
    ServiceType.deleteMany({}),
    TaskTemplate.deleteMany({}),
  ]);

  const password =
    await bcrypt.hash(
      "Password@123",
      10
    );

  const users = await User.insertMany([
    {
      name: "Admin User",
      email: "admin@example.com",
      password,
      role: "ADMIN",
    },
    {
      name: "Manager One",
      email: "manager1@example.com",
      password,
      role: "MANAGER",
    },
    {
      name: "Manager Two",
      email: "manager2@example.com",
      password,
      role: "MANAGER",
    },
    {
      name: "Team Member One",
      email: "member1@example.com",
      password,
      role: "TEAM_MEMBER",
    },
    {
      name: "Team Member Two",
      email: "member2@example.com",
      password,
      role: "TEAM_MEMBER",
    },
    {
      name: "Team Member Three",
      email: "member3@example.com",
      password,
      role: "TEAM_MEMBER",
    },
    {
      name: "Team Member Four",
      email: "member4@example.com",
      password,
      role: "TEAM_MEMBER",
    },
  ]);

  await Client.insertMany([
    {
      name: "ABC Pvt Ltd",
      email: "abc@example.com",
      phone: "9000000001",
    },
    {
      name: "XYZ Limited",
      email: "xyz@example.com",
      phone: "9000000002",
    },
    {
      name: "Acme Industries",
      email: "acme@example.com",
      phone: "9000000003",
    },
    {
      name: "Tech Solutions",
      email: "tech@example.com",
      phone: "9000000004",
    },
    {
      name: "Global Traders",
      email: "global@example.com",
      phone: "9000000005",
    },
  ]);

  const monthlyGST =
    await ServiceType.create({
      name: "Monthly GST Compliance",
      frequency: "MONTHLY",
    });

  const registration =
    await ServiceType.create({
      name: "GST Registration",
      frequency: "ONE_TIME",
    });

  const refund =
    await ServiceType.create({
      name: "GST Refund",
      frequency: "ONE_TIME",
    });

  await TaskTemplate.insertMany([
    {
      serviceType: monthlyGST._id,
      title: "Collect GST documents",
      description:
        "Collect documents from client",
      defaultDays: 3,
      position: 1,
    },
    {
      serviceType: monthlyGST._id,
      title: "Prepare GST return",
      description:
        "Prepare monthly GST return",
      defaultDays: 7,
      position: 2,
    },
    {
      serviceType: monthlyGST._id,
      title: "Review and file",
      description:
        "Review and file GST return",
      defaultDays: 10,
      position: 3,
    },
    {
      serviceType: registration._id,
      title: "Collect registration documents",
      defaultDays: 3,
      position: 1,
    },
    {
      serviceType: registration._id,
      title: "Prepare registration application",
      defaultDays: 7,
      position: 2,
    },
    {
      serviceType: refund._id,
      title: "Collect refund documents",
      defaultDays: 3,
      position: 1,
    },
    {
      serviceType: refund._id,
      title: "Prepare refund application",
      defaultDays: 7,
      position: 2,
    },
  ]);

  console.log("Seed completed successfully");

  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});