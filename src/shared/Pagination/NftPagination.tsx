import React, { FC } from "react";
import twFocusClass from "utils/twFocusClass";

export interface NftPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const NftPagination: FC<NftPaginationProps> = ({ currentPage, totalPages, onPageChange }) => {

  const pageNumbers: (number | string)[] = [];

  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length > 7) {
    if (currentPage < pageNumbers.length - 3) {
      const startCut = currentPage < 4 ? 5 : currentPage + 1
      pageNumbers.splice(startCut, pageNumbers.length - startCut - 1, '...');
    }
    if (currentPage > 4) {
      const endCut = currentPage > pageNumbers.length - 4 ? pageNumbers.length - 6 : currentPage - 1
      pageNumbers.splice(1, endCut, '...');
    }
  }

  const handleClick = (pageNumber: number | string) => {
    if(typeof pageNumber === 'number'){
      onPageChange(pageNumber);
    }
  }

  const goNextPage = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  const goPervPage = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const ActiveClass = `inline-flex w-11 h-11 items-center justify-center rounded-full bg-primary-6000 text-white ${twFocusClass()}`
  const defaultClass = `inline-flex w-11 h-11 items-center justify-center rounded-full bg-white hover:bg-neutral-100 border border-neutral-200 text-neutral-6000 dark:text-neutral-400 dark:bg-neutral-900 dark:hover:bg-neutral-800 dark:border-neutral-700 ${twFocusClass()}`

  return (
    <nav
      className={`nc-Pagination inline-flex space-x-1 text-base font-medium`}
    >
      <button className={defaultClass} onClick={() => goPervPage()}>
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
        </svg>
      </button>
      {pageNumbers.map((pageNumber) => (
        <button
          key={pageNumber}
          className={`page-item ${pageNumber === currentPage ? ActiveClass : defaultClass}`}
          onClick={() => handleClick(pageNumber)}
        >
          {pageNumber}
        </button>
      ))}
      <button className={defaultClass} onClick={() => goNextPage()}>
        <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20">
          <path d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" fillRule="evenodd"></path>
        </svg>
      </button>
    </nav>
  );
};

export default NftPagination;