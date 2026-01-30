import axios from 'axios';
import { env } from 'next-runtime-env';

const axiosInstance = axios.create({
    baseURL: env('NEXT_PUBLIC_API_URL') || '/api',
    withCredentials: true, // Enable cookies for stateful authentication
    headers: {
        'X-Requested-With': 'XMLHttpRequest',
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds timeout
});

// Request Interceptor: No need to manually attach tokens - cookies handle this
axiosInstance.interceptors.request.use(
    (config) => {
        // Cookies are automatically sent with withCredentials: true
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle errors and session expiration
axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Session expired or invalid - clear any stored user data
            if (typeof window !== 'undefined') {
                // Clear any stored user data from localStorage/cookies if any
                localStorage.removeItem('user');
                
                // Only redirect if we're in the browser and not already on login/auth pages or homepage
                const currentPath = window.location.pathname;
                const isOnPublicPage = ['/login', '/register', '/'].includes(currentPath);
                
                if (!isOnPublicPage) {
                    console.log('🔄 401 detected, redirecting to login from:', currentPath);
                    window.location.href = '/login';
                }
            }
        }
        
        // Enhanced error object for SWR
        const enhancedError = {
            ...error,
            status: error.response?.status,
            message: error.response?.data?.message || error.message,
            data: error.response?.data
        };
        
        return Promise.reject(enhancedError);
    }
);

// SWR-compatible fetcher function (with auth)
export const fetcher = async (url: string) => {
    const response = await axiosInstance.get(url);
    return response.data;
};

// Public fetcher function (without auth token)
export const publicFetcher = async (url: string) => {
    const response = await axios.get(`${env('NEXT_PUBLIC_API_URL') || '/api'}${url}`, {
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        timeout: 60000,
    });
    return response.data;
};

// Helper function for POST requests with SWR mutation
export const poster = async (url: string, data: any, config?: any) => {
    // If data is FormData, let browser set Content-Type automatically
    const requestConfig = data instanceof FormData ? {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': undefined // Let browser set multipart boundary
        }
    } : config;
    
    const response = await axiosInstance.post(url, data, requestConfig);
    return response.data;
};

// Helper function for PUT requests with SWR mutation  
export const putter = async (url: string, data: any, config?: any) => {
    // If data is FormData, let browser set Content-Type automatically
    const requestConfig = data instanceof FormData ? {
        ...config,
        headers: {
            ...config?.headers,
            'Content-Type': undefined // Let browser set multipart boundary
        }
    } : config;
    
    const response = await axiosInstance.put(url, data, requestConfig);
    return response.data;
};

// Helper function for DELETE requests with SWR mutation
export const deleter = async (url: string) => {
    const response = await axiosInstance.delete(url);
    return response.data;
};

export default axiosInstance;