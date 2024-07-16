import React from "react";

const ConfirmationPage = ({
  positions,
  selectedCandidates,
  onBack,
  onSubmit,
}) => {
  const getSelectedCandidate = (positionId) => {
    const candidateId = selectedCandidates[positionId];
    const position = positions.find((pos) => pos.id === positionId);
    return position.candidates.find((cand) => cand.id === candidateId);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <h1 className="text-xl font-bold">Confirm Your Selection</h1>
        </div>
      </header>

      <main className="flex flex-col items-center p-3">
        {positions.map((position) => (
          <div key={position.id} className="mb-10 m-10">
            <h2 className="text-2xl font-bold py-3 text-center">
              {position.description}
            </h2>
            <div className="flex justify-center">
              {selectedCandidates[position.id] ? (
                <div className="border rounded-lg p-2 shadow-md flex flex-col items-center w-60">
                  <img
                    src={getSelectedCandidate(position.id).image}
                    alt="Candidate"
                    className="h-500 object-contain rounded-md mb-2"
                  />
                  <h3 className="text-center text-lg font-semibold">
                    {getSelectedCandidate(position.id).name}
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
            className="bg-gray-400 text-white p-2 rounded-lg"
          >
            Go Back
          </button>
          <button
            onClick={onSubmit}
            className="bg-blue-600 text-white p-2 rounded-lg"
          >
            Confirm Selection
          </button>
        </div>
      </main>
    </div>
  );
};

export default ConfirmationPage;
