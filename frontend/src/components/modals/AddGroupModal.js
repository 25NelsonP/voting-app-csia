import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const AddModal = ({ groups, handleAdd, setModalStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const title = "Add Group";
  const [currentGroupPage, setCurrentGroupPage] = useState(1);
  const itemsPerPage = 10;

  //filtering groups by the search term
  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // called when add is clicked, used in form permissions
  const handleAddClick = async (e, groupId) => {
    setLoading(true);
    await handleAdd(e, groupId);
    setLoading(false);
  };

  // Pagination functions for groups
  const nextGroupPage = () => {
    if (currentGroupPage * itemsPerPage < filteredGroups.length) {
      setCurrentGroupPage(currentGroupPage + 1);
    }
  };

  const prevGroupPage = () => {
    if (currentGroupPage > 1) {
      setCurrentGroupPage(currentGroupPage - 1);
    }
  };

  // Slicing groups and members for pagination
  const paginatedGroups = filteredGroups.slice(
    (currentGroupPage - 1) * itemsPerPage,
    currentGroupPage * itemsPerPage
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <div className="flex flex-col space-y-3">
          <input
            type="text"
            placeholder="Search groups..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="border p-2 rounded"
          />
          {loading ? (
            <div className="text-center">Adding...</div>
          ) : paginatedGroups.length > 0 ? (
            <>
              <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
                <table className="w-full text-sm text-black">
                  <tbody>
                    {paginatedGroups.map((group) => (
                      <tr className="bg-gray-100 border-b" key={group.group_id}>
                        <td className="px-4 py-2 text-left flex justify-between items-center">
                          {group.group_name}
                          <button
                            onClick={(e) => handleAddClick(e, group.group_id)}
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
                  onClick={prevGroupPage}
                  disabled={currentGroupPage === 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={nextGroupPage}
                  disabled={
                    currentGroupPage * itemsPerPage >= filteredGroups.length
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </>
          ) : (
            <p className="text-center">No groups found.</p>
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
