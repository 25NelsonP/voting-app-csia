import React from "react";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const VotedPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <header className="bg-blue-600 text-white p-4 w-full text-center">
        <h1 className="text-xl font-bold">
          Your have already submitted a vote
        </h1>
      </header>

      <main className="flex flex-col items-center p-3">
        <div className="mb-10 text-center">
          <h2 className="text-2xl font-bold py-3">Thank You for Voting!</h2>
          <p>Contact HS STUCO if you think this is an error.</p>
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

export default VotedPage;
