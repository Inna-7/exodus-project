import ButtonClose from "shared/ButtonClose/ButtonClose";
import { FC } from "react";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import Button from "shared/Button/Button";

interface Props{
  onClose: () => void;
  name: string;
  onDelete: () => void;
}

const NftDeleteModal: FC<Props> = ({ onClose, name, onDelete }) => {
  return (
    <div className="fixed z-[60] flex justify-center items-center bg-black bg-opacity-50 top-0 left-0 right-0 w-full p-4 h-full">
      <div className="relative flex justify-center items-center max-w-[500px] h-full md:h-auto ">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Delete NFT
            </h3>
            <ButtonClose onClick={onClose} />
          </div>
          <div className="p-6 space-y-2">
            <p className="text-base text-gray-600 dark:text-white">
              Are you sure you want to delete <span className="font-bold">{name}</span>?
            </p>

          </div>
          <div className="flex justify-end items-center p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <Button
              className={`bg-gray-500 text-white`}
              onClick={onClose}
            >
              No
            </Button>
            <Button
              className={`bg-red-500 text-white`}
              onClick={onDelete}
            >
              Yes
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NftDeleteModal;