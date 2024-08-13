import { Navigate } from "react-router-dom";
import useSession from "../utils/useSession";
import LoadingScreen from "./LoadingScreen";

const AdminProtectedRoute = ({ element }) => {
  const { user, loading } = useSession();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!user.is_admin) {
    return <Navigate to="/noaccess" replace />;
  }

  return element;
};

export default AdminProtectedRoute;
