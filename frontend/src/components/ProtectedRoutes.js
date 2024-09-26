import { Navigate } from "react-router-dom";
import useSession from "../utils/useSession";
import LoadingScreen from "./LoadingScreen";

//user verification
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useSession();

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? element : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
