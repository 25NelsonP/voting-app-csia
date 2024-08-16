import React, { useState } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const AddModal = ({ groups, handleAdd, setModalStatus }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);
  const title = "Add Group";

  const filteredGroups = groups.filter((group) =>
    group.group_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleAddClick = async (e, groupId) => {
    setLoading(true);
    await handleAdd(e, groupId);
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative">
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
          ) : groups.length > 0 ? (
            <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
              <table className="w-full text-sm text-black">
                <tbody>
                  {filteredGroups.map((group) => (
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
