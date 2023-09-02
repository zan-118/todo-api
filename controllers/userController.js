const express = require("express");
const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
app.use(express.json());

const prisma = new PrismaClient();

// Register a new user
exports.register = async (req, res, next) => {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      throw new Error("Passwords do not match");
    }

    if (!password || password.length < 6) {
      throw new Error("Password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ message: "User created successfully", user });
  } catch (error) {
    next(error);
  }
};

// Update an existing user's information
exports.updateUser = async (req, res, next) => {
  try {
    const { email, oldPassword, newPassword, confirmNewPassword } = req.body;

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      throw new Error("Invalid password");
    }

    if (newPassword !== confirmNewPassword) {
      throw new Error("New passwords do not match");
    }

    if (!newPassword || newPassword.length < 6) {
      throw new Error("New password must be at least 6 characters");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const result = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        email,
        password: hashedPassword,

        lastUpdatedPassword: new Date(),
      },
    });

    res.status(200).json({ message: "User updated successfully", result });
  } catch (error) {
    next(error);
  }
};

// Login a user and generate a JWT token

exports.login = async (req, res) => {
  const { username, password } = req.body;
  try {
    if (!username) {
      return res.status(400).json({ msg: "Username cannot be empty!" });
    }
    if (!password) {
      return res.status(400).json({ msg: "Password cannot be empty!" });
    }
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      return res.status(400).json({ msg: "User not found!" });
    }
    const compare = await bcrypt.compare(password, user.password);
    if (!compare) {
      return res
        .status(400)
        .json({ auth: false, message: "Password doesn't match" });
    }
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        email: user.email,
      },
      process.env.TOKEN,
      {
        expiresIn: "3d",
      }
    );
    return res.status(200).json({
      auth: true,
      status: "authorized",
      token,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

exports.getUser = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    console.log(user);
    if (!user) {
      throw new Error("User not found");
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};
