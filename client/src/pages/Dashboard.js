import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { toast } from "react-toastify";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmModal from "../components/ConfirmModal";
import TaskList from "../components/TaskList";
import {
  PlusCircle,
  EyeOff,
  Eye,
  CheckSquare,
  Clock,
  CheckCircle,
} from "lucide-react";
import TaskDetailModal from "../components/TaskDetailModal";

const Dashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [showModalCreate, setShowModalCreate] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCompleteConfirmModal, setShowCompleteConfirmModal] =
    useState(false);
  const [taskIdToDelete, setTaskIdToDelete] = useState(null);
  const [taskToToggleComplete, setTaskToToggleComplete] = useState(null);
  const [newCompleteState, setNewCompleteState] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);
  const [showCompletedTasks, setShowCompletedTasks] = useState(true);
  const { token } = useSelector((state) => state.auth);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const handleViewDetails = (task) => {
    setSelectedTask(task);
    setDetailModalOpen(true);
  };

  useEffect(() => {
    if (!token) {
      return;
    }

    const fetchTasks = async () => {
      try {
        const res = await axios.get("/api/todos", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTasks(res.data);
      } catch (err) {
        toast.error(
          "Error al obtener tareas: " + err.response?.data?.msg || err.message,
          {
            position: "bottom-right",
            className:
              "bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-700 dark:text-rose-300",
          }
        );
      }
    };

    fetchTasks();
  }, [token]);

  const handleToggleComplete = (id, newState) => {
    // Buscar la tarea para mostrar su nombre en el modal de confirmación
    const taskToToggle = tasks.find((task) => task._id === id);

    if (taskToToggle) {
      setTaskToToggleComplete(id);
      setNewCompleteState(newState);

      // Mostrar confirmación tanto al completar como al desmarcar
      setShowCompleteConfirmModal(true);
    }
  };

  const confirmToggleComplete = async (id, newState) => {
    try {
      const response = await axios.put(
        `/api/todos/${id}/complete`,
        { isCompleted: newState },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Actualizar el estado de las tareas
      setTasks((prev) =>
        prev.map((task) => {
          if (task._id === id) {
            // Si estamos completando la tarea, activar el confeti en el componente TaskCard
            if (newState) {
              return { ...task, isCompleted: newState, showConfetti: true };
            }
            return { ...task, isCompleted: newState };
          }
          return task;
        })
      );

      // Después de un tiempo, quitar la bandera de confeti
      if (newState) {
        setTimeout(() => {
          setTasks((prev) =>
            prev.map((task) => {
              if (task._id === id) {
                return { ...task, showConfetti: false };
              }
              return task;
            })
          );
        }, 1000); //1000ms
      }

      if (newState) {
        toast.success("¡Tarea marcada como completada!", {
          position: "bottom-right",
          className:
            "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-300",
          icon: "🎉",
        });
      } else {
        toast.info("Tarea marcada como pendiente", {
          position: "bottom-right",
          className:
            "bg-blue-50 border-l-4 border-blue-500 text-blue-700 dark:bg-blue-900/50 dark:border-blue-700 dark:text-blue-300",
        });
      }
    } catch (err) {
      toast.error(
        `Error al ${newState ? "completar" : "desmarcar"} tarea: ` +
          err.response?.data?.msg || err.message,
        {
          position: "bottom-right",
          className:
            "bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-700 dark:text-rose-300",
        }
      );
    } finally {
      setShowCompleteConfirmModal(false);
      setTaskToToggleComplete(null);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      await axios.delete(`/api/todos/${taskIdToDelete}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success("¡Tarea eliminada con éxito!", {
        position: "bottom-right",
        className:
          "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-300",
        icon: "🗑️",
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskIdToDelete));
    } catch (err) {
      toast.error(
        `Error al eliminar tarea: ${err.response?.data?.msg || err.message}`,
        {
          position: "bottom-right",
          className:
            "bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-700 dark:text-rose-300",
        }
      );
    } finally {
      setShowConfirmModal(false);
      setTaskIdToDelete(null);
    }
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks((prev) =>
      prev.map((task) => (task._id === updatedTask._id ? updatedTask : task))
    );
  };

  // Ordenar y filtrar tareas
  const sortedAndFilteredTasks = [...tasks]
    .sort((a, b) => {
      // Primero por estado de completado
      if (a.isCompleted && !b.isCompleted) return 1;
      if (!a.isCompleted && b.isCompleted) return -1;

      return 0;
    })
    .filter((task) => showCompletedTasks || !task.isCompleted);

  // Contar tareas completadas y pendientes
  const completedTasksCount = tasks.filter((task) => task.isCompleted).length;
  const pendingTasksCount = tasks.length - completedTasksCount;

  // Obtener el nombre de la tarea para el modal de confirmación
  const taskToCompleteName =
    tasks.find((task) => task._id === taskToToggleComplete)?.name ||
    "esta tarea";

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 pt-20 px-6 pb-10 flex flex-col items-center transition-all duration-300">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-10 animate-fade-in">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-r from-rose-500 to-pink-500 rounded-xl shadow-lg mb-4">
            <CheckSquare className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-3 tracking-tight">
            ToDo App
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-lg max-w-xl mx-auto">
            Tu espacio privado para manejar tareas con estilo ✨
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
            <div className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-sm border border-slate-100 dark:border-slate-700 w-full sm:w-auto">
              <div className="flex flex-wrap justify-center sm:justify-start items-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="p-1 bg-rose-100 dark:bg-rose-900/30 rounded-full">
                    <Clock className="w-4 h-4 text-rose-500 dark:text-rose-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    <span className="text-rose-500 dark:text-rose-400 font-bold">
                      {pendingTasksCount}
                    </span>{" "}
                    pendientes
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="p-1 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                    <CheckCircle className="w-4 h-4 text-emerald-500 dark:text-emerald-400" />
                  </div>
                  <span className="text-slate-600 dark:text-slate-300 font-medium">
                    <span className="text-emerald-500 dark:text-emerald-400 font-bold">
                      {completedTasksCount}
                    </span>{" "}
                    completadas
                  </span>
                </div>
              </div>
            </div>

            <button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300 w-full sm:w-auto justify-center
                ${
                  showCompletedTasks
                    ? "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
                    : "bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700"
                }
              `}
            >
              {showCompletedTasks ? (
                <>
                  <EyeOff className="w-4 h-4" />
                  <span>Ocultar completadas</span>
                </>
              ) : (
                <>
                  <Eye className="w-4 h-4" />
                  <span>Mostrar completadas</span>
                </>
              )}
            </button>
          </div>

          <button
            onClick={() => setShowModalCreate(true)}
            className="group bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2 w-full md:w-auto justify-center"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Nueva tarea</span>
          </button>
        </div>

        <div className="w-full bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-6 transition-all duration-300 hover:shadow-2xl">
          <TaskList
            tasks={sortedAndFilteredTasks}
            setTasks={setTasks}
            token={token}
            onToggleComplete={handleToggleComplete}
            onDelete={(id) => {
              setTaskIdToDelete(id);
              setShowConfirmModal(true);
            }}
            onEdit={(task) => {
              setTaskToEdit(task);
              setShowModal(true);
            }}
            onViewDetails={handleViewDetails}
          />
        </div>
      </div>

      <CreateTaskModal
        isOpen={showModalCreate}
        onClose={() => setShowModalCreate(false)}
        onTaskCreated={(newTask) => setTasks((prev) => [...prev, newTask])}
        token={token}
      />

      <EditTaskModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onTaskUpdated={handleTaskUpdated}
        task={taskToEdit}
        token={token}
      />

      <ConfirmModal
        isOpen={showConfirmModal}
        onClose={() => setShowConfirmModal(false)}
        onConfirm={handleConfirmDelete}
        message="Esta acción no se puede deshacer. ¿Querés eliminar esta tarea?"
      />

      <TaskDetailModal
        isOpen={detailModalOpen}
        onClose={() => setDetailModalOpen(false)}
        task={selectedTask}
        onToggleComplete={handleToggleComplete}
        onDelete={(id) => {
          setTaskIdToDelete(id);
          setShowConfirmModal(true);
        }}
        onEdit={(task) => {
          setTaskToEdit(task);
          setShowModal(true);
        }}
      />

      <ConfirmModal
        isOpen={showCompleteConfirmModal}
        onClose={() => setShowCompleteConfirmModal(false)}
        onConfirm={() =>
          confirmToggleComplete(taskToToggleComplete, newCompleteState)
        }
        message={
          newCompleteState
            ? `¿Estás seguro de marcar "${taskToCompleteName}" como completada?`
            : `¿Estás seguro de marcar "${taskToCompleteName}" como pendiente?`
        }
        confirmText={newCompleteState ? "Completar" : "Desmarcar"}
        confirmColor={newCompleteState ? "emerald" : "blue"}
      />
    </div>
  );
};

export default Dashboard;
