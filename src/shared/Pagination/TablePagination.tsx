import { FC } from "react";

export interface NftPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
  itemslength: number;
  showItemsCount: number
}

const TablePagination: FC<NftPaginationProps> = ({
  currentPage,
  totalPages,
  onPageChange,
  itemslength,
  showItemsCount
}) => {
  const showDataStart = showItemsCount * (currentPage - 1) + 1
  const showDataEnd = (currentPage - 1) * showItemsCount + showItemsCount
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
    if (typeof pageNumber === 'number') {
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

  const ActiveClass = `z-10 px-3 py-2 leading-tight text-blue-600 border border-blue-300 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white`
  const defaultClass = `px-3 py-2 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white`

  return (
    <nav className="flex items-center flex-col gap-y-2.5 justify-between pt-4 sm:flex-row">
      <span className="text-sm font-normal text-gray-500 dark:text-gray-400">
        Showing <span className="font-semibold text-gray-900 dark:text-white">
          {showDataStart}-{showDataEnd > itemslength ? itemslength : showDataEnd}
        </span> of
        <span className="font-semibold text-gray-900 dark:text-white"> {itemslength}</span>
      </span>
      <ul className="inline-flex items-center -space-x-px">
        <li>
          <span onClick={goPervPage} className="cursor-pointer block py-2 px-1.5 ml-0 leading-tight text-gray-500 bg-white border border-gray-300 rounded-l-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:px-3">
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd"></path></svg>
          </span>
        </li>
        {pageNumbers.map((pageNumber: any, i: any) => (
          <span
            key={i}
            className={`cursor-pointer ${pageNumber === currentPage ? ActiveClass : defaultClass}`}
            onClick={() => handleClick(pageNumber)}
          >
            {pageNumber}
          </span>
        ))}
        <li>
          <span onClick={goNextPage} className="cursor-pointer block py-2 px-1.5 leading-tight text-gray-500 bg-white border border-gray-300 rounded-r-lg hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white sm:px-3">
            <svg className="w-5 h-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd"></path></svg>
          </span>
        </li>
      </ul>
    </nav>
  )
}

export default TablePagination;