import { Navigate, useLocation } from "react-router-dom";
import useSession from "../utils/useSession";
import LoadingScreen from "./LoadingScreen";

//user verification
const ProtectedRoute = ({ element }) => {
  const location = useLocation();
  const { user, loading } = useSession();

  const redirect = location.pathname;

  if (loading) {
    return <LoadingScreen />;
  }

  return user ? (
    element
  ) : (
    <Navigate to={`/login/?redirect=` + redirect} replace />
  );
};

export default ProtectedRoute;
