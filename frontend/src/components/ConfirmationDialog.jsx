import React from 'react';
import { Button } from "@heroui/react";
import ModalWrapper from './ModalWrapper';

const ConfirmationDialog = ({
  isOpen,
  onOpenChange,
  title = "Confirm Action",
  message,
  onConfirm,
  confirmText = "Confirm",
  cancelText = "Cancel",
  confirmColor = "primary",
  loading = false
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const footer = (
    <>
      <Button
        color="danger"
        variant="light"
        onPress={() => onOpenChange(false)}
        disabled={loading}
      >
        {cancelText}
      </Button>
      <Button
        color={confirmColor}
        onPress={handleConfirm}
        disabled={loading}
      >
        {loading ? "Processing..." : confirmText}
      </Button>
    </>
  );

  return (
    <ModalWrapper
      isOpen={isOpen}
      onOpenChange={onOpenChange}
      title={title}
      footer={footer}
    >
      <p>{message}</p>
    </ModalWrapper>
  );
};

export default ConfirmationDialog;