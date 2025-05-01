// src/components/NavBar.jsx
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Link } from "react-router-dom";

const NavBar = () => {
  const dispatch = useDispatch();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logout()); // Limpiamos el estado de autenticación
  };

  return (
    <nav className="bg-gray-800 p-4">
      <div className="flex justify-between items-center">
        <Link to="/" className="text-white text-lg font-semibold">
          ToDo App
        </Link>
        <div>
          {isAuthenticated ? (
            <>
              <Link to="/" className="text-white px-4">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="text-white px-4">
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="text-white px-4">
                Login
              </Link>
              <Link to="/register" className="text-white px-4">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
