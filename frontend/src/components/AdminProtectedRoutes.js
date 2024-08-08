import { Navigate } from "react-router-dom";
import useSession from "../utils/useSession";

const AdminProtectedRoute = ({ element }) => {
  const { user, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.is_admin !== 1) {
    return <Navigate to="/" replace />;
  }

  return element;
};

export default AdminProtectedRoute;
