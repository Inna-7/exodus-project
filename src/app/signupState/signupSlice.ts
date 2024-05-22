import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { setToken } from "app/LoginStateReducer";
import { RootState } from "app/store";
import SignUpService from "./signup.service";
import { SignUpUserType } from "./signupTypes";
import { toast } from 'react-toastify';

const initialState = {
  firstName: '',
  lastName: '',
  email: '',
  password: '',
  confirm_password: '',
  error: '',
  verificationPopup: false,
  resendEmailLoading: false,
}

export const registerUser = createAsyncThunk(
  "signup/fetchSignupUser",
  async (userCred: SignUpUserType, thunkAPI) => {
    try {
      const res = await SignUpService.SignUpUser(userCred);
      thunkAPI.dispatch(setToken(res.data.token))
      thunkAPI.dispatch(setVerificationPopup())
    }
    catch (err:any) {
      thunkAPI.dispatch(setSignupError(err?.response?.data?.message || ''))
      console.error(err.message)
    }
  }
)

export const resendVerifyToken = createAsyncThunk(
  "signup/resendVerifyToken",
  async (token:string, thunkAPI) => {
    try {
      thunkAPI.dispatch(setResendEmailLoading(true))
      await SignUpService.ResendVerifyToken(token)
      toast.success('Email has been sent successfully!')
      thunkAPI.dispatch(setResendEmailLoading(false))
    }
    catch (err:any) {
      console.error(err.message)
    }
  }
)

export const SignupSlice = createSlice({
  name: "signup",
  initialState,
  reducers: {
    setFirstName: (state, action) => {
      state.firstName = action.payload
    },
    setLastName: (state, action) => {
      state.lastName = action.payload
    },
    setEmail: (state, action) => {
      state.email = action.payload
    },
    setPassword: (state, action) => {
      state.password = action.payload
    },
    setConfirmPassword: (state, action) => {
      state.confirm_password = action.payload
    },
    setSignupError: (state, action) => {
      state.error = action.payload
    },
    setVerificationPopup: (state) => {
      state.verificationPopup = !state.verificationPopup
    },
    setResendEmailLoading: (state, action) => {
      state.resendEmailLoading = action.payload
    },
  },
});

export const {
  setFirstName,
  setLastName,
  setEmail,
  setPassword,
  setConfirmPassword,
  setSignupError,
  setVerificationPopup,
  setResendEmailLoading
} = SignupSlice.actions;

export const selectSignupState = (state: RootState) => state.signupState;

export default SignupSlice.reducer;