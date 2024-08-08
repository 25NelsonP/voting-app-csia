import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import axios from "axios";

const CreateGroupModal = ({ setShowModal, setGroups, groups }) => {
  const [groupName, setGroupName] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  const handleAddGroup = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${API_URL}/groups/`, {
        group_name: groupName,
      });

      const group_id = response.data.group_id;
      const group_name = response.data.group_name;

      const newGroup = { group_id, group_name };

      setGroups((prevGroups) => {
        const updatedGroups = [...prevGroups, newGroup];
        return updatedGroups;
      });
      setShowModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">Create New Group</h2>
        <form onSubmit={handleAddGroup} className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            className="border p-2 rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded flex justify-center items-center"
          >
            <FaPlus className="mr-2" /> Create
          </button>
        </form>
        <button
          onClick={() => setShowModal(false)}
          className="absolute top-2 right-2 p-2"
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

export default CreateGroupModal;
