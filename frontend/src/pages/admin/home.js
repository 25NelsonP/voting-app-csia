import React, { useState, useEffect } from "react";
import Adminheader from "../../components/AdminHeader";
import axios from "axios";
import FormatDate from "../../components/FormatDate";

const AdminHome = () => {
  const [votings, setVotings] = useState([]);

  useEffect(() => {
    const fetchVotes = async () => {
      try {
        const res = await axios.get("http://localhost:8080/elections");
        setVotings(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchVotes();
  }, []);

  return (
    <div className="min-h-min flex flex-col">
      <Adminheader />
      <hr />
      <main className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-4"> Voting Forms </h2>
        <hr className="mb-2" />
        {votings.length > 0 ? (
          <ul className="space-y-3">
            {votings.map((vote) => (
              <li
                key={vote.election_id}
                className="bg-white shadow p-6 rounded-lg flex justify-between items-center hover:bg-gray-50"
              >
                <div>
                  <h3 className="font-semibold">{vote.title}</h3>
                  <p>
                    Closing Date: {<FormatDate dateString={vote.end_date} />}
                  </p>
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
