// Auth Types
export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  isPremium: boolean;
  avatar?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Story Types
export interface Story {
  id: string;
  title: string;
  description: string;
  coverImage: any; // ImageSourcePropType
  author: string;
  category: string;
  readTime: number;
  createdAt: string;
  isLocked: boolean;
  isFavorite?: boolean;
  chapters?: number;
  activities?: number;
}

export interface Chapter {
  id: string;
  title: string;
  content: string;
  order: number;
  hasActivity: boolean;
}

export interface Activity {
  id: string;
  chapterId: string;
  type: string;
  prompt: string;
  options: {
    characters: string[];
    colors: string[];
    textures: string[];
    shapes: string[];
  };
  hint: string;
}

export interface StoryDetails extends Story {
  chapters: Chapter[];
  activities: Activity[];
  currentProgress?: {
    currentChapter: number;
    lastReadAt: string;
    isCompleted: boolean;
  };
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  image: string;
  description: string;
}

export interface GuideSection {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface GuideContent {
  sections: GuideSection[];
  lastUpdated: string;
}

// Library Types
export interface UserLibrary {
  continueReading: ReadingProgress[];
  finished: Story[];
  favorites: Story[];
}

export interface ReadingProgress {
  story: Story;
  currentPage: number;
  lastReadAt: string;
  progress: number;
}

// Analytics Types
export interface DidYouKnow {
  id: string;
  title: string;
  summary: string;
  content: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  readTime: number;
  author: string;
  tags: string[];
}

export interface AnalyticsData {
  totalReadTime: number;
  storiesRead: number;
  charactersDiscovered: number;
  readingStreak: number;
  weeklyStats: {
    date: string;
    readTime: number;
    storiesCompleted: number;
  }[];
  categoryBreakdown: {
    category: string;
    count: number;
  }[];
}