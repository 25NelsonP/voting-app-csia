import React from "react";

//presents the candidate for the form and editor
const CandidateCard = ({ candidate, positionId, isSelected, onSelect }) => {
  return (
    <div
      onClick={
        onSelect
          ? () => onSelect(positionId, candidate.candidate_id)
          : undefined
      }
      className={`border rounded-lg p-2 shadow-md cursor-pointer flex flex-col items-center w-40 sm:w-48 md:w-56 lg:w-60 ${
        isSelected ? "bg-blue-100" : "bg-white"
      }`}
    >
      <img
        src={candidate.img_url || "https://via.placeholder.com/400x516"}
        alt="Candidate"
        className="object-contain rounded-lg mb-2 w-full"
      />
      <h3 className="text-center text-lg font-semibold">{candidate.name}</h3>
      <p className="text-center">Grade {candidate.grade}</p>
    </div>
  );
};

export default CandidateCard;
