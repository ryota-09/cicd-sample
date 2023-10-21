import { useRouter } from "next/router";
import React from "react";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages }) => {
  const router = useRouter();

  const handlePageChange = (page: number) => {
    router.push({
      pathname: router.pathname,
      query: { ...router.query, page },
    });
  };

  return (
    <div className="flex items-center">
      <button
        disabled={currentPage === 1}
        className={`mx-1 p-2 hover:bg-gray-200 ${
          currentPage === 1 && "opacity-20"
        }`}
        onClick={() => handlePageChange(1)}
      >
        ＜＜
      </button>
      <button
        disabled={currentPage === 1}
        className={`mx-1 p-2 hover:bg-gray-200 ${
          currentPage === 1 && "opacity-20"
        }`}
        onClick={() => handlePageChange(currentPage - 1)}
      >
        ＜
      </button>
      {/* Array(totalPages) は要素なしになる。 */}
      {Array.from({ length: totalPages }).map((_, index) => {
        const pageNumber = index + 1;
        return (
          <button
            key={pageNumber}
            className={`mx-1 p-2 ${
              pageNumber === currentPage
                ? "bg-green-500 text-white"
                : "hover:bg-gray-200"
            }`}
            onClick={() => handlePageChange(pageNumber)}
          >
            {pageNumber}
          </button>
        );
      })}
      <button
        disabled={currentPage === totalPages}
        className={`mx-1 p-2 hover:bg-gray-200 ${
          currentPage === totalPages && "opacity-20"
        }`}
        onClick={() => handlePageChange(currentPage + 1)}
      >
        ＞
      </button>
      <button
        disabled={currentPage === totalPages}
        className={`mx-1 p-2 hover:bg-gray-200 ${
          currentPage === totalPages && "opacity-20"
        }`}
        onClick={() => handlePageChange(totalPages)}
      >
        ＞＞
      </button>
      <span className="ml-4">
        {(currentPage - 1) * 30 + 1}〜{currentPage * 30}件表示
      </span>
    </div>
  );
};

export default Pagination;
