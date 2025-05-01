import axios from "../api/axios";
import { loginSuccess, logout } from "./authSlice";
import Cookies from "js-cookie";

export const checkAuth = () => async (dispatch) => {
  const token = Cookies.get("token");

  if (!token) {
    dispatch(logout());
    return { redirect: true };
  }

  try {
    const res = await axios.get("/api/auth/validate-token", {
      headers: { Authorization: `Bearer ${token}` },
    });

    dispatch(loginSuccess({ user: res.data.user || null, token }));
    return { redirect: false };
  } catch (err) {
    console.warn("Token inválido, cerrando sesión...");
    dispatch(logout());
    return { redirect: true };
  }
};

export const logoutAndRedirect = (navigate) => (dispatch) => {
  dispatch(logout());
  navigate("/login");
};
