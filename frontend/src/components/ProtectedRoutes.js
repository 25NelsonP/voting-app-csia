import { Navigate } from "react-router-dom";
import useSession from "../utils/useSession";

const ProtectedRoute = ({ element }) => {
  const { user, loading } = useSession();

  if (loading) {
    return <div>Loading...</div>;
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
