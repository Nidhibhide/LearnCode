import React from 'react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@heroui/react";
import { useNavigate } from 'react-router-dom';

const ModalWrapper = ({
  isOpen,
  onOpenChange,
  title,
  children,
  footer,
  size = "md",
  navigateOnClose = true,
  className = "",
  classNames = {},
}) => {
  const navigate = useNavigate();

  const handleOpenChange = (open) => {
    if (onOpenChange) {
      onOpenChange(open);
    }
    if (!open && navigateOnClose) {
      navigate(-1);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={handleOpenChange}
      size={size}
      className={className}
      classNames={classNames}
    >
      <ModalContent>
        {(onClose) => (
          <>
            {title && (
              <ModalHeader
                className={`border-b-0 shadow-none ${classNames.header || ""}`}
              >
                {title}
              </ModalHeader>
            )}
            <ModalBody className={classNames.body || ""}>
              {typeof children === 'function' ? children(onClose) : children}
            </ModalBody>
            {footer && <ModalFooter>{footer}</ModalFooter>}
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default ModalWrapper;