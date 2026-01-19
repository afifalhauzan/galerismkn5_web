import useSWR from 'swr';
import { fetcher } from '@/lib/axios';

export interface CarouselSlide {
  id: number;
  image_url: string;
  title: string;
  subtitle: string;
  is_active?: boolean;
}

interface CarouselResponse {
  success: boolean;
  data: CarouselSlide[];
  message?: string;
}

// Mock data fallback
const mockSlides: CarouselSlide[] = [
  {
    id: 1,
    image_url: '/fotosmkn5landing.png',
    title: 'Selamat Datang!',
    subtitle: 'Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!'
  },
  {
    id: 2,
    image_url: '/fotosmkn5landing.png',
    title: 'Selamat Datang!',
    subtitle: 'Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!'
  },
  {
    id: 3,
    image_url: '/fotosmkn5landing.png',
    title: 'Selamat Datang!',
    subtitle: 'Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!'
  },
  {
    id: 4,
    image_url: '/fotosmkn5landing.png',
    title: 'Selamat Datang!',
    subtitle: 'Selamat datang di situs web galeri karya Akhir SMK Negeri 5 Malang. Selamat berkunjung!'
  }
];

export function useHeroCarousel() {
  const { data, error, isLoading, mutate } = useSWR<CarouselResponse>(
    '/carousel-slides', // Updated to match backend API endpoint
    fetcher,
    {
      revalidateOnFocus: false,
      dedupingInterval: 300000, // Cache for 5 minutes
      shouldRetryOnError: false, // Don't retry on error, use fallback instead
    }
  );

  // Use backend data if available and successful, otherwise fallback to mock data
  const slides = (() => {
    if (error || !data?.success || !data?.data?.length) {
      return mockSlides;
    }
    // Filter only active slides if backend provides this feature
    return data.data.filter(slide => slide.is_active !== false);
  })();

  // Helper function to get full image URL
  const getImageUrl = (imageUrl: string): string => {
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    
    // If it's already a full URL, return as is
    if (imageUrl.startsWith('http')) {
      return imageUrl;
    }
    
    // If it starts with /, it's a relative path from the backend - prepend backend URL
    if (imageUrl.startsWith('/')) {
      return `${backendUrl}${imageUrl}`;
    }
    
    // Otherwise prepend backend URL with slash
    return `${backendUrl}/${imageUrl}`;
  };

  return {
    slides: slides.map(slide => ({
      ...slide,
      fullImageUrl: getImageUrl(slide.image_url)
    })),
    isLoading,
    isError: error,
    isUsingFallback: error || !data?.success || !data?.data?.length,
    mutate
  };
}