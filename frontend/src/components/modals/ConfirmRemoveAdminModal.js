import React from "react";
import { FaTimes } from "react-icons/fa";

const ConfirmRemoveAdminModal = ({
  handleRemoveAdmin,
  setOpenConfirmRmvAdminModal,
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md relative flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">Remove Administrator</h2>
        <p className="mb-3 text-center">
          Are you sure you want to remove this administrator?
        </p>
        <div className="flex space-x-4">
          <button
            onClick={() => setOpenConfirmRmvAdminModal(false)}
            className="bg-red-600 text-white p-2 rounded w-3/6 flex items-center justify-center"
          >
            <p>Cancel</p>
          </button>
          <button
            onClick={handleRemoveAdmin}
            className="bg-green-600 text-white p-2 rounded w-3/5 flex items-center justify-center"
          >
            <p>Confirm</p>
          </button>
        </div>
        <button
          onClick={() => setOpenConfirmRmvAdminModal(false)}
          className="absolute top-2 right-2 p-2"
        >
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmRemoveAdminModal;
