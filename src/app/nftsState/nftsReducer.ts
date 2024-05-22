import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { toast } from "react-toastify";
import NftsService from "./nfts.service";
import { getCurrencyResType, mintNftApiType, NftType, purchasedNftType, sendPurchaseBodyType } from "./nftsTypes";

interface INftsInitialState {
  nfts: NftType[],
  purchasedNfts: purchasedNftType[],
  ETHUSDT: number,
  BNBUSDT: number,
  WAXPUSDT: number,
  LUNCUSDT: number,
  YOCOUSDT: number
}

const initialState: INftsInitialState = {
  nfts: [],
  purchasedNfts: [],
  ETHUSDT: 0,
  BNBUSDT: 0,
  WAXPUSDT: 0,
  LUNCUSDT: 0,
  YOCOUSDT: 0,
}


export const getNfts = createAsyncThunk(
  "nftStateCheck/getNfts",
  async (_, { dispatch }) => {
    try {
      const nft = await NftsService.getNft()
      const waxPrice = nft.data.rows[0].median / 10000
      const res = await NftsService.getNftMarket()
      const nfts = res.data.data.map((row: NftType) => ({
        ...row,
        image: row.nftUrl,
        video: row.nftVideoUrl,
        price: row.nftPriceInDollars,
        waxPrice: waxPrice
      }))
      dispatch(setNfts(nfts))
    }
    catch (err) {
      console.log(err)
    }
  }
)

export const getCurrencySet = createAsyncThunk(
  "nftStateCheck/getCurrencySet",
  async (_, thunkAPI) => {
    try {
      const res = await NftsService.getCurrencySet()
      const dataObj = res.data.reduce((obj: Record<string, number>, item: getCurrencyResType) => {
        return {
          ...obj,
          [item.symbol]: item.price,
        };
      }, {});
      thunkAPI.dispatch(setETHUSDT(dataObj.ETHUSDT));
      thunkAPI.dispatch(setBNBUSDT(dataObj.BNBUSDT));
      thunkAPI.dispatch(setWAXPUSDT(dataObj.WAXPUSDT));
      thunkAPI.dispatch(setLUNCUSDT(dataObj.LUNCUSDT));
    }
    catch (err) {
      console.log(err)
    }
  }
)

export const getPurchasedNfts = createAsyncThunk(
  "nftStateCheck/getPurchasedNfts",
  async (_, { dispatch, getState }) => {
    try {
      const state = getState() as RootState
      const res = await NftsService.getPurchasedNfts(state?.logState?.token)
      dispatch(setPurchasedNfts(res.data.nfts));
    }
    catch (err) {
      console.log(err)
    }
  }
)

export const sendPurchase = createAsyncThunk(
  "nftStateCheck/sendPurchase",
  async (body: sendPurchaseBodyType, { getState }) => {
    try {
      const state = getState() as RootState
      const res = await NftsService.sendPurchase(state?.logState?.token, body)
      console.log(res)
    }
    catch (err) {
      console.log('There was an error sending transaction to bridge.')
    }
  }
)

export const sendWaxPurchase = createAsyncThunk(
  "nftStateCheck/sendPurchase",
  async (body: JSON, { getState }) => {
    try {
      const state = getState() as RootState
      const res = await NftsService.sendWaxPurchase(state?.logState?.token, body)
      console.log(res)
    }
    catch (err) {
      console.log('There was an error sending transaction to bridge.')
    }
  }
)

export const mintNftApi = createAsyncThunk(
  "nftStateCheck/mintNft",
  async ({body, isOpensea}: {body: mintNftApiType, isOpensea: boolean}, { getState }) => {
    try {
      const state = getState() as RootState
      const res = await NftsService.mintNft(state?.logState?.token, body, isOpensea)
      if(!res.data.success){
        toast.error(res.data.message);
        return;
      }
      toast.success('Successfully minted!');
    }
    catch (err: any) {
      toast.error('There was a problem minting: ' + err.message)
    }
  }
)

export const NftsStateSlice = createSlice({
  name: "nftStateCheck",
  initialState,
  reducers: {
    setNfts: (state, action) => {
      state.nfts = action.payload
    },
    setPurchasedNfts: (state, action) => {
      state.purchasedNfts = action.payload
    },
    setETHUSDT: (state, action) => {
      state.ETHUSDT = action.payload
    },
    setBNBUSDT: (state, action) => {
      state.BNBUSDT = action.payload
    },
    setWAXPUSDT: (state, action) => {
      state.WAXPUSDT = action.payload
    },
    setLUNCUSDT: (state, action) => {
      state.LUNCUSDT = action.payload
    },
    setYOCOUSDT: (state, action) => {
      state.YOCOUSDT = action.payload
    }
  },
});


export const {
  setNfts,
  setPurchasedNfts,
  setETHUSDT,
  setBNBUSDT,
  setWAXPUSDT,
  setLUNCUSDT,
  setYOCOUSDT
} = NftsStateSlice.actions;

export const selectNftState = (state: RootState) =>
  state.nftsState;

export default NftsStateSlice.reducer;