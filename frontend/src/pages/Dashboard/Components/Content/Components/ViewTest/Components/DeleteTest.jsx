import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";

function DeleteTest() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { testId } = useParams(); // from URL
  const { state } = useLocation(); // from navigation state
  const navigate = useNavigate();
  const name = state?.name || "Not Available";
  useEffect(() => {
    onOpen();
  }, [onOpen]);

  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm Delete</ModalHeader>
              <ModalBody>
                <p>
                  Are you sure you want to delete test{" "}
                  <span className="font-bold text-base">{name}</span>?
                </p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    onClose();
                    navigate("/dashboard/viewTest");
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    // your delete logic using testId
                    console.log("Deleting test ID:", testId);
                    onClose();
                    navigate("/dashboard/viewTest");
                  }}
                >
                  Confirm
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}

export default DeleteTest;
