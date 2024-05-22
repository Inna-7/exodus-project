import { useEffect, useMemo, useState } from "react";
import { useAppSelector } from "app/hooks";
import { selectLogState } from "app/LoginStateReducer";
import NftsService from "app/nftsState/nfts.service";
import { selectUserState } from "app/UserReducer";
import Loader from "components/Loader";
import { selectLoginWalletsState } from "app/loginWalletsState/loginWalletsSlice";
import { useWallet } from "@terra-money/wallet-provider";
import RecentTransactionsAdmin from "./RecentTransactionsAdmin";
import { dateFormat } from "utils/dateFormat";
import { transactionForEth, transactionForLunc, transactionForWax } from "app/nftsState/nftsTypes";

interface TableType {
  title: string,
  active: boolean,
  userAccount: string
}

interface TablesDataType {
  title: string,
  value: string,
  type?: string
}

export interface dataTransactionUserType extends transactionForLunc,transactionForWax,transactionForEth{}

const RecentTransactions = () => {
  const { wallets } = useWallet();
  const { token, metaAddress } = useAppSelector(selectLogState);
  const { isAdmin } = useAppSelector(selectUserState);
  const { waxAddress } = useAppSelector(selectLoginWalletsState)
  const [dataTransactionUser, setDataTransactionUser] = useState<dataTransactionUserType[]>([])
  const [loading, setLoading] = useState(false)
  const [tables, setTables] = useState<TableType[]>([
    { title: "Wax", active: true, userAccount: '' },
    { title: "Bnb", active: false, userAccount: '' },
    { title: "Eth", active: false, userAccount: '' },
    // { title: "YoCoin", active: false, userAccount: '' },
    { title: "Lunc", active: false, userAccount: '' },
  ])

  const activeTab = useMemo(() => {
    return tables.find(t => t.active)
  }, [tables])

  const tablesData: TablesDataType[][] = useMemo(() => {
    if (activeTab?.title === "Wax") {
      return dataTransactionUser.map(item => {
        return [
          { title: 'From', value: item.act.data.from },
          { title: 'To', value: item.act.data.to },
          { title: 'Receiver', value: item.receiver },
          { title: 'Quantity', value: item.act.data.quantity },
          { title: 'Block Time', value: item.block_time, type: 'time' },
          { title: 'TRX ID', value: item.trx_id }
        ]
      })
    }
    else if (activeTab?.title === "Eth" || activeTab?.title === "Bnb") {
      return dataTransactionUser.map(item => {
        return [
          { title: 'From', value: item.from },
          { title: 'To', value: item.to },
          { title: 'Gas', value: item.gas },
          { title: 'Gas Price', value: item.gasPrice },
          { title: 'Gas Used', value: item.gasUsed },
          { title: 'Hash', value: item.hash },
          { title: 'Block Hash', value: item.blockHash }
        ]
      })
    }
    else if (activeTab?.title === "Lunc") {
      return dataTransactionUser.map(item => {
        return [
          { title: 'From', value: item.tx?.body.messages[0].from_address },
          { title: 'To', value: item.tx?.body.messages[0].to_address },
          { title: 'Gas Used', value: item.gas_used },
          { title: 'Gas Wanted', value: item.gas_wanted },
          { title: 'Times Tamp', value: item.timestamp, type: 'time' },
          { title: 'Tx Hash', value: item.txhash }
        ]
      })
    }
    return []
  }, [dataTransactionUser])

  useEffect(() => {
    setTables(tables.map(tab => {
      if (metaAddress && (tab.title === "Bnb" || tab.title === "Eth")) {
        return { ...tab, disable: false, userAccount: metaAddress }
      }
      if (waxAddress && tab.title === "Wax") {
        return { ...tab, disable: false, userAccount: waxAddress }
      }
      if (wallets[0]?.terraAddress && tab.title === "Lunc") {
        return { ...tab, disable: false, userAccount: wallets[0]?.terraAddress }
      }
      return { ...tab, disable: true, userAccount: '' }
    }))
  }, [metaAddress, waxAddress, wallets])

  useEffect(() => {
    const getTransaction = async () => {
      setDataTransactionUser([])
      if (!activeTab?.userAccount) {
        return;
      }
      setLoading(true)
      try {
        const selectedValue = activeTab?.title
        const res = await NftsService.getRecentTransactionUser(selectedValue, activeTab?.userAccount, token)
        if (selectedValue === 'Wax') {
          setDataTransactionUser(res?.data?.data)
        }
        else if (selectedValue === 'Bnb' || selectedValue === 'Eth') {
          setDataTransactionUser(res?.data?.result)
        }
        else if (selectedValue === 'Lunc') {
          setDataTransactionUser(res?.data?.txs)
        }
        setLoading(false)
      }
      catch (err: any) {
        console.error(err.message)
        setLoading(false)
      }
    }
    getTransaction()
  }, [tables])

  const setActiveTable = (item: TableType) => {
    setTables(tables.map((tap) => ({ ...tap, active: item.title === tap.title })));
  }

  const notFoundMessage = (message: string) => {
    return (
      <div className="w-full h-[200px] px-6 text-lg bg-gray-100 rounded-md flex justify-center items-center dark:bg-gray-800 dark:border-gray-700">
        <span className="text-gray-600 dark:text-neutral-300">
          {message}
        </span>
      </div>
    )
  }

  return (
    <div className="container py-10 lg:pb-15 lg:pt-15 space-y-10 lg:space-y-10">
      <h3 className="text-xl sm:text-2xl font-semibold">
        My Recent Transactions
      </h3>
      <div className="flex flex-wrap gap-3">
        {tables.map((item, i) =>
          <div
            key={i}
            className={`flex items-center justify-center px-4 py-2 text-sm rounded-full border focus:outline-none cursor-pointer 
              ${item.active
                ? "border-primary-500 bg-primary-50 text-primary-900"
                : "border-neutral-300 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300 hover:border-neutral-400 dark:hover:border-neutral-500"
              }`
            }
            onClick={() => setActiveTable(item)}
          >
            <span className="line-clamp-1">
              {item.title}
            </span>
          </div>
        )}
      </div>

      {activeTab?.userAccount ? (
        loading ? (
          <div className="flex justify-center align-center h-[200px]">
            <Loader size="20" />
          </div>
        ) : (
          tablesData[0] ? (
            <div className="relative overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    {tablesData[0].map((item, i) => (
                      <th key={i} scope="col" className="px-6 py-3 text-sm">
                        {item.title}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {tablesData.map((transaction, i) => (
                    <tr key={i} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                      {transaction.map((item, index) => (
                        <td key={index} className="px-6 py-4 whitespace-nowrap">
                          {item.type === "time" ? dateFormat(item.value) : item.value}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            notFoundMessage(`No recent transactions with ${activeTab?.title} found`)
          )
        )
      ) : (
        notFoundMessage(`Connect your wallet to see your recent transactions`)
      )}

      {isAdmin && <RecentTransactionsAdmin />}
    </div>
  )
}

export default RecentTransactions;