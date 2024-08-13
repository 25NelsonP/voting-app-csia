import React from "react";
import { Link } from "react-router-dom";

const NoAccessPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <header className="bg-red-500 text-white p-4 w-full text-center">
        <h1 className="text-xl font-bold">
          You don't have access to this voting form.
        </h1>
      </header>

      <main className="flex flex-col items-center p-3">
        <div className="mb-10 text-center">
          <p>If you think this is an error, contact the STUCO members.</p>
        </div>
        <div className="p-2">
          <Link
            to={`/`}
            className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
          >
            Home
          </Link>
        </div>
      </main>
    </div>
  );
};

export default NoAccessPage;
