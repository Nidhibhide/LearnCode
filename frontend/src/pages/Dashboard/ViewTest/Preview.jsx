import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";
import { useLocation,useNavigate } from "react-router-dom";

const Preview = () => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { state } = useLocation();
  const list = state?.questions || [];
  const navigate = useNavigate();
  useEffect(() => {
    if (list && list.length > 0) {
      onOpen();
    }
  }, [list, onOpen]);
   const handleOpenChange = (open) => {
    if (!open) {
      navigate(-1); //  Go back to previous page when modal is closed
    }
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={handleOpenChange}>
      <ModalContent className=" max-w-2xl max-h-[80vh]">
        {() => (
          <>
            <ModalHeader className="text-lg font-bold text-center">
              Question Preview
            </ModalHeader>
            <ModalBody className="space-y-4 p-4 overflow-y-auto max-h-[60vh]">
              {list.length === 0 ? (
                <p className="text-center text-gray-500">
                  No questions to display.
                </p>
              ) : (
                list.map((item, index) => (
                  <div
                    key={item._id}
                    className="p-3 border rounded-md bg-gray-50 w-full break-words"
                  >
                    <p className="font-semibold mb-1">
                      Q{index + 1}: {item.questionText}
                    </p>
                    <p className="text-sm mb-1">
                      <strong>Input:</strong> {item.sampleInput}
                    </p>
                    <p className="text-sm">
                      <strong>Output:</strong> {item.expectedOutput}
                    </p>
                  </div>
                ))
              )}
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Preview;
