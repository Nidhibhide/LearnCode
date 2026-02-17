import { InputField, Button } from "../../components/index";
import { Formik } from "formik";
import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { create } from "../../api/test";
import * as Yup from "yup";
import { handleApiResponse, handleApiError } from "../../utils";
import { stringValidator, integerValidator, selectValidator } from "../../validation/GlobalValidation";

const LANGUAGES = ["Java", "C++", "JavaScript", "Python", "C"];
const LEVELS = ["Basic", "Intermediate", "Advanced"];

const CreateTest = () => {
  const [loading, setLoading] = useState(false);

  // handle sign up
  const handleCreate = async (values, { resetForm }) => {
    try {
      if (loading) return;
      setLoading(true);
      const response = await create(values);
      handleApiResponse(response);
      resetForm();
    } catch (err) {
      handleApiError(err, "test creation failed");
    } finally {
      setLoading(false);
    }
  };

  //validation schema - using validators directly from GlobalValidation
  const validationSchema = Yup.object().shape({
    name: stringValidator("Test name", 3, 100, true),
    numOfQuestions: integerValidator("Number of questions", 1, 5, true),
    language: selectValidator("Language", LANGUAGES, true),
    level: selectValidator("Level", LEVELS, true),
  });

  return (
    <div className="h-full w-full py-4 sm:py-8 md:py-12 px-4">
      <h1 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-6">Create Test</h1>
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
                    options={LANGUAGES}
                  />
                </div>
                <div className="flex flex-col space-y-1">
                  <InputField
                    label="Test Level"
                    name="level"
                    as="select"
                    options={LEVELS}
                  />
                </div>
              </div>

              <Button
                loading={loading}
                onClick={handleSubmit}
              >
                Create Test
              </Button>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

export default CreateTest;
