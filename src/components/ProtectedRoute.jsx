import { useSelector } from "react-redux";
import { Navigate, Outlet } from "react-router-dom";
import { selectIsAuthenticated } from "../features/auth/authSlice";

const ProtectedRoute = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  // If not logged in, kick to /login
  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;