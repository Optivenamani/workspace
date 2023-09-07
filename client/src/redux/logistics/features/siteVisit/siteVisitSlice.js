import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  visits: [],
  activeVisits: [],
  pendingVisits: [],
  assignedVisits: [],
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
        `https://workspace.optiven.co.ke/api/site-visit-requests/active/active?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Server error:", error.response);
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
        `https://workspace.optiven.co.ke/api/site-visit-requests/pending-site-visits/${id}`,
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

export const completeSiteVisit = createAsyncThunk(
  "siteVisits/completeSiteVisit",
  async ({ id }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.patch(
        `https://workspace.optiven.co.ke/api/site-visit-requests/pending-site-visits/${id}`,
        { status: "complete" },
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

export const fetchPendingSiteVisits = createAsyncThunk(
  "siteVisits/fetchPendingSiteVisits",
  async (_, { getState }) => {
    const token = getState().user.token;

    try {
      const response = await axios.get(
        "https://workspace.optiven.co.ke/api/site-visit-requests/pending-site-visits/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Pending site visits:", response.data);
      return response.data;
    } catch (error) {
      console.log("Server error:", error.response);
      throw error;
    }
  }
);

export const fetchAssignedSiteVisits = createAsyncThunk(
  "siteVisits/fetchAssignedSiteVisits",
  async (_, { getState }) => {
    const token = getState().user.token;

    try {
      const response = await axios.get(
        `https://workspace.optiven.co.ke/api/drivers/assigned-site-visits`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return response.data;
    } catch (error) {
      console.log("Server error:", error.response);
      throw error;
    }
  }
);

const siteVisitSlice = createSlice({
  name: "siteVisit",
  initialState,
  reducers: {
    updateSiteVisit: (state, action) => {
      state.activeVisits = state.activeVisits.map((siteVisit) =>
        siteVisit.id === action.payload.id ? action.payload : siteVisit
      );
    },
  },
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
      })
      .addCase(completeSiteVisit.pending, (state) => {
        state.status = "loading";
      })
      .addCase(completeSiteVisit.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeVisits = state.activeVisits.map((siteVisit) =>
          siteVisit.id === action.payload.id ? action.payload : siteVisit
        );
      })
      .addCase(completeSiteVisit.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchPendingSiteVisits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingSiteVisits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingVisits = action.payload;
      })
      .addCase(fetchPendingSiteVisits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(fetchAssignedSiteVisits.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchAssignedSiteVisits.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.assignedVisits = action.payload;
      })
      .addCase(fetchAssignedSiteVisits.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectActiveSiteVisits = (state) => state.siteVisit.activeVisits;
export const selectAssignedSiteVisits = (state) =>
  state.siteVisit.assignedVisits;

export default siteVisitSlice.reducer;
