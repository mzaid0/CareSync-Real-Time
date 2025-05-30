import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import type { User } from "../types/user";
import axiosInstance from "../api/axiosInstance";

interface AuthState {
  user: User | null;
}

const initialState: AuthState = {
  user: null,
};

// Async thunk for logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axiosInstance.post("/api/users/logout");
      return;
    } catch (error) {
      return rejectWithValue((error as Error).message || "Failed to logout");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
    },
    clearUser: (state) => {
      state.user = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(logout.fulfilled, (state) => {
      state.user = null; // Clear user state upon successful logout
    });
  },
});

export const { setUser, clearUser } = authSlice.actions;
export default authSlice.reducer;
