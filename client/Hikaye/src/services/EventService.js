import { useEffect, useState } from 'react';

// Backend API URL'sini buraya ekleyin
const API_URL = 'YOUR_BACKEND_API_URL';

/**
 * Aktivite verilerini yönetmek için custom hook
 * @returns {Object} Aktivite state'i ve yönetim fonksiyonları
 */
export const useActivity = () => {
    // Aktivite state'leri
    const [categories, setCategories] = useState([
        {
            id: 'character',
            name: 'Karakter',
            options: ['Robot', 'Kedi', 'Kelebek', 'Ejderha', 'Sinek'],
        },
        {
            id: 'color',
            name: 'Renk',
            options: ['Pembe', 'Sarı', 'Mavi', 'Yeşil', 'Mor'],
        },
        {
            id: 'texture',
            name: 'Doku',
            options: ['Pürüzlü', 'Yumuşak', 'Sert', 'Parlak', 'Mat'],
        },
        {
            id: 'shape',
            name: 'Biçim',
            options: ['Yuvarlak', 'Köşeli', 'Uzun', 'Kısa', 'Oval'],
        },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [selectedOptions, setSelectedOptions] = useState({});
    const [generatedImage, setGeneratedImage] = useState(null);
    const [artyInfo, setArtyInfo] = useState(null);

    /**
     * Kategorileri backend'den getir
     */
    const fetchCategories = async () => {
        try {
            setLoading(true);
            setError(null);
            
            // TODO: Backend entegrasyonu yapıldığında yorum satırlarını kaldırın
            /*
            const response = await fetch(`${API_URL}/categories`);
            const data = await response.json();
            setCategories(data);
            */

        } catch (err) {
            setError('Kategoriler yüklenirken bir hata oluştu');
            console.error('Kategori yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Seçilen özelliklere göre görsel oluştur
     */
    const generateImage = async () => {
        try {
            setLoading(true);
            setError(null);

            // Seçilen özellikleri birleştirip prompt oluştur
            const promptText = Object.entries(selectedOptions)
                .map(([category, option]) => `${option}`)
                .join(' ve ');

            // TODO: Backend entegrasyonu yapıldığında yorum satırlarını kaldırın
            /*
            const response = await fetch(`${API_URL}/generate-image`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    prompt: promptText,
                    selectedOptions
                }),
            });
            const data = await response.json();
            setGeneratedImage(data.imageUrl);
            */

            // Geçici olarak örnek bir resim URL'si
            setGeneratedImage('generated_image_url');
            
            // Görsel oluşturulurken Arty bilgisini de getir
            await fetchArtyInfo();

        } catch (err) {
            setError('Görsel oluşturulurken bir hata oluştu');
            console.error('Görsel oluşturma hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    /**
     * Seçilen özellikleri güncelle
     */
    const handleOptionSelect = (categoryId, option) => {
        setSelectedOptions(prev => ({
            ...prev,
            [categoryId]: option,
        }));
    };

    // Component mount olduğunda kategorileri yükle
    useEffect(() => {
        fetchCategories();
    }, []);

    /**
     * Arty'den rastgele bir bilgi getir
     */
    const fetchArtyInfo = async () => {
        try {
            setLoading(true);
            setError(null);

            // TODO: Backend entegrasyonu yapıldığında yorum satırlarını kaldırın
            /*
            const response = await fetch(`${API_URL}/arty-info/random`);
            const data = await response.json();
            setArtyInfo(data.info);
            */

            // Geçici örnek veriler
            const sampleArtyInfo = [
                "Yapay zeka sanatı, insanların hayal gücü ile bilgisayarların işlem gücünü birleştirerek yepyeni sanat eserleri ortaya çıkarır!",
                "Yapay zeka, milyonlarca sanat eserini inceleyerek kendine özgü bir sanat stili geliştirebilir.",
                "Yapay zeka ile oluşturulan her görsel benzersizdir ve bir daha aynısı oluşturulamaz!",
                "Yapay zeka sanatçıları, geleneksel sanat teknikleriyle dijital teknolojiyi harmanlayarak yeni sanat formları yaratır.",
                "Yapay zeka, renkleri ve şekilleri matematiksel formüllerle hesaplayarak estetik kompozisyonlar oluşturur."
            ];

            const randomInfo = sampleArtyInfo[Math.floor(Math.random() * sampleArtyInfo.length)];
            setArtyInfo(randomInfo);

        } catch (err) {
            setError('Arty bilgisi yüklenirken bir hata oluştu');
            console.error('Arty bilgisi yükleme hatası:', err);
        } finally {
            setLoading(false);
        }
    };

    return {
        categories,
        loading,
        error,
        selectedOptions,
        generatedImage,
        artyInfo,
        handleOptionSelect,
        generateImage,
        fetchArtyInfo,
    };
};