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
        setLoading(false); // Data has been fetched, set loading to false
      })
      .catch((error) => {
        console.error("Error fetching user:", error);
        setLoading(false); // Stop loading even if there's an error
        setUser(null); // Explicitly set user to null on error
      });
  }, [navigate]);
  // Return both user and loading state
  return { user, loading };
};

export default useSession;
