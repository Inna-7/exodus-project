import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { RootState } from "app/store";
import { LoginUserType } from "./loginTypes";
import LoginService from "./login.service";
import { setToken, SetPlayerDataLogging } from 'app/LoginStateReducer';
import { setUserData } from "app/UserReducer";
import { disconnectUser } from "utils/disconnectUser";

const initialState = {
  username: '',
  password: '',
  error: '',
}

export const loginUser = createAsyncThunk(
  "login/loginUser",
  async ({ userCred, navigate }: LoginUserType, thunkAPI) => {
    try {
      const res = await LoginService.loginUser(userCred)
      await thunkAPI.dispatch(getAuthorizedUser({token: res.data.token}))
      thunkAPI.dispatch(setClearLoginState())
      const old_url = localStorage.old_url
      if (old_url) {
        localStorage.removeItem("old_url")
        navigate(old_url)
      }
      else {
        navigate('/')
      }
    }
    catch (err: any) {
      thunkAPI.dispatch(setLoginError(err?.response?.data?.message || ''))
      thunkAPI.dispatch(setToken(err?.response?.data?.token || 'null'))
      console.error(err.message)
    }
  }
)

export const getAuthorizedUser = createAsyncThunk(
  "login/getAuthorizedUser",
  async ({token, disconnect}:{token: string, disconnect?: any}, thunkAPI) => {
    try {
      const res = await LoginService.getAuthorizedUser(token)
      const userData = res.data.user

      thunkAPI.dispatch(setUserData({
        name: userData.username,
        userId: userData.id,
        isAdmin: userData.scope === 'adminuser'
      }))
      thunkAPI.dispatch(SetPlayerDataLogging({
        token,
        isLogged: true
      }))
    }
    catch (err) {
      disconnectUser(thunkAPI.dispatch, disconnect)
      console.log(err)
    }
  }
)

export const LoginSlice = createSlice({
  name: "logStateCheck",
  initialState,
  reducers: {
    setUserName: (state, action) => {
      state.username = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setLoginError: (state, action) => {
      state.error = action.payload
    },
    setClearLoginState: () =>  initialState
  },
});

export const {
  setUserName,
  setPassword,
  setLoginError,
  setClearLoginState
} = LoginSlice.actions;

export const selectLoginState = (state: RootState) =>
  state.loginState;

export default LoginSlice.reducer;