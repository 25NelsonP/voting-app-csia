import React from "react";
import { Link, NavLink } from "react-router-dom";

const header = () => (
  <nav className="bg-amber px-4 py-3 flex justify-between">
    <div className="flex items-center text-xl">
      <Link to="/" className="text-2xl text-black font-bold">
        Home
      </Link>
    </div>
    <div className="flex items-center gap-x-5">
    <ul>
      <li className="active:text-white">
        <NavLink to="/admin" className="hover:text-white">Admin</NavLink>
      </li>
    </ul>
    </div>
  </nav>
);

export default header;
