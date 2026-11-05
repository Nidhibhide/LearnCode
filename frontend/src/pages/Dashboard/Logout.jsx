import { useNavigate } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from "@heroui/react";
import { logout } from "../../api/user";
import { useDispatch } from "react-redux";
import { clearUser } from "../../redux/features/userSlice";

const Logout = ({ isOpen, onOpenChange }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleConfirm = async (onClose) => {
    const res = await logout();
    const { statusCode } = res;
    if (statusCode === 200) {
      dispatch(clearUser());
      onClose();
      navigate("/");
    }
  };

  const handleCancel = (onClose) => {
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader>Confirm LogOut</ModalHeader>
            <ModalBody>
              <p>Are you sure you want to exit the application?</p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="danger"
                variant="light"
                onPress={() => handleCancel(onClose)}
              >
                Cancel
              </Button>
              <Button
                color="primary"
                onPress={() => handleConfirm(onClose)}
              >
                Confirm
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default Logout;
