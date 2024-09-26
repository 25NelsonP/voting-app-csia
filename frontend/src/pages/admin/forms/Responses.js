import React, { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import LoadingScreen from "./../../../components/LoadingScreen";
import FormEditHeader from "../../../components/FormEditHeader";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const Responses = () => {
  const location = useLocation();
  const electionId = location.pathname.split("/")[4];
  const [positions, setPositions] = useState([]);
  const [loading, setLoading] = useState(true);

  //backend call
  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/votes/${electionId}`
        );
        setPositions(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching candidate data:", error);
        setLoading(false);
      }
    };

    fetchResponses();
  }, [electionId]);

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FormEditHeader electionId={electionId} />
      <main className="flex flex-col items-center p-3">
        {positions.map((position) => (
          <div key={position.position_id} className="mb-6">
            <h2 className="text-xl font-semibold mb-3">{position.title}</h2>
            <div className="flex flex-justify-center items-center space-x-3">
              {position.candidates.map((candidate) => (
                <div
                  key={candidate.candidate_id}
                  className="flex bg-white shadow-md rounded-lg overflow-hidden"
                >
                  <img
                    src={
                      candidate.img_url || "https://via.placeholder.com/400x516"
                    }
                    alt={`${candidate.name}`}
                    className="h-52 object-cover"
                  />
                  <div className="p-4 flex flex-col justify-center">
                    <h3 className="text-lg font-semibold">{candidate.name}</h3>
                    <p className="text-gray-600">Grade {candidate.grade}</p>
                    <p className="text-gray-800 font-bold mt-2">
                      Votes: {candidate.voteCount}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
};

export default Responses;
