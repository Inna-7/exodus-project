import { FC, useEffect, useState } from "react";
import ButtonClose from "shared/ButtonClose/ButtonClose";
import Button from "shared/Button/Button";
import Input from "shared/Input/Input";
import Textarea from "shared/Textarea/Textarea";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { NftType } from "app/nftsState/nftsTypes";
import {actionTypes} from "./NftManagement"

interface NftFormModalType {
  onClose: () => void,
  type: string,
  nft: NftType,
  onClick: ({body,setError}:actionTypes) => void
}

const NftFormModal: FC<NftFormModalType> = ({ onClose, type, nft, onClick }) => {
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [nftUrl, setNftUrl] = useState('')
  const [nftIsVideo, setNftIsVideo] = useState(false)
  const [nftPriceInDollars, setNftPriceInDollars] = useState('')
  const [quantityAvailable, setQuantityAvailable] = useState('')
  const [quantityPurchased, setQuantityPurchased] = useState('')
  const [atomicWaxId, setAtomicWaxId] = useState('')
  const [miataLuncId, setMiataLuncId] = useState('')
  const [openseaEthBscId, setOpenseaEthBscId] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    if (type === 'edit') {
      setName(nft.name || '')
      setDescription(nft.description || '')
      setNftUrl(nft.nftVideoUrl || nft.nftUrl || '')
      setNftIsVideo(!!nft.nftVideoUrl)
      setNftPriceInDollars(nft.price.toString() || '')
      setQuantityAvailable(nft.quantityAvailable.toString() || '')
      setQuantityPurchased(nft.quantityPurchased.toString() || '')
      setAtomicWaxId(nft.atomicWaxId || '')
      setMiataLuncId(nft.miataLuncId || '')
      setOpenseaEthBscId(nft.openseaEthBscId || '')
    }
  }, [type])

  const onSubmit = async () => {
    if (!name) {
      setError('Name is required')
      return;
    }
    if (!nftUrl) {
      setError('Nft Url is required')
      return;
    }
    if (!nftPriceInDollars) {
      setError('Price is required')
      return;
    }
    if (!description) {
      setError('Description is required')
      return;
    }
    if (!quantityAvailable) {
      setError('Quantity Available is required')
      return;
    }
    if (!atomicWaxId && !miataLuncId && !openseaEthBscId) {
      setError('One of the three template IDs is required.')
      return;
    }

    const body = {
      name,
      description,
      nftUrl: !nftIsVideo ? nftUrl : '',
      nftVideoUrl: nftIsVideo ? nftUrl : '',
      nftPriceInDollars: +nftPriceInDollars,
      quantityAvailable: +quantityAvailable,
      quantityPurchased: +quantityPurchased,
      atomicWaxId,
      miataLuncId,
      openseaEthBscId
    }
    onClick({body, setError})
  }

  return (
    <div className="fixed z-[60] flex justify-center items-center bg-black bg-opacity-50 top-0 left-0 right-0 w-full p-4 h-full">
      <div className="max-h-full overflow-y-auto bg-white rounded-lg shadow dark:bg-gray-700">
        <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            {type === 'edit' ? 'Edit Nft' : 'Create New Nft'}
          </h3>
          <ButtonClose onClick={onClose} />
        </div>
        <div className="py-4 px-8">
          <form className="grid grid-cols-1 gap-3">
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Name
              </span>
              <Input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1"
              />
            </label>
            <label className="block">
              <div className="flex justify-between">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Nft Url
                </span>
                <div>
                  <span
                    className={`cursor-pointer ${!nftIsVideo && `border-b-2 text-primary-6000 border-primary-6000`}`}
                    onClick={() => setNftIsVideo(false)}
                  >photo</span>
                  {' | '}
                  <span
                    className={`cursor-pointer ${nftIsVideo && `border-b-2 text-primary-6000 border-primary-6000`}`}
                    onClick={() => setNftIsVideo(true)}
                  >video</span>
                </div>
              </div>

              <Input
                type="text"
                value={nftUrl}
                onChange={(e) => setNftUrl(e.target.value)}
                className="mt-1"
              />
            </label>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Price in USD
              </span>
              <Input
                type="number"
                value={nftPriceInDollars}
                onChange={(e) => setNftPriceInDollars(e.target.value)}
                className="mt-1"
              />
            </label>

            <label>
              <span className="text-neutral-800 dark:text-neutral-200">
                Description
              </span>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
              />
            </label>
            <div className="flex gap-x-4">
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Quantity Available
                </span>
                <Input
                  type="number"
                  value={quantityAvailable}
                  onChange={(e) => setQuantityAvailable(e.target.value)}
                  className="mt-1"
                />
              </label>
              <label className="block">
                <span className="text-neutral-800 dark:text-neutral-200">
                  Quantity Purchased
                </span>
                <Input
                  type="number"
                  value={quantityPurchased}
                  onChange={(e) => setQuantityPurchased(e.target.value)}
                  className="mt-1"
                />
              </label>
            </div>

            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Atomic Wax Id
              </span>
              <Input
                type="text"
                value={atomicWaxId}
                onChange={(e) => setAtomicWaxId(e.target.value)}
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Miata Lunc Id
              </span>
              <Input
                type="text"
                value={miataLuncId}
                onChange={(e) => setMiataLuncId(e.target.value)}
                className="mt-1"
              />
            </label>
            <label className="block">
              <span className="text-neutral-800 dark:text-neutral-200">
                Opensea Eth Bsc Id
              </span>
              <Input
                type="text"
                value={openseaEthBscId}
                onChange={(e) => setOpenseaEthBscId(e.target.value)}
                className="mt-1"
              />
            </label>
            {error && (
              <div className="text-sm text-center text-rose-500 flex justify-center items-center">{error}</div>
            )}
          </form>
        </div>

        <div className="flex justify-end items-center p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
          <Button
            className={`bg-gray-500 text-white`}
            onClick={onClose}
          >
            Close
          </Button>
          <ButtonPrimary
            onClick={onSubmit}
          >
            {type === 'edit' ? 'Edit' : 'Create'}
          </ButtonPrimary>
        </div>
      </div>
    </div>
  )
}

export default NftFormModal;