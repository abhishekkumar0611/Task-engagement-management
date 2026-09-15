const bcrypt = require("bcryptjs");
const User = require("../models/User");

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name,
      email,
      password,
      role,
    } = req.body;

    if (
      !name ||
      !email ||
      !password ||
      !role
    ) {
      return res.status(400).json({
        message:
          "name, email, password and role are required",
      });
    }

    const validRoles = [
      "ADMIN",
      "MANAGER",
      "TEAM_MEMBER",
    ];

    if (!validRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid role",
      });
    }

    const existing =
      await User.findOne({
        email: email.toLowerCase(),
      });

    if (existing) {
      return res.status(409).json({
        message: "User already exists",
      });
    }

    const hashedPassword =
      await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role,
    });

    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (
  req,
  res,
  next
) => {
  try {
    const {
      name,
      role,
      isActive,
    } = req.body;

    const user =
      await User.findByIdAndUpdate(
        req.params.id,
        {
          name,
          role,
          isActive,
        },
        {
          new: true,
          runValidators: true,
        }
      ).select("-password");

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      success: true,
      message: "User updated successfully",
      user,
    });
  } catch (error) {
    next(error);
  }
};

const getTeamMembers = async (req, res, next) => {
  try {
    const users = await User.find({
      role: "TEAM_MEMBER",
      isActive: true,
    })
      .select("name email role")
      .sort({ name: 1 });

    res.json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  getTeamMembers
};