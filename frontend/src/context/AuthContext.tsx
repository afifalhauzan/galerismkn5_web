"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "@/lib/axios";
import { useRouter } from "next/navigation";
import { Jurusan } from "@/types/proyek";
import { Kelas } from "@/types/proyek";
import { env } from 'next-runtime-env';

export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'guru' | 'siswa';
    nis_nip?: string;
    jurusan_id?: number;
    jurusan_name?: string;
    jurusan?: Jurusan;
    jurusans?: Jurusan[];
    kelas_id?: number;
    kelas?: Kelas;
    created_at: string;
    updated_at: string;
}

interface AuthContextType {
    user: User | null;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, nis: string, password: string, role: string, jurusan_id: number, kelas?: string) => Promise<void>;
    logout: () => Promise<void>;
    isLoading: boolean;
    error: string | null;
    clearError: () => void;
    setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    // Helper to clear error
    const clearError = () => setError(null);

    // Check for existing session on app load
    useEffect(() => {
        const checkSession = async () => {
            try {
                // Try to get current user - this will work if session is valid
                const response = await axios.get("/user");
                const userData = response.data.user || response.data;
                
                // Add helper methods to user object
                const userWithMethods = {
                    ...userData,
                    isGuru: () => userData.role === 'guru',
                    isSiswa: () => userData.role === 'siswa'
                };
                
                setUser(userWithMethods);
            } catch (error) {
                // No valid session, user is not authenticated
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkSession();
    }, []);

    const login = async (email: string, password: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Get backend URL for CSRF cookie
            const backendUrl = env('NEXT_PUBLIC_BACKEND_URL') || 'http://localhost:8000';

            // First, get the CSRF cookie from Laravel Sanctum
            await axios.get("/sanctum/csrf-cookie", {
                baseURL: backendUrl,
                withCredentials: true
            });

            // Then attempt login
            const response = await axios.post("/login", { email, password });
            
            // Extract user data from response
            const userData = response.data.user || response.data;

            // Add helper methods to user object
            const userWithMethods = {
                ...userData,
                isGuru: () => userData.role === 'guru',
                isSiswa: () => userData.role === 'siswa'
            };

            setUser(userWithMethods);
            
            router.push("/dashboard"); // Redirect after login
        } catch (err: any) {
            console.error('Login error:', err);
            setError(err.response?.data?.message || "Login failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (name: string, email: string, nis: string, password: string, role: string, jurusan_id: number, kelas?: string) => {
        try {
            setIsLoading(true);
            setError(null);

            // Get backend URL for CSRF cookie
            const backendUrl = env('NEXT_PUBLIC_BACKEND_URL') || 'http://localhost:8000';

            // First, get the CSRF cookie from Laravel Sanctum
            await axios.get("/sanctum/csrf-cookie", {
                baseURL: backendUrl,
                withCredentials: true
            });

            const requestData: any = {
                name,
                email,
                nis_nip: nis,
                password,
                password_confirmation: password,
                role,
                jurusan_id
            };

            // Add kelas only for siswa role
            if (role === 'siswa' && kelas) {
                requestData.kelas = kelas;
            }

            const response = await axios.post("/register", requestData);

            // Extract user data from response
            const userData = response.data.user || response.data;

            // Add helper methods to user object
            const userWithMethods = {
                ...userData,
                isGuru: () => userData.role === 'guru',
                isSiswa: () => userData.role === 'siswa'
            };

            setUser(userWithMethods);
            
            router.push("/dashboard"); // Redirect after registration
        } catch (err: any) {
            console.error('Registration error:', err);
            setError(err.response?.data?.message || "Registration failed");
            throw err;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            setIsLoading(true);
            
            // Attempt to logout on server (best effort)
            try {
                await axios.post("/logout");
            } catch {
                // Continue logout even if server request fails
            }
        } finally {
            // Clear local state regardless of server response
            setUser(null);
            setIsLoading(false);
            router.push("/login");
        }
    };

    return (
        <AuthContext.Provider value={{ 
            user, 
            login, 
            register, 
            logout, 
            isLoading, 
            error, 
            clearError,
            setUser
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};