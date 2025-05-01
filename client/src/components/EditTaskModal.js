import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import axios from "../api/axios";
import { toast } from "react-toastify";

const EditTaskModal = ({ isOpen, onClose, onTaskUpdated, task, token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      const response = await axios.put(
        `/api/todos/${task._id}/edit`,
        { name, description, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onTaskUpdated(response.data.todo);
      toast.success("Tarea editada exitosamente! 📝");
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      console.error(err);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-xl shadow-lg w-96">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold">Editar Tarea</h2>
          <button onClick={onClose} className="text-gray-500">
            <FaTimes size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Nombre
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Descripción
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-600">
              Fecha de vencimiento
            </label>
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mt-2 p-2 border rounded-lg"
              required
            />
          </div>

          <button
            type="submit"
            className={`w-full bg-blue-500 text-white py-2 rounded-lg ${
              loading && "opacity-50"
            }`}
            disabled={loading}
          >
            {loading ? "Actualizando..." : "Actualizar tarea"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditTaskModal;
