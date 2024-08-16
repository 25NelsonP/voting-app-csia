import React from "react";
import ConfirmModal from "./ConfirmModal";

const ConfirmRemoveMemberModal = ({
  groupName,
  memberToRemove,
  handleRemoveMember,
  setOpenConfirmRmvMemberModal,
}) => {
  return (
    <ConfirmModal
      title="Remove Group Member"
      message={`Are you sure you want to remove ${memberToRemove} from ${groupName}?`}
      handleConfirm={handleRemoveMember}
      handleCancel={() => setOpenConfirmRmvMemberModal(false)}
    />
  );
};

export default ConfirmRemoveMemberModal;
