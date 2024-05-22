import { useAppSelector } from "app/hooks";
import { selectLogState } from "app/LoginStateReducer";
import { FC } from "react";
import Button from "shared/Button/Button";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonClose from "shared/ButtonClose/ButtonClose";

interface Props {
  onClose: () => void,
  onLogout: () => void
}

const ModalDisconnectMetaMask: FC<Props> = ({ onClose, onLogout }) => {

  const { metaAddress, metaBalance } = useAppSelector(selectLogState)

  return (
    <div className="fixed z-[60] flex justify-center items-center bg-black bg-opacity-50 top-0 left-0 right-0 w-full p-4 h-full">
      <div className="relative flex justify-center items-center h-full md:h-auto ">
        <div className="relative bg-white rounded-lg shadow dark:bg-gray-700">
          <div className="flex items-start justify-between p-4 border-b rounded-t dark:border-gray-600">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Metamask Wallet Information
            </h3>
            <ButtonClose onClick={onClose} />
          </div>
          <div className="p-6 space-y-2">
            <p className="text-base break-all leading-relaxed text-gray-600 dark:text-gray-400">
              Address: {metaAddress}
            </p>
            <p className="text-base break-all leading-relaxed text-gray-600 dark:text-gray-400">
              Balance: {metaBalance}
            </p>
          </div>
          <div className="flex justify-end items-center p-4 space-x-2 border-t border-gray-200 rounded-b dark:border-gray-600">
            <ButtonPrimary
              type="submit"
              onClick={onLogout}
            >
              Logout MetaMask
            </ButtonPrimary>
            <Button
              className={`bg-gray-600 text-white`}
              onClick={onClose}
            >
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ModalDisconnectMetaMask;