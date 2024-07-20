import React, { useEffect, useState } from "react";
import axios from "axios";
import Adminheader from "./../../components/AdminHeader";
import { MdMail } from "react-icons/md";
import { Link } from "react-router-dom";

const Users = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get("http://localhost:8080/users");
        setUsers(res.data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center">
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
                  <th className="border-b p-2 text-center w-3/5">Name</th>
                  <th className="border-b p-2 text-center w-1/5">Email</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr className="bg-gray-100 border-b " key={user.user_id}>
                    <td className="px-4 py-2 text-left">{user.name}</td>
                    <td className="px-4 py-2 flex justify-center">
                      <Link to={"mailto:" + user.email}>
                        <MdMail size={20} />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No users available.</p>
        )}
      </main>
    </div>
  );
};

export default Users;
