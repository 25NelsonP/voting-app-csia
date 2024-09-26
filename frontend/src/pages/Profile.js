import React from "react";
import useSession from "../utils/useSession";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import Footer from "../components/Footer";

//user information page
const ViewProfile = () => {
  const { user, loading } = useSession();

  // delete the local storage cookie for logout
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
    <div className="flex flex-col items-center bg-gray-100 min-h-screen ">
      <Header />
      <h1 className="text-2xl font-bold m-6">My Account</h1>
      <div className="bg-white shadow-md rounded-lg p-6 w-11/12 max-w-md">
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
      <Footer />
    </div>
  );
};

export default ViewProfile;
