import React from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmDeleteGroupModal = ({
  groupName,
  handleDeleteGroup,
  setOpenConfirmDeleteGroupModal,
}) => {
  return (
    <ConfirmModal
      title="Delete Group"
      message={
        <>
          Are you sure you want to delete <b>{groupName}</b>
        </>
      }
      handleConfirm={handleDeleteGroup}
      handleCancel={() => setOpenConfirmDeleteGroupModal(false)}
    />
  );
};

export default ConfirmDeleteGroupModal;
