import useSWR from 'swr';
import axios from '@/lib/axios';
import { fetcher, publicFetcher } from '@/lib/axios';
import { env } from 'next-runtime-env';

interface PasswordCheckResponse {
  success: boolean;
  needs_password_change?: boolean;
  message?: string;
  user_role?: string;
}

interface PasswordRequirementsResponse {
  success: boolean;
  data: {
    min_length: number;
    requires_confirmation: boolean;
  };
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

interface ChangePasswordResponse {
  success: boolean;
  message: string;
}

export function usePasswordCheck() {
  const { data, error, isLoading, mutate } = useSWR<PasswordCheckResponse>(
    '/auth/password-check',
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      shouldRetryOnError: false,
      errorRetryCount: 1,
    }
  );

  return {
    needsPasswordChange: data?.needs_password_change || false,
    userRole: data?.user_role,
    isLoading,
    error,
    mutate,
  };
}

export function usePasswordRequirements() {
  const { data, error, isLoading } = useSWR<PasswordRequirementsResponse>(
    '/auth/password-requirements',
    publicFetcher,
    {
      revalidateOnFocus: false,
      shouldRetryOnError: false,
    }
  );

  return {
    requirements: data?.data,
    isLoading,
    error,
  };
}

export async function changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
  try {
    // Get backend URL for CSRF cookie (same as AuthContext)
    const backendUrl = env('NEXT_PUBLIC_BACKEND_URL') || 'http://localhost:8000';

    // First, get the CSRF cookie from Laravel Sanctum (same as AuthContext)
    await axios.get("/sanctum/csrf-cookie", {
      baseURL: backendUrl,
      withCredentials: true
    });

    // Then make the change password request using axios (same pattern as AuthContext)
    const response = await axios.post("/auth/change-password", data);
    
    console.log('✅ Change password success:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Change password error:', error);
    
    // Handle different error cases (same pattern as AuthContext)
    if (error.response?.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    const errorMessage = error.response?.data?.message || "Failed to change password";
    console.log('❌ Error response:', error.response?.data);
    throw new Error(errorMessage);
  }
}