import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
  requests: [],
  activeRequests: [],
  pendingVehicleRequests: [],
  status: "idle",
  error: null,
};

export const fetchActiveVehicleRequests = createAsyncThunk(
  "vehicleRequest/fetchActiveVehicleRequests",
  async (_, { getState }) => {
    const token = getState().user.token;
    const userId = getState().user.user.user_id;

    try {
      const response = await axios.get(
        `https://workspace.optiven.co.ke/api/vehicle-requests/active/active?user_id=${userId}`,
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

export const fetchPendingVehicleRequests = createAsyncThunk(
  "vehicleRequest/fetchPendingVehicleRequests",
  async (_, { getState }) => {
    const token = getState().user.token;

    try {
      const response = await axios.get(
        "https://workspace.optiven.co.ke/api/vehicle-requests/pending-vehicle-requests",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log("Pending VRs:", response.data.length);
      return response.data;
    } catch (error) {
      console.log("Server error:", error.response);
      throw error;
    }
  }
);

export const approveVehicleRequest = createAsyncThunk(
  "vehicleRequest/approveVehicleRequest",
  async ({ id, data }, { getState, rejectWithValue }) => {
    try {
      const token = getState().user.token;
      const response = await axios.patch(
        `https://workspace.optiven.co.ke/api/vehicle-requests/pending-vehicle-requests/${id}`,
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

const vehicleRequestSlice = createSlice({
  name: "vehicleRequest",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchActiveVehicleRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchActiveVehicleRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.activeRequests = action.payload;
      })

      .addCase(fetchActiveVehicleRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(approveVehicleRequest.pending, (state) => {
        state.status = "loading";
      })
      .addCase(approveVehicleRequest.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingRequest = state.pendingRequest.map((vehicleRequest) =>
          vehicleRequest.id === action.payload.id
            ? action.payload
            : vehicleRequest
        );
      })
      .addCase(approveVehicleRequest.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })

      .addCase(fetchPendingVehicleRequests.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchPendingVehicleRequests.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.pendingVehicleRequests = action.payload;
      })
      .addCase(fetchPendingVehicleRequests.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const selectPendingVehicleRequest = (state) =>
  state.vehicleRequest.pendingRequest;

export default vehicleRequestSlice.reducer;
