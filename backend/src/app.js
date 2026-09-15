const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/authRoute");
const clientRoutes = require("./routes/clientRoute");
const serviceRoutes =
  require("./routes/serviceRoute");
const engagementRoutes = require("./routes/engagementRoute");
const taskRoutes = require("./routes/taskRoute");
const dashboardRoutes = require("./routes/dashboardRoute");
const recurringRoutes =
  require("./routes/recurringRoute");
const userRoutes =
  require("./routes/userRoute");



const {
  notFound,
  errorHandler,
} = require("./middleware/errorMiddleware");

const app = express();

// Middleware
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
  })
);

app.use(express.json());

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Task Management API is running",
  });
});

// Routes
app.use("/api/auth", authRoutes);
app.use(
  "/api/clients",
  clientRoutes
);
app.use(
  "/api/services",
  serviceRoutes
);
app.use("/api/engagements", engagementRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use(
  "/api/recurring",
  recurringRoutes
);
app.use(
  "/api/users",
  userRoutes
);
// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

module.exports = app;