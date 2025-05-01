// src/App.js
import React, { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useDispatch } from "react-redux";
import { checkAuth } from "./redux/authSlice";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { ToastContainer } from "react-toastify"; // Importamos ToastContainer
import "react-toastify/dist/ReactToastify.css"; // Importamos el estilo de los toasts

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <BrowserRouter>
      <NavBar />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Dashboard />} />
        </Route>
      </Routes>
      <ToastContainer /> {/* Colocamos el ToastContainer aquí */}
    </BrowserRouter>
  );
};

export default App;
