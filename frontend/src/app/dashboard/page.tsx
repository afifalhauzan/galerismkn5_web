"use client";

import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
import axios from "@/lib/axios";

export default function Dashboard() {
    const { user, logout, isLoading } = useAuth();
    const [profileData, setProfileData] = useState(null);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [profileError, setProfileError] = useState("");



    const fetchProfile = async () => {
        try {
            setIsLoadingProfile(true);
            setProfileError("");
            const response = await axios.get("/profile");
            setProfileData(response.data);
        } catch (error: any) {
            setProfileError(error.response?.data?.message || "Failed to fetch profile");
        } finally {
            setIsLoadingProfile(false);
        }
    };

    useEffect(() => {
        if (user) {
            fetchProfile();
        }
    }, [user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="h-10 w-10 bg-indigo-600 rounded-lg flex items-center justify-center">
                                    <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                    </svg>
                                </div>
                            </div>
                            <div className="ml-4">
                                <h1 className="text-2xl font-bold text-gray-900">Galeri SMKN 5</h1>
                                <p className="text-sm text-gray-500">Dashboard</p>
                            </div>
                        </div>
                        
                        <div className="flex items-center space-x-4">
                            <div className="text-right">
                                <p className="text-sm font-medium text-gray-900">{user.name}</p>
                                <p className="text-xs text-gray-500 capitalize">
                                    {user.role} • {user.email}
                                </p>
                            </div>
                            <button
                                onClick={logout}
                                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors text-sm"
                            >
                                Logout
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-6 py-8">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        Selamat Datang, {user.name}! 👋
                                    </h2>
                                    <p className="mt-2 text-gray-600">
                                        Anda login sebagai{" "}
                                        <span className="font-medium capitalize text-indigo-600">
                                            {user.role}
                                        </span>
                                    </p>
                                    {user.isGuru() && (
                                        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-4">
                                            <div className="flex">
                                                <svg className="h-5 w-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                                </svg>
                                                <div className="ml-3">
                                                    <p className="text-sm text-blue-700">
                                                        <strong>Status Guru:</strong> Anda memiliki akses penuh untuk mengelola galeri dan konten.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </div>
                                <div className="flex-shrink-0">
                                    <div className={`h-16 w-16 rounded-full flex items-center justify-center text-white text-2xl font-bold ${
                                        user.isGuru() ? 'bg-green-500' : 'bg-blue-500'
                                    }`}>
                                        {user.name}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                User ID
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                #{user.id}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Status
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                Active
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">
                                                Role
                                            </dt>
                                            <dd className="text-lg font-medium text-gray-900 capitalize">
                                                {user.role}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Profile Data Section */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Data Profil dari API
                            </h3>
                            <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                Data yang diambil langsung dari endpoint /profile menggunakan Axios
                            </p>
                        </div>
                        <div className="px-6 py-4">
                            {isLoadingProfile ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
                                    <span className="ml-3 text-gray-600">Mengambil data...</span>
                                </div>
                            ) : profileError ? (
                                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                    <p className="font-medium">Error:</p>
                                    <p className="text-sm">{profileError}</p>
                                    <button 
                                        onClick={fetchProfile}
                                        className="mt-2 text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                                    >
                                        Coba Lagi
                                    </button>
                                </div>
                            ) : profileData ? (
                                <div className="space-y-4">
                                    <pre className="bg-gray-50 p-4 rounded-lg overflow-auto text-sm">
                                        {JSON.stringify(profileData, null, 2)}
                                    </pre>
                                    <div className="flex justify-between items-center">
                                        <p className="text-sm text-green-600">
                                            ✅ Berhasil mengambil data dari API
                                        </p>
                                        <button 
                                            onClick={fetchProfile}
                                            className="text-sm bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
                                        >
                                            Refresh Data
                                        </button>
                                    </div>
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-6 bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Quick Actions
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-indigo-50 transition-colors">
                                    <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Lihat Galeri</p>
                                        <p className="text-xs text-gray-500">Browse foto galeri</p>
                                    </div>
                                </button>

                                {user.isGuru() && (
                                    <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-colors">
                                        <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                        </svg>
                                        <div className="ml-3 text-left">
                                            <p className="text-sm font-medium text-gray-900">Upload Foto</p>
                                            <p className="text-xs text-gray-500">Tambah ke galeri</p>
                                        </div>
                                    </button>
                                )}

                                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Edit Profil</p>
                                        <p className="text-xs text-gray-500">Update informasi</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}