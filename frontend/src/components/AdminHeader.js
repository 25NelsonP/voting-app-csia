import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";
import { adminHeaderLinks } from "./../assets/constants/index";
import axios from "axios";

const Adminheader = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const [creating, setCreating] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleCreateForm = async (e) => {
    setCreating(true);
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/elections`);
      const electionId = response.data.election_id;
      navigate(`/admin/edit/${electionId}`);
    } catch (error) {
      console.error("Error creating form:", error);
    } finally {
      setCreating(false);
    }
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <nav className="bg-blue-600 flex justify-between items-center p-4 md:px-6 md:py-3 w-full text-white">
      <div className="flex items-center space-x-4">
        <NavLink to="/admin" className="text-xl font-bold">
          Admin Dashboard
        </NavLink>
      </div>

      {/* Toggle button for mobile view */}
      <button className="md:hidden focus:outline-none" onClick={toggleSidebar}>
        {sidebarOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      <div
        className={`fixed inset-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transition-transform duration-300 ease-in-out md:relative md:translate-x-0 md:flex md:items-center bg-blue-600 w-64 md:w-auto h-full md:h-auto md:space-x-6`}
      >
        <ul className="flex flex-col md:flex-row space-y-4 md:space-y-0 p-4 md:p-0 md:items-center">
          {adminHeaderLinks.map((item) => (
            <li key={item.route}>
              <NavLink
                to={item.route}
                className="hover:text-gray-300 active:text-gray-500 md:mx-2"
                onClick={() => setSidebarOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
          <li className="mt-4 md:mt-0">
            <button
              onClick={handleCreateForm}
              disabled={creating}
              className={`${
                creating ? "bg-blue-900" : "bg-blue-700 hover:bg-blue-900"
              } text-white py-2 px-4 rounded-full flex items-center transition-all duration-200`}
            >
              <FaPlus className="m-1" />
              {creating ? "Creating..." : "New Form"}
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Adminheader;
