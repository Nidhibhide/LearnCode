import React from 'react';

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Unauthorized</h1>
        <p className="text-gray-700 mb-6">You do not have permission to access this page.</p>
        <a
          href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        >
          Go to Login
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;