import React, { useEffect, useState } from "react";
import { FaArrowRight, FaTimes } from "react-icons/fa";
import axios from "axios";

const GoogleImport = ({ groupId, handleCancel }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [groupMembers, setGroupMembers] = useState([]);
  const [selectedGroupEmail, setSelectedGroupEmail] = useState("");
  const [error, setError] = useState("");
  const [showGroupMembers, setShowGroupMembers] = useState(false);
  //Pagination State
  const [currentGroupPage, setCurrentGroupPage] = useState(1);
  const [currentMemberPage, setCurrentMemberPage] = useState(1);
  const itemsPerPage = 10;

  const title = "Import Group from Google";

  const filteredGroups = groups.filter((group) =>
    group.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  useEffect(() => {
    const fetchGroups = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await axios.post(
          process.env.REACT_APP_GROUPSLIST_API_URL,
          {},
          {
            headers: {
              "X-API-Key": process.env.REACT_APP_X_API_KEY,
            },
          }
        );
        const groupsArray = Object.values(response.data.groups);
        setGroups(groupsArray);
      } catch (error) {
        console.error("Error fetching groups:", error);
        setError("Failed to fetch groups. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchGroups();
  }, []);

  const handleGetGroup = async (groupEmail) => {
    setSelectedGroupEmail(groupEmail);
    setShowGroupMembers(true);
    setCurrentMemberPage(1); // Reset to first page of members
    try {
      const response = await axios.post(
        process.env.REACT_APP_GMEMBERLIST_API_URL,
        { group_email: groupEmail },
        {
          headers: {
            "X-API-Key": process.env.REACT_APP_X_API_KEY,
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );
      setGroupMembers(response.data.members);
      console.log(response.data.members);
    } catch (error) {
      console.error("Error fetching group members:", error);
    }
  };

  const handleAddGroup = async () => {
    try {
      // Ensure groupMembers is an array of strings (emails)
      const emails = groupMembers.map((member) => member.email || member);
      await axios.post(
        `${process.env.REACT_APP_API_URL}/groups/import/${groupId}`,
        { emails }
      );
      window.location.reload();
    } catch (error) {
      console.error("Error importing users", error);
    }
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

  // Pagination functions for group members
  const nextMemberPage = () => {
    if (currentMemberPage * itemsPerPage < groupMembers.length) {
      setCurrentMemberPage(currentMemberPage + 1);
    }
  };

  const prevMemberPage = () => {
    if (currentMemberPage > 1) {
      setCurrentMemberPage(currentMemberPage - 1);
    }
  };

  // Slicing groups and members for pagination
  const paginatedGroups = filteredGroups.slice(
    (currentGroupPage - 1) * itemsPerPage,
    currentGroupPage * itemsPerPage
  );

  const paginatedMembers = groupMembers.slice(
    (currentMemberPage - 1) * itemsPerPage,
    currentMemberPage * itemsPerPage
  );

  return (
    <div className="min-h-screen fixed inset-0 z-50 bg-black bg-opacity-50 flex flex-col justify-center items-center overflow-scroll">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative mt-5">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>

        {/* Show search input and groups or group members based on state */}
        {!showGroupMembers ? (
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border p-2 rounded"
            />
            {loading ? (
              <div className="text-center">Loading...</div>
            ) : error ? (
              <div className="text-center text-red-500">{error}</div>
            ) : paginatedGroups.length > 0 ? (
              <>
                <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
                  <table className="w-full text-sm text-black">
                    <tbody>
                      {paginatedGroups.map((group) => (
                        <tr className="bg-gray-100 border-b" key={group.email}>
                          <td className="px-4 py-2 text-left flex justify-between items-center">
                            {group.name}
                            <button
                              onClick={() => handleGetGroup(group.email)}
                              className="bg-green-600 text-white p-2 rounded"
                            >
                              <FaArrowRight />
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
        ) : (
          <div>
            <h3 className="text-xl font-semibold mb-4">
              Members of {selectedGroupEmail}
            </h3>
            <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
              <table className="w-full text-sm text-black">
                <thead>
                  <tr>
                    <th className="text-left px-4 py-2">Email</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMembers.map((member, index) => (
                    <tr className="bg-gray-100 border-b" key={index}>
                      <td className="px-4 py-2">{member.email}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination controls for members */}
              <div className="flex justify-between m-4">
                <button
                  onClick={prevMemberPage}
                  disabled={currentMemberPage === 1}
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Previous
                </button>
                <button
                  onClick={nextMemberPage}
                  disabled={
                    currentMemberPage * itemsPerPage >= groupMembers.length
                  }
                  className="bg-blue-600 text-white px-4 py-2 rounded disabled:bg-gray-400"
                >
                  Next
                </button>
              </div>
            </div>
            <div className="flex justify-between mt-4">
              <button
                className="bg-gray-600 text-white p-2 rounded"
                onClick={() => setShowGroupMembers(false)}
              >
                Back
              </button>
              <button
                className="bg-blue-600 text-white p-2 rounded"
                onClick={handleAddGroup}
              >
                Add Group
              </button>
            </div>
          </div>
        )}
        <div className="absolute top-6 right-6 space-x-3">
          <button onClick={handleCancel}>
            <FaTimes size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoogleImport;
