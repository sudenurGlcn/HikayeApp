import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import guideReducer from './guideSlice';
import storyReducer from './storySlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    guide: guideReducer,
    story: storyReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;