import React from "react";
import { FaTrashAlt, FaEdit, FaCheckCircle, FaRegCircle } from "react-icons/fa";

const TaskCard = ({ task, onMarkAsCompleted, onDelete, onEdit }) => {
  const { _id, name, description, dueDate, isCompleted } = task;

  return (
    <div className="bg-white rounded-2xl shadow-md p-5 flex flex-col justify-between hover:shadow-lg transition">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
          {isCompleted ? (
            <FaCheckCircle className="text-green-500" />
          ) : (
            <FaRegCircle className="text-gray-400" />
          )}
          {name}
        </h2>
        <p className="text-sm text-gray-600 mt-2">{description}</p>
        <p className="text-xs text-gray-400 mt-1">
          📅 Vence: {new Date(dueDate).toLocaleDateString()}
        </p>
      </div>

      <div className="flex justify-end gap-3">
        {!isCompleted && (
          <button
            onClick={() => onMarkAsCompleted(_id)}
            className="text-green-500 hover:text-green-600 transition"
            title="Marcar como completada"
          >
            <FaCheckCircle size={18} />
          </button>
        )}
        <button
          onClick={() => onEdit(task)}
          className="text-yellow-500 hover:text-yellow-600 transition"
          title="Editar tarea"
        >
          <FaEdit size={18} />
        </button>
        <button
          onClick={() => onDelete(_id)}
          className="text-red-500 hover:text-red-600 transition"
          title="Eliminar tarea"
        >
          <FaTrashAlt size={18} />
        </button>
      </div>
    </div>
  );
};

export default TaskCard;
