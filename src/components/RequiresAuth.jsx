import { Navigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
export default function RequiresAuth({ children }) {
  const token = window.localStorage.getItem("token");
  return token ? children : <Navigate to="/login" />;
}