import React, { useState, useEffect } from "react";
import ConfirmationPage from "../components/VoteConfirmation"; // Import the ConfirmationPage component
import ElectionForm from "../components/ElectionFormFill"; // Import ElectionForm component
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "./../components/LoadingScreen";
import useSession from "../utils/useSession";

const VotingPage = () => {
  const location = useLocation();

  const { user } = useSession();

  const electionId = location.pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState("");
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [positions, setPositions] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPermission = async () => {
      if (user) {
        try {
          const res = await axios.get(
            `${API_URL}/permissions/check/${electionId}/${user.user_id}`
          );
          if (!res.data.eligible) {
            navigate("/noaccess");
          }
          if (res.data.voted) {
            navigate("/voted");
          }
        } catch (error) {
          console.log("Error checking status", error);
        }
      }
    };
    fetchPermission();
  }, [user, API_URL, navigate, electionId]);

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
    setLoading(false);
  }, [electionId, API_URL]);

  const selectCandidate = (positionId, candidateId) => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [positionId]: candidateId,
    }));
  };

  const handleSubmit = async (e) => {
    try {
      await axios.post(`${API_URL}/votes/submit`, {
        voter_id: user.user_id,
        election_id: electionId,
        votes: selectedCandidates,
      });
      navigate("/votesuccess");
    } catch (error) {
      console.log(error);
    }
    console.log("Confirmed Candidates:", selectedCandidates);
  };

  if (loading) {
    return <LoadingScreen />;
  }

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
          onSubmit={() => handleSubmit()}
        />
      ) : (
        <ElectionForm
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
