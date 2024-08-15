import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <header className="bg-yellow-800 text-white p-4 w-full text-center">
        <h1 className="text-xl font-bold">404 - Page Not Found</h1>
      </header>

      <main className="flex flex-col items-center p-3">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold py-3">
            Oops! Something went wrong.
          </h2>
          <p>The page you are looking for doesn't exist.</p>
        </div>
        <div className="p-2">
          <Link
            to={`/`}
            className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
          >
            Go to Home
          </Link>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default NotFoundPage;
