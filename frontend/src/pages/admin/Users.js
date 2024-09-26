import React, { useEffect, useState } from "react";
import axios from "axios";
import Adminheader from "./../../components/AdminHeader";
import { MdDeleteForever } from "react-icons/md";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  // Create a collator instance for locale-aware sorting
  const collator = new Intl.Collator("en", {
    sensitivity: "base", // base = ignore accents and case
    numeric: true, // enable numeric sorting (e.g., "file2" before "file10")
  });
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
    } catch (error) {
      console.log(error);
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredUsers = users.filter((user) => {
    const name = user.name ? user.name.toLowerCase() : "";
    const email = user.email.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
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
          <h2 className="text-2xl font-bold">Users</h2>
        </div>
        <div className="w-full flex justify-between items-center mb-3 space-x-3">
          {/* Searching */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search users..."
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
        {sortedUsers.length > 0 ? (
          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-2/5">Name</th>
                  <th className="border-b p-2 text-center w-2/5">Email</th>
                  <th className="border-b p-2 text-center w-1/5"></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {sortedUsers.map((user) => (
                  <tr className="bg-gray-100 border-b " key={user.user_id}>
                    <td className="px-4 py-2 text-left">
                      {user.name ? user.name : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center">
                      <Link to={"mailto:" + user.email}>{user.email}</Link>
                    </td>
                    <td className="px-7 py-2 flex justify-end">
                      <button
                        onClick={() => confirmDeleteUser(user)}
                        className="hover:text-red-700"
                      >
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
