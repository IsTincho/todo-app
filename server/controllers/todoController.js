const Todo = require("../models/Todo");

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user._id, isDeleted: false }) // Obtenemos las tareas del usuario utilizando req.user._id
      .sort({ order: 1 }); // Ordenamos las tareas según el campo "order"

    res.status(200).json(todos);
  } catch (err) {
    console.error("Error al obtener las tareas:", err.message);
    res.status(500).json({ message: "Error al obtener las tareas" });
  }
};

const createTodo = async (req, res) => {
  const { name, description, dueDate, order } = req.body;

  if (!name || !description || !dueDate) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    // Calculo para autogenerar el orden
    const lastTodo = await Todo.findOne({ user: req.userId }).sort({
      order: -1,
    });
    const newOrder = lastTodo ? lastTodo.order + 1 : 1; // Si no existe, el primer order será 1

    const newTodo = new Todo({
      user: req.userId,
      name,
      description,
      dueDate,
      order: newOrder,
    });

    await newTodo.save();

    res.status(201).json({ message: "Tarea creada exitosamente", newTodo });
  } catch (err) {
    console.error("Error al crear la tarea:", err.message);
    res.status(500).json({ message: "Error al crear la tarea" });
  }
};

const updateTodoOrder = async (req, res) => {
  const { todoId, newOrder } = req.body;

  if (newOrder === undefined || newOrder === null) {
    return res.status(400).json({ message: "El nuevo orden es requerido" });
  }

  try {
    const todo = await Todo.findById(todoId);

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (todo.user.toString() !== req.userId) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para actualizar esta tarea" });
    }

    todo.order = newOrder;
    await todo.save();

    res
      .status(200)
      .json({ message: "Orden de tarea actualizado exitosamente", todo });
  } catch (err) {
    console.error("Error al actualizar el orden de la tarea:", err.message);
    res
      .status(500)
      .json({ message: "Error al actualizar el orden de la tarea" });
  }
};

module.exports = { getAllTodos, createTodo, updateTodoOrder };
