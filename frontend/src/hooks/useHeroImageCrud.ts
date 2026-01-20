import { useState } from 'react';
import useSWR from 'swr';
import { fetcher } from '@/lib/axios';
import api from '@/lib/axios';

export interface HeroImage {
  id: number;
  title: string;
  subtitle: string;
  image_url: string;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface CreateHeroImageData {
  title: string;
  subtitle: string;
  image: File;
  is_active: boolean;
  sort_order: number;
}

export interface UpdateHeroImageData {
  title?: string;
  subtitle?: string;
  image?: File;
  is_active?: boolean;
  sort_order?: number;
}

interface HeroImageResponse {
  success: boolean;
  data: HeroImage[];
  message?: string;
}

interface SingleHeroImageResponse {
  success: boolean;
  data: HeroImage;
  message?: string;
}

export function useHeroImageCrud() {
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch all hero images (admin only)
  const { data, error, isLoading, mutate } = useSWR<HeroImageResponse>(
    '/hero-images',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      dedupingInterval: 30000, // Cache for 30 seconds
      errorRetryCount: 3, // Only retry 3 times
      errorRetryInterval: 5000, // Wait 5 seconds between retries
      shouldRetryOnError: (error) => {
        // Don't retry on 4xx errors (client errors)
        return error?.response?.status >= 500;
      },
    }
  );

  // Create new hero image
  const createHeroImage = async (heroImageData: CreateHeroImageData): Promise<boolean> => {
    console.log('🚀 Creating hero image:', heroImageData);
    setIsCreating(true);
    
    try {
      const formData = new FormData();
      formData.append('title', heroImageData.title);
      formData.append('subtitle', heroImageData.subtitle);
      formData.append('image', heroImageData.image);
      formData.append('is_active', heroImageData.is_active ? '1' : '0');
      formData.append('sort_order', heroImageData.sort_order.toString());

      console.log('📤 Sending FormData to backend...');
      const response = await api.post('/hero-images', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Hero image created successfully:', response.data);
      await mutate(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error('❌ Error creating hero image:', error);
      console.error('📋 Error details:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  // Update existing hero image
  const updateHeroImage = async (id: number, heroImageData: UpdateHeroImageData): Promise<boolean> => {
    console.log(`🔄 Updating hero image ${id}:`, heroImageData);
    setIsUpdating(true);
    
    try {
      const formData = new FormData();
      
      if (heroImageData.title !== undefined) {
        formData.append('title', heroImageData.title);
      }
      if (heroImageData.subtitle !== undefined) {
        formData.append('subtitle', heroImageData.subtitle);
      }
      if (heroImageData.image) {
        formData.append('image', heroImageData.image);
      }
      if (heroImageData.is_active !== undefined) {
        formData.append('is_active', heroImageData.is_active ? '1' : '0');
      }
      if (heroImageData.sort_order !== undefined) {
        formData.append('sort_order', heroImageData.sort_order.toString());
      }

      // Laravel expects _method for file uploads with PUT
      formData.append('_method', 'PUT');

      console.log(`📤 Sending update data to backend for image ${id}...`);
      const response = await api.post(`/hero-images/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('✅ Hero image updated successfully:', response.data);
      await mutate(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error(`❌ Error updating hero image ${id}:`, error);
      console.error('📋 Error details:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsUpdating(false);
    }
  };

  // Delete hero image
  const deleteHeroImage = async (id: number): Promise<boolean> => {
    console.log(`🗑️ Deleting hero image ${id}...`);
    setIsDeleting(true);
    
    try {
      const response = await api.delete(`/hero-images/${id}`);
      
      console.log('✅ Hero image deleted successfully:', response.data);
      await mutate(); // Refresh the list
      return true;
    } catch (error: any) {
      console.error(`❌ Error deleting hero image ${id}:`, error);
      console.error('📋 Error details:', error.response?.data || error.message);
      throw error;
    } finally {
      setIsDeleting(false);
    }
  };

  // Toggle active status
  const toggleActive = async (id: number, currentStatus: boolean): Promise<boolean> => {
    console.log(`🔄 Toggling active status for hero image ${id}: ${currentStatus} → ${!currentStatus}`);
    
    try {
      await updateHeroImage(id, { is_active: !currentStatus });
      return true;
    } catch (error) {
      console.error(`❌ Error toggling active status for hero image ${id}:`, error);
      throw error;
    }
  };

  return {
    // Data
    heroImages: data?.data?.map(image => ({
      ...image,
      image_url: image.image_url.startsWith('http') 
        ? image.image_url 
        : `${process.env.NEXT_PUBLIC_BACKEND_URL || ''} ${image.image_url}`
    })) || [],
    isLoading,
    isError: error,
    
    // CRUD operations
    createHeroImage,
    updateHeroImage,
    deleteHeroImage,
    toggleActive,
    
    // Loading states
    isCreating,
    isUpdating,
    isDeleting,
    
    // Utils
    mutate,
  };
}