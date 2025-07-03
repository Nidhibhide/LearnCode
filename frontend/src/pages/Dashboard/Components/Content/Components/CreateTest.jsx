import { InputField } from "../../../../../components/index";
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { create } from "../../../../../api/test";
import * as Yup from "yup";

const CreateTest = () => {
  const [loading, setLoading] = useState(false);

  // handle sign up
  const handleCreate = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await create(values);

      const { message, statusCode } = response;

      if (statusCode === 201) {
        toast.success(message);
      } else if (message) {
        toast.error(message);
      }
      resetForm();
    } catch (err) {
      toast.error(err.message || "test creationg failed");
    } finally {
      setLoading(false);
    }
  };

  //validation schema
  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(3, "Test name must be at least 3 characters")
      .max(100, "Test name should not exceed 100 characters")
      .required("Test name is required"),

    numOfQuestions: Yup.number()
      .typeError("Number of questions must be a number")
      .integer("Number of questions must be an integer")
      .min(1, "There must be at least 1 question")
      .max(5, "Questions should not exceed 5")
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

  return (
    <div className=" h-full w-full md:py-12 py-4 px-4 ">
      <h1 className="md:text-2xl text-xl font-bold text-center mb-6">Create Test</h1>
      <div className=" w-full">
        <Formik
          initialValues={{
            name: "",
            level: "",
            language: "",
            numOfQuestions: "",
          }}
          validationSchema={validationSchema}
          onSubmit={handleCreate}
        >
          {({ handleSubmit }) => (
            <>
              <div className="flex flex-col space-y-4 mb-12">
                <div className="flex flex-col space-y-1">
                  <InputField
                    label="Name of Test"
                    name="name"
                    type="text"
                    placeholder="Enter test name"
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <InputField
                    label="No of Questions"
                    name="numOfQuestions"
                    type="number"
                    placeholder="Enter No of Questions "
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <InputField
                    label="Language"
                    name="language"
                    as="select"
                    options={["Java", "C++", "JavaScript", "Python", "C"]}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <InputField
                    label="Test Level"
                    name="level"
                    as="select"
                    options={["Basic", "Intermediate", "Advanced"]}
                  />
                </div>
              </div>

              <button
                onClick={handleSubmit}
                type="button"
                disabled={loading}
                className="bg-black text-white w-full md:py-3 py-2.5 md:text-lg text-base font-medium rounded-xl md:mb-4 mb-2 hover:bg-gray-700 hover:shadow-md transition duration-500"
              >
                {loading ? "Loading..." : "Create Test"}
              </button>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateTest;
