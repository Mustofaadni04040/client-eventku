import { createSlice } from "@reduxjs/toolkit";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    role: null,
    refreshToken: null,
    email: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
    setRefreshToken: (state, action) => {
      state.refreshToken = action.payload;
    },
    setEmail: (state, action) => {
      state.email = action.payload;
    },
  },
});

export const { setToken, setRole, setRefreshToken, setEmail } =
  authSlice.actions;
export default authSlice.reducer;
