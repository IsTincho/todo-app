import axios from "axios";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Agregar DEV para usar en local
  headers: {
    "Content-Type": "application/json",
    "x-api-client": process.env.REACT_APP_API_CLIENT,
    "x-api-secret": process.env.REACT_APP_API_SECRET,
  },
});

export default instance;
