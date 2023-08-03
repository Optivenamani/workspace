import { createSlice } from "@reduxjs/toolkit";

const paginationSlice = createSlice({
  name: "pagination",
  initialState: {
    itemsPerPage: 10, // Default value
  },
  reducers: {
    setItemsPerPage: (state, action) => {
      state.itemsPerPage = action.payload;
    },
  },
});

export const { setItemsPerPage } = paginationSlice.actions;
export default paginationSlice.reducer;
