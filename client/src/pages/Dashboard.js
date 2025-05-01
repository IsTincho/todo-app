import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "../api/axios";
import { toast } from "react-toastify";
import CreateTaskModal from "../components/CreateTaskModal";
import EditTaskModal from "../components/EditTaskModal";
import ConfirmModal from "../components/ConfirmModal";
import TaskList from "../components/TaskList";
import { PlusCircle, EyeOff, Eye } from "lucide-react";

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
            className: "bg-rose-50 border-l-4 border-rose-500 text-rose-700",
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
            "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
          icon: "🎉",
        });
      } else {
        toast.info("Tarea marcada como pendiente", {
          position: "bottom-right",
          className: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
        });
      }
    } catch (err) {
      toast.error(
        `Error al ${newState ? "completar" : "desmarcar"} tarea: ` +
          err.response?.data?.msg || err.message,
        {
          position: "bottom-right",
          className: "bg-rose-50 border-l-4 border-rose-500 text-rose-700",
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
          "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700",
        icon: "🗑️",
      });

      setTasks((prev) => prev.filter((task) => task._id !== taskIdToDelete));
    } catch (err) {
      toast.error(
        `Error al eliminar tarea: ${err.response?.data?.msg || err.message}`,
        {
          position: "bottom-right",
          className: "bg-rose-50 border-l-4 border-rose-500 text-rose-700",
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
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-10 px-6 flex flex-col items-center transition-all duration-300">
      <div className="w-full max-w-5xl">
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-5xl font-bold text-slate-800 mb-3 tracking-tight">
            <span className="inline-block mr-2 transform hover:scale-110 transition-transform duration-200">
              📋
            </span>
            ToDo App
          </h1>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">
            Tu espacio privado para manejar tareas con estilo ✨
          </p>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/80 backdrop-blur-sm px-5 py-3 rounded-full shadow-sm border border-slate-100">
              <p className="text-slate-600 font-medium flex items-center gap-2">
                <span className="text-rose-500 font-bold">
                  {pendingTasksCount}
                </span>{" "}
                pendientes
                <span className="mx-1 text-slate-300">|</span>
                <span className="text-emerald-500 font-bold">
                  {completedTasksCount}
                </span>{" "}
                completadas
              </p>
            </div>

            <button
              onClick={() => setShowCompletedTasks(!showCompletedTasks)}
              className={`
                flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-300
                ${
                  showCompletedTasks
                    ? "bg-emerald-50 text-emerald-600 border-emerald-200 hover:bg-emerald-100"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
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
            className="group bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white font-medium px-6 py-3 rounded-full shadow-md hover:shadow-lg transition-all duration-300 flex items-center gap-2"
          >
            <PlusCircle className="w-5 h-5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Nueva tarea</span>
          </button>
        </div>

        <div className="w-full bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border border-slate-100 p-6 transition-all duration-300 hover:shadow-2xl">
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
