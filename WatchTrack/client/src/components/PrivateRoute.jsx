import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth.context.jsx";

export default function PrivateRoute({ children }) {
  const { token } = useAuth();
  if (!token) return <Navigate to="/signin" replace />;
  return children;
}