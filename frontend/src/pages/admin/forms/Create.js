import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axios from "axios";

const Create = () => {
  const location = useLocation();
  const electionId = location.pathname.split("/")[3];
  const [editingTitle, setEditingTitle] = useState(true);
  const [title, setTitle] = useState("");
  const [positions, setPositions] = useState([]);

  const [editingPosition, setEditingPosition] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);
  const [newDescription, setNewDescription] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateGrade, setNewCandidateGrade] = useState("");
  const [newCandidateImageUrl, setNewCandidateImageUrl] = useState("");
  const [addingCandidate, setAddingCandidate] = useState(null);
  const [addingPosition, setAddingPosition] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

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
        console.log(res.data);
        setPositions(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchTitle();
    fetchPositions();
  }, [electionId, API_URL]);

  const handleRemovePosition = async (positionId) => {
    try {
      await deleteCandidates(positionId);
      await axios.delete(`${API_URL}/elections/positions/${positionId}`);
      setPositions(positions.filter((pos) => pos.position_id !== positionId));
    } catch (error) {
      console.log(error);
    }
  };

  const deleteCandidates = async (positionId) => {
    const position = positions.find((pos) => pos.position_id === positionId);
    console.log(position);
    try {
      const deletePromises = position.candidates.map((cand) =>
        axios.delete(`${API_URL}/elections/candidates/${cand.candidate_id}`)
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveCandidate = async (positionId, candidateId) => {
    try {
      await axios.delete(`${API_URL}/elections/candidates/${candidateId}`);
      setPositions(
        positions.map((pos) =>
          pos.position_id === positionId
            ? {
                ...pos,
                candidates: pos.candidates.filter(
                  (cand) => cand.candidate_id !== candidateId
                ),
              }
            : pos
        )
      );
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateTitle = async () => {
    try {
      await axios.put(`${API_URL}/elections/`, {
        election_id: electionId,
        title: title,
      });
      setEditingTitle(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditPosition = (positionId) => {
    setEditingPosition(positionId);
    const position = positions.find((pos) => pos.position_id === positionId);
    setNewDescription(position.title);
  };

  const handleUpdatePosition = async (positionId) => {
    try {
      await axios.put(`${API_URL}/elections/positions`, {
        position_id: positionId,
        title: newDescription,
      });
      setPositions(
        positions.map((pos) =>
          pos.position_id === positionId
            ? { ...pos, title: newDescription }
            : pos
        )
      );
      setEditingPosition(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleEditCandidate = (positionId, candidateId) => {
    setEditingCandidate({ positionId, candidateId });
    const position = positions.find((pos) => pos.position_id === positionId);
    const candidate = position.candidates.find(
      (cand) => cand.candidate_id === candidateId
    );
    setNewCandidateName(candidate.name);
    setNewCandidateGrade(candidate.grade);
    setNewCandidateImageUrl(candidate.img_url);
  };

  const handleUpdateCandidate = async (positionId, candidateId) => {
    try {
      await axios.put(`${API_URL}/elections/candidates`, {
        candidate_id: candidateId,
        name: newCandidateName,
        grade: newCandidateGrade,
        img_url: newCandidateImageUrl,
      });
      setPositions(
        positions.map((pos) =>
          pos.position_id === positionId
            ? {
                ...pos,
                candidates: pos.candidates.map((cand) =>
                  cand.candidate_id === candidateId
                    ? {
                        ...cand,
                        name: newCandidateName,
                        grade: newCandidateGrade,
                        img_url: newCandidateImageUrl,
                      }
                    : cand
                ),
              }
            : pos
        )
      );
      setEditingCandidate(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddCandidate = (positionId) => {
    setAddingCandidate(positionId);
    setNewCandidateName("");
    setNewCandidateGrade("");
    setNewCandidateImageUrl("");
  };

  const handleSaveNewCandidate = async (positionId) => {
    try {
      const res = await axios.post(`${API_URL}/elections/candidates`, {
        position_id: positionId,
        name: newCandidateName,
        grade: newCandidateGrade,
        img_url: newCandidateImageUrl,
      });
      setPositions(
        positions.map((pos) =>
          pos.position_id === positionId
            ? {
                ...pos,
                candidates: [...pos.candidates, res.data],
              }
            : pos
        )
      );
      setAddingCandidate(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddPosition = () => {
    setAddingPosition(true);
    setNewDescription("");
  };

  const handleSaveNewPosition = async () => {
    try {
      const res = await axios.post(`${API_URL}/elections/positions`, {
        election_id: electionId,
        title: newDescription,
      });
      console.log(res);
      setPositions([...positions, res.data]);
      setAddingPosition(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
        <div className="flex items-center">
          {editingTitle ? (
            <div className="flex items-center text-black">
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="p-2 border rounded mr-2"
              />
              <button
                onClick={handleUpdateTitle}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-800"
              >
                Save
              </button>
              <button
                onClick={() => setEditingTitle(false)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h1 className="text-xl font-bold">{title}</h1>
              <button
                onClick={() => setEditingTitle(true)}
                className="ml-2 p-2"
              >
                <FaEdit />
              </button>
            </div>
          )}
        </div>
      </header>
      <div className="min-h-screen flex flex-col">
        <main className="flex flex-col items-center p-3 ">
          {positions.map((position) => (
            <div key={position.position_id} className="mb-10 m-10">
              <div className="flex justify-center items-center">
                {editingPosition === position.position_id ? (
                  <div className="flex items-center text-black py-2">
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      className="p-2 border rounded mr-2"
                    />
                    <button
                      onClick={() => handleUpdatePosition(position.position_id)}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingPosition(null)}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h2 className="text-2xl font-bold py-3 flex justify-center items-center">
                    {position.title}
                    <button
                      onClick={() => handleEditPosition(position.position_id)}
                      className="ml-2 border-2 rounded-lg p-1 text-black"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleRemovePosition(position.position_id)}
                      className="ml-2 border-2 rounded-lg p-1 text-black"
                    >
                      <MdDelete />
                    </button>
                  </h2>
                )}
              </div>
              <div className="flex justify-center items-center space-x-4">
                {position.candidates.map((candidate) => (
                  <div
                    key={candidate.candidate_id}
                    className="flex justify-center"
                  >
                    {editingCandidate &&
                    editingCandidate.positionId === position.position_id &&
                    editingCandidate.candidateId === candidate.candidate_id ? (
                      <div className="flex flex-col items-center text-black border rounded-lg p-2 shadow-md cursor-pointer w-60">
                        <input
                          type="text"
                          value={newCandidateName}
                          onChange={(e) => setNewCandidateName(e.target.value)}
                          className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                          type="text"
                          value={newCandidateGrade}
                          onChange={(e) => setNewCandidateGrade(e.target.value)}
                          className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                          type="text"
                          value={newCandidateImageUrl}
                          onChange={(e) =>
                            setNewCandidateImageUrl(e.target.value)
                          }
                          className="p-2 border rounded mb-2 w-full"
                        />
                        <div className="flex">
                          <button
                            onClick={() =>
                              handleUpdateCandidate(
                                position.position_id,
                                candidate.candidate_id
                              )
                            }
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900"
                          >
                            Save
                          </button>
                          <button
                            onClick={() => setEditingCandidate(null)}
                            className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center">
                        <div
                          className={`border rounded-lg p-2 shadow-md inline-flex flex-col items-center w-60 `}
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
                        <div className="mt-2">
                          <button
                            onClick={() =>
                              handleEditCandidate(
                                position.position_id,
                                candidate.candidate_id
                              )
                            }
                            className="ml-2 border-2 rounded-lg p-2 text-black"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() =>
                              handleRemoveCandidate(
                                position.position_id,
                                candidate.candidate_id
                              )
                            }
                            className="ml-2 border-2 rounded-lg p-2 text-black"
                          >
                            <MdDelete />
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {addingCandidate === position.position_id ? (
                  <div className="flex flex-col items-center text-black border rounded-lg p-2 shadow-md cursor-pointer w-60">
                    <input
                      type="text"
                      value={newCandidateName}
                      onChange={(e) => setNewCandidateName(e.target.value)}
                      placeholder="Name"
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                      type="text"
                      value={newCandidateGrade}
                      onChange={(e) => setNewCandidateGrade(e.target.value)}
                      placeholder="Grade"
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                      type="text"
                      value={newCandidateImageUrl}
                      onChange={(e) => setNewCandidateImageUrl(e.target.value)}
                      placeholder="Image URL"
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <div className="flex">
                      <button
                        onClick={() =>
                          handleSaveNewCandidate(position.position_id)
                        }
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900"
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setAddingCandidate(null)}
                        className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleAddCandidate(position.position_id)}
                    className="border rounded-lg p-2 shadow-md cursor-pointer inline-flex flex-col items-center w-60 hover:bg-blue-100"
                  >
                    <div className="flex justify-center items-center h-full">
                      <FaPlus className="h-5 w-5 text-blue-500 mr-2" />
                      <h3 className="text-center text-lg font-semibold">
                        Add Candidate
                      </h3>
                    </div>
                  </button>
                )}
              </div>
            </div>
          ))}
          {addingPosition ? (
            <div className="flex flex-col items-center text-black border rounded-lg p-2 shadow-md cursor-pointer w-60 mb-4">
              <input
                type="text"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="Position Description"
                className="p-2 border rounded mb-2 w-full"
              />
              <div className="flex">
                <button
                  onClick={handleSaveNewPosition}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900"
                >
                  Save
                </button>
                <button
                  onClick={() => setAddingPosition(false)}
                  className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={handleAddPosition}
              className="border rounded-lg px-5 py-2 shadow-md cursor-pointer inline-flex flex-col items-center hover:bg-blue-100"
            >
              <div className="flex justify-center items-center h-full">
                <FaPlus className="h-5 w-5 text-blue-500 mr-1" />
                <h3 className="text-center text-lg font-semibold">
                  Add Position
                </h3>
              </div>
            </button>
          )}
        </main>
      </div>
    </div>
  );
};

export default Create;
