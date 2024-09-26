import React from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "./../assets/isylogo.png";
import { RxAvatar } from "react-icons/rx";
import useSession from "../utils/useSession";

//header for all users
function Header() {
  const { user } = useSession(); //get user data
  const title = "ISY STUCO";

  //if user is not logged in, display the general header
  if (!user) {
    return (
      <nav className="bg-amber px-4 py-3 flex justify-between relative w-full">
        <div className="flex space-x-4">
          <Link
            to="/"
            className="text-2xl text-black font-bold inline-flex items-center space-x-4"
          >
            <img className="max-w-16" src={logo} alt="logo" />
            <p className="font-bold hover:text-gray-800">{title}</p>
          </Link>
        </div>
      </nav>
    );
  }

  //if user is logged in, display the link to admin dashboard if the user is admin.
  return (
    <nav className="bg-amber px-4 py-3 flex justify-between relative w-full">
      <div className="flex space-x-4">
        <Link
          to="/"
          className="text-2xl text-black font-bold inline-flex items-center space-x-4"
        >
          <img className="max-w-16" src={logo} alt="logo" />
          <p className="font-bold hover:text-gray-800">{title}</p>
        </Link>
      </div>
      <div className="flex items-center gap-x-5">
        <ul className="flex space-x-6 cursor-pointer">
          {user.is_admin ? (
            <li>
              <NavLink to="/admin" className="hover:text-white">
                Admin Dashboard
              </NavLink>
            </li>
          ) : (
            <></>
          )}
          <li className="flex items-center relative cursor-pointer">
            <NavLink to="/profile" className="hover:text-white ">
              <RxAvatar size={25} className="" />
            </NavLink>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default Header;
