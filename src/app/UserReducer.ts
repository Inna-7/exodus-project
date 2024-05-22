import { createSlice } from '@reduxjs/toolkit';
import { RootState } from './store';

const initialState = {
  userId: '',
  name: '',
  isAdmin: null,
};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserData: (state, action) => {
      state.userId = action.payload.userId
      state.name = action.payload.name
      state.isAdmin = action.payload.isAdmin
    },
    clearUser: () => initialState,
  }
});

export const { setUserData, clearUser } = user.actions;

export const selectUserState = (state: RootState) =>
  state.user;

export default user.reducer;
