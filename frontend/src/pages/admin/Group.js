import React, { useState, useEffect } from "react";
import Adminheader from "../../components/AdminHeader";
import { useLocation } from "react-router-dom";
import axios from "axios";
import { FaPlus, FaTimes } from "react-icons/fa";
import ConfirmRemoveMemberModal from "../../components/modals/ConfirmRemoveMemberModal";
import AddMemberModal from "../../components/modals/AddMemberModal";
import { useNavigate } from "react-router-dom";
import ConfirmDeleteGroupModal from "../../components/modals/ConfirmDeleteGroupModal";

const Group = () => {
  const [members, setMembers] = useState([]);
  const location = useLocation();
  const [groupName, setGroupName] = useState("");
  const [rmvmember_id, setRmvmember_id] = useState(null);
  const [memberToRemove, setMemberToRemove] = useState(null);
  const [openConfirmRmvMemberModal, setOpenConfirmRmvMemberModal] =
    useState(false);
  const [openAddMemberModal, setOpenAddMemberModal] = useState(false);
  const [openDeleteGroupModal, setOpenDeleteGroupModal] = useState(false);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const group_id = location.pathname.split("/")[3];

  useEffect(() => {
    const fetchGroupName = async () => {
      try {
        const res = await axios.get(`http://localhost:8080/groups/${group_id}`);
        setGroupName(res.data[0].group_name);
      } catch (error) {
        navigate(`/admin/managegroups`);
        console.log(error);
      }
    };
    fetchGroupName();
  }, [group_id]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8080/groups/${group_id}/members`
        );
        setMembers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchMembers();
  }, [group_id]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users/");
        const rmv = new Set(members.map((member) => member.user_id));
        const filteredUsers = res.data.filter((user) => !rmv.has(user.user_id));
        setUsers(filteredUsers);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, [members]);

  const handleRemoveMember = async () => {
    try {
      await axios.delete(
        `http://localhost:8080/groups/${group_id}/members/${rmvmember_id}`
      );
      setMembers(members.filter((member) => member.user_id !== rmvmember_id));
      setOpenConfirmRmvMemberModal(false);
      setRmvmember_id(null);
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateGroupName = async () => {
    try {
      await axios.put(`http://localhost:8080/groups/${group_id}`, {
        group_name: groupName,
      });
    } catch (error) {
      console.log(error);
    }
  };

  const handleDeleteGroup = async () => {
    try {
      await deleteAllMembers();
      await axios.delete(`http://localhost:8080/groups/${group_id}`);
      navigate(`/admin/managegroups`);
    } catch (error) {
      console.log(error);
    }
  };

  const deleteAllMembers = async () => {
    try {
      const deletePromises = members.map((member) =>
        axios.delete(
          `http://localhost:8080/groups/${group_id}/members/${member.user_id}`
        )
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
      await axios.post(`http://localhost:8080/groups/${group_id}/members`, {
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

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">{groupName}</h2>
          <div className="flex items-center">
            <button
              onClick={() => setOpenAddMemberModal(true)}
              className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900 mr-2"
            >
              <FaPlus size={20} />
            </button>
          </div>
        </div>
        {members.length > 0 ? (
          <div className="w-full overflow-x-auto sm:rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-4/5">Name</th>
                  <th className="border-b p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {members.map((member) => (
                  <tr className="bg-gray-100 border-b " key={member.user_id}>
                    <td className="px-4 py-2 text-left">{member.name}</td>
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
          setOpenAddMemberModal={setOpenAddMemberModal}
          members={members}
          users={users}
          handleAddMember={handleAddMember}
        />
      )}

      {openDeleteGroupModal && (
        <ConfirmDeleteGroupModal
          groupName={groupName}
          handleDeleteGroup={handleDeleteGroup}
          setOpenConfirmDeleteGroupModal={setOpenDeleteGroupModal}
        />
      )}
    </div>
  );
};

export default Group;
