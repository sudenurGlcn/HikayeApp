import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { api } from '../services/api';
import { GuideContent } from '../types';

interface GuideState {
  content: GuideContent | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: GuideState = {
  content: null,
  isLoading: false,
  error: null,
};

export const fetchGuideContent = createAsyncThunk(
  'guide/fetchContent',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/guide');
      return response.data as GuideContent;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Kılavuz yüklenirken bir hata oluştu');
    }
  }
);

const guideSlice = createSlice({
  name: 'guide',
  initialState,
  reducers: {
    clearGuideContent: (state) => {
      state.content = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchGuideContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchGuideContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.content = action.payload;
        state.error = null;
      })
      .addCase(fetchGuideContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearGuideContent } = guideSlice.actions;
export default guideSlice.reducer;
