import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaPlus } from "react-icons/fa";

const Adminheader = () => {
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
          <li>
            <NavLink to="/admin/manageAdmins" className="hover:text-gray-300">
              Admin Management
            </NavLink>
          </li>
          <li>
            <NavLink to="/admin/manageUsers" className="hover:text-gray-300">
              User Management
            </NavLink>
          </li>
          <li>
            <Link to="/admin/new-voting-form">
              <button className="bg-blue-700 text-white p-4 rounded-full hover:bg-blue-900 hover:shadow-md flex items-center">
                <FaPlus className="m-1" /> New Form
              </button>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
};

export default Adminheader;
