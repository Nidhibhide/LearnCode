import React from "react";
import { Link } from "react-router-dom";
import { Formik, Field, ErrorMessage } from "formik";
import { googleIcon, codingImage } from "../../images/index";
import { signup } from "../../api/user";
import * as Yup from "yup";
import { toast } from "react-toastify";

const SignUp = () => {
  const statusMessages = {
    409: "User already exists",
    201: "Signup successful",
    500: "Failed to SignUp User",
  };

  // handle sign up
  const handleSignUp = async (values, { resetForm }) => {
    try {
      const response = await signup(values);

      const message = statusMessages[response?.status];

      if (response?.status === 201) {
        toast.success(message);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      alert(err.message || "Registration failed");
    }
  };

  // validation schema
  const validationSchema = Yup.object({
    name: Yup.string()
      .matches(/^[a-zA-Z\s]+$/, "Only alphabets and spaces are allowed")
      .min(3, "Name must be at least 3 characters")
      .max(50, "Name should not exceed 50 characters")
      .required("Name is required"),

    email: Yup.string().email("Invalid email").required("Email is required"),

    password: Yup.string()
      .matches(/^\d+$/, "Password must contain digits only")
      .min(5, "Password must be at least 5 characters")
      .max(10, "Password must not exceed 10 characters")
      .required("Password is required"),
  });

  return (
    <div className="h-screen flex bg-slate-200">
      <div className="lg:w-[50%] w-full rounded-tl-2xl rounded-bl-2xl px-4 md:px-12 bg-white">
        <div className="h-full flex flex-col justify-center">
          <p className="font-extrabold text-3xl md:text-4xl md:mb-12 mb-8">
            LearnCode
          </p>
          <p className="font-semibold text-2xl md:text-3xl mb-14">
            Welcome to LearnCode! Please sign up to start your coding journey.
          </p>
          <button className="bg-white mb-8 rounded-lg border border-gray-300 flex justify-center items-center py-3">
            <img className="object-contain h-7 w-7" src={googleIcon} />
            <span className="text-base font-semibold">Sign in with Google</span>
          </button>

          <Formik
            initialValues={{ name: "", email: "", password: "" }}
            validationSchema={validationSchema}
            onSubmit={handleSignUp}
          >
            {({ handleSubmit }) => (
              <>
                <div className="flex flex-col space-y-4 mb-12">
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium">Name</p>
                    <Field
                      type="text"
                      name="name"
                      className="py-3 px-4 rounded-lg border border-gray-300"
                      placeholder="Enter your name"
                    />
                    <ErrorMessage
                      name="name"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium">Email</p>
                    <Field
                      type="email"
                      name="email"
                      className="py-3 px-4 rounded-lg border border-gray-300"
                      placeholder="Enter your email"
                    />
                    <ErrorMessage
                      name="email"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>
                  <div className="flex flex-col space-y-1">
                    <p className="text-base font-medium">Password</p>
                    <Field
                      type="password"
                      name="password"
                      className="py-3 px-4 rounded-lg border border-gray-300"
                      placeholder="Enter your password"
                    />
                    <ErrorMessage
                      name="password"
                      component="p"
                      className="text-sm text-red-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  className="bg-black text-white py-3 font-medium rounded-xl md:mb-4 mb-2   hover:bg-gray-700 hover:shadow-md transition duration-500"
                >
                  Create Account
                </button>
              </>
            )}
          </Formik>

          <p className="md:text-lg text-base">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-blue-600 hover:underline"
            >
              Login Here
            </Link>
          </p>
        </div>
      </div>

      <div className="w-[50%] lg:block hidden">
        <img
          src={codingImage}
          className="h-full w-full object-fill rounded-tr-2xl rounded-br-2xl"
        />
      </div>
    </div>
  );
};

export default SignUp;
