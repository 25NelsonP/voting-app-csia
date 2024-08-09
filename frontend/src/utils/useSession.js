import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "./axiosInstance";

const useSession = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axiosInstance
      .get("/auth/user")
      .then((response) => {
        console.log("User data received:", response.data);
        setUser(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        if (error.response) {
          console.error("Response error data:", error.response.data);
          console.error("Response error status:", error.response.status);
        }
        setUser(null);
        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login page on unauthorized
        }
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of the result
      });
  }, [navigate]);

  return { user, loading };
};

export default useSession;
