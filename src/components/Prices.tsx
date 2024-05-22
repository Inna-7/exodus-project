import React, { FC } from "react";

export interface PricesProps {
  className?: string;
  price?: string;
  contentClass?: string;
  labelTextClassName?: string;
  buttonTextClass?: string;
  labelText?: string;
  onClick?: (() => void) | undefined
}

const Prices: FC<PricesProps> = ({
  className = "pt-3",
  price = "1.000 ETH",
  contentClass = "py-1.5 md:py-2 px-2.5 md:px-3.5 text-sm sm:text-base font-semibold border-green-500",
  labelTextClassName = "bg-white",
  buttonTextClass = "",
  labelText = Math.random() > 0.4 ? "Price" : "Current Bid",
  onClick,
}) => {
  return (
    <div className={`${className}`} onClick={onClick}>
      <div
        className={`flex items-baseline border-2 text-green-500 rounded-lg relative ${contentClass}`}
      >
        <span
          className={`block absolute font-normal bottom-full translate-y-1 p-1 -mx-1 text-xs text-neutral-500 dark:text-neutral-400 ${labelTextClassName}`}
        >
          {labelText}
        </span>
        <span className={`!leading-none ${buttonTextClass}`}>{price}</span>
      </div>
    </div>
  );
};

export default Prices;
