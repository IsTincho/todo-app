import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { toast } from "react-toastify";
import TaskCard from "../components/TaskCard";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmModal from "../components/ConfirmModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const { token } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get("/api/todos", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setTasks(res.data))
      .catch((err) =>
        toast.error(
          "Error al obtener tareas: " + err.response?.data?.msg || err.message
        )
      );
  }, [token]);

  const handleMarkAsCompleted = (id) => {
    axios
      .put(
        `/api/todos/${id}/complete`,
        { isCompleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then(() => {
        toast.success("¡Tarea marcada como completada!");
        setTasks((prev) =>
          prev.map((task) =>
            task._id === id ? { ...task, isCompleted: true } : task
          )
        );
      })
      .catch((err) =>
        toast.error(
          "Error al completar tarea: " + err.response?.data?.msg || err.message
        )
      );
  };

  const confirmDeleteTask = (id) => {
    setTaskIdToDelete(id);
    setShowConfirmModal(true);
  };

  const handleConfirmDelete = () => {
    axios
      .delete(`/api/todos/${taskIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        toast.success("🗑️ ¡Tarea eliminada con éxito!", {
          position: "top-right",
          autoClose: 3000,
        });
        setTasks((prev) => prev.filter((task) => task._id !== taskIdToDelete));
      })
      .catch((err) =>
        toast.error(
          `❌ Error al eliminar tarea: ${
            err.response?.data?.msg || err.message
          }`,
          { position: "top-right", autoClose: 4000 }
        )
      )
      .finally(() => {
        setShowConfirmModal(false);
        setTaskIdToDelete(null);
      });
  };

  const handleEditTask = (task) => {
    setTaskToEdit(task);
    setShowModal(true);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 py-10 px-6 flex flex-col items-center">
      <h1 className="text-4xl font-bold text-slate-800 mb-2">📋 ToDo App</h1>
      <p className="text-gray-600 mb-6">
        Tu espacio privado para manejar tareas con estilo ✨
      </p>

      <div className="w-full max-w-5xl flex justify-between items-center mb-6">
        <p className="text-gray-700">
          Tareas activas: <strong>{tasks.length}</strong>
        </p>
        <button
          onClick={() => setShowModalCreate(true)}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium px-4 py-2 rounded-xl shadow transition-all"
        >
          + Nueva tarea
        </button>
      </div>

      {tasks.length === 0 ? (
        <p className="text-xl text-gray-500 mt-10">
          No tenés tareas todavía 💤
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onMarkAsCompleted={handleMarkAsCompleted}
              onDelete={confirmDeleteTask}
              onEdit={handleEditTask}
            />
          ))}
        </div>
      )}

      <EditTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTaskUpdated={handleTaskUpdated}
        task={taskToEdit}
        token={token}
      />

      <CreateTaskModal
        isOpen={showModalCreate}
        onClose={() => setShowModalCreate(false)}
        onEdit={handleEditTask} //
        onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
        token={token}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        message="Esta acción no se puede deshacer. ¿Querés eliminar esta tarea?"
      />
    </div>
  );
};

export default Dashboard;
