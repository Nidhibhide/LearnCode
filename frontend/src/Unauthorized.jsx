

const Unauthorized = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-md w-full text-center">
        <h1 className=" text-3xl md:text-4xl font-bold text-red-500 mb-4">401</h1>
        <h2 className="text-xl font-semibold mb-2">Unauthorized Access</h2>
        <p className="text-gray-600 mb-6">
          Sorry, you are not authorized to view this page.
        </p>
        <a
          href="/"
          className="inline-block px-6 py-2 text-white bg-black hover:bg-gray-700 rounded-full transition font-medium"
        >
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default Unauthorized;
