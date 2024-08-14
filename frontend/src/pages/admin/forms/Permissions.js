import React, { useState, useEffect } from "react";
import axios from "axios";
import FormEditHeader from "../../../components/FormEditHeader";
import { useLocation } from "react-router-dom";
import { MdPersonRemove } from "react-icons/md";
import { FaPlus } from "react-icons/fa";
import AddPermissionModal from "./../../../components/modals/AddModal";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

const Permissions = () => {
  const location = useLocation();
  const electionId = location.pathname.split("/")[4];
  const [students, setStudents] = useState([]);
  const [users, setUsers] = useState([]);
  const [openAddUserModal, setOpenAddUserModal] = useState(false);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_API_URL}/permissions/${electionId}`
        );
        console.log(res.data);
        setStudents(res.data);
      } catch (error) {
        console.log("Error fetching permissions data", error);
      }
    };
    fetchStudent();
  }, [electionId]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get(`${process.env.REACT_APP_API_URL}/users`);
        const rmv = new Set(students.map((student) => student.student_id));
        const filteredUsers = res.data.filter((user) => !rmv.has(user.user_id));
        console.log(res.data);
        console.log(filteredUsers);
        setUsers(filteredUsers);
      } catch (error) {
        console.log("Error fetching user data", error);
      }
    };
    fetchUsers();
  }, [students]);

  const handleRemoveAccess = async (studentId) => {
    try {
      await axios.delete(
        `${process.env.REACT_APP_API_URL}/permissions/${electionId}/${studentId}`
      );
      setStudents((prevStudents) =>
        prevStudents.filter((student) => student.student_id !== studentId)
      );
    } catch (error) {
      console.error("Error removing access", error);
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
  return (
    <div className="flex flex-col items-center w-ful min-h-screen">
      <Header />
      <FormEditHeader electionId={electionId} />
      <div className="p-6 w-full flex flex-col items-center">
        <div className="w-1/2 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Permissions</h2>
          <button
            onClick={() => setOpenAddUserModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900 mr-1"
          >
            <FaPlus size={20} />
          </button>
        </div>
        <p className="w-1/2 items-start text-xs">
          Adding a user here will give them access to vote for this election.
        </p>
        <p className="w-1/2 items-start text-xs mb-5">
          Admin users have access to all election forms.
        </p>
        <div className="w-1/2 overflow-x-auto rounded-lg shadow-md">
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
                  <td className="px-6 py-4 text-left">{student.name}</td>
                  <td className="px-6 py-4 flex justify-center">
                    <button
                      onClick={() => handleRemoveAccess(student.student_id)}
                      className="text-red-500 hover:underline flex items-center"
                    >
                      <MdPersonRemove className="mr-1" />
                      Remove Access
                    </button>
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
      <Footer />
    </div>
  );
};

export default Permissions;
