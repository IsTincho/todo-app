import { useState, useEffect } from "react";
import { CheckCircle, Circle, Trash2, Edit, Calendar } from "lucide-react";
import Confetti from "./Confetti";

const TaskCard = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  dragHandleProps,
  onViewDetails,
}) => {
  const { _id, name, description, dueDate, isCompleted, showConfetti } = task;
  const [isCompleting, setIsCompleting] = useState(false);

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

  // Calcular si la fecha de vencimiento está próxima (menos de 2 días)
  const today = new Date();
  const taskDate = new Date(dueDate);
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isNearDue = diffDays >= 0 && diffDays <= 2 && !isCompleted;

  // Calcular si la tarea está vencida
  const isOverdue = diffDays < 0 && !isCompleted;

  // Manejar la animación de completado
  const handleToggleComplete = (e) => {
    e.stopPropagation();
    onToggleComplete(_id, !isCompleted);
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(_id);
  };

  return (
    <div
      className={`
        group bg-white dark:bg-slate-800 rounded-xl shadow-lg p-5 transition-all duration-500 relative cursor-pointer
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
          isCompleting
            ? "scale-105 shadow-xl bg-emerald-50 dark:bg-emerald-900/20"
            : "hover:shadow-xl hover:-translate-y-1"
        }
        transform transition-all
      `}
      onClick={() => onViewDetails(task)}
    >
      {showConfetti && <Confetti />}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3 max-w-[85%]">
          <button
            onClick={handleToggleComplete}
            className={`
              transition-all duration-300 rounded-full p-1 flex-shrink-0
              ${
                isCompleted
                  ? "text-emerald-500 hover:text-amber-500 hover:bg-amber-50 dark:hover:bg-amber-900/30 transform hover:scale-110"
                  : "text-slate-400 hover:text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 transform hover:scale-110"
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
          <h2
            className={`
              text-lg font-semibold transition-all duration-500 truncate
              ${
                isCompleted
                  ? "text-slate-400 line-through"
                  : "text-slate-800 dark:text-white"
              }
            `}
          >
            {name}
          </h2>
        </div>
        <span
          {...dragHandleProps}
          className="cursor-grab text-slate-300 dark:text-slate-600 hover:text-slate-500 dark:hover:text-slate-400 active:cursor-grabbing touch-none select-none transition-colors duration-200 flex-shrink-0"
          title="Arrastrar"
          onClick={(e) => e.stopPropagation()}
        >
          ≡
        </span>
      </div>

      <div className="pl-8 mb-4 overflow-hidden">
        <p
          className={`
            text-sm transition-all duration-500 line-clamp-2
            ${
              isCompleted
                ? "text-slate-400"
                : "text-slate-600 dark:text-slate-300"
            }
          `}
        >
          {description}
        </p>

        <div
          className={`
            flex items-center gap-1 mt-3 text-xs
            ${
              isOverdue
                ? "text-rose-500"
                : isNearDue
                ? "text-amber-500"
                : "text-slate-400 dark:text-slate-500"
            }
          `}
        >
          <Calendar className="w-3 h-3 flex-shrink-0" />
          <span className="truncate">
            {isOverdue
              ? `Vencida (${Math.abs(diffDays)} ${
                  Math.abs(diffDays) === 1 ? "día" : "días"
                } atrás)`
              : isNearDue
              ? `Vence pronto (${diffDays} ${diffDays === 1 ? "día" : "días"})`
              : `Vence: ${new Date(dueDate).toLocaleDateString()}`}
          </span>
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <button
          onClick={handleEdit}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-amber-500 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/30 rounded-full transition-all duration-200"
          title="Editar tarea"
        >
          <Edit className="w-4 h-4" />
        </button>
        <button
          onClick={handleDelete}
          className="p-2 text-slate-400 dark:text-slate-500 hover:text-rose-500 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-900/30 rounded-full transition-all duration-200"
          title="Eliminar tarea"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>

      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 dark:from-emerald-500/10 dark:to-emerald-500/20 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default TaskCard;
