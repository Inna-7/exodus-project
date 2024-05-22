import React, { FC, useState, useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import ButtonPrimary from "shared/Button/ButtonPrimary";
import { Helmet } from "react-helmet";
import NcModal from "shared/NcModal/NcModal";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import QrCodeImg from "images/qr-code.png";
import metamaskImg from "images/metamask.png";
import wcwImg from "images/waxToken.png";
import anchorImage from "images/anchorWallet.png";
import terraImage from "images/terraWallet.png";
import Web3 from "web3";
import { useWallet, WalletStatus } from "@terra-money/use-wallet";
import walletconnectImg from "images/walletconnect.webp";
import walletlinkImg from "images/walletlink.webp";
import fortmaticImg from "images/fortmatic.webp";
import { User, UserService } from "UserService";
import { useLocation, useNavigate } from "react-router";
import { ethers } from 'ethers'
import {
  setWax,
  clearWax,
  setWaxIsLgged,
  setAnchorIsLogged,
  selectLoginWalletsState
} from "app/loginWalletsState/loginWalletsSlice";
import {
  selectLogState, 
  SetMetaDataLogging, 
  setMetaIsLoggedin, 
  setMetaIsLoggedOut
} from "app/LoginStateReducer";
import { setAnchorDisconnected } from "app/LoginStateReducer";
import ModalDisconnectMetaMask from "components/ModalDisconnectMetaMask";

export interface PageConnectWalletProps {
  className?: string;
}

// This enables the use of window.ethereum
declare let window: any;

const PageConnectWallet: FC<PageConnectWalletProps> = ({ className = "" }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate()
  const location = useLocation()

  const { metaIsLogged, isLogged } = useSelector(selectLogState)
  const { waxIsLogged, anchorIsLogged } = useSelector(selectLoginWalletsState)

  const [showModal, setShowModal] = useState(false);
  const [showModalMetaMask, setShowModalMetaMask] = useState(false);

  const checkLogin = () => {
    if (!isLogged) {
      localStorage.setItem("old_url", location.pathname)
      navigate("/login")
      return false
    }
    return true
  }

  //Meta Mask
  const accountChangeHandler = (account: string) => {
    // if the user changes meta mask accounts, change it here
    // Setting an address data
    dispatch(
      SetMetaDataLogging({
        address: account
      })
    )
    // Setting a balance
    getEthBalance(account)
  };


  const connectMetaMaskWallet = () => {
    if (checkLogin()) {
      console.log("connect metaaa")
      /// could move this whole section to UserService.ts
      if (window.ethereum) {
        // res[0] for fetching a first wallet
        window.ethereum
          .request({ method: "eth_requestAccounts" })
          .then((res: any) => accountChangeHandler(res[0]));
      } else {
        alert("install metamask extension!!");
      }
    }
  };

  const getEthBalance = (address: any) => {
    // Requesting balance method
    window.ethereum
      .request({
        method: 'eth_getBalance',
        params: [address, 'latest']
      })
      .then((balance: any) => {
        dispatch(
          SetMetaDataLogging({
            address: address,
            Balance: ethers.utils.formatEther(balance)
          })
        )
        dispatch(setMetaIsLoggedin())
      })
  }

  const logoutMetamask = () => {
    dispatch(setMetaIsLoggedOut())
    setShowModalMetaMask(false)
  }

  const closeMetaMaskLogoutModal = () => {
    setShowModalMetaMask(false)
  }

  const openMetaMaskLogoutModal = () => {
    setShowModalMetaMask(true)
  }

  const connectWaxCloudWallet = async () => {
    if (checkLogin() && !anchorIsLogged) {
      UserService.waxLogin().then(async res => {
        dispatch(setWax({ waxAddress: res, waxBalance: await UserService.getWaxBalance(res) }))
        dispatch(setWaxIsLgged())
      });
    }
  };

  const disconnectWaxCloudWallet = () => {
    console.log("disconnect saddd")
    dispatch(clearWax())
    UserService.logout()
  }

  const connectAnchorWallet = () => {
    if (checkLogin() && !waxIsLogged) {
      UserService.anchorConnect().then(async wallet => {
        // console.log(wallet)
        if (wallet) {
          let waxAddress = wallet?.session.auth.actor.toString();
          dispatch(setWax({
            waxAddress: waxAddress,
            waxBalance: await UserService.getWaxBalance(waxAddress)
          }))
          dispatch(setAnchorIsLogged())
        } else {
          console.error('anchor error')
        }
      })
    }
  }

  const disconnectAnchorWallet = () => {
    dispatch(clearWax()) // this clears anchor also
    dispatch(setAnchorDisconnected())
  }

  const {
    status,
    network,
    wallets,
    availableConnectTypes,
    supportFeatures,
    connect,
    disconnect,
  } = useWallet();

  const connectTerraWallet = () => {
    if (checkLogin()) {
      connect(availableConnectTypes[0]);
      console.log(status)
    }
  };

  const disConnectTerraWallet = () => {
    disconnect();
    console.log("disconnected");
  };

  const renderContent = () => {
    return (
      <form action="#">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-200">
          Scan to connect
        </h3>
        <span className="text-sm">
          Open Coinbase Wallet on your mobile phone and scan
        </span>

        <div className="p-5 border bg-white dark:bg-neutral-300 border-neutral-200 dark:border-neutral-700 rounded-xl flex items-center justify-center mt-4">
          <NcImage className="w-40" src={QrCodeImg} />
        </div>

        <div className="mt-5 space-x-3">
          <ButtonPrimary type="submit">Install app</ButtonPrimary>
          <ButtonSecondary type="button">Cancel</ButtonSecondary>
        </div>
      </form>
    );
  };

  return (
    <div
      className={`nc-PageConnectWallet ${className}`}
      data-nc-id="PageConnectWallet"
    >
      <Helmet>
        <title>Connect Wallet || Exodus</title>
      </Helmet>
      <div className="container">
        <div className="my-12 sm:lg:my-16 lg:my-24 max-w-3xl mx-auto space-y-8 sm:space-y-10">
          {/* HEADING */}
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl font-semibold">
              Connect your wallet.
            </h2>
            <span className="block mt-3 text-neutral-500 dark:text-neutral-400">
              A WAX Wallet is required for receiving purchased NFTs.
            </span>
          </div>
          <div className="w-full border-b-2 border-neutral-100 dark:border-neutral-700"></div>
          <div className="mt-10 md:mt-0 space-y-5 sm:space-y-6 md:sm:space-y-8">
            <div className="space-y-3">
              <div
                key="Metamask"
                onClick={!metaIsLogged ? connectMetaMaskWallet : openMetaMaskLogoutModal}
                typeof="button"
                tabIndex={0}
                className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
                    border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                    dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={metamaskImg}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Metamask{" "}
                    {!metaIsLogged
                      ? "(Connect)"
                      : "(Disconnect)"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div
                key="WCW"
                onClick={!waxIsLogged ? connectWaxCloudWallet : disconnectWaxCloudWallet}
                typeof="button"
                tabIndex={0}
                className={`relative rounded-xl ${!anchorIsLogged ? "hover:shadow-lg hover:bg-neutral-50" : "hover:cursor-no-drop"} border 
                    border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                    dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200`}
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={wcwImg}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Wax Cloud Wallet{" "}
                    {!waxIsLogged
                      ? "(Connect)"
                      : "(Disconnect)"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div
                key="AnchorWallet"
                onClick={!anchorIsLogged ? connectAnchorWallet : disconnectAnchorWallet}
                typeof="button"
                tabIndex={0}
                className={`relative rounded-xl ${!waxIsLogged ? "hover:shadow-lg hover:bg-neutral-50" : "hover:cursor-no-drop"} border 
                    border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                    dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200`}
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={anchorImage}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Anchor Wallet{" "}
                    {!anchorIsLogged
                      ? "(Connect)"
                      : "(Disconnect)"}
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <div
                key="TerraWallet"
                onClick={() =>
                  status === WalletStatus.WALLET_NOT_CONNECTED
                    ? connectTerraWallet()
                    : disConnectTerraWallet()
                }
                typeof="button"
                tabIndex={0}
                className="relative rounded-xl hover:shadow-lg hover:bg-neutral-50 border 
                    border-neutral-200 dark:border-neutral-700 px-3 sm:px-5 py-4 cursor-pointer flex 
                    focus:outline-none focus:shadow-outline-blue focus:border-blue-500 dark:bg-neutral-800 
                    dark:text-neutral-100 dark:hover:bg-neutral-900 dark:hover:text-neutral-200"
              >
                <div className="flex items-center w-full">
                  <NcImage
                    src={terraImage}
                    containerClassName="flex-shrink-0 w-10 h-10 sm:w-14 sm:h-14 p-2 sm:p-3 bg-white rounded-full overflow-hidden shadow-lg"
                  />
                  <div
                    className={`ml-4 sm:ml-8 font-semibold text-xl sm:text-2xl `}
                  >
                    Terra Wallet{" "}
                    {status === WalletStatus.WALLET_NOT_CONNECTED
                      ? "(Connect)"
                      : "(Disconnect)"}
                  </div>
                </div>
              </div>
            </div>

            {/* <div>
              <section>
                <pre>
                  {status === WalletStatus.WALLET_CONNECTED
                    ? JSON.stringify(
                      {
                        status,
                        network,
                        wallets,
                        supportFeatures: Array.from(supportFeatures),
                      },
                      null,
                      2
                    )
                    : null}
                </pre>
              </section>
            </div> */}

            {/* ---- */}
            <div className="pt-2 ">
              <ButtonPrimary href={"/"} className="flex-1">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M9.57 5.92993L3.5 11.9999L9.57 18.0699"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M20.5 12H3.67004"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>

                <span className="ml-2">Go Back Home</span>
              </ButtonPrimary>
            </div>
          </div>
        </div>
      </div>

      <NcModal
        renderTrigger={() => null}
        isOpenProp={showModal}
        renderContent={renderContent}
        contentExtraClass="max-w-md"
        onCloseModal={() => setShowModal(false)}
        modalTitle="Connect Wallet"
      />

      {showModalMetaMask && <ModalDisconnectMetaMask onClose={closeMetaMaskLogoutModal} onLogout={logoutMetamask} />}
    </div>
  );
};

export default PageConnectWallet;


