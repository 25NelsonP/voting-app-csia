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
  const [searchTerm, setSearchTerm] = useState("");
  const [sortType, setSortType] = useState("name");
  const [sortOrder, setSortOrder] = useState("asc");
  // Create a collator instance for locale-aware sorting
  const collator = new Intl.Collator("en", {
    sensitivity: "base", // base = ignore accents and case
    numeric: true, // enable numeric sorting (e.g., "file2" before "file10")
  });
  const API_URL = process.env.REACT_APP_API_URL;

  //Fetch from database
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

  //Save add admin
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

  // remove admin
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
      setAdminToRemove(null);
    } catch (error) {
      console.log(error);
    }
  };

  //confimration to remove admin
  const confirmRemoveAdmin = (user_id) => {
    setAdminToRemove(user_id);
    setOpenConfirmRmvAdminModal(true);
  };

  if (loading) {
    return <LoadingScreen />;
  }

  const filteredAdministrators = administrators.filter((admin) => {
    const name = admin.name ? admin.name.toLowerCase() : "";
    const email = admin.email.toLowerCase();
    const searchLower = searchTerm.toLowerCase();
    return name.includes(searchLower) || email.includes(searchLower);
  });

  // Sort filtered administrators
  const sortedAdministrators = [...filteredAdministrators].sort((a, b) => {
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
          <h2 className="text-2xl font-bold">Admin</h2>
          <button
            onClick={() => setAddAdminModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900"
          >
            <FaPlus size={20} />
          </button>
        </div>
        <div className="w-full flex justify-between items-center mb-3 space-x-3">
          {/* Searching */}
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search administrators..."
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
        {sortedAdministrators.length > 0 ? (
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
                {sortedAdministrators.map((admin) => (
                  <tr className="bg-gray-100 border-b " key={admin.user_id}>
                    <td className="px-4 py-2 text-left">
                      {admin.name ? admin.name : "N/A"}
                    </td>
                    <td className="px-4 py-2 text-center">{admin.email}</td>
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
          <p>No Admin Found</p>
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
