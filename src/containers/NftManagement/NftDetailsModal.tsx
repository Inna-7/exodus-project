import ButtonClose from "shared/ButtonClose/ButtonClose";
import { FC } from "react";
import Button from "shared/Button/Button";
import NcImage from "shared/NcImage/NcImage";
import AccordionInfo from "containers/NftDetailPage/AccordionInfo";
import VideoForNft_V2 from "components/VideoForNft_V2";
import { NftType } from "app/nftsState/nftsTypes";
import { dateFormat } from "utils/dateFormat";

interface NftDetailsModalType {
  onClose: () => void;
  nft: NftType;
}

const NftDetailsModal: FC<NftDetailsModalType> = ({ onClose, nft }) => {
  return (
    <div className="fixed z-[60] flex justify-center items-center bg-black bg-opacity-50 top-0 left-0 right-0 w-full p-4 h-full">
      <div className="relative max-h-full overflow-y-auto bg-white rounded-lg w-full sm:w-[600px] shadow dark:bg-gray-700">
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            NFT Details
          </h3>
          <ButtonClose onClick={onClose} />
        </div>

        <div className="p-5">
          <div className="w-full flex justify-evenly flex-col gap-x-4 mb-6 sm:flex-row sm:items-center">
            <div className="sm:min-w-[250px]">
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
            <div className="flex flex-col gap-y-3 pt-3">
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">Name: </span>
                  {nft.name}
                </span>
              </div>
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">Price In USD: </span>
                  {nft.price}
                </span>
              </div>
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">quantityAvailable: </span>
                  {nft.quantityAvailable || '(null)'}
                </span>
              </div>
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">quantityPurchased: </span>
                  {nft.quantityPurchased || '(null)'}
                </span>
              </div>
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">atomicWaxId: </span>
                  {nft.atomicWaxId || '(null)'}
                </span>
              </div>
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">miataLuncId: </span>
                  {nft.miataLuncId || '(null)'}
                </span>
              </div>
              <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
                <span className="break-all">
                  <span className="font-bold">openseaEthBscId: </span>
                  {nft.openseaEthBscId || '(null)'}
                </span>
              </div>
            </div>

          </div>
          <div className="flex flex-col justify-center gap-x-4 gap-y-3 mb-6 sm:flex-row">
            <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
              <span className="break-all">
                <span className="font-bold">CreatedAt: </span>
                {dateFormat(nft.createdAt) || '(null)'}
              </span>
            </div>
            <div className="flex gap-x-3 text-gray-800 leading-tight tracking-normal text-neutral-800 dark:text-neutral-200">
              <span className="break-all">
                <span className="font-bold">UpdatedAt: </span>
                {dateFormat(nft.updatedAt) || '(null)'}
              </span>
            </div>
          </div>
          <div>
            <AccordionInfo description={nft?.description} />
          </div>
        </div>

        <div className="flex justify-end items-center p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <Button
            className={`bg-gray-500 text-white`}
            onClick={onClose}
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  )
}

export default NftDetailsModal;