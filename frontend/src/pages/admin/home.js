import React, { useState, useEffect } from "react";
import Adminheader from "../../components/adminheader";
import { Link } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

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
    <div>
      <Adminheader />
      <hr />
      <main className="flex-grow p-6">
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
