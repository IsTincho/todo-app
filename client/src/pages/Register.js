import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ShowPasswordButton from "../components/ShowPasswordButton";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      return toast.error("Las contraseñas no coinciden.");
    }

    axios
      .post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      })
      .then((response) => {
        toast.success("Cuenta creada con éxito");
        navigate("/login");
      })
      .catch((err) => {
        toast.error("Error: " + (err.response?.data?.message || err.message));
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 px-4 sm:px-6 md:px-8">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">
          Registrarse
        </h2>

        <div className="mb-4 flex space-x-4">
          <div className="w-1/2">
            <label
              htmlFor="firstName"
              className="block text-sm font-medium text-gray-600"
            >
              Nombre
            </label>
            <input
              type="text"
              id="firstName"
              className="mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              placeholder="Ingresa tu nombre"
            />
          </div>
          <div className="w-1/2">
            <label
              htmlFor="lastName"
              className="block text-sm font-medium text-gray-600"
            >
              Apellido
            </label>
            <input
              type="text"
              id="lastName"
              className="mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              placeholder="Ingresa tu apellido"
            />
          </div>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-600"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            className="mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Ingresa tu email"
          />
        </div>

        <div className="mb-4 flex space-x-4">
          {/* Password Input */}
          <div className="w-1/2 relative">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-600"
            >
              Contraseña
            </label>
            <input
              type={showPassword ? "text" : "password"}
              id="password"
              className="mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Ingresa tu contraseña"
            />
            <ShowPasswordButton
              showPassword={showPassword}
              togglePassword={() => setShowPassword(!showPassword)}
            />
          </div>

          {/* Confirm Password Input */}
          <div className="w-1/2 relative">
            <label
              htmlFor="confirmPassword"
              className="block text-sm font-medium text-gray-600"
            >
              Repetir Contraseña
            </label>
            <input
              type={showConfirmPass ? "text" : "password"}
              id="confirmPassword"
              className="mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Repite tu contraseña"
            />
            <ShowPasswordButton
              showPassword={showConfirmPass}
              togglePassword={() => setShowConfirmPass(!showConfirmPass)}
            />
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition duration-200"
        >
          Crear cuenta
        </button>

        {/* Enlace para cambiar al login */}
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿Ya tienes cuenta?{" "}
          <Link
            to="/login"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Inicia sesión aquí
          </Link>
        </p>
      </form>
    </div>
  );
}
