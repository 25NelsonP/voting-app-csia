import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function VoterHome() {
  const [ongoingVotes, setOngoingVotes] = useState([]);

  // Sample fetch function to simulate getting ongoing votes
  useEffect(() => {
    const fetchOngoingVotes = async () => {
      // Replace this with actual API call
      const votes = [
        { id: 1, title: "Election", date: "2024-07-15" },
        { id: 2, title: "School Board Election", date: "2024-07-20" },
      ];
      setOngoingVotes(votes);
    };

    fetchOngoingVotes();
  }, []);

  return (
    <div className="min-h-min flex flex-col">
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
                key={vote.id}
                className="p-4 border rounded-lg flex justify-between items-center bg-white shadow-sm hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{vote.title}</h3>
                  <p>Closing Date: {vote.date}</p>
                </div>
                <Link
                  to={`/vote/${vote.id}`}
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
    </div>
  );
}

export default VoterHome;
