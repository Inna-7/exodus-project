import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "app/store";

const initialState = {
  waxBalance: null,
  waxAddress: null,
  waxIsLogged: false,
  anchorIsLogged: false,
}

export const LoginWalletsSlice = createSlice({
  name: "loginWallets",
  initialState,
  reducers: {
    setWax: (state, action) => {
      state.waxBalance = action.payload?.waxBalance || state.waxBalance
      state.waxAddress = action.payload?.waxAddress || state.waxAddress
    },
    setWaxIsLgged: (state) => {
      state.waxIsLogged = true;
    },
    setAnchorIsLogged: (state) => {
      state.anchorIsLogged = true;
    },
    clearWax: state => {
      state.waxBalance = initialState.waxBalance;
      state.waxAddress = initialState.waxAddress;
      state.waxIsLogged = initialState.waxIsLogged;
      state.anchorIsLogged = initialState.anchorIsLogged;
      //since if wax is out- anchor is out
    }
  },
});

export const {
  setWax,
  clearWax,
  setWaxIsLgged,
  setAnchorIsLogged
} = LoginWalletsSlice.actions;

export const selectLoginWalletsState = (state: RootState) =>
  state.loginWalletsState;

export default LoginWalletsSlice.reducer;