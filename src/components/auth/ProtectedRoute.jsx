import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../../context/AuthContext";
import Spinner from "../common/Spinner";

function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, isAdmin, initializing } = useAuth();
  const location = useLocation();

  if (initializing) {
    return <Spinner label="Checking your session..." />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" state={{ from: location.pathname }} replace />;
  }

  if (roles && roles.length > 0 && !roles.includes(isAdmin ? "admin" : "user")) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

export default ProtectedRoute;
