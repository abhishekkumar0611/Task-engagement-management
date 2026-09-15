const express = require("express");

const {
  getServices,
  getServiceById,
  createService,
} = require("../controllers/serviceController");

const {
  getTemplates,
  createTemplate,
  updateTemplate,
} = require("../controllers/taskTemplateController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getServices
);

router.get(
  "/:id",
  protect,
  getServiceById
);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createService
);

router.get(
  "/:serviceId/templates",
  protect,
  getTemplates
);

router.post(
  "/:serviceId/templates",
  protect,
  authorize("ADMIN"),
  createTemplate
);

router.patch(
  "/templates/:id",
  protect,
  authorize("ADMIN"),
  updateTemplate
);

module.exports = router;