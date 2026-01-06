import React from "react";
import { ButtonGroup, Modal } from "..";

const DeleteDialog = ({ isModalOpen, onCancel, onDelete }) => {
  return (
    <Modal
      modalTitle={"Are you sure you want to do this?"}
      modalDescription="This action cannot be undone. This will permanently delete your account and remove your data from our servers."
      isOpen={isModalOpen}
      onClose={onCancel}
      maxWidth="max-w-lg"
    >
      <ButtonGroup
        negativeLabel="Cancel"
        negativeClick={onCancel}
        positiveLabel="Delete"
        positiveClick={onDelete}
      />
    </Modal>
  );
};

export default DeleteDialog;
