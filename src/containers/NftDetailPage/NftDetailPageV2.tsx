import React, { FC, useEffect, useMemo, useState } from "react";
import Avatar from "shared/Avatar/Avatar";
import Badge from "shared/Badge/Badge";
import ButtonPrimary from "shared/Button/ButtonPrimary";
import ButtonSecondary from "shared/Button/ButtonSecondary";
import NcImage from "shared/NcImage/NcImage";
import LikeSaveBtns from "../NftDetailPage/LikeSaveBtns";
import BackgroundSection from "components/BackgroundSection/BackgroundSection";
import SectionSliderCategories from "components/SectionSliderCategories/SectionSliderCategories";
import VerifyIcon from "components/VerifyIcon";
import { nftsLargeImgs, personNames } from "contains/fakeData";
import TimeCountDown from "../NftDetailPage/TimeCountDown";
import TabDetail from "../NftDetailPage/TabDetail";
import collectionPng from "images/nfts/collection.png";
import ItemTypeVideoIcon from "components/ItemTypeVideoIcon";
import LikeButton from "components/LikeButton";
import AccordionInfo from "../NftDetailPage/AccordionInfo";
import SectionBecomeAnAuthor from "components/SectionBecomeAnAuthor/SectionBecomeAnAuthor";
import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "app/hooks";
import { getNfts, getCurrencySet, selectNftState, sendPurchase, sendWaxPurchase } from "app/nftsState/nftsReducer";
import VideoForNft_V2 from "components/VideoForNft_V2";
import Prices from "components/Prices";
import { useConnectedWallet, useLCDClient, UserDenied } from '@terra-money/wallet-provider';
import { Fee, MsgSend, Coins } from '@terra-money/terra.js';
import { selectLogState } from "app/LoginStateReducer";
import Web3 from 'web3';
import yocoinAbi from 'abis/yocoin.json';
import { selectLoginWalletsState } from "app/loginWalletsState/loginWalletsSlice";
import { toast } from "react-toastify";
import { User, UserService } from "UserService";
import { AnyAction } from "anchor-link";
import ItemTypeImageIcon from "components/ItemTypeImageIcon";
import { NftType } from "app/nftsState/nftsTypes";

export interface NftDetailPageProps {
  className?: string;
  isPreviewMode?: boolean;
}

const CLIENT_ADDRESS = 'terra1euyeayxsvfpqx460gwytnhcg5qwcnw6fh7kg6w';

const NftDetailPage: FC<NftDetailPageProps> = ({
  className = "",
  isPreviewMode,
}) => {
  const yocoinabi: any = yocoinAbi
  const { id } = useParams()
  const dispatch = useAppDispatch()
  const { nfts, ETHUSDT, BNBUSDT, WAXPUSDT, LUNCUSDT, YOCOUSDT } = useAppSelector(selectNftState)
  const { metaIsLogged } = useAppSelector(selectLogState)
  const { waxIsLogged, anchorIsLogged } = useAppSelector(selectLoginWalletsState)
  const connectedWallet = useConnectedWallet();
  const [selectedChain, setSelectedChain] = useState<any>(null);
  const lcd = useLCDClient(
    // { isClassic: true }
  );

  const nft: NftType = useMemo(() => {
    return nfts.find((item: NftType) => item.id == id) || {} as NftType
  }, [nfts, id])

  const values = [
    {
      id: 1,
      price: (nft?.price / WAXPUSDT).toFixed(2) + " WAX",
      disabled: !waxIsLogged && !anchorIsLogged,
      onClick: () => buyWithWax()
    },
    {
      id: 2,
      price: (nft?.price / BNBUSDT).toFixed(6) + " BNB",
      disabled: !metaIsLogged,
      onClick: () => buyWithBNB()
    },
    {
      id: 3,
      price: (nft?.price / ETHUSDT).toFixed(8) + " ETH",
      disabled: !metaIsLogged,
      onClick: () => buyWithETH()
    },
    // {
    //   id: 4,
    //   price: (nft?.price / YOCOUSDT + (nft?.price / YOCOUSDT) * 0.04).toFixed(0) + " YoCoin",
    //   disabled: !metaIsLogged,
    //   onClick: () => buyWithYoCoin()
    // },
    {
      id: 5,
      price: (nft?.price / LUNCUSDT).toFixed(0) + " LUNC",
      disabled: !connectedWallet,
      onClick: () => purchaseWithLunc()
    }
  ]

  useEffect(() => {
    if (!nfts.length) {
      dispatch(getNfts())
    }

    async function runAsync() {
      if (window.ethereum) {
        const web3 = new Web3(Web3.givenProvider);
        let chainId: any = await web3.eth.net.getId();

        setSelectedChain(chainId);
      }
    }
    runAsync();

    if (LUNCUSDT === 0) {
      dispatch(getCurrencySet())
    }

    const interval = setInterval(() => {
      dispatch(getCurrencySet())
    }, 60000);

    return () => clearInterval(interval);
  }, [LUNCUSDT]);

  if (typeof window.ethereum !== 'undefined' && window.ethereum !== null) {
    window.ethereum.on('networkChanged', function (chainId: any) {
      setSelectedChain(chainId);
    });
  }

  const buyWithETH = async () => {
    if (parseInt(selectedChain, 10) !== 11155111) {
      // switch to eth
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(11155111) }],
        });

        purchaseUsingDefaultCoin((nft.price / ETHUSDT).toFixed(8), 'ETH', 'ETH');
      } catch (error) {
        console.error(error);
      }
    } else {
      purchaseUsingDefaultCoin((nft.price / ETHUSDT).toFixed(8), 'ETH', 'ETH');
    }
  }

  const buyWithWax = async () => {
    if (!nft.atomicWaxId) {
      toast.warn('Action failed. Please try with another value.');
      return;
    }
    if (waxIsLogged) {
      buyWithWaxCloud()
      return;
    }
    else if (anchorIsLogged) {
      buyWithAnchor()
      return;
    }
  }

  const buyWithWaxCloud = () => {
    // for the wax cloud wallet
    try {
      User.wax!
        .api.transact(
          {
            actions: [
              {
                account: 'eosio.token',
                name: 'transfer',
                authorization: [
                  {
                    actor: User.wax?.userAccount || '',
                    permission: 'active'
                  }
                ],
                data: {
                  from: User.wax?.userAccount || '',
                  to: 'universegame',
                  quantity: `${Math.floor(
                    nft.price / nft.waxPrice
                  ).toFixed(8)} WAX`,
                  memo: `purchase%${nft.atomicWaxId}`
                }
              }
            ]
          },
          {
            blocksBehind: 3,
            expireSeconds: 30
          }
        )
        .then(response => {
          if (response) {
            try {
              const body: any = {
                transaction_hash: response,
                // wallet: 'WCW',
                // nftKey: nft.key
              }
              dispatch(sendWaxPurchase(body))
              toast.success('Purchase Successful!');
            } catch (ex: any) {
              console.log("WAX-ANCHOR Error: ", ex);
              toast.error('Error: ' + ex.message);
            }
            toast.success('Purchase was successful!');
          } else {
            toast.error('Something went wrong.');
          }
        })
    } catch (err) {
      console.log(err)
      toast.error('Connect your Wax Wallet First');
    }
  }

  const buyWithAnchor = () => {
    // for the anchor
    const action: AnyAction = {
      account: 'eosio.token',
      name: 'transfer',
      authorization: [{ actor: User.anchorSession?.auth?.actor.toString() || '', permission: 'active' }],
      data: {
        from: User.anchorSession?.auth.actor.toString(),
        to: 'universegame',
        quantity: `${Math.floor(
          nft.price / nft.waxPrice
        ).toFixed(8)} WAX`,
        memo: `purchase%${nft.atomicWaxId}`,
      },
    }
    console.log(action)
    User.anchorSession?.transact({ action }).then((transaction) => {
      console.log("transaction of.. umm.. anchor.. ")
      console.log(transaction)
      // need to verify WAX purchases from the backend -- the nft is directly minted to users wax account
      try {
        const body: any = {
          transaction_hash: transaction.payload.tx,
          // chain_symbol: 'EOS',
          // token_symbol: 'WAX',
          // wallet: 'ANCHOR',
          // nftKey: nft.key
        }
        dispatch(sendWaxPurchase(body))
        toast.success('Purchase Successful!');
      } catch (ex: any) {
        console.log("WAX-ANCHOR Error: ", ex);
        toast.error('Error: ' + ex.message);
      }
    }).catch(e => {
      console.error(e)
    })
  }

  const buyWithBNB = async () => {
    if (parseInt(selectedChain, 10) !== 11155111) {
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: Web3.utils.toHex(11155111) }],
        });

        purchaseUsingDefaultCoin((nft.price / BNBUSDT).toFixed(6), 'BSC', 'BNB');
      } catch (error: any) {
        toast.error('Error: ' + error.message);
        console.error(error);
      }
    } else {
      purchaseUsingDefaultCoin((nft.price / BNBUSDT).toFixed(6), 'BSC', 'BNB');
    }
  }

  // const buyWithYoCoin = async () => {
  //   if (parseInt(selectedChain, 10) !== 5) {
  //     try {
  //       await window.ethereum.request({
  //         method: 'wallet_switchEthereumChain',
  //         params: [{ chainId: Web3.utils.toHex(5) }],
  //       });

  //       purchaseUsingYoCoin();
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   } else {
  //     purchaseUsingYoCoin();
  //   }
  // }

  // const purchaseUsingYoCoin = async () => {
  //   const price = (nft.price / YOCOUSDT + (nft.price / YOCOUSDT) * 0.04).toFixed(0)
  //   const { ethereum } = window;
  //   let accounts = await ethereum.request({ method: 'eth_requestAccounts' });
  //   let tokenAddress = '0xdd17629d05e068a9d118ee35d11101d4140d0586';
  //   let toAddress = '0x40658073216131baE1ce2fC9301B4D29D925621F';

  //   let web3 = new Web3(Web3.givenProvider);
  //   // @ts-ignore
  //   let contractInstance = new web3.eth.Contract(yocoinAbi, tokenAddress);
  //   let gasAmount = await getGasAmountForContractCall(accounts[0], toAddress, price.toString(), tokenAddress);

  //   try {
  //     const res = await contractInstance.methods.transfer(toAddress, web3.utils.toHex(+price * 1000000000)).send({ gas: web3.utils.toHex(gasAmount), from: accounts[0] });
  //     // sendPurchaseToApi(res.transactionHash, res.from, toAddress, price, 'BSC', 'YOCO', nft.key);
  //     const body = {
  //       transaction_hash: res.transactionHash,
  //       payment_from: res.from,
  //       payment_to: toAddress,
  //       amount: price,
  //       chain_symbol: 'BSC',
  //       token_symbol: 'YOCO',
  //       // nftKey: nft.key
  //     }

  //     dispatch(sendPurchase(body))
  //     toast.success('Purchase Successful!');
  //   } catch (ex: any) {
  //     console.log("YoCoin Error: ", ex);
  //     toast.error('Error: ' + ex.message);
  //   }
  // };

  // const getGasAmountForContractCall = async (fromAddress: string, toAddress: string, amount: string, contractAddress: string) => {
  //   try {
  //     let web3 = new Web3(Web3.givenProvider);
  //     const contract = new web3.eth.Contract(yocoinabi, contractAddress);
  //     let gasAmount = await contract.methods.transfer(toAddress, web3.utils.toHex(+amount * 1000000000)).estimateGas({ from: fromAddress });
  //     return gasAmount;
  //   } catch (ex) {
  //     return 150000;
  //   }
  // }

  // This is a transfer that works for both ETH and BNB
  const purchaseUsingDefaultCoin = async (price: string, networkSymbol: string, tokenSymbol: string) => {
    if (!window.ethereum) {
      alert('MetaMask is not installed.  Please install it.');
      return false;
    }

    let merchantAddress = '0x40658073216131baE1ce2fC9301B4D29D925621F';
    let web3 = new Web3(Web3.givenProvider);
    let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
    let strWeiPrice = Web3.utils.toHex(Web3.utils.toWei(String(price), 'ether'));
    let gasAmount = await getGasAmount(String(accounts[0]), merchantAddress, price);
    console.log('Gas required for transaction: ' + gasAmount);

    let transactionParameters = {
      to: merchantAddress,
      from: String(accounts[0]),
      value: strWeiPrice,
      gas: String(gasAmount)
    };

    try {
      const txHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [transactionParameters]
      });
      console.log(txHash);
      toast.success('Transaction successful!');
      // sendPurchaseToApi(txHash, String(accounts[0]), merchantAddress, price, networkSymbol, tokenSymbol, nft.key);
      const body = {
        transaction_hash: txHash,
        payment_from: String(accounts[0]),
        payment_to: merchantAddress,
        amount: price,
        chain_symbol: networkSymbol,
        token_symbol: tokenSymbol,
        nftKey: nft.id
      }

      dispatch(sendPurchase(body))
    } catch (ex: any) {
      toast.error('Error: ' + ex.message);
    }
  };

  const getGasAmount = async (fromAddress: string, toAddress: string, amount: string) => {
    try {
      let web3 = new Web3(Web3.givenProvider);

      const gasAmount = await web3.eth.estimateGas({
        to: toAddress,
        from: fromAddress,
        value: web3.utils.toWei(`${amount}`, 'ether'),
      });
      return gasAmount;
    } catch (ex) {
      return '25000';
    }
  };

  const purchaseWithLunc = async () => {
    const luncAmount: string = (nft.price / LUNCUSDT).toFixed(0)

    if (!connectedWallet) {
      return;
    }

    // if (!connectedWallet.network.chainID.startsWith('columbus')) {
    //   alert(`You are not using Terra Classic, please switch to Terra Classic.`);
    //   return;
    // }

    const gasPrices = await (
      await fetch("https://fcd.terra.dev/v1/txs/gas_prices", {
        redirect: "follow",
      })
    ).json();

    const taxRate = await (
      await fetch("https://lcd.terra.dev/terra/treasury/v1beta1/tax_rate", {
        redirect: "follow",
      })
    ).json();

    const gasPricesCoins = new Coins(gasPrices);
    console.log(connectedWallet);

    try {
      let priceInUluna: number = parseInt(luncAmount, 10) * 1000000;
      let burnFee = Math.floor((parseInt(String(priceInUluna), 10) * taxRate['tax_rate']) * 1.1);
      let gasAdjustment = 2.5;
      let msg = new MsgSend(connectedWallet.walletAddress, CLIENT_ADDRESS, { uluna: priceInUluna });

      // get the signer data for the gas estimation
      const account = await lcd.auth.accountInfo(connectedWallet.walletAddress);
      console.log(`Account: ${account}`);

      const signerDataArray = [{
        address: connectedWallet.walletAddress,
        publicKey: account.getPublicKey(),
        sequenceNumber: account.getSequenceNumber()
      }];
      console.log(`Signer Data: ${signerDataArray}`);

      // attempt to get the gas needed for this transaction
      let txFee = await lcd.tx.estimateFee(signerDataArray, { msgs: [msg], gasPrices: gasPricesCoins, gasAdjustment: gasAdjustment, feeDenoms: ['uluna'] });

      let transactionMsg = {
        fee: new Fee(txFee.gas_limit, { uluna: burnFee }),
        msgs: [msg],
        // isClassic: true
      };

      console.log(`Transaction: ${transactionMsg}`);

      console.log('Attempting LUNC transfer');
      try {
        const tx: any = await connectedWallet.post(transactionMsg);
        toast.success('Transaction successful!' + tx.result.txhash);

        const body = {
          transaction_hash: tx.result.txhash,
          payment_from: connectedWallet.walletAddress,
          payment_to: tx.msgs[0].to_address,
          amount: luncAmount,
          chain_symbol: 'ATOM',
          token_symbol: 'LUNC',
          nftKey: nft.id
        }

        dispatch(sendPurchase(body))
      } catch (ex: any) {
        toast.error('Error: ' + ex.message);
      }
      // *********************************************************
    } catch (error: any) {
      if (error instanceof UserDenied) {
        toast.error('Transaction was denied by user.');
      } else {
        toast.error('Error: ' + error.message);
      }
    }
  }

  const renderSection1 = () => {
    return (
      <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
        {/* ---------- 1 ----------  */}
        <div className="pb-9 space-y-5">
          {/* <div className="flex justify-between items-center">
            <Badge name="Virtual Worlds" color="green" />
            <LikeSaveBtns />
          </div> */}
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-semibold">
            {nft?.name}
          </h2>

          {/* ---------- 4 ----------  */}
          {/* <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-8 text-sm">
            <div className="flex items-center ">
              <Avatar sizeClass="h-9 w-9" radius="rounded-full" />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Creator</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{personNames[1]}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
            <div className="hidden sm:block h-6 border-l border-neutral-200 dark:border-neutral-700"></div>
            <div className="flex items-center">
              <Avatar
                imgUrl={collectionPng}
                sizeClass="h-9 w-9"
                radius="rounded-full"
              />
              <span className="ml-2.5 text-neutral-500 dark:text-neutral-400 flex flex-col">
                <span className="text-sm">Collection</span>
                <span className="text-neutral-900 dark:text-neutral-200 font-medium flex items-center">
                  <span>{"The Moon Ape"}</span>
                  <VerifyIcon iconClass="w-4 h-4" />
                </span>
              </span>
            </div>
          </div> */}
        </div>

        {/* ---------- 6 ----------  */}
        {/* <div className="py-9">
          <TimeCountDown />
        </div> */}

        {/* ---------- 7 ----------  */}
        {/* PRICE */}
        <div className="pb-9 pt-4">
          <div className="flex flex-col">
            {values.map(item => <Prices
              key={item.id}
              className={`mt-2 ${item.disabled ? 'cursor-no-drop opacity-80' : 'cursor-pointer'}`}
              labelTextClassName="hidden"
              buttonTextClass={`text-xl ${item.disabled && 'text-gray-500'}`}
              contentClass={`p-2.5 text-sm sm:text-base font-semibold justify-center ${item.disabled ? 'border-gray-500' : 'border-green-500 hover:bg-green-500 hover:text-white'}`}
              price={item.price}
              onClick={!item.disabled ? item.onClick : undefined}
            />)}

            {/* <span className="text-sm text-end mt-3 text-neutral-500 dark:text-neutral-400">
              [96 in stock]
            </span> */}

            {!metaIsLogged && !waxIsLogged && !anchorIsLogged && !connectedWallet && (
              <span className="text-center mt-3 text-red-500 text-lg">
                Connect any wallet to Buy this NFT
              </span>
            )}
          </div>

          <div className="mt-8 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <ButtonPrimary href={"/connect-wallet"} className="flex-1">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18.04 13.55C17.62 13.96 17.38 14.55 17.44 15.18C17.53 16.26 18.52 17.05 19.6 17.05H21.5V18.24C21.5 20.31 19.81 22 17.74 22H6.26C4.19 22 2.5 20.31 2.5 18.24V11.51C2.5 9.44001 4.19 7.75 6.26 7.75H17.74C19.81 7.75 21.5 9.44001 21.5 11.51V12.95H19.48C18.92 12.95 18.41 13.17 18.04 13.55Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M2.5 12.4101V7.8401C2.5 6.6501 3.23 5.59006 4.34 5.17006L12.28 2.17006C13.52 1.70006 14.85 2.62009 14.85 3.95009V7.75008"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M22.5588 13.9702V16.0302C22.5588 16.5802 22.1188 17.0302 21.5588 17.0502H19.5988C18.5188 17.0502 17.5288 16.2602 17.4388 15.1802C17.3788 14.5502 17.6188 13.9602 18.0388 13.5502C18.4088 13.1702 18.9188 12.9502 19.4788 12.9502H21.5588C22.1188 12.9702 22.5588 13.4202 22.5588 13.9702Z"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M7 12H14"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>

              <span className="ml-2.5">Connect Wallet</span>
            </ButtonPrimary>
          </div>
        </div>

        {/* ---------- 9 ----------  */}
        <div className="pt-9">
          {/* <TabDetail /> */}
        </div>
      </div>
    );
  };

  return (
    <div
      className={`nc-NftDetailPage  ${className}`}
      data-nc-id="NftDetailPage"
    >
      {/* MAIn */}
      <main className="container mt-11 mb-20 flex ">
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-14">
          {/* CONTENT */}
          <div className="space-y-8 lg:space-y-10">
            {/* HEADING */}
            <div className="relative">
              {nft?.video ? (
                <VideoForNft_V2 src={nft?.video} />
              ) : (
                <div>
                  <NcImage
                    containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
                    src={nft?.image}
                    className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
                  />
                </div>
              )}
              {/* META TYPE */}
              {nft?.video ? (
                <ItemTypeVideoIcon className="absolute top-3 left-3 !w-9 !h-9" />
              ) : (
                <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
              )}

              {/* META FAVORITES */}
              {/* <LikeButton className="absolute right-3 top-3 " /> */}
            </div>

            <AccordionInfo description={nft?.description} />
          </div>

          {/* SIDEBAR */}
          <div className="pt-10 lg:pt-0 xl:pl-10 border-t-2 border-neutral-200 dark:border-neutral-700 lg:border-t-0">
            {renderSection1()}
          </div>
        </div>
      </main>

      {/* OTHER SECTION */}
      {/* {!isPreviewMode && (
        <div className="container py-24 lg:py-32">
          <div className="relative py-24 lg:py-28">
            <BackgroundSection />
            <SectionSliderCategories />
          </div>

          <SectionBecomeAnAuthor className="pt-24 lg:pt-32" />
        </div>
      )} */}
    </div>
  );
};

export default NftDetailPage;
