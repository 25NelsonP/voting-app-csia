import React from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmRemoveAdminModal = ({
  handleRemoveAdmin,
  setOpenConfirmRmvAdminModal,
}) => {
  return (
    <ConfirmModal
      title="Remove Administrator"
      message="Are you sure you want to remove this administrator?"
      handleConfirm={handleRemoveAdmin}
      handleCancel={() => setOpenConfirmRmvAdminModal(false)}
    />
  );
};

export default ConfirmRemoveAdminModal;
