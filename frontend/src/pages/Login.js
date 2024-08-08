import React from "react";
import { FcGoogle } from "react-icons/fc";

const Login = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogin = () => {
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
          className="bg-blue-600 text-white border font-medium flex items-center justify-center hover:bg-blue-700 transition duration-200"
        >
          <div className="bg-white p-3">
            <FcGoogle size={20} />
          </div>
          <span className="flex-1 text-center py-2 px-4">
            Continue with Google
          </span>
        </button>
      </div>
    </div>
  );
};

export default Login;
