interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPrevious: () => void;
  onNext: () => void;
  showPageNumbers?: boolean;
  pageNumbers?: (number | string)[];
  /** Whether pagination is 0-indexed (default: false, uses 1-indexed) */
  zeroIndexed?: boolean;
  /** Whether current page is first page (from server data, optional) */
  isFirstPage?: boolean;
  /** Whether current page is last page (from server data, optional) */
  isLastPage?: boolean;
}

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onPrevious,
  onNext,
  showPageNumbers = false,
  pageNumbers = [],
  zeroIndexed = false,
  isFirstPage: serverIsFirstPage,
  isLastPage: serverIsLastPage,
}: PaginationProps) {
  // Use server data if available, otherwise calculate based on indexing
  const isFirstPage = serverIsFirstPage ?? (zeroIndexed ? currentPage === 0 : currentPage === 1);
  const isLastPage = serverIsLastPage ?? (zeroIndexed ? currentPage >= totalPages - 1 : currentPage >= totalPages);

  return (
    <div className="flex items-center justify-center gap-2 flex-wrap">
      {/* Previous Button - Outline Style (Secondary Action) */}
      <button
        onClick={onPrevious}
        disabled={isFirstPage}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors border-2 ${
          isFirstPage
            ? "bg-gray-200 text-gray-400 border-gray-200 cursor-not-allowed"
            : "bg-white text-green-600 border-green-500 hover:bg-green-50 hover:border-green-600"
        }`}
      >
        <span className="material-icons text-sm mr-1">chevron_left</span>
        Edellinen
      </button>

      {/* Page Numbers (Optional) */}
      {showPageNumbers && pageNumbers.length > 0 && (
        <div className="flex gap-1">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span key={`ellipsis-${index}`} className="px-3 py-2 text-gray-500">
                  ...
                </span>
              );
            }

            return (
              <button
                key={page}
                onClick={() => onPageChange(page as number)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentPage === page
                    ? "bg-green-500 text-white hover:bg-green-600"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>
      )}

      {/* Simple Page Indicator (when page numbers not shown) */}
      {!showPageNumbers && (
        <span className="text-gray-700 font-medium">
          Sivu {zeroIndexed ? currentPage + 1 : currentPage} / {totalPages}
        </span>
      )}

      {/* Next Button - Solid Style (Primary Action) */}
      <button
        onClick={onNext}
        disabled={isLastPage}
        className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
          isLastPage ? "bg-gray-200 text-gray-400 cursor-not-allowed" : "bg-green-500 text-white hover:bg-green-600"
        }`}
      >
        Seuraava
        <span className="material-icons text-sm ml-1">chevron_right</span>
      </button>
    </div>
  );
}
