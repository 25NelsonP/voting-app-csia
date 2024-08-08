import React, { useState } from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
    setLoading(true);
    window.location.href = `${API_URL}/auth/google`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-10 rounded shadow-md text-center">
        <img
          src="./assets/isylogo.png"
          alt="STUCO Logo"
          className="mb-4"
          style={{ width: "150px", height: "auto" }}
        />
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
    </div>
  );
};

export default Login;
