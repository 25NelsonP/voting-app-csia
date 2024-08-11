import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit } from "react-icons/fa";
import { NavLink } from "react-router-dom";
import { formHeaderLinks } from "./../assets/constants/index";

const FormEditHeader = ({ electionId }) => {
  const [editingTitle, setEditingTitle] = useState(false);
  const [title, setTitle] = useState("");
  const [newTitle, setNewTitle] = useState("");
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTitle = async () => {
      try {
        const res = await axios.get(`${API_URL}/elections/${electionId}`);
        setTitle(res.data.title);
        setNewTitle(res.data.title);
      } catch (error) {
        console.log(error);
      }
    };
    fetchTitle();
  }, [electionId, API_URL]);

  const handleUpdateTitle = async () => {
    try {
      await axios.put(`${API_URL}/elections/`, {
        election_id: electionId,
        title: newTitle,
      });
      setTitle(newTitle);
      setEditingTitle(false);
    } catch (error) {
      console.log(error);
      setEditingTitle(false);
    }
  };

  return (
    <header className="bg-blue-600 text-white p-4 flex justify-between items-center">
      <div className="flex items-center">
        {editingTitle ? (
          <div className="flex items-center text-black">
            <input
              type="text"
              id="title"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              className="p-2 border rounded mr-2"
            />
            <button
              onClick={handleUpdateTitle}
              className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-800"
            >
              Save
            </button>
            <button
              onClick={() => {
                setEditingTitle(false);
                setNewTitle(title);
              }}
              className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
            >
              Cancel
            </button>
          </div>
        ) : (
          <div className="flex items-center">
            <h1 className="text-xl font-bold">{title}</h1>
            <button onClick={() => setEditingTitle(true)} className="ml-2 p-2">
              <FaEdit />
            </button>
          </div>
        )}
      </div>
      <div className="flex items-center gap-x-5">
        <ul className="flex items-center space-x-6">
          {formHeaderLinks.map((item) => {
            return (
              <li key={item.route}>
                <NavLink
                  to={`${item.route}/${electionId}`}
                  className="hover:text-gray-300 active:text-gray-500"
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
        </ul>
      </div>
    </header>
  );
};

export default FormEditHeader;
