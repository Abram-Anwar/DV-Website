import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../../context/auth-context";

const ProtectedRoute = () => {
  const { admin, loading } = useAuth();

  // Still asking the server: do not decide yet
  if (loading) {
    return <p>جاري التحميل...</p>;
  }

  if (!admin) {
    return <Navigate to="/login" />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
