import {
  Calendar,
  CheckCircle,
  Circle,
  Edit,
  FileText,
  Trash2,
} from "lucide-react";
import Modal from "./Modal";

const TaskDetailModal = ({
  isOpen,
  onClose,
  task,
  onToggleComplete,
  onDelete,
  onEdit,
}) => {
  if (!isOpen || !task) return null;

  const { _id, name, description, dueDate, isCompleted } = task;

  // Calcular si la fecha de vencimiento está próxima o vencida
  const today = new Date();
  const taskDate = new Date(dueDate);
  const diffTime = taskDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  const isNearDue = diffDays >= 0 && diffDays <= 2 && !isCompleted;
  const isOverdue = diffDays < 0 && !isCompleted;

  const modalContent = (
    <form className="space-y-4">
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Nombre
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isCompleted ? (
              <CheckCircle className="h-5 w-5 text-emerald-500" />
            ) : (
              <Circle className="h-5 w-5 text-slate-400" />
            )}
          </div>
          <input
            type="text"
            value={name}
            disabled
            className="pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-white cursor-default"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Descripción
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <FileText className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <textarea
            value={description}
            disabled
            className="pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-white min-h-[100px] cursor-default"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
          Fecha de vencimiento
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-slate-400 dark:text-slate-500" />
          </div>
          <input
            type="text"
            value={
              isOverdue
                ? `Vencida (${Math.abs(diffDays)} días atrás)`
                : isNearDue
                ? `Vence pronto (${diffDays} días)`
                : `Vence: ${new Date(dueDate).toLocaleDateString()}`
            }
            disabled
            className="pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-xl text-slate-700 dark:text-white cursor-default"
          />
        </div>
      </div>

      {isCompleted && (
        <div className="bg-emerald-50 dark:bg-emerald-900/20 text-emerald-600 dark:text-emerald-400 rounded-xl p-3 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4" />
          <span>Esta tarea está completada</span>
        </div>
      )}
    </form>
  );

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <button
        onClick={() => {
          onEdit(task);
          onClose();
        }}
        className="flex items-center gap-2 px-4 py-2 border border-amber-200 dark:border-amber-800 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 rounded-xl hover:bg-amber-100 dark:hover:bg-amber-900/40 transition-colors duration-200"
      >
        <Edit className="w-4 h-4" />
        <span>Editar</span>
      </button>
      <button
        onClick={() => {
          onDelete(_id);
          onClose();
        }}
        className="flex items-center gap-2 px-4 py-2 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-900/20 rounded-xl hover:bg-rose-100 dark:hover:bg-rose-900/40 transition-colors duration-200"
      >
        <Trash2 className="w-4 h-4" />
        <span>Eliminar</span>
      </button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Detalles de la Tarea"
      footer={modalFooter}
    >
      {modalContent}
    </Modal>
  );
};

export default TaskDetailModal;
