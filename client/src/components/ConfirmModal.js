import React from "react";
import { FaExclamationTriangle } from "react-icons/fa";

const ConfirmModal = ({ isOpen, onClose, onConfirm, message }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-2xl p-6 w-96 shadow-xl text-center">
        <div className="flex flex-col items-center gap-3 mb-4">
          <FaExclamationTriangle className="text-yellow-500" size={36} />
          <h2 className="text-xl font-semibold text-gray-800">
            ¿Estás seguro?
          </h2>
          <p className="text-sm text-gray-600">{message}</p>
        </div>
        <div className="flex justify-center gap-4">
          <button
            onClick={onConfirm}
            className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            Sí, eliminar
          </button>
          <button
            onClick={onClose}
            className="bg-gray-300 text-gray-700 px-4 py-2 rounded-xl hover:bg-gray-400 transition"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
