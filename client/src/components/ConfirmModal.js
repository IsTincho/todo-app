import { AlertTriangle, CheckCircle } from "lucide-react";
import Modal from "./Modal";

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
      rose: "bg-rose-500 hover:bg-rose-600 dark:bg-rose-600 dark:hover:bg-rose-700",
      emerald:
        "bg-emerald-500 hover:bg-emerald-600 dark:bg-emerald-600 dark:hover:bg-emerald-700",
      amber:
        "bg-amber-500 hover:bg-amber-600 dark:bg-amber-600 dark:hover:bg-amber-700",
      blue: "bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700",
    };
    return colors[color] || colors.rose;
  };

  const getIcon = (color) => {
    if (color === "emerald")
      return (
        <CheckCircle className="h-5 w-5 text-emerald-500 dark:text-emerald-400" />
      );
    return (
      <AlertTriangle className="h-5 w-5 text-amber-500 dark:text-amber-400" />
    );
  };

  const modalTitle = (
    <div className="flex items-center gap-2">
      {getIcon(confirmColor)}
      Confirmar acción
    </div>
  );

  const modalFooter = (
    <div className="flex justify-end gap-3">
      <button
        onClick={onClose}
        className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors duration-200"
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
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={modalTitle}
      footer={modalFooter}
    >
      <p className="text-slate-600 dark:text-slate-300">{message}</p>
    </Modal>
  );
};

export default ConfirmModal;
