import React, { useEffect, useState } from "react";
import { FaEdit, FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useLocation } from "react-router-dom";
import axios from "axios";
import FormEditHeader from "../../../components/FormEditHeader";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import LoadingScreen from "../../../components/LoadingScreen";

const Edit = () => {
  const location = useLocation();
  const electionId = location.pathname.split("/")[3]; //get election id from path
  const [positions, setPositions] = useState([]); //positions state
  const [loading, setLoading] = useState(true);

  //open the add/edit forms
  const [addingCandidate, setAddingCandidate] = useState(null);
  const [addingPosition, setAddingPosition] = useState(false);
  const [editingPosition, setEditingPosition] = useState(null);
  const [editingCandidate, setEditingCandidate] = useState(null);

  //processing text
  const [processingPosition, setProcessingPosition] = useState(false);
  const [processingCandidate, setProcessingCandidate] = useState(false);
  const [deletingCandidate, setDeletingCandidate] = useState(false);
  const [deletingPosition, setDeletingPosition] = useState(false);

  //states for the new value
  const [newPositionDescription, setNewPositionDescription] = useState("");
  const [newCandidateName, setNewCandidateName] = useState("");
  const [newCandidateGrade, setNewCandidateGrade] = useState("");
  const [newCandidateImageUrl, setNewCandidateImageUrl] = useState("");

  const BACKEND_API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    //get the positions and the corresponding candidate
    const fetchPositions = async () => {
      try {
        const res = await axios.get(
          `${BACKEND_API_URL}/elections/positions/${electionId}`
        );
        setPositions(res.data);
      } catch (error) {
        console.log("Position", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, [electionId, BACKEND_API_URL]);

  const handleRemovePosition = async (positionId) => {
    //delete the position
    setDeletingPosition(true);
    try {
      await deleteCandidates(positionId);
      await axios.delete(
        `${BACKEND_API_URL}/elections/positions/${positionId}`
      );
      setPositions(positions.filter((pos) => pos.position_id !== positionId));
    } catch (error) {
      console.log(error);
      setDeletingPosition(false);
    } finally {
      setDeletingPosition(false);
    }
  };

  //called when deleting a position, to delete the corresponding candidate
  const deleteCandidates = async (positionId) => {
    const position = positions.find((pos) => pos.position_id === positionId);
    try {
      const deletePromises = position.candidates.map((cand) =>
        axios.delete(
          `${BACKEND_API_URL}/elections/candidates/${cand.candidate_id}`
        )
      );
      await Promise.all(deletePromises);
    } catch (error) {
      console.log(error);
    }
  };

  //delete a candidate
  const handleRemoveCandidate = async (positionId, candidateId) => {
    setDeletingCandidate(true);
    try {
      await axios.delete(
        `${BACKEND_API_URL}/elections/candidates/${candidateId}`
      );
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
    } finally {
      setDeletingCandidate(false);
    }
  };

  //set editing states
  const handleEditPosition = (positionId) => {
    setEditingPosition(positionId);
    const position = positions.find((pos) => pos.position_id === positionId);
    setNewPositionDescription(position.title);
    setAddingPosition(false);
  };

  //backend saving
  const handleUpdatePosition = async (positionId) => {
    const position = positions.find((pos) => pos.position_id === positionId);
    if (newPositionDescription === position.title) {
      setEditingPosition(null);
      return;
    }
    setProcessingPosition(true);
    try {
      await axios.put(`${BACKEND_API_URL}/elections/positions/`, {
        position_id: positionId,
        title: newPositionDescription,
      });
      setPositions(
        positions.map((pos) =>
          pos.position_id === positionId
            ? { ...pos, title: newPositionDescription }
            : pos
        )
      );
      setEditingPosition(null);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessingPosition(false);
    }
  };

  //set editing candidate states
  const handleEditCandidate = (positionId, candidateId) => {
    setAddingCandidate(false);
    setEditingCandidate({ positionId, candidateId });
    const position = positions.find((pos) => pos.position_id === positionId);
    const candidate = position.candidates.find(
      (cand) => cand.candidate_id === candidateId
    );
    setNewCandidateName(candidate.name);
    setNewCandidateGrade(candidate.grade);
    setNewCandidateImageUrl(candidate.img_url);
  };

  // backend saving
  const handleUpdateCandidate = async (positionId, candidateId) => {
    const position = positions.find((pos) => pos.position_id === positionId);
    const candidate = position.candidates.find(
      (cand) => cand.candidate_id === candidateId
    );

    // Check if the new name is the same as the old name
    if (
      candidate.name === newCandidateName &&
      candidate.grade === newCandidateGrade &&
      candidate.img_url === newCandidateImageUrl
    ) {
      setEditingCandidate(null);
      return; // Exit early without making the backend call
    }

    setProcessingCandidate(true);
    try {
      await axios.put(`${BACKEND_API_URL}/elections/candidates`, {
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
    } finally {
      setProcessingCandidate(false);
    }
  };

  //set states for a new candidate
  const handleAddCandidate = (positionId) => {
    setEditingCandidate(false);
    setAddingCandidate(positionId);
    setNewCandidateName("");
    setNewCandidateGrade("");
    setNewCandidateImageUrl("");
  };

  // backend saving
  const handleSaveNewCandidate = async (positionId) => {
    if (!newCandidateName || !newCandidateGrade) {
      alert("Name and grade cannot be empty.");
      return;
    }
    setProcessingCandidate(true);
    try {
      const res = await axios.post(`${BACKEND_API_URL}/elections/candidates`, {
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
    } finally {
      setProcessingCandidate(false);
    }
  };

  //set states for a new position
  const handleAddPosition = () => {
    setAddingPosition(true);
    setEditingPosition(false);
    setNewPositionDescription("");
  };

  // backend saving
  const handleSaveNewPosition = async () => {
    setProcessingPosition(true);
    try {
      const res = await axios.post(`${BACKEND_API_URL}/elections/positions`, {
        election_id: electionId,
        title: newPositionDescription,
      });
      setPositions([...positions, res.data]);
      setAddingPosition(false);
    } catch (error) {
      console.log(error);
    } finally {
      setProcessingPosition(false);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <FormEditHeader electionId={electionId} />

      <div className="flex flex-col">
        <main className="flex flex-col items-center p-3 ">
          {positions.map((position) => (
            <div key={position.position_id} className="mb-10 m-10">
              <div className="flex justify-center items-center">
                {editingPosition === position.position_id ? (
                  <div className="flex items-center text-black py-2">
                    <input
                      type="text"
                      id={position.position_id}
                      value={newPositionDescription}
                      onChange={(e) =>
                        setNewPositionDescription(e.target.value)
                      }
                      disabled={processingPosition}
                      className="p-2 border rounded mr-2"
                    />
                    <button
                      onClick={() => handleUpdatePosition(position.position_id)}
                      className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900 disabled:bg-green-400"
                      disabled={processingPosition}
                    >
                      {processingPosition ? "Saving..." : "Save"}
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
                      disabled={deletingPosition}
                      className="ml-2 border-2 rounded-lg p-1 text-black disabled:text-gray-600"
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
                          id="candidateName"
                          disabled={processingCandidate}
                          value={newCandidateName}
                          onChange={(e) => setNewCandidateName(e.target.value)}
                          className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                          type="number"
                          id="candidateGrade"
                          disabled={processingCandidate}
                          value={newCandidateGrade}
                          onChange={(e) => setNewCandidateGrade(e.target.value)}
                          className="p-2 border rounded mb-2 w-full"
                        />
                        <input
                          type="text"
                          id="candidateImage"
                          disabled={processingCandidate}
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
                            disabled={processingCandidate}
                            className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900 disabled:bg-green-400"
                          >
                            {processingCandidate ? "Saving..." : "Save"}
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
                            src={
                              candidate.img_url ||
                              "https://via.placeholder.com/400x516"
                            }
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
                            disabled={deletingCandidate}
                            className="ml-2 border-2 rounded-lg p-2 text-black disabled:text-gray-600"
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
                      id="newName"
                      value={newCandidateName}
                      disabled={processingCandidate}
                      onChange={(e) => setNewCandidateName(e.target.value)}
                      placeholder="Name"
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                      type="number"
                      id="newGrade"
                      value={newCandidateGrade}
                      disabled={processingCandidate}
                      onChange={(e) => setNewCandidateGrade(e.target.value)}
                      placeholder="Grade"
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <input
                      type="text"
                      id="newImage"
                      value={newCandidateImageUrl}
                      disabled={processingCandidate}
                      onChange={(e) => setNewCandidateImageUrl(e.target.value)}
                      placeholder="Image URL"
                      className="p-2 border rounded mb-2 w-full"
                    />
                    <div className="flex">
                      <button
                        onClick={() =>
                          handleSaveNewCandidate(position.position_id)
                        }
                        disabled={processingCandidate}
                        className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900 disabled:bg-green-400"
                      >
                        {processingCandidate ? "Saving..." : "Save"}
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
                value={newPositionDescription}
                id="newPosition"
                disabled={processingPosition}
                onChange={(e) => setNewPositionDescription(e.target.value)}
                placeholder="Position Description"
                className="p-2 border rounded mb-2 w-full"
              />
              <div className="flex">
                <button
                  onClick={handleSaveNewPosition}
                  disabled={processingPosition}
                  className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900 disabled:bg-green-400"
                >
                  {processingPosition ? "Saving..." : "Save"}
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
      <Footer />
    </div>
  );
};

export default Edit;
