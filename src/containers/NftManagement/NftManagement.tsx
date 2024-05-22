import { useAppDispatch, useAppSelector } from "app/hooks";
import { selectLogState } from "app/LoginStateReducer";
import NftsService from "app/nftsState/nfts.service";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import NftDeleteModal from "./NftDeleteModel";
import NftFormModal from "./NftFormModal";
import NftDetailsModal from "./NftDetailsModal";
import VideoForNft_V2 from "components/VideoForNft_V2";
import NcImage from "shared/NcImage/NcImage";
import Loader from "components/Loader";
import { getNfts, selectNftState } from "app/nftsState/nftsReducer";
import { createNftMarketTypes, NftType } from "app/nftsState/nftsTypes";
import TablePagination from "shared/Pagination/TablePagination";

export interface actionTypes {
  body: createNftMarketTypes,
  setError: (text: string) => void
}

const NftManagement = () => {
  const dispatch = useAppDispatch()
  const { token } = useAppSelector(selectLogState)
  const { nfts } = useAppSelector(selectNftState)
  const [loading, setLoading] = useState(false)
  const [activeNft, setActiveNft] = useState<NftType>({} as NftType)
  const [modalType, setModalType] = useState('new')
  const [formModal, setFormModal] = useState(false)
  const [deleteModal, setDeleteModal] = useState(false)
  const [detailsModal, setDetailsModal] = useState(false)
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;
  const totalPages = Math.ceil(nfts.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const visibleData = nfts.slice(startIndex, endIndex);

  useEffect(() => {
    getAllNfts()
  }, [])

  const getAllNfts = async () => {
    setLoading(true)
    await dispatch(getNfts())
    setLoading(false)
  }

  //delete
  const onClickDeleteNft = (nft: NftType) => {
    setActiveNft(nft)
    setDeleteModal(true)
  }

  const deleteNft = async () => {
    try {
      await NftsService.deleteNftMarket(token, activeNft.id)
      toast.success('NFT deleted successfully')
      closeDeleteModal()
      getAllNfts();
    }
    catch (err: any) {
      console.log(err.message)
    }
  }

  const closeDeleteModal = () => {
    setDeleteModal(false)
  }

  //create
  const onClickCreateNft = () => {
    setModalType('new')
    setFormModal(true)
  }

  const createNftFunc = async ({ body, setError }: actionTypes) => {
    try {
      const res = await NftsService.createNftMarket(token, body)
      if (!res.data.success) {
        setError(res.data.message)
        return;
      }
      toast.success('NFT created succesfully')
      closeFormModal()
      getAllNfts();
    }
    catch (err: any) {
      console.log(err.message)
    }
  }

  //edit
  const onClickEditNft = (nft: NftType) => {
    setActiveNft(nft)
    setModalType('edit')
    setFormModal(true)
  }

  const editNftFunc = async ({ body, setError }: actionTypes) => {
    try {
      const res = await NftsService.editNftMarket(token, { ...body, id: activeNft.id })
      if (!res.data.success) {
        setError(res.data.message)
        return;
      }
      toast.success('NFT edited succesfully')
      closeFormModal()
      getAllNfts();
    }
    catch (err: any) {
      console.log(err.message)
    }
  }

  const closeFormModal = () => {
    setFormModal(false)
  }


  //details
  const closeDetailsModal = () => {
    setDetailsModal(false)
  }

  const onClickNftDetails = (nft: NftType) => {
    setActiveNft(nft)
    setDetailsModal(true)
  }

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  }

  return (
    <>
      <div className="container py-10 lg:pb-15 lg:pt-15 space-y-10 lg:space-y-10">
        <div className="flex justify-between">
          <h3 className="text-xl sm:text-2xl font-semibold">
            Nft managment
          </h3>
          <ButtonPrimary onClick={onClickCreateNft}>
            Add new Nft
          </ButtonPrimary>
        </div>
        <div>
          {loading ? (
            <div className="flex justify-center align-center h-[200px]">
              <Loader size="20" />
            </div>
          ) : !nfts[0] ? (
            <div className="w-full h-[200px] px-6 text-lg bg-gray-100 rounded-md flex justify-center items-center dark:bg-gray-800 dark:border-gray-700">
              <span className="text-gray-600 dark:text-neutral-300">
                No NFTs available
              </span>
            </div>
          ) : (
            <div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                  <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-sm">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center">
                        Price In USD
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center">
                        Quantity Available
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center">
                        Quantity Purchased
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center">
                        Atomic WaxId
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center whitespace-nowrap">
                        Miata Lunc Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center whitespace-nowrap">
                        Open Sea Eth Bsc Id
                      </th>
                      <th scope="col" className="px-6 py-3 text-sm text-center">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-gray-100">
                    {visibleData.map(nft =>
                      <tr key={nft.id} className="bg-white border-b dark:bg-gray-800 dark:border-gray-700">
                        <td className="flex items-center px-6 py-4 whitespace-nowrap">
                          <div className="w-20 h-20 flex-shrink-0 mr-2 sm:mr-3">
                            {nft.nftVideoUrl ? (
                              <VideoForNft_V2 src={nft.nftVideoUrl} />
                            ) : (
                              <div>
                                <NcImage
                                  containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
                                  src={nft.nftUrl}
                                  className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
                                />
                              </div>
                            )}
                          </div>
                          {nft.name || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {nft.price || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {nft.quantityAvailable || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {nft.quantityPurchased || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {nft.atomicWaxId || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {nft.miataLuncId || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-center">
                          {nft.openseaEthBscId || '(null)'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex justify-center items-center w-full h-full gap-x-2">
                            <svg onClick={() => onClickNftDetails(nft)} className='w-6 h-6 cursor-pointer' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z"></path>
                              <path d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                            </svg>
                            <svg onClick={() => onClickEditNft(nft)} className='w-6 h-6 cursor-pointer' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"></path>
                            </svg>
                            <svg onClick={() => onClickDeleteNft(nft)} className='w-6 h-6 cursor-pointer' fill="none" stroke="currentColor" strokeWidth="1.5" viewBox="0 0 24 24" aria-hidden="true">
                              <path d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"></path>
                            </svg>
                          </div>
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
                itemslength={nfts.length}
                showItemsCount={ITEMS_PER_PAGE}
              />
            </div>
          )}
        </div>
      </div>

      {formModal && (
        <NftFormModal
          onClose={closeFormModal}
          type={modalType}
          nft={activeNft}
          onClick={modalType === 'edit' ? editNftFunc : createNftFunc}
        />
      )}
      {deleteModal && (
        <NftDeleteModal
          onClose={closeDeleteModal}
          name={activeNft?.name}
          onDelete={deleteNft}
        />
      )}
      {detailsModal && (
        <NftDetailsModal
          onClose={closeDetailsModal}
          nft={activeNft}
        />
      )}
    </>
  )
}

export default NftManagement;