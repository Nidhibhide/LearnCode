import * as Yup from "yup";

// Common validation schemas
export const testValidationSchema = Yup.object().shape({
  name: Yup.string()
    .min(3, "Test name must be at least 3 characters")
    .max(100, "Test name should not exceed 100 characters")
    .required("Test name is required"),

  numOfQuestions: Yup.number()
    .typeError("Number of questions must be a number")
    .integer("Number of questions must be an integer")
    .min(1, "There must be at least 1 question")
    .max(100, "Questions should not exceed 100")
    .required("Number of questions is required"),

  language: Yup.string()
    .oneOf(
      ["Java", "C++", "JavaScript", "Python", "C"],
      "Language must be one of Java, C++, JavaScript, Python, or C"
    )
    .required("Language is required"),

  level: Yup.string()
    .oneOf(
      ["Basic", "Intermediate", "Advanced"],
      "Level must be one of Basic, Intermediate, or Advanced"
    )
    .required("Level is required"),
});


export const passwordValidationSchema = Yup.object({
  currentPassword: Yup.string()
    .required("Current password is required"),
});

export const userProfileValidationSchema = Yup.object({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters")
    .max(50, "Name should not exceed 50 characters")
    .required("Name is required"),
  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),
});

export const newPasswordValidationSchema = Yup.object({
  password: Yup.string()
    .matches(/^\d+$/, "Password must contain digits only")
    .min(5, "Must be at least 5 digits")
    .max(10, "Must not exceed 10 digits")
    .required("New password is required"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match")
    .required("Confirm your password"),
});