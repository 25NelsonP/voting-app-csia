import React from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmDeleteUserModal = ({
  handleDeleteUser,
  setOpenConfirmDeleteUserModal,
  userToRemove,
}) => {
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
      handleConfirm={handleDeleteUser}
      handleCancel={() => setOpenConfirmDeleteUserModal(false)}
    />
  );
};

export default ConfirmDeleteUserModal;
