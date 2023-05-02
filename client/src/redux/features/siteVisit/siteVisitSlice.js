import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  visits: [],
  activeVisits: [],
  status: "idle",
  error: null,
};

export const fetchActiveSiteVisits = createAsyncThunk(
  "siteVisit/fetchActiveSiteVisits",
  async (_, { getState }) => {
    const token = getState().user.token;
    const userId = getState().user.user.user_id;

    try {
      const response = await axios.get(
        `http://localhost:8080/api/site-visit-requests/active?user_id=${userId}`, // Pass the user ID as a query parameter
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Server error:", error.response); // Debugging
      throw error;
    }
  }
);

export const approveSiteVisit = createAsyncThunk(
  "siteVisits/approveSiteVisit",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.patch(
        `http://localhost:8080/api/site-visit-requests/pending-site-visits/${id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response.data);
    }
  }
);

const siteVisitSlice = createSlice({
  name: "siteVisit",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveSiteVisits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveSiteVisits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeVisits = action.payload;
      })
      .addCase(fetchActiveSiteVisits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(approveSiteVisit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(approveSiteVisit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeVisits = state.activeVisits.map((siteVisit) =>
          siteVisit.id === action.payload.id ? action.payload : siteVisit
        );
      })
      .addCase(approveSiteVisit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectActiveSiteVisits = (state) => state.siteVisit.activeVisits;

export default siteVisitSlice.reducer;
