import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmRemoveAdminModal = ({
  handleRemoveAdmin,
  setOpenConfirmRmvAdminModal,
}) => {
  const [loading, setLoading] = useState(false);

  //when confirm button is clicked
  const handleConfirm = async () => {
    setLoading(true);
    await handleRemoveAdmin();
    setLoading(false); // Reset loading state
    setOpenConfirmRmvAdminModal(false); // Close modal
  };

  return (
    <ConfirmModal
      title="Remove Administrator"
      message="Are you sure you want to remove this administrator?"
      handleConfirm={handleConfirm}
      handleCancel={() => setOpenConfirmRmvAdminModal(false)}
      loading={loading}
    />
  );
};

export default ConfirmRemoveAdminModal;
