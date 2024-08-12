import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const AddModal = ({ users, handleAdd, setModalStatus, type }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [title, setTitle] = useState("Select a user to add");
  useEffect(() => {
    if (type === "group") {
      setTitle("Add Member");
    }
    if (type === "admin") {
      setTitle("Add Adminstrator");
    }
    if (type === "p_user") {
      setTitle("Add Users");
    }
    if (type === "p_group") {
      setTitle("Add Users");
    }
  }, [type]);
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
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
                    <tr className="bg-gray-100 border-b" key={user.user_id}>
                      <td className="px-4 py-2 text-left flex justify-between items-center">
                        {user.name}{" "}
                        <button
                          onClick={(e) => handleAdd(e, user.user_id)}
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
          onClick={() => setModalStatus(false)}
          className="absolute top-2 right-2 p-2"
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

export default AddModal;
