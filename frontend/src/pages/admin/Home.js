import React, { useState, useEffect } from "react";
import Adminheader from "../../components/AdminHeader";
import axios from "axios";
import FormatDate from "../../components/FormatDate";
import { Link } from "react-router-dom";
import LoadingScreen from "../../components/LoadingScreen";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const AdminHome = () => {
  const [elections, setElections] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  //fetch the elections
  useEffect(() => {
    const fetchElections = async () => {
      try {
        const res = await axios.get(`${API_URL}/elections`);
        setElections(res.data);
        setLoading(false);
      } catch (error) {
        console.log("Error", error);
        setLoading(false);
      }
    };

    fetchElections();
  }, [API_URL]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Adminheader />
      <hr />
      <main className="flex-grow p-6">
        <h2 className="text-2xl font-bold mb-4"> Voting Forms </h2>
        <hr className="mb-2" />
        {elections.length > 0 ? (
          <ul className="space-y-3">
            {elections.map((vote) => (
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
                  <Link
                    to={`/admin/edit/${vote.election_id}`}
                    className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
                  >
                    Manage
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p>No elections available.</p>
        )}

        <hr className="mt-2" />
      </main>
      <Footer />
    </div>
  );
};

export default AdminHome;
