import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { name, role, _id }
  userId: null,
  token: null,
  isAuthenticated: false,
  logoutError: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = action.payload;
      state.userId = action.payload._id;
      state.isAuthenticated = true;
      state.logoutError = null;
    },
    logout: (state) => {
      state.user = null;
      state.userId = null;
      state.token = null;
      state.isAuthenticated = false;
      state.logoutError = null;
    },
    setLogoutError: (state, action) => {
      state.logoutError = action.payload;
    },
  },
});

export const { setAuthUser, logout, setLogoutError } = authSlice.actions;
export default authSlice.reducer;