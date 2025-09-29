import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null, // { name, role }
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setAuthUser: (state, action) => {
      state.user = {
        name: action.payload.user.name,
        role: action.payload.user.role,
      };
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
    },
  },
});

export const { setAuthUser, logout } = authSlice.actions;
export default authSlice.reducer;
