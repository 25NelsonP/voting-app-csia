import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import Adminheader from "./../../components/adminheader";
import { Link } from "react-router-dom";

const exampleUsers = [
  { user_id: 1, name: "Alice Johnson", email: "alice@example.com" },
  { user_id: 2, name: "Bob Smith", email: "bob@example.com" },
  { user_id: 3, name: "Charlie Brown", email: "charlie@example.com" },
  { user_id: 4, name: "Diana Prince", email: "diana@example.com" },
];

const Users = () => {
  const [users, setUsers] = useState(exampleUsers);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Users</h2>
        </div>
        {users.length > 0 ? (
          <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-3/5">Name</th>
                  <th className="border-b p-2 text-center w-2/5">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((admin) => (
                  <tr className="bg-gray-100 border-b " key={admin.user_id}>
                    <td className="px-4 py-2 text-left">{admin.name}</td>
                    <td className="px-4 py-2 text-center">
                      <Link to={"mailto:" + admin.email}>{admin.email}</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No users available.</p>
        )}
      </main>
    </div>
  );
};

export default Users;
