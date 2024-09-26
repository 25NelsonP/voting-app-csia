import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmDeleteUserModal = ({
  handleDeleteUser,
  setOpenConfirmDeleteUserModal,
  userToRemove,
}) => {
  const [loading, setLoading] = useState(false);

  //when confirm button is clicked
  const handleConfirm = async () => {
    setLoading(true);
    await handleDeleteUser(); // Perform deletion
    setLoading(false); // Reset loading state
    setOpenConfirmDeleteUserModal(false); // Close modal
  };

  return (
    <ConfirmModal
      title={`Delete ${userToRemove}`}
      message={
        <>
          Deleting the user will delete all records related to the user. <br />
          This deletion is permanent and datas cannot be recovered. <br />
          Are you sure you want to delete <b>{userToRemove}</b>
        </>
      }
      handleConfirm={handleConfirm}
      handleCancel={() => setOpenConfirmDeleteUserModal(false)}
      loading={loading}
    />
  );
};

export default ConfirmDeleteUserModal;
