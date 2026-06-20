import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/services/api';
import { User } from '@/types';

// UserInfo includes all properties returned by backend (token, user data, etc.)
interface UserInfo extends User {
  token?: string;
  refreshToken?: string;
  [key: string]: string | undefined; // Allow other fields from backend
}

const storedUser = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
const initialUser: UserInfo | null = storedUser ? JSON.parse(storedUser) : null;

export const loginUser = createAsyncThunk(
  'user/login',
  async (credentials: { email: string; password: string }) => {
    const res = await api.post('/users/login', credentials);
    console.log('[loginUser API Response]:', res.data);
    return res.data;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (payload: { name: string; email: string; password: string }) => {
    const res = await api.post('/users/register', payload);
    console.log('[registerUser API Response]:', res.data);
    return res.data;
  }
);

export const fetchUserProfile = createAsyncThunk(
  'user/profile',
  async () => {
    const res = await api.get('/users/profile');
    console.log('[fetchUserProfile API Response]:', res.data);
    return res.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload: { name?: string; email?: string; password?: string; address?: string; phoneNumber?: string }) => {
    const res = await api.put('/users/profile', payload);
    console.log('[updateUserProfile API Response]:', res.data);
    return res.data;
  }
);

interface UserState {
  userInfo: UserInfo | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const userSlice = createSlice({
  name: 'user',
  initialState: {
    userInfo: initialUser,
    status: 'idle' as const,
    error: null,
  } as UserState,
  reducers: {
    logout(state) {
      state.userInfo = null;
      state.status = 'idle';
      state.error = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('userInfo');
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = 'succeeded';
        console.log('[loginUser.fulfilled] Redux state:', { userInfo: state.userInfo });
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      });

    // Register
    builder
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = 'succeeded';
        console.log('[registerUser.fulfilled] Redux state:', { userInfo: state.userInfo });
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      });

    // Fetch Profile
    builder
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = 'succeeded';
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch profile';
      });

    // Update Profile
    builder
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        state.userInfo = action.payload;
        state.status = 'succeeded';
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(action.payload));
        }
      })
      .addCase(updateUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to update profile';
      });
  },
});

export const { logout, clearError } = userSlice.actions;
export default userSlice.reducer;