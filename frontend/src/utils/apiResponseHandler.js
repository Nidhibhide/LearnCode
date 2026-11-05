import { toast } from "react-toastify";

export const handleApiResponse = (response, options = {}) => {
  const {
    showSuccessToast = true,
    showErrorToast = true,
    successMessage,
    errorMessage,
  } = options;

  let status, message, data;

  // Check if it's a success response (has statusCode)
  if (response.statusCode) {
    status = response.statusCode;
    message = successMessage || response.message;
    data = response.data;

    if ((showSuccessToast && status === 200) || status === 201) {
      toast.success(message);
    }
  }
  // Check if it's an error response (has status)
  else if (response.status) {
    status = response.status;
    message =
      errorMessage ||
      response.data?.message ||
      response.message ||
      "An error occurred";
    data = response.data;

    // 429 is already toasted by the axios interceptor
    if (showErrorToast && status !== 429) {
      toast.error(message);
    }
  }
  // Fallback for unexpected response structure
  else {
    status = 500;
    message = errorMessage || "Unexpected error occurred";
    data = null;

    if (showErrorToast) {
      toast.error(message);
    }
  }

  return { status, message, data };
};

export const handleApiError = (
  error,
  fallbackMessage = "An error occurred"
) => {
  // 429 is already toasted by the axios interceptor
  if (error?.__rateLimited || error?.response?.status === 429) {
    return (
      error.response?.data?.message ||
      "Too many requests. Please try again later."
    );
  }

  const message = error.message || fallbackMessage;
  toast.error(message);
  return message;
};
