import React, { useState, useEffect } from "react";
import Adminheader from "../../components/AdminHeader";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTimes, FaFileCsv, FaGoogle } from "react-icons/fa";
import ConfirmRemoveMemberModal from "../../components/modals/ConfirmRemoveMemberModal";
import AddMemberModal from "../../components/modals/AddModal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteGroupModal from "../../components/modals/ConfirmDeleteGroupModal";
import { MdEdit } from "react-icons/md";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import ImportCSV from "../../components/modals/CSVImport";
import GoogleImport from "../../components/modals/GoogleImport";

const Group = () => {
  const [members, setMembers] = useState([]);
  const location = useLocation();
  const [groupName, setGroupName] = useState("");
  const [editingGroupName, setEditingGroupName] = useState(false);
  const [loading, setLoading] = useState(true);
  const [rmvmember_id, setRmvmember_id] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [openConfirmRmvMemberModal, setOpenConfirmRmvMemberModal] =
    useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [openDeleteGroupModal, setOpenDeleteGroupModal] = useState(false);
  const [users, setUsers] = useState([]);
  const [importingcsv, setImportingcsv] = useState(false);
  const [importingGoogle, setImportingGoogle] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  // Create a collator instance for locale-aware sorting
  const collator = new Intl.Collator("en", {
    sensitivity: "base", // base = ignore accents and case
    numeric: true, // enable numeric sorting (e.g., "file2" before "file10")
  });
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const group_id = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${group_id}`);
        setGroupName(res.data.group_name);
      } catch (error) {
        navigate(`/admin/managegroups`);
        console.log(error);
      }
    };
    const fetchMembers = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/${group_id}/members`);
        setMembers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      await Promise.all([fetchGroupName(), fetchMembers()]);
      setLoading(false);
    };

    fetchData();
  }, [group_id, navigate, API_URL]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/`);
        const rmv = new Set(members.map((member) => member.user_id));
        const filteredUsers = res.data.filter((user) => !rmv.has(user.user_id));
        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [members, API_URL]);

  const handleRemoveMember = async () => {
    try {
      await axios.delete(
        `${API_URL}/groups/${group_id}/members/${rmvmember_id}`
      );
      setMembers(members.filter((member) => member.user_id !== rmvmember_id));
      setRmvmember_id(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateGroupName = async () => {
    try {
      await axios.put(`${API_URL}/groups/${group_id}`, {
        group_name: groupName,
      });
      setEditingGroupName(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteAllMembers();
      await axios.delete(`${API_URL}/groups/${group_id}`);
      navigate(`/admin/managegroups`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllMembers = async () => {
    try {
      const deletePromises = members.map((member) =>
        axios.delete(`${API_URL}/groups/${group_id}/members/${member.user_id}`)
      );
      await Promise.all(deletePromises);
      setMembers([]);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddMember = async (e, member_id) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/groups/${group_id}/members`, {
        member_id: member_id,
      });
      const selectedUser = users.find(
        (user) => user.user_id === parseInt(member_id)
      );
      setMembers([...members, selectedUser]);
      setUsers(users.filter((user) => user.user_id !== member_id));
      setOpenAddMemberModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmRemoveMember = (member_id) => {
    setRmvmember_id(member_id);
    const memberToRemove = members.find(
      (member) => member.user_id === member_id
    );
    setMemberToRemove(memberToRemove);
    setOpenConfirmRmvMemberModal(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredMembers = members.filter((member) => {
    const name = member.name ? member.name.toLowerCase() : "";
    const email = member.email.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const sortedMembers = [...filteredMembers].sort((a, b) => {
    const aValue = sortType === "name" ? a.name || a.email : a.email;
    const bValue = sortType === "name" ? b.name || b.email : b.email;

    if (sortOrder === "asc") {
      return collator.compare(aValue, bValue);
    } else {
      return collator.compare(bValue, aValue);
    }
  });
  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          {editingGroupName ? (
            <div className="flex items-center">
              <input
                type="text"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                className="p-2 border rounded mr-2"
              />
              <button
                onClick={handleUpdateGroupName}
                className="bg-green-600 text-white p-2 rounded-lg hover:bg-green-900"
              >
                Save
              </button>
              <button
                onClick={() => setEditingGroupName(false)}
                className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-2"
              >
                Cancel
              </button>
            </div>
          ) : (
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold mr-3">{groupName}</h2>
              <button
                onClick={() => setEditingGroupName(true)}
                className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-900 mr-2"
              >
                <MdEdit />
              </button>
            </div>
          )}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setImportingcsv(true)}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-900 flex items-center"
            >
              <FaFileCsv className="mr-1" size={20} /> Import
            </button>
            <button
              onClick={() => setImportingGoogle(true)}
              className="bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-900 flex items-center"
            >
              <FaGoogle className="mr-1" size={20} /> Import
            </button>
            <button
              onClick={() => setOpenAddMemberModal(true)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900"
            >
              <FaPlus size={20} />
            </button>
          </div>
        </div>
        <div className="w-full flex justify-between items-center mb-3 space-x-3">
          {/* Searching */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search members..."
            className="p-2 w-full border rounded-md"
          />
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="name">Sort by Name</option>
            <option value="email">Sort by Email</option>
          </select>
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className="p-2 border rounded-md"
          >
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
        {sortedMembers.length > 0 ? (
          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-2/5">Name</th>
                  <th className="border-b p-2 text-center w-2/5">Email</th>
                  <th className="border-b p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {sortedMembers.map((member) => (
                  <tr className="bg-gray-100 border-b " key={member.user_id}>
                    <td className="px-4 py-2 text-left">
                      {member.name ? member.name : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center">{member.email}</td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => confirmRemoveMember(member.user_id)}
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
          <p>No members available.</p>
        )}
        <button
          onClick={() => setOpenDeleteGroupModal(true)}
          className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-900 ml-auto mt-3"
        >
          Delete Group
        </button>
      </main>
      {openConfirmRmvMemberModal && (
        <ConfirmRemoveMemberModal
          groupName={groupName}
          memberToRemove={memberToRemove.name}
          handleRemoveMember={handleRemoveMember}
          setOpenConfirmRmvMemberModal={setOpenConfirmRmvMemberModal}
        />
      )}
      {openAddMemberModal && (
        <AddMemberModal
          users={users}
          handleAdd={handleAddMember}
          setModalStatus={setOpenAddMemberModal}
          type={`group`}
        />
      )}

      {openDeleteGroupModal && (
        <ConfirmDeleteGroupModal
          groupName={groupName}
          handleDeleteGroup={handleDeleteGroup}
          setOpenConfirmDeleteGroupModal={setOpenDeleteGroupModal}
        />
      )}

      {importingcsv && (
        <ImportCSV
          groupId={group_id}
          handleCancel={() => setImportingcsv(false)}
        />
      )}
      {importingGoogle && (
        <GoogleImport
          groupId={group_id}
          handleCancel={() => setImportingGoogle(false)}
        />
      )}
      <Footer />
    </div>
  );
};

export default Group;
