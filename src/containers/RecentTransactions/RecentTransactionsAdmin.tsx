import { useAppSelector } from "app/hooks";
import { selectLogState } from "app/LoginStateReducer";
import doneIcon from 'images/done-icon.jpg';
import unDoneIcon from 'images/undone-icon.png';
import NftsService from "app/nftsState/nfts.service"
import { useEffect, useState } from "react"
import Loader from "components/Loader";
import { dateFormat } from "utils/dateFormat";
import { transactionAdminType } from "app/nftsState/nftsTypes";
import TablePagination from "../../shared/Pagination/TablePagination";

const tableHeaders = [
  'Sender',
  'Receiver',
  'Amount paid in token',
  'Amount paid in dollars',
  'Mint Status',
  'Verified Status',
  'createdAt',
  'updatedAt',
  'Transaction Hash',
]

const RecentTransactionsAdmin = () => {
  const { token } = useAppSelector(selectLogState);
  const [dataTransactionAdmin, setDataTransactionAdmin] = useState<transactionAdminType[]>([])
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(dataTransactionAdmin.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleData = dataTransactionAdmin.slice(startIndex, endIndex);

  useEffect(() => {
    const getTransactionAdmin = async () => {
      setLoading(true)
      const res = await NftsService.getRecentTransactionAll(token)
      setDataTransactionAdmin(res.data.data || [])
      setLoading(false)
    }
    getTransactionAdmin()
  }, [])

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  return (
    <>
      <div className="w-full h-[2px] bg-gray-200 rounded-md"></div>
      <h3 className="text-xl sm:text-2xl font-semibold">
        Recent Transactions of Users
      </h3>
      {loading ? (
        <div className="flex justify-center align-center h-[200px]">
          <Loader size="20" />
        </div>
      ) : (
        !dataTransactionAdmin[0] ? (
          <div className="w-full h-[200px] px-6 text-lg bg-gray-100 rounded-md flex justify-center items-center dark:bg-gray-800 dark:border-gray-700">
            <span className="text-gray-600 dark:text-neutral-300">
              No recent transactions found
            </span>
          </div>
        ) : (
          <div>
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {tableHeaders.map((item, index) =>
                      <th key={index} scope="col" className="px-6 py-3 text-sm">
                        {item}
                      </th>
                    )}
                  </tr>
                </thead>
                <tbody>
                  {visibleData.map(transaction =>
                    <tr key={transaction.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      <td className="px-6 py-4">
                        {transaction.sender}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.receiver}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.paidInToken}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.paidInDollars}
                      </td>
                      <td className="px-6 py-4">
                        <img className="w-5 mx-auto" src={transaction.isMinted ? doneIcon : unDoneIcon} />
                      </td>
                      <td className="px-6 py-4">
                        <img className="w-5 mx-auto" src={transaction.isPaymentVerifiedByMiners ? doneIcon : unDoneIcon} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dateFormat(transaction.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {dateFormat(transaction.updatedAt)}
                      </td>
                      <td className="px-6 py-4">
                        {transaction.transactionHash}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
            <TablePagination 
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
              itemslength={dataTransactionAdmin.length}
              showItemsCount={ITEMS_PER_PAGE}
            />
          </div>
        )
      )}
    </>
  )
}

export default RecentTransactionsAdmin;