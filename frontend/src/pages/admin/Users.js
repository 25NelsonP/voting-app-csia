import React, { useEffect, useState } from "react";
import axios from "axios";
import Adminheader from "./../../components/AdminHeader";
import { MdMail, MdDeleteForever } from "react-icons/md";
import { Link } from "react-router-dom";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import LoadingScreen from "../../components/LoadingScreen";
import ConfirmDeleteUserModal from "../../components/modals/ConfirmDeleteUserModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userToDelete, setUserToDelete] = useState(null);
  const [openDeleteUserModal, setOpenDeleteUserModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users`);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [API_URL]);

  const confirmDeleteUser = (user) => {
    setUserToDelete(user);
    setOpenDeleteUserModal(true);
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`${API_URL}/users/delete/${userToDelete.user_id}`);
      setUsers(users.filter((user) => user.user_id !== userToDelete.user_id));
      setUserToDelete(null);
      setOpenDeleteUserModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full sm:max-w-3xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Users</h2>
        </div>
        {users.length > 0 ? (
          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-4/5">Name</th>
                  <th className="border-b p-2 text-center w-1/6"></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr className="bg-gray-100 border-b " key={user.user_id}>
                    <td className="px-4 py-2 text-left">
                      {user.name ? user.name : user.email}
                    </td>
                    <td className="px-4 py-2 flex justify-between">
                      <Link to={"mailto:" + user.email}>
                        <MdMail size={20} />
                      </Link>
                      <button onClick={() => confirmDeleteUser(user)}>
                        <MdDeleteForever size={20} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>Loading...</p>
        )}
      </main>
      {openDeleteUserModal && (
        <ConfirmDeleteUserModal
          userToRemove={
            userToDelete.name ? userToDelete.name : userToDelete.email
          }
          handleDeleteUser={handleDeleteUser}
          setOpenConfirmDeleteUserModal={setOpenDeleteUserModal}
        />
      )}
      <Footer />
    </div>
  );
};

export default Users;
