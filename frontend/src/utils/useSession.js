import { useState, useEffect } from "react";
import axios from "axios";

const useSession = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/auth/user`, {
        withCredentials: true,
      })
      .then((response) => {
        setUser(response.data); // Directly using the full user object
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return { user, loading };
};

export default useSession;
