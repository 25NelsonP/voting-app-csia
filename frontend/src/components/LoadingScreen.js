import React from "react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex items-center space-x-4">
        <div className="flex space-x-2">
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce"></div>
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce animation-delay-200"></div>
          <div className="h-4 w-4 bg-blue-500 rounded-full animate-bounce animation-delay-400"></div>
        </div>
        <span className="text-xl font-medium text-gray-700">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingScreen;
