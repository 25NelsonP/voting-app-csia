import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import FormatDate from "../components/FormatDate";
import useSession from "./../utils/useSession";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import Footer from "../components/Footer";

function VoterHome() {
  const [ongoingVotes, setOngoingVotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchOngoingVotes = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_URL}/elections/user/${user.user_id}`
          );
          setOngoingVotes(res.data);
          setLoading(false);
        } catch (error) {
          console.log("ERROR", error);
        }
      }
    };

    fetchOngoingVotes();
  }, [user, API_URL]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Voter Portal</h1>
        </div>
      </header>

      <main className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-4">Ongoing Votes</h2>
        {ongoingVotes.length > 0 ? (
          <ul className="space-y-4">
            {ongoingVotes.map((vote) => (
              <li
                key={vote.election_id}
                className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{vote.title}</h3>
                  <p>
                    Closing Date: {<FormatDate dateString={vote.end_date} />}
                  </p>
                </div>
                <Link
                  to={`/vote/${vote.election_id}`}
                  className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
                >
                  View Details
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ongoing votes available.</p>
        )}
      </main>
      <Footer />
    </div>
  );
}

export default VoterHome;
