import React, { FC } from "react";
import { Link } from "react-router-dom";
import Avatar from "shared/Avatar/Avatar";
import NcImage from "shared/NcImage/NcImage";
import { nftsImgs } from "contains/fakeData";
import ItemTypeImageIcon from "./ItemTypeImageIcon";
import LikeButton from "./LikeButton";
import Prices from "./Prices";
import { ClockIcon } from "@heroicons/react/outline";
import ItemTypeVideoIcon from "./ItemTypeVideoIcon";
import { useAppSelector } from "app/hooks";
import VideoForNft_V2 from "./VideoForNft_V2";
import { selectNftState } from "app/nftsState/nftsReducer";
import { useConnectedWallet } from '@terra-money/wallet-provider';
import { selectLogState } from "app/LoginStateReducer";
import { selectLoginWalletsState } from "app/loginWalletsState/loginWalletsSlice";

export interface CardNFT_V2Props {
  className?: string;
  isLiked?: boolean;
  name?: string;
  src?: string;
  price: number,
  type?: string,
  id?: string
}

const CardNFT_V2: FC<CardNFT_V2Props> = (
  {
    className = "",
    isLiked,
    name = `CloneF #${Math.floor(Math.random() * 1000) + 1000}`,
    src = nftsImgs[Math.floor(Math.random() * nftsImgs.length)],
    price,
    type = "image",
    id
  }
) => {
  const { ETHUSDT, BNBUSDT, WAXPUSDT, LUNCUSDT, YOCOUSDT } = useAppSelector(selectNftState)
  const { metaIsLogged } = useAppSelector(selectLogState)
  const { waxIsLogged, anchorIsLogged } = useAppSelector(selectLoginWalletsState)

  const connectedWallet = useConnectedWallet();

  const values = [
    {
      id: 1,
      price: (price / WAXPUSDT).toFixed(2) + " WAX",
      disabled: !waxIsLogged && !anchorIsLogged,
    },
    {
      id: 2,
      price: (price / BNBUSDT).toFixed(6) + " BNB",
      disabled: !metaIsLogged,
    },
    {
      id: 3,
      price: (price / ETHUSDT).toFixed(8) + " ETH",
      disabled: !metaIsLogged,
    },
    // {
    //   id: 4,
    //   price: (price / YOCOUSDT + (price / YOCOUSDT) * 0.04).toFixed(0) + " YoCoin",
    //   disabled: !metaIsLogged,
    // },
    {
      id: 5,
      price: (price / LUNCUSDT).toFixed(0) + " LUNC",
      disabled: !connectedWallet,
    }
  ]

  const renderAvatars = () => {
    return (
      <div className="flex -space-x-1 ">
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
        <Avatar
          containerClassName="ring-2 ring-white dark:ring-neutral-900"
          sizeClass="h-5 w-5 text-sm"
        />
      </div>
    );
  };

  return (
    <div
      className={`nc-CardNFT_V2 relative flex flex-col group !border-0 [ nc-box-has-hover nc-dark-box-bg-has-hover ] ${className}`}
      data-nc-id="CardNFT_V2"
    >
      <div className="relative flex-shrink-0 ">
        {type === "video" ? (
          <VideoForNft_V2 src={src} />
        ) : (
          <div>
            <NcImage
              containerClassName="flex aspect-w-11 aspect-h-12 w-full h-0 rounded-3xl overflow-hidden z-0"
              src={src}
              className="object-cover w-full h-full group-hover:scale-[1.03] transition-transform duration-300 ease-in-out will-change-transform"
            />
          </div>
        )}
        {type === "video" ? (
          <ItemTypeVideoIcon className="absolute top-3 left-3 !w-9 !h-9" />
        ) : (
          <ItemTypeImageIcon className="absolute top-3 left-3 !w-9 !h-9" />
        )}
        {/* <LikeButton
          liked={isLiked}
          className="absolute top-3 right-3 z-10 !h-9"
        /> */}
        <div className="absolute top-3 inset-x-3 flex"></div>
      </div>

      <div className="p-4 py-5 space-y-3">
        {/* <div className="flex justify-between">
          {renderAvatars()}
          <span className="text-neutral-700 dark:text-neutral-400 text-xs">
            {Math.floor(Math.random() * 90) + 10} in stock
          </span>
        </div> */}
        <h2 className={`text-lg font-medium truncate`}>
          {name}
        </h2>

        {/* <div className="w-2d4 w-full border-b border-neutral-100 dark:border-neutral-700"></div> */}

        <div>
          {values.map(item => <Prices
            key={item.id}
            className={`pt-1 ${item.disabled && 'opacity-80'}`}
            labelTextClassName="hidden"
            buttonTextClass={`${item.disabled && 'text-gray-500'}`}
            contentClass={`py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold justify-center ${item.disabled ? 'border-gray-500' : 'border-green-500'}`}
            price={item.price}
          />)}
          {/* <div className="flex justify-end items-center mt-[5px] text-sm text-neutral-500 dark:text-neutral-400">
            <ClockIcon className="w-4 h-4" />
            <span className="ml-1 mt-0.5">
              {Math.floor(Math.random() * 20) + 1} hours left
            </span>
          </div> */}
        </div>
      </div>

      <Link to={`/nft-detailt/${id}`} className="absolute inset-0"></Link>
    </div>
  );
};

export default CardNFT_V2;
