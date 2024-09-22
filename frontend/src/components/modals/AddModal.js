import React, { useEffect, useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const AddModal = ({ users, handleAdd, setModalStatus, type }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState("Select a user to add");

  //Pagination State
  const [currentUserPage, setCurrentUserPage] = useState(1);
  const itemsPerPage = 10;

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
  }, [type]);

  const filteredUsers = users.filter((user) => {
    const name = user.name ? user.name : user.email; // If user.name is null or undefined, use an empty string
    return name.toLowerCase().includes(searchTerm.toLowerCase());
  });

  const handleAddClick = async (e, userId) => {
    setLoading(true);
    await handleAdd(e, userId);
    setLoading(false);
  };

  // Pagination functions for groups
  const nextUserPage = () => {
    if (currentUserPage * itemsPerPage < filteredUsers.length) {
      setCurrentUserPage(currentUserPage + 1);
    }
  };

  const prevUserPage = () => {
    if (currentUserPage > 1) {
      setCurrentUserPage(currentUserPage - 1);
    }
  };
  // Slicing groups and members for pagination
  const paginatedUsers = filteredUsers.slice(
    (currentUserPage - 1) * itemsPerPage,
    currentUserPage * itemsPerPage
  );

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          {loading ? (
            <div className="text-center">Adding...</div>
          ) : paginatedUsers.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
                <table className="w-full text-sm text-black">
                  <tbody>
                    {paginatedUsers.map((user) => (
                      <tr className="bg-gray-100 border-b" key={user.user_id}>
                        <td className="px-4 py-2 text-left flex justify-between items-center">
                          {user.name ? user.name : user.email}
                          <button
                            onClick={(e) => handleAddClick(e, user.user_id)}
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
              {/* Pagination controls for groups */}
              <div className="flex justify-between m-4">
                <button
                  onClick={prevUserPage}
                  disabled={currentUserPage === 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={nextUserPage}
                  disabled={
                    currentUserPage * itemsPerPage >= filteredUsers.length
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </>
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
