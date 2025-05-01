const Todo = require("../models/Todo");

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find({
      user: req.user._id,
      isDeleted: false,
    }).sort({ order: 1 });

    res.status(200).json(todos);
  } catch (err) {
    console.error("Error al obtener las tareas:", err.message);
    res.status(500).json({ message: "Error al obtener las tareas" });
  }
};

const createTodo = async (req, res) => {
  const { name, description, dueDate } = req.body;

  if (!name || !description || !dueDate) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  if (!req.user || !req.user._id) {
    return res.status(400).json({ message: "User no encontrado en el token" });
  }

  try {
    // Calculo para autogenerar el orden
    const lastTodo = await Todo.findOne({ user: req.user._id }).sort({
      order: -1,
    });
    const newOrder = lastTodo ? lastTodo.order + 1 : 1; // Si no existe, el primer order será 1

    const newTodo = new Todo({
      user: req.user._id,
      name,
      description,
      isDeleted: false,
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

const markTodoAsCompleted = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (todo.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar esta tarea" });
    }

    todo.isCompleted = true;
    await todo.save();

    res.status(200).json({ message: "Tarea completada", todo });
  } catch (err) {
    res.status(500).json({
      message: "Error al marcar tarea como completada",
      error: err.message,
    });
  }
};

const editTodo = async (req, res) => {
  const { id } = req.params;
  const { name, description, dueDate } = req.body;

  if (!name || !description || !dueDate) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (todo.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para modificar esta tarea" });
    }

    todo.name = name;
    todo.description = description;
    todo.dueDate = dueDate;

    await todo.save();
    res.status(200).json({ message: "Tarea editada", todo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al editar tarea", error: err.message });
  }
};

const deleteTodo = async (req, res) => {
  const { id } = req.params;

  try {
    const todo = await Todo.findById(id);

    if (!todo) {
      return res.status(404).json({ message: "Tarea no encontrada" });
    }

    if (todo.user.toString() !== req.user._id) {
      return res
        .status(403)
        .json({ message: "No tienes permiso para eliminar esta tarea" });
    }

    todo.isDeleted = true;
    await todo.save();

    res.status(200).json({ message: "Tarea eliminada", todo });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al eliminar tarea", error: err.message });
  }
};

const reorderTodos = async (req, res) => {
  const { tasksOrder } = req.body;
  if (!Array.isArray(tasksOrder) || tasksOrder.length === 0) {
    return res
      .status(400)
      .json({ message: "El orden de las tareas es necesario" });
  }

  try {
    // Actualizamos el orden de cada tarea según el nuevo orden recibido
    for (let i = 0; i < tasksOrder.length; i++) {
      const todo = await Todo.findById(tasksOrder[i]);

      if (!todo) {
        return res
          .status(404)
          .json({ message: `Tarea con ID ${tasksOrder[i]} no encontrada` });
      }

      if (todo.user.toString() !== req.user._id) {
        return res
          .status(403)
          .json({ message: "No tienes permiso para modificar esta tarea" });
      }

      todo.order = i + 1;
      await todo.save();
    }

    res.status(200).json({ message: "Orden de tareas actualizado" });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al reordenar las tareas", error: err.message });
  }
};

module.exports = {
  getAllTodos,
  createTodo,
  updateTodoOrder,
  markTodoAsCompleted,
  editTodo,
  deleteTodo,
  reorderTodos,
};
