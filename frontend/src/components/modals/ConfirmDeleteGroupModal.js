import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmDeleteGroupModal = ({
  groupName,
  handleDeleteGroup,
  setOpenConfirmDeleteGroupModal,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await handleDeleteGroup();
    setLoading(false); // Reset loading state
    setOpenConfirmDeleteGroupModal(false); // Close modal
  };

  return (
    <ConfirmModal
      title="Delete Group"
      message={
        <>
          Are you sure you want to delete <b>{groupName}</b>
        </>
      }
      handleConfirm={handleConfirm}
      handleCancel={() => setOpenConfirmDeleteGroupModal(false)}
      loading={loading}
    />
  );
};

export default ConfirmDeleteGroupModal;
