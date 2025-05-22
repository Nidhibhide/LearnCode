const PaginationControls = ({ page, setPage, hasNext }) => (
  <div className="mt-8 flex justify-center items-center gap-2">
    <button
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 ease-in-out "
      onClick={() => setPage(page - 1)}
      disabled={page <= 1}
    >
      Previous
    </button>

    <button
      className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition duration-150 ease-in-out"
      onClick={() => setPage(page + 1)}
      disabled={!hasNext}
    >
      Next
    </button>
  </div>
);

export default PaginationControls;
