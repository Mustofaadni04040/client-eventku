import { createSlice } from "@reduxjs/toolkit";
import getFromLocalStorage from "@/utils/getToken";
import removeFromLocalStorage from "@/utils/removeToken";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    token: null,
    role: null,
  },
  reducers: {
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setRole: (state, action) => {
      state.role = action.payload;
    },
  },
});

export const { setToken, setRole } = authSlice.actions;
export default authSlice.reducer;
