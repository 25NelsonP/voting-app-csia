import React from "react";
import CandidateCard from "./CandidateCard";

//form filling component.
const CandidatesForm = ({
  positions,
  selectedCandidates,
  selectCandidate,
  setIsConfirming,
}) => {
  return (
    <main className="flex flex-col items-center p-3">
      {positions.map((position) => (
        <div key={position.position_id} className="mb-10 w-full max-w-4xl">
          <h2 className="text-2xl font-bold py-3 text-center">
            {position.title}
          </h2>
          <div className="flex flex-wrap justify-center gap-6">
            {position.candidates.map((candidate) => (
              <CandidateCard
                key={candidate.candidate_id}
                candidate={candidate}
                positionId={position.position_id}
                isSelected={
                  selectedCandidates[position.position_id] ===
                  candidate.candidate_id
                }
                onSelect={selectCandidate}
              />
            ))}
          </div>
        </div>
      ))}
      <div className="p-10 flex justify-end sm:justify-center w-full max-w-4xl">
        <button
          onClick={() => setIsConfirming(true)}
          className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-800"
        >
          Next
        </button>
      </div>
    </main>
  );
};

export default CandidatesForm;
