import React, { useState, useEffect } from "react";
import axios from "axios";
import FormEditHeader from "../../../components/FormEditHeader";
import { Link, useLocation } from "react-router-dom";
import { MdPersonRemove, MdManageAccounts } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import AddPermissionModal from "./../../../components/modals/AddModal";
import AddGroupPermissionModal from "./../../../components/modals/AddGroupModal";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import LoadingScreen from "../../../components/LoadingScreen";

const Permissions = () => {
  const location = useLocation();
  const electionId = location.pathname.split("/")[4];
  const [loading, setLoading] = useState(true);
  const [students, setStudents] = useState([]); //all users eligible
  const [groups, setGroups] = useState([]); //all groups
  const [groupEligible, setGroupEligible] = useState([]); //the groups eligible
  const [users, setUsers] = useState([]); // all users
  const [openAddUserModal, setOpenAddUserModal] = useState(false);
  const [openAddGroupModal, setOpenAddGroupModal] = useState(false);
  const [removingStudent, setRemovingStudent] = useState(null);
  const [removingGroup, setRemovingGroup] = useState(null);

  useEffect(() => {
    //fetching students with permissions
    const fetchStudent = async () => {
      try {
        //backend call
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/permissions/${electionId}`
        );
        setStudents(res.data);
      } catch (error) {
        console.log("Error fetching permissions data", error);
      }
    };

    //fetching groups with permissions
    const fetchGroup = async () => {
      try {
        //backend call
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/permissions/groups/${electionId}`
        );
        setGroupEligible(res.data);
      } catch (error) {
        console.log("Error fetching group data", error);
      }
    };

    const fetchData = async () => {
      try {
        //calling fetchGroup and fetchStudent
        await Promise.all([fetchStudent(), fetchGroup()]);
      } catch (error) {
        console.log("Error during data fetching", error);
      } finally {
        setLoading(false); // Set loading to false only after both fetches are completed
      }
    };

    fetchData();
  }, [electionId]);

  useEffect(() => {
    // Fetching all users except those who have already been given access as a single student in the election
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`); //backend call
        const rmv = new Set(students.map((student) => student.student_id));
        const filteredUsers = res.data.filter((user) => !rmv.has(user.user_id)); //filter out users who are given access to the election
        setUsers(filteredUsers);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };

    // Fetching all Groups except those which have already been given access to the election.
    const fetchAllGroups = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/groups`); //backend call
        const rmv = new Set(groupEligible.map((group) => group.group_id));
        const filteredGroups = res.data.filter(
          (group) => !rmv.has(group.group_id)
        ); //filtering out groups that have already been given access to the election
        setGroups(filteredGroups);
      } catch (error) {
        console.log("Error fetching group data", error);
      }
    };
    fetchAllGroups();
    fetchUsers();
  }, [students, groupEligible]);

  const handleRemoveGroupAccess = async (groupId) => {
    setRemovingGroup(groupId);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/permissions/groups/${electionId}/${groupId}`
      ); //backend call
      setGroupEligible((prevGroups) =>
        prevGroups.filter((group) => group.group_id !== groupId)
      ); //remove the group (from frontend)
    } catch (error) {
      console.error("Error removing group access", error);
    } finally {
      setRemovingGroup(null);
    }
  };

  const handleRemoveAccess = async (studentId) => {
    setRemovingStudent(studentId);
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/permissions/${electionId}/${studentId}`
      ); //backend call
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.student_id !== studentId)
      ); //remove the student (from frontend)
    } catch (error) {
      console.error("Error removing access", error);
    } finally {
      setRemovingStudent(null);
    }
  };

  const handleAddGroup = async (e, groupId) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/permissions/groups/${electionId}`,
        { group_id: groupId }
      );
      setGroupEligible((prevGroups) => [
        ...prevGroups,
        {
          group_id: groupId,
          group_name: groups.find((group) => group.group_id === groupId)
            .group_name,
        },
      ]);
      setGroups((prevGroups) =>
        prevGroups.filter((group) => group.group_id !== groupId)
      );
    } catch (error) {
      console.error("Error adding group access", error);
    }
  };

  const handleAddStudent = async (e, studentId) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/permissions/${electionId}`,
        { student_id: studentId }
      );
      setStudents((prevStudents) => [
        ...prevStudents,
        {
          student_id: studentId,
          name: users.find((user) => user.user_id === studentId).name,
          email: users.find((user) => user.user_id === studentId).email,
        },
      ]);
      setUsers((prevUsers) =>
        prevUsers.filter((user) => user.user_id !== studentId)
      );
    } catch (error) {
      console.error("Error adding access", error);
    }
    console.log(students);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="flex flex-col items-center w-full min-h-screen">
      <Header />
      <FormEditHeader electionId={electionId} />
      <div className="p-6 w-full flex flex-col items-center">
        <div className="md:w-1/2 w-full flex justify-between items-center">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <button
            onClick={() => setOpenAddUserModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900 mr-1"
          >
            <FaPlus size={20} />
          </button>
        </div>
        <p className="md:w-1/2 w-full items-start text-xs mb-3">
          All users need to be added here for them to be able to access this
          election.
        </p>
        <div className="md:w-1/2 w-full overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-black">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-4 px-6 text-center w-3/5">Name</th>
                <th className="py-4 px-6 text-center w-2/5"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {students.map((student) => (
                <tr key={student.student_id} className="border-b">
                  <td className="px-6 py-4 text-left">
                    {student.name ? student.name : student.email}
                  </td>
                  <td className="px-6 py-4 flex justify-center">
                    <button
                      onClick={() => handleRemoveAccess(student.student_id)}
                      className="text-red-500 hover:text-red-700 flex items-center disabled:text-red-200"
                      disabled={removingStudent !== null}
                    >
                      {removingStudent === student.student_id ? (
                        "Removing..."
                      ) : (
                        <>
                          <MdPersonRemove className="mr-1" />
                          Remove Access
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="p-6 w-full flex flex-col items-center">
        <div className="md:w-1/2 w-full flex justify-between items-center">
          <h2 className="text-xl font-semibold">Group Permissions</h2>
          <button
            onClick={() => setOpenAddGroupModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900 mr-1"
          >
            <FaPlus size={20} />
          </button>
        </div>
        <p className="md:w-1/2 w-full items-start text-xs mb-3">
          Adding a group here will give access to all the members of the group
        </p>
        <div className="md:w-1/2 w-full overflow-x-auto rounded-lg shadow-md">
          <table className="w-full text-sm text-black">
            <thead className="bg-blue-700 text-white">
              <tr>
                <th className="py-4 px-6 text-center w-1/2">Name</th>
                <th className="py-4 px-6 text-center w-1/2"></th>
              </tr>
            </thead>
            <tbody className="bg-gray-100">
              {groupEligible.map((group) => (
                <tr key={group.group_id} className="border-b">
                  <td className="px-6 py-4 text-left">{group.group_name}</td>
                  <td className="px-6 py-4 flex justify-between">
                    <button
                      onClick={() => handleRemoveGroupAccess(group.group_id)}
                      disabled={removingGroup !== null}
                      className="text-red-500 hover:text-red-700 flex items-center disabled:text-red-200"
                    >
                      {removingGroup === group.group_id ? (
                        "Removing..."
                      ) : (
                        <>
                          <MdManageAccounts className="mr-1" />
                          Remove Access
                        </>
                      )}
                    </button>
                    <Link
                      to={`/admin/managegroup/${group.group_id}`}
                      className="text-blue-500 hover:text-blue-700 ml-2 flex items-center"
                    >
                      <MdManageAccounts className="mr-1" />
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {openAddUserModal && (
        <AddPermissionModal
          users={users}
          handleAdd={handleAddStudent}
          setModalStatus={setOpenAddUserModal}
          type={`p_user`}
        />
      )}
      {openAddGroupModal && (
        <AddGroupPermissionModal
          groups={groups}
          handleAdd={handleAddGroup}
          setModalStatus={setOpenAddGroupModal}
        />
      )}
      <Footer />
    </div>
  );
};

export default Permissions;
