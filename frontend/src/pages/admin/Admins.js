import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import Adminheader from "./../../components/adminheader";
import axios from "axios";

const Admins = () => {
  const [administrators, setAdministrators] = useState([]);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [modalIsOpen, setModalIsOpen] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/non_admins");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchAdmin = async () => {
      try {
        const res = await axios.get("http://localhost:8080/admins");
        setAdministrators(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchAdmin();
  }, []);

  const handleAddAdmin = async (e, user_id) => {
    e.preventDefault();

    try {
      await axios.put(`http://localhost:8080/set_admin/${user_id}`, {
        is_admin: true,
      });
      const selectedUser = users.find(
        (user) => user.user_id === parseInt(user_id)
      );
      setAdministrators([...administrators, selectedUser]);
      setUsers(users.filter((user) => user.user_id !== user_id));
      setModalIsOpen(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveAdmin = async (user_id) => {
    try {
      await axios.put(`http://localhost:8080/set_admin/${user_id}`, {
        is_admin: false,
      });
      const selectedAdmin = administrators.find(
        (admin) => admin.user_id === parseInt(user_id)
      );
      setAdministrators(
        administrators.filter((admin) => admin.user_id !== user_id)
      );
      setUsers([...users, selectedAdmin]);
    } catch (error) {
      console.log(error);
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Admin</h2>
          <button
            onClick={() => setModalIsOpen(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900"
          >
            <FaPlus size={20} />
          </button>
        </div>
        {administrators.length > 0 ? (
          <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-4/5">Name</th>
                  <th className="border-b p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {administrators.map((admin) => (
                  <tr className="bg-gray-100 border-b " key={admin.user_id}>
                    <td className="px-4 py-2 text-left">{admin.name}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => handleRemoveAdmin(admin.user_id)}
                        className="bg-red-600 text-white p-2 rounded items-center hover:bg-red-700 "
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No administrators available.</p>
        )}
      </main>

      {modalIsOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
            <h2 className="text-2xl font-bold mb-4">Add New Administrator</h2>
            <div className="flex flex-col space-y-3">
              <input
                type="text"
                placeholder="Search users..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border p-2 rounded"
              />
              {users.length > 0 ? (
                <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
                  <table className="w-full text-sm text-black">
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr
                          className="bg-gray-100 border-b "
                          key={user.user_id}
                        >
                          <td className="px-4 py-2 text-left flex justify-between items-center">
                            {user.name}{" "}
                            <button
                              onClick={(e) => handleAddAdmin(e, user.user_id)}
                              className="bg-green-600 text-white p-2 rounded"
                            >
                              <FaPlus />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-center">No users found.</p>
              )}
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

export default Admins;
