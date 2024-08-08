import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { adminHeaderLinks } from "./../assets/constants/index";
import axios from "axios";

const Adminheader = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleCreateFrom = async (e) => {
    e.preventDefault();
    const response = await axios.post(`${API_URL}/elections`);
    const electionId = await response.data.election_id;
    navigate(`/admin/create/${electionId}`);
  };
  return (
    <nav className="bg-blue-600 px-6 py-3 flex justify-between w-full text-white">
      <div className="flex space-x-4">
        <NavLink
          to="/admin"
          className="text-2xlfont-bold inline-flex items-center space-x-4"
        >
          <h1 className="text-xl font-bold text-left">Admin Dashboard</h1>
        </NavLink>
      </div>
      <div className="flex items-center gap-x-5">
        <ul className="flex items-center space-x-6">
          {adminHeaderLinks.map((item) => {
            return (
              <li key={item.route}>
                <NavLink
                  to={item.route}
                  className="hover:text-gray-300 active:text-gray-500"
                >
                  {item.label}
                </NavLink>
              </li>
            );
          })}
          <li>
            <button
              onClick={handleCreateFrom}
              className="bg-blue-700 text-white p-4 rounded-full hover:bg-blue-900 hover:shadow-md flex items-center"
            >
              <FaPlus className="m-1" /> New Form
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Adminheader;
