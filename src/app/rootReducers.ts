// import { combineReducers } from 'redux'
import user from '../app/UserReducer'
import logState from '../app/LoginStateReducer'
import mediaRunningReducer from "./mediaRunning/mediaRunning";
import loginStateReducer from "./loginState/loginSlice";
import signupStateReducer from "./signupState/signupSlice";
import nftsStateReducer from "./nftsState/nftsReducer";
import loginWalletsSlice from './loginWalletsState/loginWalletsSlice';

const rootReducers = {
  user,
  logState,
  mediaRunning: mediaRunningReducer,
  loginState: loginStateReducer,
  loginWalletsState: loginWalletsSlice,
  signupState: signupStateReducer,
  nftsState: nftsStateReducer
};

export default rootReducers;
