import React from "react";
import { FaTimes } from "react-icons/fa";

const ConfirmModal = ({
  title,
  message,
  handleConfirm,
  handleCancel,
  loading,
}) => {
  const confirmLabel = "Confirm";
  const cancelLabel = "Cancel";
  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg w-11/12 max-w-md relative flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-4">{title}</h2>
        <p className="mb-3 text-center">{message}</p>
        <div className="flex space-x-4">
          <button
            onClick={handleCancel}
            className="bg-red-600 text-white p-2 rounded w-3/6 flex items-center justify-center hover:bg-red-800"
          >
            <p>{cancelLabel}</p>
          </button>
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="bg-green-600 hover:bg-green-800 text-white p-2 rounded w-3/5 flex items-center justify-center disabled:bg-green-200"
          >
            <p>{loading ? "Processing..." : confirmLabel}</p>
          </button>
        </div>
        <button onClick={handleCancel} className="absolute top-2 right-2 p-2">
          <FaTimes size={20} />
        </button>
      </div>
    </div>
  );
};

export default ConfirmModal;
