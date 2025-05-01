// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";
import Cookies from "js-cookie";

const initialState = {
  isAuthenticated: false,
  user: null,
  token: Cookies.get("token") || null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action) => {
      const { user, token } = action.payload;
      state.isAuthenticated = true;
      state.user = user;
      state.token = token;
      Cookies.set("token", token, { expires: 7 }); // cookie por 7 días
    },
    logout: (state) => {
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      Cookies.remove("token");
    },
    checkAuth: (state) => {
      const token = Cookies.get("token");
      if (token) {
        state.token = token;
        state.isAuthenticated = true;
      }
    },
  },
});

export const { loginSuccess, logout, checkAuth } = authSlice.actions;
export default authSlice.reducer;
