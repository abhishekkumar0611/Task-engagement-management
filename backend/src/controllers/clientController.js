const Client = require("../models/Client");

const getClients = async (req, res, next) => {
  try {
    const clients = await Client.find({
      isActive: true,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: clients.length,
      clients,
    });
  } catch (error) {
    next(error);
  }
};

const getClientById = async (req, res, next) => {
  try {
    const client = await Client.findById(
      req.params.id
    );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      client,
    });
  } catch (error) {
    next(error);
  }
};

const createClient = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
    } = req.body;

    if (!name) {
      return res.status(400).json({
        message: "Client name is required",
      });
    }

    const client = await Client.create({
      name,
      email,
      phone,
    });

    res.status(201).json({
      success: true,
      message: "Client created successfully",
      client,
    });
  } catch (error) {
    next(error);
  }
};

const updateClient = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      isActive,
    } = req.body;

    const client =
      await Client.findByIdAndUpdate(
        req.params.id,
        {
          name,
          email,
          phone,
          isActive,
        },
        {
          new: true,
          runValidators: true,
        }
      );

    if (!client) {
      return res.status(404).json({
        message: "Client not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Client updated successfully",
      client,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  updateClient,
};