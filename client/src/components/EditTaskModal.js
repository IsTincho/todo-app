import { useState, useEffect } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { Calendar, FileText, Type, Save } from "lucide-react";
import Modal from "./Modal";

const EditTaskModal = ({ isOpen, onClose, onTaskUpdated, task, token }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (task) {
      setName(task.name);
      setDescription(task.description);
      setDueDate(new Date(task.dueDate).toISOString().split("T")[0]);
      setErrors({});
    }
  }, [task]);

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!name.trim()) {
      newErrors.name = "El nombre es requerido";
    } else if (name.length < 3) {
      newErrors.name = "El nombre debe tener al menos 3 caracteres";
    } else if (name.length > 100) {
      newErrors.name = "El nombre no puede exceder los 100 caracteres";
    }

    // Validar descripción
    if (!description.trim()) {
      newErrors.description = "La descripción es requerida";
    } else if (description.length < 5) {
      newErrors.description = "La descripción debe tener al menos 5 caracteres";
    } else if (description.length > 500) {
      newErrors.description =
        "La descripción no puede exceder los 500 caracteres";
    }

    // Validar fecha
    if (!dueDate) {
      newErrors.dueDate = "La fecha de vencimiento es requerida";
    } else {
      const selectedDate = new Date(dueDate);
      if (isNaN(selectedDate.getTime())) {
        newErrors.dueDate = "Formato de fecha inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const response = await axios.put(
        `/api/todos/${task._id}/edit`,
        { name, description, dueDate },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      onTaskUpdated(response.data.todo);
      toast.success("¡Tarea editada exitosamente!", {
        position: "bottom-right",
        className:
          "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-300",
        icon: "📝",
      });
      setLoading(false);
      onClose();
    } catch (err) {
      setLoading(false);
      toast.error(
        "Error al editar tarea: " + err.response?.data?.msg || err.message,
        {
          position: "bottom-right",
          className:
            "bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-700 dark:text-rose-300",
        }
      );
    }
  };

  const modalContent = (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            Nombre
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Type className="h-5 w-5 text-slate-400 dark:text-slate-500" />
            </div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                errors.name
                  ? "border-rose-500 dark:border-rose-500"
                  : "border-slate-200 dark:border-slate-600"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
              required
              placeholder="Nombre de la tarea"
            />
          </div>
          {errors.name && (
            <p className="text-rose-500 text-xs mt-1">{errors.name}</p>
          )}
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
              onChange={(e) => setDescription(e.target.value)}
              className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                errors.description
                  ? "border-rose-500 dark:border-rose-500"
                  : "border-slate-200 dark:border-slate-600"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 min-h-[100px] dark:text-white`}
              required
              placeholder="Descripción detallada de la tarea"
            />
          </div>
          {errors.description && (
            <p className="text-rose-500 text-xs mt-1">{errors.description}</p>
          )}
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
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                errors.dueDate
                  ? "border-rose-500 dark:border-rose-500"
                  : "border-slate-200 dark:border-slate-600"
              } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
              required
            />
          </div>
          {errors.dueDate && (
            <p className="text-rose-500 text-xs mt-1">{errors.dueDate}</p>
          )}
        </div>
      </div>

      <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200 mb-2 sm:mb-0"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {loading ? (
            <>
              <svg
                className="animate-spin h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Actualizando...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Guardar cambios
            </>
          )}
        </button>
      </div>
    </form>
  );

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Editar Tarea">
      {modalContent}
    </Modal>
  );
};

export default EditTaskModal;
