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
import { toast } from "react-toastify";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { deleteTest } from "../../../../../../../api/test";

function DeleteTest() {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { testId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const name = state?.name || "Not Available";
  useEffect(() => {
    onOpen();
  }, [onOpen]);
  const statusMessages = {
    200: "Test Deleted! Refresh the page to see the latest changes",
    400: "Invalid test ID",
    404: "Test not found",
    500: "Unexpected error occurred while delete test",
  };
  const handleDelete = async (onClose) => {
    try {
      const res = await deleteTest(testId);

      const message = statusMessages[res?.status];
      if (res?.status === 200 && message) {
        toast.success(message);
        setTimeout(() => navigate("/dashboard/viewTest"), 3000);
      } else if (message) {
        toast.error(message);
      }
    } catch (err) {
      alert(err.message || "test deletion failed");
    } finally {
      onClose();
    }
  };

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
                <Button color="primary" onPress={() => handleDelete(onClose)}>
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
