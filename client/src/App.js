import { useEffect } from "react";
import { Routes, Route, BrowserRouter } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import NavBar from "./components/NavBar";
import { useDispatch } from "react-redux";
import ProtectedLayout from "./layouts/ProtectedLayout";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { checkAuth } from "./redux/authActions";
import { ThemeProvider } from "./components/ThemeProvider";

const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  return (
    <ThemeProvider>
      <BrowserRouter>
        <NavBar />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route element={<ProtectedLayout />}>
            <Route path="/" element={<Dashboard />} />
          </Route>
        </Routes>
        <ToastContainer />
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
