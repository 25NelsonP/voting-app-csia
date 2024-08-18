import React, { useState, useEffect } from "react";
import { FaPlus } from "react-icons/fa";
import Adminheader from "./../../components/AdminHeader";
import axios from "axios";
import { Link } from "react-router-dom";
import CreateGroupModal from "../../components/modals/CreateGroupModal";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

const UserGroups = () => {
  const [groups, setGroups] = useState([]);
  const [openCreateGroupModal, setOpenCreateGroupModal] = useState(false);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const res = await axios.get(`${API_URL}/groups/`);
        setGroups(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchGroups();
  }, [API_URL]);

  return (
    <div className="min-h-screen flex flex-col items-center">
      <Header />
      <Adminheader />
      <main className="flex flex-col items-center p-5 w-full max-w-2xl">
        <div className="w-full flex justify-between items-center mb-5">
          <h2 className="text-2xl font-bold">Groups</h2>
          <button
            onClick={() => setOpenCreateGroupModal(true)}
            className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-900"
          >
            <FaPlus size={20} />
          </button>
        </div>
        {groups.length > 0 ? (
          <div className="w-full overflow-x-auto rounded-lg shadow-md">
            <table className="w-full text-sm text-black">
              <thead className="text-white bg-blue-700">
                <tr>
                  <th className="border-b p-2 text-center w-3/5">Group Name</th>
                  <th className="border-b p-2 text-center"></th>
                </tr>
              </thead>
              <tbody>
                {groups.map((groups) => (
                  <tr className="bg-gray-100 border-b " key={groups.group_id}>
                    <td className="px-4 py-2 text-left">{groups.group_name}</td>
                    <td className="p-4 text-right">
                      <Link
                        to={`/admin/manageGroup/${groups.group_id}`}
                        className="text-white bg-blue-500 hover:bg-blue-600 py-2 px-4 rounded-lg"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No Groups available.</p>
        )}
      </main>
      {openCreateGroupModal && (
        <CreateGroupModal
          setShowModal={setOpenCreateGroupModal}
          setGroups={setGroups}
          groups={groups}
        />
      )}
      <Footer />
    </div>
  );
};

export default UserGroups;
