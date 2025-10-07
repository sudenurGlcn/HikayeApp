import { useEffect, useState } from 'react';

interface AnalysisData {
  readerPersonality: {
    type: string;
    traits: string[];
    preferredGenres: string[];
  } | null;
  dailyUsage: {
    averageMinutes: number;
    lastWeekTrend: string;
    bestTimeOfDay: string;
    weeklyStats: number[];
  } | null;
  mostConsumedGenre: {
    primary: string;
    percentage: number;
    recentBooks: string[];
  } | null;
  readingHabitProgress: {
    currentStreak: number;
    longestStreak: number;
    monthlyProgress: number[];
    improvement: string;
  } | null;
  focusDuration: {
    average: number;
    best: number;
    weeklyTrend: number[];
  } | null;
}

interface AnalysisHook {
  loading: boolean;
  error: string | null;
  analysisData: AnalysisData;
  fetchAnalysisData: () => Promise<void>;
}

export const useAnalysis = (): AnalysisHook => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisData>({
    readerPersonality: null,
    dailyUsage: null,
    mostConsumedGenre: null,
    readingHabitProgress: null,
    focusDuration: null,
  });

  const fetchAnalysisData = async () => {
    try {
      setLoading(true);
      setError(null);

      setAnalysisData({
        readerPersonality: {
          type: 'Maceraperest Okur',
          traits: ['Meraklı', 'Yaratıcı', 'Heyecan Arayan'],
          preferredGenres: ['Macera', 'Fantastik', 'Bilim Kurgu'],
        },
        dailyUsage: {
          averageMinutes: 45,
          lastWeekTrend: 'up',
          bestTimeOfDay: 'Akşam',
          weeklyStats: [30, 45, 40, 50, 35, 60, 45],
        },
        mostConsumedGenre: {
          primary: 'Macera',
          percentage: 45,
          recentBooks: ['Sude\'nin Maceraları', 'Orman Kahramanları'],
        },
        readingHabitProgress: {
          currentStreak: 5,
          longestStreak: 12,
          monthlyProgress: [20, 25, 30, 35, 40, 45],
          improvement: '+15%',
        },
        focusDuration: {
          average: 25,
          best: 40,
          weeklyTrend: [20, 22, 25, 28, 25, 30, 25],
        },
      });
    } catch (err) {
      setError('Analiz verileri yüklenirken bir hata oluştu');
      console.error('Analiz veri yükleme hatası:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalysisData();
  }, []);

  return {
    loading,
    error,
    analysisData,
    fetchAnalysisData,
  };
};
