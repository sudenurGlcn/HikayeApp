import { useState } from 'react';

// Backend API URL'sini buraya ekleyin
const API_URL = 'YOUR_BACKEND_API_URL';

/**
 * Hikaye verilerini yönetmek için custom hook
 * @returns {Object} Hikaye state'i ve yönetim fonksiyonları
 */
export const useStory = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Hikayeyi tamamlandı olarak işaretle ve kullanıcının tamamladıklarına ekle
     * @param {Object} storyData - Hikaye ile ilgili veriler
     */
    const completeStory = async (storyData) => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Backend entegrasyonu yapıldığında yorum satırlarını kaldırın
            /*
            const response = await fetch(`${API_URL}/stories/complete`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storyId: storyData.storyId,
                    userId: storyData.userId, // Kullanıcı ID'si
                    completionData: {
                        completedAt: new Date().toISOString(),
                        readTime: storyData.readTime, // Okuma süresi
                        activityCompleted: storyData.activityCompleted, // Aktivite tamamlandı mı?
                        lastChapterRead: storyData.currentChapter,
                    }
                }),
            });

            if (!response.ok) {
                throw new Error('Hikaye tamamlama işlemi başarısız oldu');
            }

            const data = await response.json();
            
            // Başarılı tamamlama sonrası yapılacak işlemler
            // Örneğin: Kullanıcı profilini güncelle, başarı rozeti ver, vb.
            if (data.rewards) {
                // Kazanılan ödülleri işle
                handleRewards(data.rewards);
            }

            // Kullanıcının tamamladığı hikayeleri güncelle
            await updateUserProgress(storyData.storyId);
            */

            // Geçici olarak başarılı kabul et
            console.log('Hikaye başarıyla tamamlandı:', storyData);

        } catch (err) {
            setError('Hikaye tamamlanırken bir hata oluştu');
            console.error('Hikaye tamamlama hatası:', err);
            throw err;
        } finally {
            setLoading(false);
        }
    };

    /**
     * Kullanıcının hikaye ilerleme durumunu güncelle
     * @param {string} storyId - Hikaye ID
     */
    const updateUserProgress = async (storyId) => {
        try {
            // TODO: Backend entegrasyonu yapıldığında yorum satırlarını kaldırın
            /*
            const response = await fetch(`${API_URL}/users/progress`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    storyId,
                    completedAt: new Date().toISOString(),
                }),
            });

            if (!response.ok) {
                throw new Error('İlerleme güncellenemedi');
            }

            const data = await response.json();
            return data;
            */

            console.log('Kullanıcı ilerlemesi güncellendi:', storyId);
        } catch (err) {
            console.error('İlerleme güncelleme hatası:', err);
            throw err;
        }
    };

    return {
        loading,
        error,
        completeStory,
    };
};
