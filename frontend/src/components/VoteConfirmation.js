import React from "react";
import { Link } from "react-router-dom";

const ConfirmationPage = ({
  positions,
  selectedCandidates,
  onBack,
  onSubmit,
}) => {
  const getSelectedCandidate = (positionId) => {
    const candidateId = selectedCandidates[positionId];
    const position = positions.find((pos) => pos.position_id === positionId);
    return position.candidates.find(
      (cand) => cand.candidate_id === candidateId
    );
  };

  return (
    <div className="min-h-min flex flex-col">
      <main className="flex flex-col items-center p-3">
        {positions.map((position) => (
          <div key={position.position_id} className="mb-10 m-10">
            <h2 className="text-2xl font-bold py-3 text-center">
              {position.title}
            </h2>
            <div className="flex justify-center">
              {selectedCandidates[position.position_id] ? (
                <div className="border rounded-lg p-2 shadow-md flex flex-col items-center w-60">
                  <img
                    src={getSelectedCandidate(position.position_id).img_url}
                    alt="Candidate"
                    className="h-500 object-contain rounded-md mb-2"
                  />
                  <h3 className="text-center text-lg font-semibold">
                    {getSelectedCandidate(position.position_id).name}
                  </h3>
                </div>
              ) : (
                <p>No candidate selected for this position.</p>
              )}
            </div>
          </div>
        ))}
        <div className="p-10 flex justify-between w-full max-w-md">
          <button
            onClick={onBack}
            className="bg-gray-400 text-white p-2 rounded-lg hover:bg-gray-500"
          >
            Go Back
          </button>
          <Link to={"/voteSuccess"}>
            <button
              onClick={onSubmit}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700"
            >
              Confirm Selection
            </button>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;
