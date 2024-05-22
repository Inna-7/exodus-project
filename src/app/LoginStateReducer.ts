import { createSlice } from '@reduxjs/toolkit'
import { RootState } from './store'

const initialState = {
  isLogged: false,
  token: 'null',

  metaIsLogged: false,
  metaAddress: '',
  metaBalance: null,

  waxConnected: false,
  anchorConnected: false,
}

export const LoginState = createSlice({
  name: 'logState',
  initialState,
  reducers: {
    //user
    SetPlayerDataLogging: (state, action) => {
      state.token = action.payload?.token
      state.isLogged = action.payload?.isLogged
    },
    setIsLoggedOut: state => {
      state.isLogged = false
      state.token = ''
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },

    //MetaMask
    SetMetaDataLogging: (state, action) => {
      state.metaAddress = action.payload.address
      state.metaBalance = action.payload.Balance
    },
    setMetaIsLoggedin: state => {
      state.metaIsLogged = true
    },
    setMetaIsLoggedOut: state => {
      state.metaAddress = ''
      state.metaBalance = null
      state.metaIsLogged = false
    },


    setWaxConnected: (state) => {
      state.waxConnected = true;
    },
    setAnchorConnected: (state) => {
      state.anchorConnected = true;
    },
    setWaxDisconnected: (state) => {
      state.waxConnected = false;
    },
    setAnchorDisconnected: (state) => {
      state.anchorConnected = false;
    },
    clearLoginState: () => initialState,
  }
})

// Action creators are generated for each case reducer function
export const {
  SetPlayerDataLogging,
  setIsLoggedOut,
  setToken,

  SetMetaDataLogging,
  setMetaIsLoggedin,
  setMetaIsLoggedOut,

  setWaxConnected,
  setAnchorConnected,
  setWaxDisconnected,
  setAnchorDisconnected,
  clearLoginState
} = LoginState.actions

export const selectLogState = (state: RootState) =>
  state.logState;

export default LoginState.reducer
