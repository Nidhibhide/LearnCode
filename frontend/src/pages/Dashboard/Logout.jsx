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
import { logout } from "../../api/user";
import { useDispatch, useSelector } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";

const Logout = () => {
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const dispatch = useDispatch();
  const role = useSelector((state) => state.user?.role);

  useEffect(() => {
    onOpen();
  }, [onOpen]);

  const handleConfirm = async (onClose) => {
    const res = await logout();
    const { message, statusCode } = res;
    if (statusCode === 200) {
      dispatch(clearUser());
      onClose();
      navigate("/");
    }
  };
  const handleCancel = (onClose) => {
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
