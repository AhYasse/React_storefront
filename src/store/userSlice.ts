import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import authService from '@/services/authService';
import { User } from '@/types';
import { AxiosError } from 'axios';

// 1. STATE & TYPES


interface UserState {
  user: User | null;
  token: string | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: authService.getCurrentUser(), // Hydrate from localStorage on app start
  token: authService.getToken(),
  status: 'idle',
  error: null,
};

// 2. HELPER: Extract error message safely


const extractErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data?.message) {
    return error.response.data.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
};

// 3. ASYNC THUNKS


interface LoginPayload {
  email: string;
  password: string;
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export const loginUser = createAsyncThunk<
  { user: User; token: string },
  LoginPayload,
  { rejectValue: string }
>('user/loginUser', async (credentials, { rejectWithValue }) => {
  try {
    const response = await authService.login(credentials);
    return { user: response.user, token: response.token };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const registerUser = createAsyncThunk<
  { user: User; token: string },
  RegisterPayload,
  { rejectValue: string }
>('user/registerUser', async (data, { rejectWithValue }) => {
  try {
    const response = await authService.register(data);
    return { user: response.user, token: response.token };
  } catch (error) {
    return rejectWithValue(extractErrorMessage(error));
  }
});

export const logoutUser = createAsyncThunk<
  void,
  void,
  { rejectValue: string }
>('user/logoutUser', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
  } catch (error) {
    // Even if API call fails, we want to clear local state
    return rejectWithValue(extractErrorMessage(error));
  }
});


// 4. SLICE

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    resetStatus: (state) => {
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // --- Login ---
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Login failed';
      });

    // --- Register ---
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<{ user: User; token: string }>) => {
        state.status = 'succeeded';
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload || 'Registration failed';
      });

    // --- Logout ---
    builder
      .addCase(logoutUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        state.token = null;
        state.error = null;
      })
      .addCase(logoutUser.rejected, (state) => {
        // Clear state even on failure
        state.status = 'idle';
        state.user = null;
        state.token = null;
        state.error = null;
      });
  },
});

export const { clearError, resetStatus } = userSlice.actions;
export default userSlice.reducer;