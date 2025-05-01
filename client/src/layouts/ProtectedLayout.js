import { Navigate, Outlet } from "react-router-dom";

function getCookie(name) {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));
  return cookie ? cookie.split("=")[1] : null;
}

function ProtectedLayout() {
  const token = getCookie("token");

  return token ? <Outlet /> : <Navigate to="/login" replace />;
}

export default ProtectedLayout;
