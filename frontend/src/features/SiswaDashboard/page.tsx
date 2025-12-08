"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserStats } from "@/hooks/useApi";

// Siswa Dashboard Component
export default function SiswaDashboard({ user, logout }: { user: any, logout: () => void }) {
    const { stats, isLoading: statsLoading, isError } = useUserStats();

    console.log('Siswa Dashboard Stats:', stats);

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 md:pt-15">
            {/* Siswa Header */}

            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="px-4 py-6 sm:px-0">
                    {/* Welcome Section */}
                    <div className="bg-white overflow-hidden shadow rounded-lg mb-6">
                        <div className="px-6 py-8">
                            <div className="flex items-center">
                                <div className="flex-1">
                                    <h2 className="text-2xl font-bold text-gray-900">
                                        🎓 Halo, {user.name}!
                                    </h2>
                                    <p className="mt-2 text-gray-600">
                                        Jelajahi galeri foto dan momen terbaik SMKN 5
                                    </p>
                                </div>
                                <div className="flex-shrink-0">
                                    <div className="h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-sm border p-6">
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Jurusan</label>
                                <p className="text-sm text-gray-900 mt-1">{user.jurusan?.nama || 'Jurusan tidak ditemukan'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Kelas</label>
                                <p className="text-sm text-gray-900 mt-1">{user.kelas || 'Kelas tidak ditemukan'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">Email</label>
                                <p className="text-sm text-gray-900 mt-1">{user?.email || '-'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-500">NIS</label>
                                <p className="text-sm text-gray-900 mt-1">{user?.nis_nip || '-'}</p>
                            </div>
                        </div>
                    </div>

                    {/* Siswa Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 my-6">
                        <div className="bg-white overflow-hidden shadow rounded-lg">
                            <div className="p-6">
                                <div className="flex items-center">
                                    <div className="flex-shrink-0">
                                        <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div className="ml-5 w-0 flex-1">
                                        <dl>
                                            <dt className="text-sm font-medium text-gray-500 truncate">Jumlah Karya</dt>
                                            <dd className="text-lg font-medium text-gray-900">
                                                {statsLoading ? (
                                                    <div className="animate-pulse bg-gray-200 h-6 w-8 rounded"></div>
                                                ) : (
                                                    stats.jumlahKarya || 0
                                                )}
                                            </dd>
                                        </dl>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Siswa Actions */}
                    <div className="bg-white shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Aktivitas Siswa
                            </h3>
                        </div>
                        <div className="px-6 py-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Jelajahi Galeri</p>
                                        <p className="text-xs text-gray-500">Lihat foto-foto terbaru</p>
                                    </div>
                                </button>

                                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Koleksi Favorit</p>
                                        <p className="text-xs text-gray-500">Simpan foto favorit</p>
                                    </div>
                                </button>

                                <button className="flex items-center p-4 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                    <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                                    </svg>
                                    <div className="ml-3 text-left">
                                        <p className="text-sm font-medium text-gray-900">Bagikan</p>
                                        <p className="text-xs text-gray-500">Share ke media sosial</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="w-full mt-10 p-8 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                    >
                        Keluar Akun
                    </button>
                </div>
            </div>
        </div>
    );
}