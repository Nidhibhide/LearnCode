import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="bg-surface p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-error mb-4">Unauthorized</h1>
        <p className="text-textPrimary mb-6">You do not have permission to access this page.</p>
        <a
          href="/login"
          className="bg-primary hover:bg-primaryDark text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;