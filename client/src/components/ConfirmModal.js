import { X, AlertTriangle, CheckCircle } from "lucide-react";

const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  message,
  confirmText = "Eliminar",
  confirmColor = "rose",
}) => {
  if (!isOpen) return null;

  const getColorClasses = (color) => {
    const colors = {
      rose: "bg-rose-500 hover:bg-rose-600",
      emerald: "bg-emerald-500 hover:bg-emerald-600",
      amber: "bg-amber-500 hover:bg-amber-600",
      blue: "bg-blue-500 hover:bg-blue-600",
    };
    return colors[color] || colors.rose;
  };

  const getIcon = (color) => {
    if (color === "emerald")
      return <CheckCircle className="h-5 w-5 text-emerald-500" />;
    return <AlertTriangle className="h-5 w-5 text-amber-500" />;
  };

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all duration-300 animate-scale-in"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-5 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            {getIcon(confirmColor)}
            Confirmar acción
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full p-2 transition-colors duration-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5">
          <p className="text-slate-600 mb-6">{message}</p>

          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-200 text-slate-600 rounded-xl hover:bg-slate-50 transition-colors duration-200"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className={`px-4 py-2 ${getColorClasses(
                confirmColor
              )} text-white rounded-xl shadow-md hover:shadow-lg transition-all duration-300`}
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
