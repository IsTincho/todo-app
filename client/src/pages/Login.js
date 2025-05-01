// src/pages/Login.jsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { loginSuccess } from "../redux/authSlice";
import axios from "../axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // Importamos toastify
import ShowPasswordButton from "../components/ShowPasswordButton"; // Importamos el componente de ShowPasswordButton
import { Link } from "react-router-dom"; // Importamos Link para navegar entre rutas

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // Para mostrar/ocultar la contraseña
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    axios
      .post("/api/auth/login", { email, password }) // Aquí ya no es necesario poner la baseURL, ya se toma automáticamente de la configuración
      .then((response) => {
        const { user, token } = response.data;
        dispatch(loginSuccess({ user, token }));
        navigate("/");
      })
      .catch((err) => {
        toast.error("Error: " + (err.response?.data?.message || err.message)); // Mostramos el error con Toastify
      });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-slate-100 px-4 sm:px-6 md:px-8">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-lg shadow-md w-full sm:w-96 space-y-6"
      >
        <h2 className="text-2xl font-bold text-center text-gray-800">Login</h2>

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
            placeholder="Enter your email"
          />
        </div>

        {/* Password Input */}
        <div className="mb-4 relative">
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-600"
          >
            Password
          </label>
          <input
            type={showPassword ? "text" : "password"} // Cambiar tipo de input
            id="password"
            className="mt-2 p-2 w-full border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" // Ajustamos padding-right para que haya espacio para el icono
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="Enter your password"
          />
          {/* Usamos el componente ShowPasswordButton */}
          <ShowPasswordButton
            showPassword={showPassword}
            togglePassword={() => setShowPassword(!showPassword)}
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          Login
        </button>

        {/* Enlace para cambiar al registro */}
        <p className="text-center mt-4 text-sm text-gray-600">
          ¿No tienes cuenta?{" "}
          <Link
            to="/register"
            className="text-blue-500 hover:text-blue-700 font-medium"
          >
            Regístrate aquí
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
