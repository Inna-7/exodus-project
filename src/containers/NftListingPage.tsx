import { useEffect, useState } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import doneIcon from 'images/done-icon.jpg';
import unDoneIcon from 'images/undone-icon.png';
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getPurchasedNfts, mintNftApi, selectNftState } from "app/nftsState/nftsReducer";
import { selectLoginWalletsState } from "app/loginWalletsState/loginWalletsSlice";
import Loader from "components/Loader";
import { purchasedNftType } from "app/nftsState/nftsTypes";
import TablePagination from "shared/Pagination/TablePagination";
import { selectLogState } from "app/LoginStateReducer";
import { toast } from "react-toastify";

interface mintDisabledListT {
  [key: string]: boolean
}

const tableHeaders = [
  'NFT Name',
  'Transaction Hash',
  'Token',
  'Amount',
  'Payment Verified',
  'NFT Minted',
  'Mint from opensea',
  'Mint from atomicassets'
]

const NftListingPage = () => {
  const dispatch = useAppDispatch()
  const { waxAddress } = useAppSelector(selectLoginWalletsState)
  const { metaAddress } = useAppSelector(selectLogState)
  const { purchasedNfts } = useAppSelector(selectNftState)
  const [mintDisabledList, setMintDisabledList] = useState<mintDisabledListT>()
  const [loading, setLoading] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(purchasedNfts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleData = purchasedNfts.slice(startIndex, endIndex);

  useEffect(() => {
    if (!purchasedNfts[0]) {
      const getNftsFirst = async () => {
        setLoading(true)
        await dispatch(getPurchasedNfts())
        setLoading(false)
      }
      getNftsFirst()
    }

    const interval = setInterval(() => {
      dispatch(getPurchasedNfts())
    }, 10000)

    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (purchasedNfts) {
      let newObj = { ...mintDisabledList }
      purchasedNfts.forEach((nft) => {
        if (nft.isMinted && !nft.isPaymentVerifiedByMiners) {
          newObj[nft.id] = true
        }
      })
      setMintDisabledList(newObj)
    }
  }, [purchasedNfts])


  const mintNFT = async (nft: purchasedNftType, type: string) => {
    const isOpensea = type === 'opensea'

    if (mintDisabledList?.[nft.id]) {
      return;
    }

    if(isOpensea && !metaAddress){
      toast.error('Please connect your Metamask wallet to mint from OpenSea')
      return;
    }
    if(!isOpensea && !waxAddress){
      toast.error('Please connect your Wax wallet to mint from AtomicAssets')
      return;
    }

    if (!nft.isPaymentVerifiedByMiners) {
      alert('Payment is not verified yet. Wait! till the Payment is verified');
      return;
    }

    if (nft.isMinted) {
      alert("NFT already Minted");
      return;
    }

    const body = {
      nftId: nft.id,
      nftReceiver: isOpensea ? metaAddress : waxAddress
    }

    setMintDisabledList({ ...mintDisabledList, [nft.id]: true })
    await dispatch(mintNftApi({body, isOpensea}))
    setMintDisabledList({ ...mintDisabledList, [nft.id]: false })
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  return (
    <div className="container py-10 lg:pb-15 lg:pt-15 space-y-10 lg:space-y-10">
      <h3 className="text-xl sm:text-2xl font-semibold">
        You must have WAX wallet account connected in order to mint the purchased NFT.
      </h3>
      {loading ? (
        <div className="flex justify-center align-center">
          <Loader size="20" />
        </div>
      ) : (
        <div>
          <div className="relative overflow-x-auto">
            <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
              <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                <tr>
                  {tableHeaders.map((item, index) =>
                    <th key={index} scope="col" className="px-6 py-3 text-sm text-center">
                      {item}
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {visibleData.map(nft =>
                  <tr key={nft.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                    <th scope="row" className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white">
                      {nft.nftDetails?.nftObject?.nft?.nft_name || ''}
                    </th>
                    <td className="px-6 py-4 text-center">
                      {nft.transactionHash}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {nft.paymentToken}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {nft.paidInToken}
                    </td>
                    <td className="px-6 py-4">
                      <img className="w-5 mx-auto" src={nft.isPaymentVerifiedByMiners ? doneIcon : unDoneIcon} />
                    </td>
                    <td className="px-6 py-4">
                      <img className="w-5 mx-auto" src={nft.isMinted ? doneIcon : unDoneIcon} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ButtonPrimary 
                        className="w-max" 
                        disabled={mintDisabledList?.[nft.id]} 
                        onClick={() => mintNFT(nft, 'opensea')}
                      >
                        Mint from OpenSea
                      </ButtonPrimary>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <ButtonPrimary 
                        className="w-max"
                        disabled={mintDisabledList?.[nft.id]} 
                        onClick={() => mintNFT(nft, 'atomic')}
                      >
                        Mint from AtomicAssets
                      </ButtonPrimary>
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
            itemslength={purchasedNfts.length}
            showItemsCount={ITEMS_PER_PAGE}
          />
        </div>
      )}
    </div >
  )
}

export default NftListingPage;