import React, { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./../assets/isylogo.png";
import { RxAvatar } from "react-icons/rx";

function Header() {
  const [tProfile, settProfile] = useState(false);

  function handleMouseEnter() {
    settProfile(true);
  }

  function handleMouseLeave() {
    settProfile(false);
  }

  function showProfileSettings() {
    if (tProfile) {
      return (
        <div className="flex flex-col bg-white shadow-md rounded-md w-40 p-4 absolute right-0">
          <Link
            className="text-sm font-medium hover:text-blue-500"
            to="/profile"
          >
            Profile
          </Link>
          <Link
            className="text-sm font-medium hover:text-blue-500"
            to="/logout"
          >
            Logout
          </Link>
        </div>
      );
    }
    return null;
  }

  return (
    <nav className="bg-amber px-4 py-3 flex justify-between relative">
      <div className="flex space-x-4">
        <Link
          to="/"
          className="text-2xl text-black font-bold inline-flex items-center space-x-4"
        >
          <img className="max-w-16" src={logo} alt="logo" />
          <p className="font-bold hover:text-gray-800">ISY HS STUCO</p>
        </Link>
      </div>
      <div className="flex items-center gap-x-5">
        <ul className="flex items-center space-x-6">
          <li>
            <NavLink to="/admin" className="hover:text-white">
              Admin
            </NavLink>
          </li>
          <li
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <RxAvatar
              size={23}
              className="rounded-full cursor-pointer hover:text-white"
            />
            {showProfileSettings()}
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
