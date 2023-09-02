const express = require("express");
const todoController = require("../controllers/todoController");
const router = express.Router();
const authOnly = require("../middlewares/auth");

router.post("/", authOnly, todoController.createTodo);
router.patch("/", authOnly, todoController.updateTodo);
router.delete("/:id", authOnly, todoController.deleteTodo);
router.get("/", authOnly, todoController.getAllTodo);
router.get("/:id", authOnly, todoController.getTodoById);
module.exports = router;
