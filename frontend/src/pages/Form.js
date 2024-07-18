import React, { useState } from "react";
import ConfirmationPage from "./Confirmation"; // Import the ConfirmationPage component
import CandidatesForm from "./FormFill"; // Import the new CandidatesForm component

const ViewCandidatesPage = () => {
  const candidateImage =
    "https://yearbooks.isyedu.org/wp-content/uploads/2024/02/Aung-Kaung-Khant-Kelvin.jpg";
  const positions = [
    {
      id: 1,
      description: "Position Description 1",
      candidates: [
        { id: 1, name: "Candidate Name 1", image: candidateImage },
        { id: 2, name: "Candidate Name 2", image: candidateImage },
        { id: 3, name: "Candidate Name 3", image: candidateImage },
      ],
    },
    {
      id: 2,
      description: "Position Description 2",
      candidates: [
        { id: 1, name: "Candidate Name 4", image: candidateImage },
        { id: 2, name: "Candidate Name 5", image: candidateImage },
        { id: 3, name: "Candidate Name 6", image: candidateImage },
      ],
    },
  ];

  const [selectedCandidates, setSelectedCandidates] = useState({});
  const [isConfirming, setIsConfirming] = useState(false);

  const selectCandidate = (positionId, candidateId) => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [positionId]: candidateId,
    }));
  };

  const handleSubmit = () => {
    setIsConfirming(true); // Navigate to confirmation page
  };

  return (
    <>
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Vote for AKK</h1>
        </div>
      </header>
      {isConfirming ? (
        <ConfirmationPage
          positions={positions}
          selectedCandidates={selectedCandidates}
          onBack={() => setIsConfirming(false)}
          onSubmit={() => {
            console.log("Confirmed Candidates:", selectedCandidates);
            // Perform any additional actions such as sending the selected candidates to an API
          }}
        />
      ) : (
        <CandidatesForm
          positions={positions}
          selectedCandidates={selectedCandidates}
          selectCandidate={selectCandidate}
          handleSubmit={handleSubmit}
        />
      )}
      ;
    </>
  );
};

export default ViewCandidatesPage;
