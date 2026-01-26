import useSWR from 'swr';
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

// Helper function to get token from cookies
function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
  
  if (tokenCookie) {
    return tokenCookie.split('=')[1];
  }
  
  return null;
}

export async function changePassword(data: ChangePasswordData): Promise<ChangePasswordResponse> {
  // Try to get token from cookies first, then localStorage
  const token = getTokenFromCookie() || localStorage.getItem('token');
  console.log('🔑 Token from cookies:', getTokenFromCookie() ? 'Present' : 'Missing');
  console.log('🔑 Token from localStorage:', localStorage.getItem('token') ? 'Present' : 'Missing');
  console.log('🔑 Using token:', token ? 'Present' : 'Missing');
  
  const response = await fetch(`${env('NEXT_PUBLIC_API_URL')}/auth/change-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      'Accept': 'application/json', // This is important for Laravel to return JSON instead of redirect
    },
    body: JSON.stringify(data),
  });

  console.log('📡 Change password response status:', response.status);

  if (!response.ok) {
    // Handle different error cases
    if (response.status === 401) {
      throw new Error('Authentication failed. Please log in again.');
    }
    
    try {
      const errorData = await response.json();
      console.log('❌ Error response:', errorData);
      throw new Error(errorData.message || 'Failed to change password');
    } catch (parseError) {
      // If we can't parse the response, throw a generic error
      throw new Error(`Server error: ${response.status} ${response.statusText}`);
    }
  }

  const result = await response.json();
  console.log('✅ Change password success:', result);
  return result;
}