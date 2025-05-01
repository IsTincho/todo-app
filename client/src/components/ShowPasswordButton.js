import React from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ShowPasswordButton = ({ showPassword, togglePassword }) => {
  return (
    <button
      type="button"
      className="absolute right-3 bottom-3 text-gray-500"
      onClick={togglePassword}
      aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
    >
      {showPassword ? <FaEyeSlash /> : <FaEye />}
    </button>
  );
};

export default ShowPasswordButton;
