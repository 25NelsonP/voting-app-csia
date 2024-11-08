import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingScreen from "../components/LoadingScreen";

//stores the user token sent from backend into local storage.
const AuthCallback = () => {
  const navigate = useNavigate();

  const redirectPath = localStorage.getItem("redirectPath");

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");

    if (token) {
      localStorage.setItem("jwtToken", token);
    }

    if (redirectPath) {
      navigate(redirectPath);
    } else {
      navigate("/");
    }
  }, [navigate, redirectPath]);

  return <LoadingScreen />;
};

export default AuthCallback;
