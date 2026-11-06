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
  loading = false,
  navigateOnClose = true,
}) => {
  const handleConfirm = () => {
    onConfirm();
  };

  const footer = (
    <>
      <Button
        color="default"
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
      navigateOnClose={navigateOnClose}
    >
      <p>{message}</p>
    </ModalWrapper>
  );
};

export default ConfirmationDialog;