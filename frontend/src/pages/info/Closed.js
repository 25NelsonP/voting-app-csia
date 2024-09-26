import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const ClosedPage = () => {
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();

  useEffect(() => {
    // Update countdown every second
    const interval = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    // Redirect after 10 seconds
    const timer = setTimeout(() => {
      navigate("/");
    }, 10000);

    // Cleanup intervals and timeouts on component unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [navigate]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <header className="bg-blue-600 text-white p-4 w-full text-center">
        <h1 className="text-xl font-bold">
          This election is not accepting responses at this time.
        </h1>
      </header>

      <main className="flex flex-col items-center p-3">
        <div className="mb-10 text-center">
          <p>Contact STUCO if you think this is an error.</p>
          <p>Redirecting to home in {countdown} seconds...</p>
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

export default ClosedPage;
