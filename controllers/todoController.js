const express = require("express");
const { PrismaClient } = require("@prisma/client");
const createError = require("../utils/createError");

const prisma = new PrismaClient();

const app = express();
app.use(express.json());

// CREATE TODO
exports.createTodo = async (req, res, next) => {
  try {
    const { title, completed } = req.body;
    const todo = await prisma.todo.create({
      data: {
        title,
        completed,
        userId: req.user.id,
      },
    });
    res.status(201).json({ todo, message: "Todo created successfully" });
  } catch (error) {
    next(error);
  }
};

// UPDATE TODO
exports.updateTodo = async (req, res, next) => {
  try {
    const { todoId, title, completed, dueDate } = req.body;
    const todo = await prisma.todo.findUnique({
      where: { id: todoId, userId: req.user.id },
    });
    if (!todo) {
      createError("Todo not found", 404, next);
    }

    const updatedTodo = await prisma.todo.update({
      where: { id: todoId },
      data: { title, completed, dueDate },
    });

    if (!updatedTodo) {
      createError("Todo not found", 404, next);
    }

    res.status(201).json({
      message: "Todo updated successfully",
      updatedTodo: { ...updatedTodo, title, completed, dueDate },
    });
  } catch (error) {
    next(error);
  }
};

// DELETE TODO
exports.deleteTodo = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await prisma.todo.delete({
      where: { id: Number(id), userId: req.user.id },
    });

    if (result === null || result === undefined) {
      createError("Todo not found", 404, next);
    }

    res.status(204).json({ message: "Todo deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// GET ALL TODO
exports.getAllTodo = async (req, res, next) => {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
    });
    if (!user) {
      createError("User not found", 404, next);
    }

    const todos = await prisma.todo.findMany({
      where: { userId: req.user.id },
    });

    if (todos.length === 0) {
      createError("No todos found", 404, next);
    }

    res.status(200).json(todos);
  } catch (error) {
    next(error);
  }
};

// GET TODO BY ID
exports.getTodoById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const todo = await prisma.todo.findUnique({
      where: { id: Number(id), userId: req.user.id },
      select: {
        id: true,
        title: true,
        completed: true,
        dueDate: true,
      },
    });

    if (!todo) {
      createError("Todo not found", 404, next);
    }

    res.status(200).json(todo);
  } catch (error) {
    next(error);
  }
};
