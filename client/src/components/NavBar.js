import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAndRedirect } from "../redux/authActions";
import { Menu, X, LogOut, Home, User } from "lucide-react";

const NavBar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);

  const handleLogout = () => {
    dispatch(logoutAndRedirect(navigate));
  };

  return (
    <nav className="bg-white shadow-md border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center gap-2 text-rose-500 hover:text-rose-600 transition-colors duration-200"
            >
              <span className="text-2xl">📋</span>
              <span className="font-bold text-xl">ToDo App</span>
            </Link>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                >
                  <Home className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                <div className="flex items-center border-l border-slate-200 pl-4 ml-2">
                  <div className="mr-3 text-right">
                    <p className="text-sm font-medium text-slate-700">
                      {user?.firstName} {user?.lastName}
                    </p>
                    <p className="text-xs text-slate-500">{user?.email}</p>
                  </div>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Cerrar sesión</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-1 px-4 py-2 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                >
                  <User className="w-4 h-4" />
                  <span>Iniciar sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-rose-500 to-pink-500 hover:from-rose-600 hover:to-pink-600 text-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <span>Registrarse</span>
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-md text-slate-400 hover:text-slate-500 hover:bg-slate-100 transition-colors duration-200"
            >
              {isMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 animate-slide-down">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 border-b border-slate-100 mb-2">
                  <p className="text-sm font-medium text-slate-700">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>

                <Link
                  to="/"
                  className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <Home className="w-5 h-5" />
                  <span>Dashboard</span>
                </Link>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMenuOpen(false);
                  }}
                  className="flex items-center gap-2 w-full text-left px-4 py-3 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                >
                  <LogOut className="w-5 h-5" />
                  <span>Cerrar sesión</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Iniciar sesión</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center gap-2 px-4 py-3 text-slate-600 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-colors duration-200"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <User className="w-5 h-5" />
                  <span>Registrarse</span>
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
