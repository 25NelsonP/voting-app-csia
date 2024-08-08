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
        setUser(response.data);
        console.log(response.data);
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setUser(null);
        if (error.response?.status === 401) {
          navigate("/login"); // Redirect to login page on unauthorized
        }
      })
      .finally(() => {
        setLoading(false); // Stop loading regardless of the result
      });
  }, [navigate]); // No dependencies needed

  return { user, loading };
};

export default useSession;
