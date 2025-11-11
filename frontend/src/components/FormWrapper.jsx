import React from 'react';
import { Formik } from 'formik';

const FormWrapper = ({
  initialValues,
  validationSchema,
  onSubmit,
  children,
  className = ""
}) => {
  return (
    <Formik
      initialValues={initialValues}
      validationSchema={validationSchema}
      onSubmit={onSubmit}
    >
      {(formikProps) => (
        <div className={className}>
          {typeof children === 'function' ? children(formikProps) : children}
        </div>
      )}
    </Formik>
  );
};

export default FormWrapper;