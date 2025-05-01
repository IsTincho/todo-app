import {
  DndContext,
  closestCenter,
  TouchSensor,
  useSensor,
  useSensors,
  MouseSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  rectSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { CheckCircle, Circle, Trash2, Edit, Calendar } from "lucide-react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import Confetti from "./Confetti";
import { useState, useEffect } from "react";

const SortableTaskItem = ({ task, onToggleComplete, onDelete, onEdit }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task._id });
  const [isCompleting, setIsCompleting] = useState(false);
  const { _id, name, description, dueDate, isCompleted, showConfetti } = task;

  // Calcular si la fecha de vencimiento está próxima (menos de 2 días)
  const today = new Date();
  const taskDate = new Date(dueDate);
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isNearDue = diffDays >= 0 && diffDays <= 2 && !isCompleted;
  const isOverdue = diffDays < 0 && !isCompleted;

  // Efecto para animar la tarea cuando se completa
  useEffect(() => {
    if (showConfetti) {
      setIsCompleting(true);

      // Desactivar la animación después de un tiempo
      const timer = setTimeout(() => {
        setIsCompleting(false);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [showConfetti]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        relative mb-2 bg-white rounded-xl shadow-lg transition-all duration-500
        ${
          isCompleted
            ? "border-l-4 border-emerald-500 opacity-80"
            : isOverdue
            ? "border-l-4 border-rose-500"
            : isNearDue
            ? "border-l-4 border-amber-500"
            : "border-l-4 border-transparent"
        }
        ${
          isCompleting ? "scale-105 shadow-xl bg-emerald-50" : "hover:shadow-xl"
        }
        transform transition-all
      `}
    >
      {showConfetti && <Confetti />}

      <div className="flex items-center p-4">
        <button
          onClick={() => onToggleComplete(_id, !isCompleted)}
          className={`
            transition-all duration-300 rounded-full p-1 mr-3
            ${
              isCompleted
                ? "text-emerald-500 hover:text-amber-500 hover:bg-amber-50 transform hover:scale-110"
                : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 transform hover:scale-110"
            }
          `}
          title={
            isCompleted ? "Marcar como pendiente" : "Marcar como completada"
          }
        >
          {isCompleted ? (
            <CheckCircle className="w-5 h-5 animate-bounce-once" />
          ) : (
            <Circle className="w-5 h-5" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <h2
            className={`
              text-lg font-semibold transition-all duration-500 truncate
              ${isCompleted ? "text-slate-400 line-through" : "text-slate-800"}
            `}
          >
            {name}
          </h2>
          <p
            className={`
              text-sm transition-all duration-500 truncate
              ${isCompleted ? "text-slate-400" : "text-slate-600"}
            `}
          >
            {description}
          </p>
        </div>

        <div
          className={`
            flex items-center gap-1 mx-4 text-xs whitespace-nowrap
            ${
              isOverdue
                ? "text-rose-500"
                : isNearDue
                ? "text-amber-500"
                : "text-slate-400"
            }
          `}
        >
          <Calendar className="w-3 h-3" />
          <span>
            {isOverdue
              ? `Vencida (${Math.abs(diffDays)} ${
                  Math.abs(diffDays) === 1 ? "día" : "días"
                } atrás)`
              : isNearDue
              ? `Vence pronto (${diffDays} ${diffDays === 1 ? "día" : "días"})`
              : `Vence: ${new Date(dueDate).toLocaleDateString()}`}
          </span>
        </div>

        <div className="flex items-center">
          <button
            onClick={() => onEdit(task)}
            className="p-2 text-slate-400 hover:text-amber-500 hover:bg-amber-50 rounded-full transition-all duration-200"
            title="Editar tarea"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(_id)}
            className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-full transition-all duration-200"
            title="Eliminar tarea"
          >
            <Trash2 className="w-4 h-4" />
          </button>
          <span
            {...attributes}
            {...listeners}
            className="cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing touch-none select-none transition-colors duration-200 p-2"
            title="Arrastrar"
          >
            ≡
          </span>
        </div>
      </div>

      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

const ListView = ({
  tasks,
  setTasks,
  token,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  const sensors = useSensors(
    useSensor(MouseSensor),
    useSensor(TouchSensor, {
      touchOnly: true,
      activationConstraint: {
        delay: 0,
        tolerance: 5,
      },
    })
  );

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = tasks.findIndex((t) => t._id === active.id);
    const newIndex = tasks.findIndex((t) => t._id === over.id);
    const newTasks = arrayMove(tasks, oldIndex, newIndex);
    setTasks(newTasks);

    try {
      const orderedIds = newTasks.map((t) => t._id);
      await axios.put(
        "/api/todos/reorder",
        { tasksOrder: orderedIds },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Orden actualizado", {
        position: "bottom-right",
        className: "bg-blue-50 border-l-4 border-blue-500 text-blue-700",
      });
    } catch (err) {
      toast.error(
        "Error al actualizar el orden: " +
          (err.response?.data?.message || err.message),
        {
          position: "bottom-right",
          className: "bg-rose-50 border-l-4 border-rose-500 text-rose-700",
        }
      );
    }
  };

  if (tasks.length === 0) {
    return (
      <p className="text-xl text-gray-500 mt-10 text-center">
        No hay tareas para mostrar 💤
      </p>
    );
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={tasks.map((task) => task._id)}
        strategy={rectSortingStrategy}
      >
        <div className="w-full space-y-2">
          {tasks.map((task) => (
            <SortableTaskItem
              key={task._id}
              task={task}
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
};

export default ListView;
