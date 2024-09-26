import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

//stores the user token sent from backend into local storage.
const AuthCallback = () => {
  const navigate = useNavigate();
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
    }

    navigate("/");
  }, [navigate]);

  return <LoadingScreen />;
};

export default AuthCallback;
