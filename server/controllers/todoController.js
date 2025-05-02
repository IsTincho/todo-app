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

  // Validaciones mejoradas
  if (!name || !description || !dueDate) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Validar longitud del nombre
  if (name.trim().length < 3 || name.trim().length > 100) {
    return res
      .status(400)
      .json({ message: "El nombre debe tener entre 3 y 100 caracteres" });
  }

  // Validar longitud de la descripción
  if (description.trim().length < 5 || description.trim().length > 500) {
    return res
      .status(400)
      .json({ message: "La descripción debe tener entre 5 y 500 caracteres" });
  }

  // Validar fecha
  const selectedDate = new Date(dueDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ message: "Formato de fecha inválido" });
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
      name: name.trim(),
      description: description.trim(),
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

const markTodoAsCompleted = async (req, res) => {
  const { id } = req.params;
  const { isCompleted } = req.body; // Ahora recibimos el estado deseado

  // Validar que el ID sea válido
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "ID de tarea inválido" });
  }

  // Validar que isCompleted sea un booleano
  if (typeof isCompleted !== "boolean") {
    return res
      .status(400)
      .json({ message: "El estado de completado debe ser un valor booleano" });
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

    // Establecer el estado según el valor recibido
    todo.isCompleted = isCompleted;
    await todo.save();

    res.status(200).json({
      message: isCompleted
        ? "Tarea completada"
        : "Tarea marcada como pendiente",
      todo,
    });
  } catch (err) {
    res.status(500).json({
      message: `Error al ${isCompleted ? "completar" : "desmarcar"} tarea`,
      error: err.message,
    });
  }
};

const editTodo = async (req, res) => {
  const { id } = req.params;
  const { name, description, dueDate } = req.body;

  // Validar que el ID sea válido
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "ID de tarea inválido" });
  }

  // Validaciones mejoradas
  if (!name || !description || !dueDate) {
    return res.status(400).json({ message: "Todos los campos son requeridos" });
  }

  // Validar longitud del nombre
  if (name.trim().length < 3 || name.trim().length > 100) {
    return res
      .status(400)
      .json({ message: "El nombre debe tener entre 3 y 100 caracteres" });
  }

  // Validar longitud de la descripción
  if (description.trim().length < 5 || description.trim().length > 500) {
    return res
      .status(400)
      .json({ message: "La descripción debe tener entre 5 y 500 caracteres" });
  }

  // Validar fecha
  const selectedDate = new Date(dueDate);
  if (isNaN(selectedDate.getTime())) {
    return res.status(400).json({ message: "Formato de fecha inválido" });
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

    todo.name = name.trim();
    todo.description = description.trim();
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

  // Validar que el ID sea válido
  if (!id.match(/^[0-9a-fA-F]{24}$/)) {
    return res.status(400).json({ message: "ID de tarea inválido" });
  }

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

  // Validar que todos los IDs sean válidos
  for (const id of tasksOrder) {
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: `ID de tarea inválido: ${id}` });
    }
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
  markTodoAsCompleted,
  editTodo,
  deleteTodo,
  reorderTodos,
};
