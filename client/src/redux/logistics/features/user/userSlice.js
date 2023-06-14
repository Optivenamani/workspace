import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: {},
  token: "",
  accessRole: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setToken: (state, action) => {
      state.token = action.payload;
    },
    setAccessRole: (state, action) => {
      state.accessRole = action.payload;
    },
    logout: () => initialState,
  },
});

export const { setUser, setToken, setAccessRole, logout } = userSlice.actions;
export default userSlice.reducer;
