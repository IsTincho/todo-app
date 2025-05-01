const express = require("express");
const {
  createTodo,
  getAllTodos,
  updateTodoOrder,
} = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createTodo);
router.get("/", authMiddleware, getAllTodos);
router.put("/update-order", authMiddleware, updateTodoOrder);

module.exports = router;
