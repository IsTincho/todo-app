import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logoutAndRedirect } from "../redux/authActions";

const NavBar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const handleLogout = () => {
    dispatch(logoutAndRedirect(navigate));
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
