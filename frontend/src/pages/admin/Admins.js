import React, { useState, useEffect } from "react";
import { FaPlus, FaTimes } from "react-icons/fa";
import Adminheader from "./../../components/AdminHeader";
import axios from "axios";
import AddAdminModal from "../../components/modals/AddModal";
import ConfirmRemoveAdminModal from "./../../components/modals/ConfirmRemoveAdminModal";
import LoadingScreen from "../../components/LoadingScreen";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const Admins = () => {
  const [administrators, setAdministrators] = useState([]);
  const [users, setUsers] = useState([]);
  const [openAddAdminModal, setAddAdminModal] = useState(false);
  const [openConfirmRmvAdminModal, setOpenConfirmRmvAdminModal] =
    useState(false);
  const [adminToRemove, setAdminToRemove] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/non_admins`);
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };

    const fetchAdmin = async () => {
      try {
        const res = await axios.get(`${API_URL}/users/admins`);
        setAdministrators(res.data);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    fetchAdmin();
  }, [API_URL]);

  const handleAddAdmin = async (e, user_id) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/users/set_admin/${user_id}`, {
        is_admin: true,
      });
      const selectedUser = users.find(
        (user) => user.user_id === parseInt(user_id)
      );
      setAdministrators([...administrators, selectedUser]);
      setUsers(users.filter((user) => user.user_id !== user_id));
      setAddAdminModal(false);
    } catch (error) {
      console.log(error);
    }
  };

  const handleRemoveAdmin = async () => {
    try {
      await axios.put(`${API_URL}/users/set_admin/${adminToRemove}`, {
        is_admin: false,
      });
      const selectedAdmin = administrators.find(
        (admin) => admin.user_id === parseInt(adminToRemove)
      );
      setAdministrators(
        administrators.filter((admin) => admin.user_id !== adminToRemove)
      );
      setUsers([...users, selectedAdmin]);
      setOpenConfirmRmvAdminModal(false);
      setAdminToRemove(null);
    } catch (error) {
      console.log(error);
    }
  };

  const confirmRemoveAdmin = (user_id) => {
    setAdminToRemove(user_id);
    setOpenConfirmRmvAdminModal(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Admin</h2>
          <button
            onClick={() => setAddAdminModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900"
          >
            <FaPlus size={20} />
          </button>
        </div>
        {administrators.length > 0 ? (
          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-4/5">Name</th>
                  <th className="border-b p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {administrators.map((admin) => (
                  <tr className="bg-gray-100 border-b " key={admin.user_id}>
                    <td className="px-4 py-2 text-left">
                      {admin.name ? admin.name : admin.email}
                    </td>
                    <td className="px-4 py-2 text-right">
                      <button
                        onClick={() => confirmRemoveAdmin(admin.user_id)}
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
          <p>Loading...</p>
        )}
      </main>

      {openAddAdminModal && (
        <AddAdminModal
          users={users}
          handleAdd={handleAddAdmin}
          setModalStatus={setAddAdminModal}
          type={`admin`}
        />
      )}

      {openConfirmRmvAdminModal && (
        <ConfirmRemoveAdminModal
          handleRemoveAdmin={handleRemoveAdmin}
          setOpenConfirmRmvAdminModal={setOpenConfirmRmvAdminModal}
        />
      )}
      <Footer />
    </div>
  );
};

export default Admins;
