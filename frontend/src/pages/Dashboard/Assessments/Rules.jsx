import React, { useEffect } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";

const Rules = ({ onClose }) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  useEffect(() => {
    onOpen();
  }, [onOpen]);
  const handleOpenChange = (open) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="text-lg font-semibold text-blue-800">
                📝 Test Rules
              </ModalHeader>
              <ModalBody>
                <ul className="list-disc space-y-2 pl-5 text-sm text-gray-800 mb-6">
                  <li>
                    Each question carries <strong>10 marks</strong>.
                  </li>
                  <li>
                    Incorrect answers score <strong>0 marks</strong> and cannot
                    be retried.
                  </li>
                  <li>
                    There is <strong>no time limit</strong> for the test.
                  </li>
                  <li>
                    Input and output are provided; you must use them
                    accordingly.
                  </li>
                  <li>
                    Your output must <strong>exactly match</strong> the expected
                    result.
                    <br />
                    <span className="text-sm text-gray-600">
                      E.g., if expected output is <code>total=10</code>, your
                      output must be exactly <code>total=10</code>.
                    </span>
                  </li>
                </ul>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};

export default Rules;
