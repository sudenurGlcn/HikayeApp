import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { storyService } from '../services/storyService';
import { DidYouKnow, Story, StoryDetails } from '../types';
import { RootState } from './store';

interface StoryState {
  stories: Story[];
  filteredStories: Story[];
  currentStory: Story | null;
  storyDetails: StoryDetails | null;
  didYouKnow: string | null;
  currentBlog: DidYouKnow | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: StoryState = {
  stories: [],
  filteredStories: [],
  currentStory: null,
  storyDetails: null,
  didYouKnow: null,
  currentBlog: null,
  isLoading: false,
  error: null,
};

export const fetchStories = createAsyncThunk(
  'story/fetchStories',
  async (_, { rejectWithValue }) => {
    try {
      const stories = await storyService.getStories();
      return stories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Hikayeler yüklenirken bir hata oluştu');
    }
  }
);

export const fetchStoryById = createAsyncThunk(
  'story/fetchStoryById',
  async (id: string, { rejectWithValue }) => {
    try {
      const story = await storyService.getStoryById(id);
      return story;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Hikaye detayı yüklenirken bir hata oluştu');
    }
  }
);

export const toggleFavorite = createAsyncThunk(
  'story/toggleFavorite',
  async (storyId: string, { rejectWithValue, getState }) => {
    try {
      const state = getState() as RootState;
      const isFavorite = state.story.currentStory?.isFavorite || false;

      if (isFavorite) {
        await storyService.removeFromFavorites(storyId);
        return false;
      } else {
        await storyService.addToFavorites(storyId);
        return true;
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Favori işlemi sırasında bir hata oluştu');
    }
  }
);

export const startReading = createAsyncThunk(
  'story/startReading',
  async (storyId: string, { rejectWithValue }) => {
    try {
      await storyService.startReading(storyId);
      const storyDetails = await storyService.getStoryDetails(storyId);
      return storyDetails;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Okuma başlatılırken bir hata oluştu');
    }
  }
);

export const fetchStoryDetails = createAsyncThunk(
  'story/fetchStoryDetails',
  async (storyId: string, { rejectWithValue }) => {
    try {
      const storyDetails = await storyService.getStoryDetails(storyId);
      return storyDetails;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Hikaye detayları yüklenirken bir hata oluştu');
    }
  }
);

export const checkFavoriteStatus = createAsyncThunk(
  'story/checkFavoriteStatus',
  async (storyId: string, { rejectWithValue }) => {
    try {
      const isFavorite = await storyService.checkFavoriteStatus(storyId);
      return isFavorite;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Favori durumu kontrol edilirken bir hata oluştu');
    }
  }
);

export const fetchBlogDetail = createAsyncThunk(
  'story/fetchBlogDetail',
  async (id: string, { rejectWithValue }) => {
    try {
      const blog = await storyService.getBlogDetail(id);
      return blog;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Blog detayı yüklenirken bir hata oluştu');
    }
  }
);

export const fetchRandomDidYouKnow = createAsyncThunk(
  'story/fetchRandomDidYouKnow',
  async (_, { rejectWithValue }) => {
    try {
      const didYouKnow = await storyService.getRandomDidYouKnow();
      return didYouKnow.content;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Bilgi yüklenirken bir hata oluştu');
    }
  }
);

export const searchStories = createAsyncThunk(
  'story/searchStories',
  async (query: string, { rejectWithValue }) => {
    try {
      const stories = await storyService.searchStories(query);
      return stories;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Hikayeler aranırken bir hata oluştu');
    }
  }
);

const storySlice = createSlice({
  name: 'story',
  initialState,
  reducers: {
    setFilteredStories: (state, action) => {
      state.filteredStories = action.payload;
    },
    clearStories: (state) => {
      state.stories = [];
      state.filteredStories = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Stories
      .addCase(fetchStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stories = action.payload;
        state.filteredStories = action.payload;
        state.error = null;
      })
      .addCase(fetchStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Search Stories
      .addCase(searchStories.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(searchStories.fulfilled, (state, action) => {
        state.isLoading = false;
        state.filteredStories = action.payload;
        state.error = null;
      })
      .addCase(searchStories.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Story By Id
      .addCase(fetchStoryById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoryById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentStory = action.payload;
        state.error = null;
      })
      .addCase(fetchStoryById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Toggle Favorite
      .addCase(toggleFavorite.fulfilled, (state, action) => {
        if (state.currentStory) {
          state.currentStory.isFavorite = action.payload;
        }
      })
      // Check Favorite Status
      .addCase(checkFavoriteStatus.fulfilled, (state, action) => {
        if (state.currentStory) {
          state.currentStory.isFavorite = action.payload;
        }
      })
      // Fetch Random Did You Know
      .addCase(fetchRandomDidYouKnow.fulfilled, (state, action) => {
        state.didYouKnow = action.payload;
      })
      .addCase(fetchRandomDidYouKnow.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Fetch Blog Detail
      .addCase(fetchBlogDetail.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchBlogDetail.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentBlog = action.payload;
        state.error = null;
      })
      .addCase(fetchBlogDetail.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Start Reading
      .addCase(startReading.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(startReading.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storyDetails = action.payload;
        state.error = null;
      })
      .addCase(startReading.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Story Details
      .addCase(fetchStoryDetails.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchStoryDetails.fulfilled, (state, action) => {
        state.isLoading = false;
        state.storyDetails = action.payload;
        state.error = null;
      })
      .addCase(fetchStoryDetails.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilteredStories, clearStories } = storySlice.actions;
export default storySlice.reducer;
