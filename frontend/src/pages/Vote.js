import React, { useState, useEffect } from "react";
import ConfirmationPage from "../components/VoteConfirmation"; // Import the ConfirmationPage component
import CandidatesForm from "../components/ElectionFormFill"; // Import the new CandidatesForm component
import { useLocation } from "react-router-dom";
import axios from "axios";

const VotingPage = () => {
  const location = useLocation();

  const electionId = location.pathname.split("/")[2];
  const [title, setTitle] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [positions, setPositions] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await axios.get(`${API_URL}/elections/${electionId}`);
        setTitle(res.data.title);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchPositions = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/elections/positions/${electionId}`
        );
        setPositions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTitle();
    fetchPositions();
  }, [electionId, API_URL]);

  const selectCandidate = (positionId, candidateId) => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [positionId]: candidateId,
    }));
  };

  const handleSubmit = () => {
    console.log("Confirmed Candidates:", selectedCandidates);
  };

  return (
    <>
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </header>
      {isConfirming ? (
        <ConfirmationPage
          positions={positions}
          selectedCandidates={selectedCandidates}
          onBack={() => setIsConfirming(false)}
          onSubmit={handleSubmit()}
        />
      ) : (
        <CandidatesForm
          positions={positions}
          selectedCandidates={selectedCandidates}
          selectCandidate={selectCandidate}
          setIsConfirming={setIsConfirming}
        />
      )}
      ;
    </>
  );
};

export default VotingPage;
