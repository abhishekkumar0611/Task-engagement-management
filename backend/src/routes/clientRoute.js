const express = require("express");

const {
  getClients,
  getClientById,
  createClient,
  updateClient,
} = require("../controllers/clientController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  getClients
);

router.get(
  "/:id",
  protect,
  getClientById
);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createClient
);

router.patch(
  "/:id",
  protect,
  authorize("ADMIN"),
  updateClient
);

module.exports = router;