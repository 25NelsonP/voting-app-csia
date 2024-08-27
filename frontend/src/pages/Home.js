import React, { useState, useEffect } from "react";
import axios from "axios";
import useSession from "./../utils/useSession";
import LoadingScreen from "../components/LoadingScreen";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ElectionCard from "../components/ElectionCard";

function VoterHome() {
  const [pastElections, setPastElections] = useState([]);
  const [ongoingElections, setOngoingElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useSession();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchElections = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_URL}/elections/user/${user.user_id}`
          );
          setOngoingElections(
            res.data.filter((election) => election.accepting_responses === true)
          );
          setPastElections(
            res.data.filter(
              (election) => election.accepting_responses === false
            )
          );
          setLoading(false);
        } catch (error) {
          console.log("ERROR", error);
        }
      }
    };

    fetchElections();
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

      <main className="flex-grow p-4 sm:p-6">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Ongoing Elections
        </h2>
        {ongoingElections.length > 0 ? (
          <ul className="space-y-4">
            {ongoingElections.map((election) => (
              <li
                key={election.election_id}
                className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:bg-gray-50"
              >
                <ElectionCard election={election} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="mb-4">No elections available.</p>
        )}

        <hr className="m-2" />

        <h2 className="text-xl sm:text-2xl font-bold my-4">Closed Elections</h2>
        {pastElections.length > 0 ? (
          <ul className="space-y-4">
            {pastElections.map((election) => (
              <li
                key={election.election_id}
                className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:bg-gray-50"
              >
                <ElectionCard election={election} />
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
