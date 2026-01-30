import { useState } from 'react';
import axios from '@/lib/axios';

export interface SystemStats {
  users: {
    total: number;
    admin: number;
    guru: number;
    siswa: number;
    active: number;
    inactive: number;
  };
  projects: {
    total: number;
    with_images: number;
  };
  assessments: {
    total: number;
  };
  structure: {
    jurusans: number;
    kelas: number;
  };
  media: {
    hero_images: number;
  };
}

export interface ResetResponse {
  success: boolean;
  message: string;
  reset_level?: number;
  items_cleared?: string[];
  admin_recreated?: {
    email: string;
    password: string;
  };
  note?: string;
}

export const useNuclearButtons = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [systemStats, setSystemStats] = useState<SystemStats | null>(null);
  const [statsLoading, setStatsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch system statistics
  const fetchSystemStats = async () => {
    try {
      setStatsLoading(true);
      setError(null);
      
      const response = await axios.get<{ success: boolean; stats: SystemStats }>('/admin/maintenance/stats');
      
      if (response.data.success) {
        setSystemStats(response.data.stats);
      } else {
        throw new Error('Failed to fetch system stats');
      }
    } catch (err: any) {
      console.error('❌ Error fetching system stats:', err);
      setError(err.response?.data?.message || 'Gagal mengambil statistik sistem');
    } finally {
      setStatsLoading(false);
    }
  };

  // Nuclear Button 1: Reset Projects Only
  const resetProjectsOnly = async (): Promise<ResetResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔥 Executing Nuclear Button 1: Reset Projects Only');
      
      const response = await axios.post<ResetResponse>('/admin/maintenance/reset-projects-only');
      
      console.log('✅ Reset Projects Only success:', response.data);
      
      // Refresh stats after reset
      await fetchSystemStats();
      
      return response.data;
    } catch (err: any) {
      console.error('❌ Reset Projects Only failed:', err);
      const errorMessage = err.response?.data?.message || 'Gagal mereset proyek';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Nuclear Button 2: Reset Academic Year
  const resetAcademicYear = async (): Promise<ResetResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔥🔥 Executing Nuclear Button 2: Reset Academic Year');
      
      const response = await axios.post<ResetResponse>('/admin/maintenance/reset-academic-year');
      
      console.log('✅ Reset Academic Year success:', response.data);
      
      // Refresh stats after reset
      await fetchSystemStats();
      
      return response.data;
    } catch (err: any) {
      console.error('❌ Reset Academic Year failed:', err);
      const errorMessage = err.response?.data?.message || 'Gagal mereset tahun ajaran';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Nuclear Button 3: Total System Reset
  const totalSystemReset = async (): Promise<ResetResponse> => {
    try {
      setIsLoading(true);
      setError(null);

      console.log('🔥🔥🔥 Executing Nuclear Button 3: TOTAL SYSTEM RESET');
      
      const response = await axios.post<ResetResponse>('/admin/maintenance/total-system-reset');
      
      console.log('✅ Total System Reset success:', response.data);
      
      // Don't refresh stats after total reset since user will be logged out
      
      return response.data;
    } catch (err: any) {
      console.error('❌ Total System Reset failed:', err);
      const errorMessage = err.response?.data?.message || 'Gagal melakukan total reset';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Clear error state
  const clearError = () => {
    setError(null);
  };

  return {
    // State
    isLoading,
    systemStats,
    statsLoading,
    error,
    
    // Actions
    fetchSystemStats,
    resetProjectsOnly,
    resetAcademicYear,
    totalSystemReset,
    clearError,
  };
};
