import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "../pagination";

export default function PaginationComponent({
  totalPages,
  currentPage,
  setCurrentPage,
}: {
  totalPages: number;
  currentPage: number;
  setCurrentPage: (page: number) => void; // void doesnt return any value;
}) {
  const handlePageClick = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <Pagination>
      <PaginationPrevious
        onClick={() => handlePageClick(currentPage - 1)}
        aria-disabled={currentPage === 1}
        className={`cursor-pointer ${
          currentPage === 1
            ? "cursor-default opacity-50 hover:bg-transparent"
            : ""
        }`}
      />
      <PaginationContent>
        {Array.from({ length: totalPages }, (_, page) => (
          <PaginationItem key={page}>
            <PaginationLink
              onClick={() => handlePageClick(page + 1)}
              isActive={currentPage === page + 1}
              className={`cursor-pointer ${
                currentPage === page + 1
                  ? "bg-primary hover:bg-primary/90 text-white hover:text-white"
                  : ""
              }`}
            >
              {page + 1}
            </PaginationLink>
          </PaginationItem>
        ))}
      </PaginationContent>
      <PaginationNext
        onClick={() => handlePageClick(currentPage + 1)}
        aria-disabled={currentPage === totalPages}
        className={`cursor-pointer ${
          currentPage === totalPages
            ? "cursor-default opacity-50 hover:bg-transparent"
            : ""
        }`}
      />
    </Pagination>
  );
}
