import React, { useState, useEffect } from "react";
import { FaEnvelope, FaPlus, FaTimes } from "react-icons/fa";
import { Link } from "react-router-dom";
import Adminheader from "../../components/adminheader";

const exampleAdministrators = [
  { user_id: 1, name: "Alice Johnson" },
  { user_id: 2, name: "Bob Smith" },
];

const exampleUsers = [
  { user_id: 3, name: "Charlie Brown", email: "charlie@example.com" },
  { user_id: 4, name: "Diana Prince", email: "diana@example.com" },
];

const AdministratorsPage = () => {
  const [administrators, setAdministrators] = useState(exampleAdministrators);
  const [newAdmin, setNewAdmin] = useState({ user_id: "" });
  const [users, setUsers] = useState(exampleUsers);
  const [modalIsOpen, setModalIsOpen] = useState(false);

  const handleAddAdmin = () => {
    const selectedUser = users.find(
      (user) => user.user_id === parseInt(newAdmin.user_id)
    );
    if (selectedUser) {
      setAdministrators([...administrators, selectedUser]);
      setNewAdmin({ user_id: "" });
      setModalIsOpen(false);
    }
  };

  const handleRemoveAdmin = (user_id) => {
    setAdministrators(
      administrators.filter((admin) => admin.user_id !== user_id)
    );
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewAdmin({ ...newAdmin, [name]: value });
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Admin</h2>
          <button
            onClick={() => setModalIsOpen(true)}
            className="bg-blue-600 text-white p-2 rounded-full"
          >
            <FaPlus size={20} />
          </button>
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border p-2 text-center">Name</th>
              <th className="border p-2 text-center">Remove</th>
            </tr>
          </thead>
          <tbody>
            {administrators.map((admin) => (
              <tr key={admin.user_id}>
                <td className="border p-2 text-left w-3/5">{admin.name}</td>
                <td className="border p-2 text-center w-1/5">
                  <button
                    onClick={() => handleRemoveAdmin(admin.user_id)}
                    className="bg-red-600 text-white p-2 rounded items-center"
                  >
                    <FaTimes />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">Add New Administrator</h2>
            <div className="flex flex-col space-y-3">
              <select
                name="user_id"
                value={newAdmin.user_id}
                onChange={handleInputChange}
                className="border p-2 rounded"
              >
                <option value="">Select a user</option>
                {users.map((user) => (
                  <option key={user.user_id} value={user.user_id}>
                    {user.name} ({user.email})
                  </option>
                ))}
              </select>
              <button
                onClick={handleAddAdmin}
                className="bg-green-600 text-white p-2 rounded"
              >
                Add Administrator
              </button>
            </div>
            <button
              onClick={() => setModalIsOpen(false)}
              className="absolute top-2 right-2 p-2"
            >
              <FaTimes size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdministratorsPage;
