import { useState, useEffect } from "react";
import { CheckCircle, Circle, Trash2, Edit, Calendar } from "lucide-react";
import Confetti from "./Confetti";

const TaskCard = ({
  task,
  onToggleComplete,
  onDelete,
  onEdit,
  dragHandleProps,
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
  const handleToggleComplete = () => {
    onToggleComplete(_id, !isCompleted);
  };

  return (
    <div
      className={`
        group bg-white rounded-xl shadow-lg p-5 transition-all duration-500 relative
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
            ? "scale-105 shadow-xl bg-emerald-50"
            : "hover:shadow-xl hover:-translate-y-1"
        }
        transform transition-all
      `}
    >
      {showConfetti && <Confetti />}

      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={handleToggleComplete}
            className={`
              transition-all duration-300 rounded-full p-1
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
          <h2
            className={`
              text-lg font-semibold transition-all duration-500
              ${isCompleted ? "text-slate-400 line-through" : "text-slate-800"}
            `}
          >
            {name}
          </h2>
        </div>
        <span
          {...dragHandleProps}
          className="cursor-grab text-slate-300 hover:text-slate-500 active:cursor-grabbing touch-none select-none transition-colors duration-200"
          title="Arrastrar"
        >
          ≡
        </span>
      </div>

      <div className="pl-8 mb-4">
        <p
          className={`
            text-sm transition-all duration-500
            ${isCompleted ? "text-slate-400" : "text-slate-600"}
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
      </div>

      <div className="flex justify-end gap-2">
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
      </div>

      {isCompleted && (
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-emerald-500/10 rounded-xl pointer-events-none" />
      )}
    </div>
  );
};

export default TaskCard;
