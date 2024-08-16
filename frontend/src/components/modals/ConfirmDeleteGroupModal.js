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
      message={`Are you sure you want to delete ${groupName}?`}
      handleConfirm={handleDeleteGroup}
      handleCancel={() => setOpenConfirmDeleteGroupModal(false)}
    />
  );
};

export default ConfirmDeleteGroupModal;
