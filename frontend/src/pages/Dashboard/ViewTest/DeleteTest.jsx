import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { deleteTest } from "../../../api/test";
import { ConfirmationDialog } from "../../../components";
import { ROUTES } from "../../../constants";
import { navigateTo, delay, handleApiResponse, handleApiError } from "../../../utils";

function DeleteTest() {
  const { testId } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const name = state?.name || "Not Available";

  useEffect(() => {
    if (testId && name) {
      setIsOpen(true);
    }
  }, [testId, name]);

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await deleteTest(testId);
      const { status } = handleApiResponse(response);

      if (status === 200) {
        await delay(3000);
        navigateTo(navigate, ROUTES.DASHBOARD + "/viewTest");
      }
    } catch (err) {
      handleApiError(err, "test deletion failed");
    } finally {
      setLoading(false);
      setIsOpen(false);
    }
  };

  return (
    <ConfirmationDialog
      isOpen={isOpen}
      onOpenChange={setIsOpen}
      title="Confirm Delete"
      message={`Are you sure you want to delete test "${name}"?`}
      onConfirm={handleDelete}
      confirmText="Delete"
      cancelText="Cancel"
      confirmColor="danger"
      loading={loading}
    />
  );
}

export default DeleteTest;
