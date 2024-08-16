import React, { useState, useEffect } from "react";
import ConfirmationPage from "../components/VoteConfirmation"; // Import the ConfirmationPage component
import ElectionForm from "../components/ElectionFormFill"; // Import ElectionForm component
import { Link, useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingScreen from "./../components/LoadingScreen";
import useSession from "../utils/useSession";
import Header from "../components/Header";
import Footer from "../components/Footer";

const VotingPage = () => {
  const location = useLocation();

  const { user } = useSession();

  const electionId = location.pathname.split("/")[2];
  const [loading, setLoading] = useState(true);
  const [election, setElection] = useState([]);
  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);
  const [positions, setPositions] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTitleAndPositions = async () => {
      try {
        const res = await axios.get(`${API_URL}/elections/${electionId}`);
        setElection(res.data);
        const resPositions = await axios.get(
          `${API_URL}/elections/positions/${electionId}`
        );
        setPositions(resPositions.data);
        if (!res.data.accepting_responses) {
          navigate("/closed");
        } else {
          await fetchPermission();
        }
      } catch (error) {
        console.log(error);
        navigate("/not-found");
      }
    };

    const fetchPermission = async () => {
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
        setLoading(false);
      } catch (error) {
        console.log("Error checking status", error);
      }
    };
    if (user) {
      fetchTitleAndPositions();
    }
  }, [user, API_URL, navigate, electionId]);

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
      <Header />
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">{election.title}</h1>
        </div>
        {user.is_admin ? (
          <p>
            Looking to edit form?{" "}
            <Link to={`/admin/edit/${electionId}`}>ClickHere</Link>
          </p>
        ) : (
          <></>
        )}
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
      <Footer />
    </>
  );
};

export default VotingPage;
