const express = require("express");
const {
  createTodo,
  getAllTodos,
  markTodoAsCompleted,
  editTodo,
  deleteTodo,
  reorderTodos,
} = require("../controllers/todoController");
const authMiddleware = require("../middlewares/authMiddleware");

const router = express.Router();

router.post("/create", authMiddleware, createTodo);
router.get("/", authMiddleware, getAllTodos);
router.put("/:id/complete", authMiddleware, markTodoAsCompleted);
router.put("/:id/edit", authMiddleware, editTodo);
router.delete("/:id", authMiddleware, deleteTodo);
router.put("/reorder", authMiddleware, reorderTodos);

module.exports = router;
