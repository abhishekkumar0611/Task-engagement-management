const notFound = (req, res) => {
  res.status(404).json({
    message: "Route not found",
  });
};

const errorHandler = (error, req, res, next) => {
  console.error(error);

  // Mongoose validation error
  if (error.name === "ValidationError") {
    return res.status(400).json({
      message: "Validation error",
      errors: Object.values(error.errors).map(
        (err) => err.message
      ),
    });
  }

  // Duplicate MongoDB record
  if (error.code === 11000) {
    return res.status(409).json({
      message: "Duplicate record already exists",
    });
  }

  res.status(error.statusCode || 500).json({
    message: error.message || "Internal server error",
  });
};

module.exports = {
  notFound,
  errorHandler,
};