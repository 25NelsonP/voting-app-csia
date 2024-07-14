import React, { useState } from "react";

const ViewCandidatesPage = () => {
  const candidateImage =
    "https://yearbooks.isyedu.org/wp-content/uploads/2024/02/Aung-Kaung-Khant-Kelvin.jpg";
  const title = "Vote for AKK";
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

  const selectCandidate = (positionId, candidateId) => {
    setSelectedCandidates((prevSelectedCandidates) => ({
      ...prevSelectedCandidates,
      [positionId]: candidateId,
    }));
  };

  const handleSubmit = () => {
    // Handle the submission logic here
    console.log("Selected Candidates:", selectedCandidates);
    // Perform any additional actions such as sending the selected candidates to an API
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
      </header>

      <main className="flex-grow p-3">
        {positions.map((position) => (
          <div key={position.id} className="mb-10 m-10">
            <h2 className="text-2xl font-bold mx-5">{position.description}</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 gap-4">
              {position.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => selectCandidate(position.id, candidate.id)}
                  className={`border rounded-lg p-2 shadow-md cursor-pointer ${
                    selectedCandidates[position.id] === candidate.id
                      ? "bg-blue-100"
                      : ""
                  }`}
                >
                  <img
                    src={candidate.image}
                    alt="Candidate"
                    className="w-full h-40 object-contain rounded-md mb-2"
                  />
                  <h3 className="text-center text-lg font-semibold">
                    {candidate.name}
                  </h3>
                </div>
              ))}
            </div>
          </div>
        ))}
        <div className="p-10 flex justify-end">
          <button
            onClick={handleSubmit}
            className="  bg-blue-600 text-white p-2 rounded-lg"
          >
            Submit Selection
          </button>
        </div>
      </main>
    </div>
  );
};

export default ViewCandidatesPage;
