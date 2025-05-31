import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { logout } from "../../../../../api/user";

const Logout = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleConfirm = async (onClose) => {
    const res = await logout();
    if (res?.status === 200) {
      localStorage.removeItem("data");
      onClose();
      navigate("/");
    }
  };
  const handleCancel = (onClose) => {
    const role = JSON.parse(localStorage.getItem("data"))?.role;
    onClose();
    role === "admin"
      ? navigate("/dashboard/viewTest")
      : navigate("/dashboard/assessments");
  };
  return (
    <>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader>Confirm LogOut</ModalHeader>
              <ModalBody>
                <p>Are you sure you want to exist the application ?</p>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="danger"
                  variant="light"
                  onPress={() => {
                    handleCancel(onClose);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  color="primary"
                  onPress={() => {
                    handleConfirm(onClose);
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
};

export default Logout;
