export interface NftType {
  id: string,
  name: string,
  description: string,
  nftUrl: string,
  nftVideoUrl: string,
  nftPriceInDollars: number,
  quantityAvailable: number,
  quantityPurchased: number,
  atomicWaxId: string,
  miataLuncId: string,
  openseaEthBscId: string,
  isActive: boolean,
  createdAt: string,
  updatedAt: string,
  image: string,
  video: string,
  price: number,
  waxPrice: number,
}

export interface purchasedNftType {
  id: string,
  paidInToken: number,
  paymentToken: string,
  transactionHash: string,
  isMinted: boolean,
  nftDetails: any,
  isPaymentVerifiedByMiners: boolean,
}

export interface sendPurchaseBodyType {
  transaction_hash: string,
  payment_from: string,
  payment_to: string,
  amount: string,
  chain_symbol: string,
  token_symbol: string,
  nftKey: string
}

export interface mintNftApiType {
  nftId: string,
  nftReceiver: string | null
}

export interface createNftMarketTypes {
  id?: string,
  name: string,
  description: string,
  nftUrl: string,
  nftVideoUrl: string,
  nftPriceInDollars: number,
  quantityAvailable: number,
  quantityPurchased: number,
  atomicWaxId: string,
  miataLuncId: string,
  openseaEthBscId: string,
}

export interface getCurrencyResType {
  symbol: string,
  price: string
}


export interface transactionForWax {
  receiver: string,
  act: {
    data: {
      quantity: string,
      from: string,
      to: string
    }
  },
  trx_id: string,
  block_time: string
}

export interface transactionForEth {
  hash: string,
  blockHash: string,
  from: string,
  to: string,
  gas: string,
  gasPrice: string,
  gasUsed: string,
}

export interface transactionForLunc {
  tx: {
    body: {
      messages: {
        to_address: string;
        from_address: string;
      }[];
    }
  };
  txhash: string,
  gas_used: string,
  timestamp: string,
  gas_wanted: string
}

export interface transactionAdminType {
  id: string,
  paidInToken: number,
  paidInDollars: number,
  transactionHash: string,
  sender: string,
  receiver: string,
  isMinted: boolean,
  isPaymentVerifiedByMiners: boolean,
  createdAt: string,
  updatedAt: string,
}