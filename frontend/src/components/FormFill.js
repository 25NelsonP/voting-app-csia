import React from "react";

const CandidatesForm = ({
  positions,
  selectedCandidates,
  selectCandidate,
  handleSubmit,
}) => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex flex-col items-center p-3 ">
        {positions.map((position) => (
          <div key={position.id} className="mb-10 m-10">
            <h2 className="text-2xl font-bold py-3 text-center">
              {position.description}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {position.candidates.map((candidate) => (
                <div
                  key={candidate.id}
                  onClick={() => selectCandidate(position.id, candidate.id)}
                  className={`border rounded-lg p-2 shadow-md cursor-pointer inline-flex flex-col items-center w-60${
                    selectedCandidates[position.id] === candidate.id
                      ? " bg-blue-100 "
                      : ""
                  }`}
                >
                  <img
                    src={candidate.image}
                    alt="Candidate"
                    className="object-contain rounded-md mb-2"
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
            className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-800"
          >
            Next
          </button>
        </div>
      </main>
    </div>
  );
};

export default CandidatesForm;
