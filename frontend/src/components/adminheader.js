import React from "react";
import { Link, NavLink } from "react-router-dom";
import { FaPlus } from "react-icons/fa";
import { adminHeaderLinks } from "./../assets/constants/index";

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
            <Link to="/admin/create">
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
