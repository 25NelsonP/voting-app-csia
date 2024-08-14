import React from "react";
import useSession from "../utils/useSession";
import LoadingScreen from "../components/LoadingScreen";

const ViewProfile = () => {
  const { user, loading } = useSession();

  const handleLogout = async () => {
    localStorage.removeItem("jwtToken");
    window.location.href = "/";
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <div className="flex flex-col items-center p-6 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">My Account</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center mb-4">
          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
          </div>
        </div>
        <div className="mb-4">
          <p className="text-gray-800">
            <strong>Email:</strong> {user.email}
          </p>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default ViewProfile;
