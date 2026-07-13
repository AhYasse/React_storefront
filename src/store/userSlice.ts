import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '@/services/api';
import { tokenStorage } from '@/services/authService';
import { User } from '@/types';

export type UserInfo = User;

const sanitizeUser = (user: any): UserInfo => {
  const { _token, _refreshToken, ...clean } = user || {};
  return clean as UserInfo;
};

const storedUser = typeof window !== 'undefined' ? localStorage.getItem('userInfo') : null;
const initialUser: UserInfo | null = storedUser ? sanitizeUser(JSON.parse(storedUser)) : null;

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
    const res = await api.get<User>('/users/profile');
    return res.data;
  }
);

export const updateUserProfile = createAsyncThunk(
  'user/updateProfile',
  async (payload: { name?: string; email?: string; password?: string; address?: string; phoneNumber?: string }) => {
    const res = await api.put<User>('/users/profile', payload);
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
        tokenStorage.clearTokens();
      }
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        const { token, refreshToken, ...userData } = action.payload as any;
        state.userInfo = sanitizeUser(userData);
        state.status = 'succeeded';
        if (token) {
          tokenStorage.setTokens(token, refreshToken || '');
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(userData));
        }
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Login failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        const { token, refreshToken, ...userData } = action.payload as any;
        state.userInfo = sanitizeUser(userData);
        state.status = 'succeeded';
        if (token) {
          tokenStorage.setTokens(token, refreshToken || '');
        }
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(userData));
        }
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Registration failed';
      })
      .addCase(fetchUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        const { _token, _refreshToken, ...userData } = action.payload as any;
        state.userInfo = sanitizeUser(userData);
        state.status = 'succeeded';
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(userData));
        }
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message || 'Failed to fetch profile';
      })
      .addCase(updateUserProfile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateUserProfile.fulfilled, (state, action) => {
        const { _token, _refreshToken, ...userData } = action.payload as any;
        state.userInfo = sanitizeUser(userData);
        state.status = 'succeeded';
        if (typeof window !== 'undefined') {
          localStorage.setItem('userInfo', JSON.stringify(userData));
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