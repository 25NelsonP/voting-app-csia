import React, { useState } from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmRemoveMemberModal = ({
  groupName,
  memberToRemove,
  handleRemoveMember,
  setOpenConfirmRmvMemberModal,
}) => {
  const [loading, setLoading] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    await handleRemoveMember();
    setLoading(false); // Reset loading state
    setOpenConfirmRmvMemberModal(false); // Close modal
  };

  return (
    <ConfirmModal
      title="Remove Group Member"
      message={
        <>
          Are you sure you want to remove <b>{memberToRemove}</b> from{" "}
          <b>{groupName}</b>?
        </>
      }
      handleConfirm={handleConfirm}
      handleCancel={() => setOpenConfirmRmvMemberModal(false)}
      loading={loading}
    />
  );
};

export default ConfirmRemoveMemberModal;
