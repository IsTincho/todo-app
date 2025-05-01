// src/redux/authActions.js
import axios from "../api/axios";
import { loginSuccess, logout } from "./authSlice";
import Cookies from "js-cookie";

export const checkAuth = (navigate) => async (dispatch) => {
  const token = Cookies.get("token");

  if (!token) {
    dispatch(logout());
    navigate("/login");
    return;
  }

  try {
    const res = await axios.get("/api/auth/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(loginSuccess({ user: res.data.user || null, token }));
  } catch (err) {
    console.warn("Token inválido, cerrando sesión...");
    dispatch(logout());
    navigate("/login");
  }
};

export const logoutAndRedirect = (navigate) => (dispatch) => {
  dispatch(logout());
  navigate("/login");
};
