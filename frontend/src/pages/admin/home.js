import React, { useState, useEffect } from "react";

const AdminHome = () => {
  const forms = ["Form 1", "Form 2", "Form 3"];
  const [votings, setVotings] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      // Replace this with actual API call
      const votes = [
        { id: 1, title: "Election", date: "2024-07-15" },
        { id: 2, title: "School Board Election", date: "2024-07-20" },
      ];
      setVotings(votes);
    };

    fetchVotes();
  }, []);

  return (
    <div className="bg-gray-100">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
        </div>
      </header>
      <hr />
      <div className="flex justify-center space-x-4 p-6">
        <button className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700">
          + New Voting Form
        </button>
        <button className="bg-blue-600 text-white p-4 rounded-lg shadow-md hover:bg-blue-700">
          User Management
        </button>
      </div>

      <main className="flex-grow px-6">
        <h2 className="text-2xl font-bold mb-4"> Voting Forms </h2>
        <hr className="mb-2" />
        {votings.length > 0 ? (
          <ul className="space-y-3">
            {votings.map((vote) => (
              <li
                key={vote.id}
                className="bg-white shadow p-6 rounded-lg flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{vote.title}</h3>
                  <p>Closing Date: {vote.date}</p>
                </div>
                <div className="flex space-x-4">
                  <button className="bg-blue-500 text-white p-2 rounded shadow-md hover:bg-blue-600">
                    Manage
                  </button>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No ongoing votes available.</p>
        )}

        <hr className="mt-2" />
      </main>
    </div>
  );
};

export default AdminHome;
