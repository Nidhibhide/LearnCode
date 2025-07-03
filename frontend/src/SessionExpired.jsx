const SessionExpired = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className=" text-2xl md:text-3xl font-bold text-red-500 mb-4">
          Session Expired
        </h1>
        <h2 className="text-xl font-semibold mb-2">Please log in again</h2>
        <p className="text-gray-600 mb-6">
          Your session has expired for security reasons. Kindly log in to
          continue.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 text-white bg-black hover:bg-gray-700 rounded-full transition font-medium"
        >
          Back to Sign Up
        </a>
      </div>
    </div>
  );
};

export default SessionExpired;
