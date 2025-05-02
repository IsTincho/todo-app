import { useState } from "react";
import axios from "../api/axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Eye, EyeOff, UserPlus, Mail, Lock, User } from "lucide-react";

export default function Register() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};

    // Validar nombre
    if (!firstName.trim()) {
      newErrors.firstName = "El nombre es requerido";
    } else if (firstName.length < 2) {
      newErrors.firstName = "El nombre debe tener al menos 2 caracteres";
    }

    // Validar apellido
    if (!lastName.trim()) {
      newErrors.lastName = "El apellido es requerido";
    } else if (lastName.length < 2) {
      newErrors.lastName = "El apellido debe tener al menos 2 caracteres";
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email.trim()) {
      newErrors.email = "El email es requerido";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Ingresa un email válido";
    }

    // Validar contraseña
    if (!password) {
      newErrors.password = "La contraseña es requerida";
    } else if (password.length < 6) {
      newErrors.password = "La contraseña debe tener al menos 6 caracteres";
    }

    // Validar confirmación de contraseña
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      await axios.post("/api/auth/register", {
        firstName,
        lastName,
        email,
        password,
      });

      // Simular un pequeño retraso para mostrar el estado de carga
      setTimeout(() => {
        toast.success("¡Cuenta creada con éxito!", {
          position: "bottom-right",
          className:
            "bg-emerald-50 border-l-4 border-emerald-500 text-emerald-700 dark:bg-emerald-900/50 dark:border-emerald-700 dark:text-emerald-300",
          icon: "🎉",
        });
        navigate("/login");
      }, 800);
    } catch (err) {
      setIsLoading(false);
      toast.error("Error: " + (err.response?.data?.message || err.message), {
        position: "bottom-right",
        className:
          "bg-rose-50 border-l-4 border-rose-500 text-rose-700 dark:bg-rose-900/50 dark:border-rose-700 dark:text-rose-300",
      });
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-rose-50 to-slate-100 dark:from-slate-900 dark:to-slate-800 px-4 sm:px-6 md:px-8">
      <div className="w-full max-w-md">
        <div className="text-center mb-8 animate-fade-in">
          <h1 className="text-4xl font-bold text-slate-800 dark:text-white mb-2">
            <span className="inline-block mr-2 transform hover:scale-110 transition-transform duration-200">
              📋
            </span>
            ToDo App
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Crea una cuenta para comenzar
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm p-8 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 space-y-6 transition-all duration-300 hover:shadow-2xl"
        >
          <h2 className="text-2xl font-bold text-center text-slate-800 dark:text-white mb-6">
            Crear Cuenta
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Nombre
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  id="firstName"
                  className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                    errors.firstName
                      ? "border-rose-500 dark:border-rose-500"
                      : "border-slate-200 dark:border-slate-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  placeholder="Nombre"
                />
              </div>
              {errors.firstName && (
                <p className="text-rose-500 text-xs mt-1">{errors.firstName}</p>
              )}
            </div>

            <div className="space-y-2">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Apellido
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type="text"
                  id="lastName"
                  className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                    errors.lastName
                      ? "border-rose-500 dark:border-rose-500"
                      : "border-slate-200 dark:border-slate-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  placeholder="Apellido"
                />
              </div>
              {errors.lastName && (
                <p className="text-rose-500 text-xs mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          {/* Email Input */}
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-slate-700 dark:text-slate-300"
            >
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail className="h-5 w-5 text-slate-400 dark:text-slate-500" />
              </div>
              <input
                type="email"
                id="email"
                className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                  errors.email
                    ? "border-rose-500 dark:border-rose-500"
                    : "border-slate-200 dark:border-slate-600"
                } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="tu@email.com"
              />
            </div>
            {errors.email && (
              <p className="text-rose-500 text-xs mt-1">{errors.email}</p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Contraseña
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                    errors.password
                      ? "border-rose-500 dark:border-rose-500"
                      : "border-slate-200 dark:border-slate-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-rose-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password Input */}
            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-slate-700 dark:text-slate-300"
              >
                Confirmar
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 dark:text-slate-500" />
                </div>
                <input
                  type={showConfirmPass ? "text" : "password"}
                  id="confirmPassword"
                  className={`pl-10 w-full p-3 bg-slate-50 dark:bg-slate-700 border ${
                    errors.confirmPassword
                      ? "border-rose-500 dark:border-rose-500"
                      : "border-slate-200 dark:border-slate-600"
                  } rounded-xl focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all duration-200 dark:text-white`}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPass(!showConfirmPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors duration-200"
                >
                  {showConfirmPass ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-rose-500 text-xs mt-1">
                  {errors.confirmPassword}
                </p>
              )}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white p-3 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
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
                Creando cuenta...
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Crear Cuenta
              </>
            )}
          </button>

          {/* Enlace para cambiar al login */}
          <p className="text-center mt-6 text-sm text-slate-600 dark:text-slate-400">
            ¿Ya tienes cuenta?{" "}
            <Link
              to="/login"
              className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 font-medium transition-colors duration-200"
            >
              Inicia sesión aquí
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
