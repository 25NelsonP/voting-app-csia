import React from "react";

const CandidatesForm = ({
  positions,
  selectedCandidates,
  selectCandidate,
  setIsConfirming,
}) => {
  return (
    <main className="flex flex-col items-center p-3 ">
      {positions.map((position) => (
        <div key={position.position_id} className="mb-10 m-10">
          <h2 className="text-2xl font-bold py-3 text-center">
            {position.title}
          </h2>
          <div className="flex justify-center items-center space-x-4">
            {position.candidates.map((candidate) => (
              <div
                key={candidate.candidate_id}
                onClick={() =>
                  selectCandidate(position.position_id, candidate.candidate_id)
                }
                className={`border rounded-lg p-2 shadow-md cursor-pointer inline-flex flex-col items-center w-60${
                  selectedCandidates[position.position_id] ===
                  candidate.candidate_id
                    ? " bg-blue-100 "
                    : ""
                }`}
              >
                <img
                  src={candidate.img_url}
                  alt="Candidate"
                  className="object-contain rounded-md mb-2"
                />
                <h3 className="text-center text-lg font-semibold">
                  {candidate.name}
                </h3>
                <p className="text-center">Grade {candidate.grade}</p>
              </div>
            ))}
          </div>
        </div>
      ))}
      <div className="p-10 flex justify-end">
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
