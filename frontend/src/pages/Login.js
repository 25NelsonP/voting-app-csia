import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import logo from "./../assets/isylogo.png";
import useSession from "../utils/useSession";
import LoadingScreen from "../components/LoadingScreen";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

//login page
const Login = () => {
  const navigate = useNavigate();
  const { user, loading: loaded } = useSession();
  const [loading, setLoading] = useState(false);

  if (loaded) {
    return <LoadingScreen />;
  }

  //redirect to home if already logged in
  if (user) {
    navigate("/");
    return null;
  }
  const API_URL = process.env.REACT_APP_API_URL;

  //redirect to google login page and set loading to true when redirecting
  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex flex-col min-h-screen items-center justify-center bg-gray-100">
      <Header />
      <div className="bg-white p-10 rounded-lg shadow-md text-center flex flex-col items-center mt-auto">
        <img
          src={logo}
          alt="STUCO Logo"
          className="mb-4 rounded-full w-32 py-8"
        />
        <h1 className="text-lg mb-5">STUCO Voting System</h1>
        <button
          onClick={handleLogin}
          className={`bg-blue-600 text-white border font-medium flex items-center justify-center hover:bg-blue-700 transition duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={loading}
        >
          <div className="bg-white p-3">
            <FcGoogle size={20} />
          </div>
          <span className="flex-1 text-center py-2 px-4">
            {loading ? "Redirecting..." : "Continue with Google"}
          </span>
        </button>
      </div>
      <Footer />
    </div>
  );
};

export default Login;
