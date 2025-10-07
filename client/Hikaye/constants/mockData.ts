import { Category, Story } from '../types';

export const mockStories: Story[] = [
  {
    id: '1',
    title: 'Küçük Prens',
    description: 'Evrensel bir klasik olan bu hikaye, küçük bir prensin gezegenleri dolaşarak edindiği hayat derslerini anlatıyor.',
    coverImage: 'https://example.com/image.jpg',
    author: 'Antoine de Saint-Exupéry',
    category: 'Klasik',
    readTime: 30,
    createdAt: new Date().toISOString(),
    isLocked: false,
  },
  {
    id: '2',
    title: 'Alice Harikalar Diyarında',
    description: 'Fantastik bir macera dolu bu hikayede, Alice tuhaf karakterlerle dolu büyülü bir dünyaya yolculuk ediyor.',
    coverImage: 'https://example.com/image2.jpg',
    author: 'Lewis Carroll',
    category: 'Fantastik',
    readTime: 25,
    createdAt: new Date().toISOString(),
    isLocked: false,
  },
  {
    id: '3',
    title: 'Orman Dostları',
    description: 'Küçük bir sincabın ormanın derinliklerinde keşfettiği dostluk ve yardımlaşma hikayesi. Doğanın güzelliklerini ve hayvanların dünyasını tanıyacaksınız.',
    coverImage: 'https://example.com/image3.jpg',
    author: 'Ayşe Yılmaz',
    category: 'Çocuk',
    readTime: 15,
    createdAt: new Date().toISOString(),
    isLocked: false,
  },
];

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'Macera',
    icon: '🗺️',
    description: 'Heyecan dolu hikayeler',
  },
  {
    id: '2',
    name: 'Fantastik',
    icon: '🦄',
    description: 'Hayal gücünü zorlayan hikayeler',
  },
  {
    id: '3',
    name: 'Klasik',
    icon: '📚',
    description: 'Zamansız eserler',
  },
  {
    id: '4',
    name: 'Çocuk',
    icon: '🎈',
    description: 'Çocuklar için özel hikayeler',
  },
];
