"use client";

import { useProyek } from "@/hooks/ProjekHooks";
import { useParams, useRouter } from "next/navigation";
import { useState } from "react";

export default function DetailKaryaSiswa({ user, logout }: { user: any; logout: () => void }) {
    const params = useParams();
    const router = useRouter();
    const proyekId = params.id as string;
    const { proyek, isLoading, isError, mutate } = useProyek(proyekId);
    const [showReview, setShowReview] = useState(false);
    const imageUrl = process.env.NEXT_PUBLIC_BACKEND_URL || '';

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Memuat detail proyek...</p>
                </div>
            </div>
        );
    }

    if (isError || !proyek) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center md:pt-20">
                <div className="text-center">
                    <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg">
                        <p className="font-medium">Error:</p>
                        <p className="text-sm">Proyek tidak ditemukan atau gagal memuat data</p>
                        <div className="mt-4 space-x-3">
                            <button
                                onClick={() => mutate()}
                                className="text-sm bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                            >
                                Coba Lagi
                            </button>
                            <button
                                onClick={() => router.back()}
                                className="text-sm bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700"
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 pt-10 md:pt-25">
            {/* Header */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:py-2">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="flex items-center text-gray-600 hover:text-gray-900"
                    >
                        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        Kembali
                    </button>
                    <div className="border-l h-6 border-gray-300"></div>
                    <h1 className="text-xl font-semibold text-gray-900">Detail Karya Siswa</h1>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8 md:py-4">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Project Details */}
                        <div className="bg-white rounded-lg shadow-sm border">
                            <div className="p-6">
                                <div className="flex items-start justify-between mb-4">
                                    <h2 className="text-2xl font-bold text-gray-900">{proyek.judul}</h2>
                                    <span className={`px-3 py-1 text-sm font-medium rounded-full ${proyek.status === 'terkirim'
                                            ? 'bg-blue-100 text-blue-800'
                                            : proyek.status === 'dinilai'
                                                ? 'bg-green-100 text-green-800'
                                                : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {proyek.status === 'terkirim' ? 'Terkirim' :
                                            proyek.status === 'dinilai' ? 'Dinilai' : proyek.status}
                                    </span>
                                </div>

                                <div className="prose max-w-none">
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
                                    <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
                                        {proyek.deskripsi}
                                    </p>
                                </div>

                                {proyek.tautan_proyek && (
                                    <div className="mt-6 pt-6 border-t">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3">Tautan Proyek</h3>
                                        <a
                                            href={proyek.tautan_proyek}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center text-blue-600 hover:text-blue-800"
                                        >
                                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                            </svg>
                                            {proyek.tautan_proyek}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Project Image */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            {proyek.image_url ? (
                                <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
                                    <img
                                        src={`${imageUrl}${proyek.image_url}`}  
                                        alt={proyek.judul}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ) : (
                                <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
                                    <div className="text-center">
                                        <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <p className="mt-2 text-sm text-gray-500">Tidak ada gambar</p>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Penilaian Section */}
                        {proyek.penilaian && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Penilaian</h3>
                                <div className="space-y-4">
                                    <div className="flex items-center">
                                        <span className="text-sm font-medium text-gray-500 w-20">Nilai:</span>
                                        <div className="flex items-center">
                                            <span className="text-lg font-bold text-sky-600 mr-1">
                                                {proyek.penilaian.nilai}
                                            </span>
                                            <span className="text-sm text-gray-500">/100</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-sm font-medium text-gray-500 w-20 mt-1">Penilai:</span>
                                        <span className="text-sm text-gray-900">
                                            {proyek.penilaian.guru?.name || 'Guru tidak ditemukan'}
                                        </span>
                                    </div>
                                    {proyek.penilaian.catatan && (
                                        <div className="flex items-start">
                                            <span className="text-sm font-medium text-gray-500 w-20 mt-1">Catatan:</span>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {proyek.penilaian.catatan}
                                            </p>
                                        </div>
                                    )}
                                    <div className="flex items-start">
                                        <span className="text-sm font-medium text-gray-500 w-20 mt-1">Tanggal:</span>
                                        <span className="text-sm text-gray-700">
                                            {new Date(proyek.penilaian.created_at).toLocaleDateString('id-ID', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Project Info */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Informasi Proyek</h3>
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Oleh</label>
                                    <p className="text-sm text-gray-900 mt-1">{proyek.user?.name || 'Pengguna tidak ditemukan'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Jurusan</label>
                                    <p className="text-sm text-gray-900 mt-1">{proyek.jurusan?.nama || 'Jurusan tidak ditemukan'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Email</label>
                                    <p className="text-sm text-gray-900 mt-1">{proyek.user?.email || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">NIS/NIP</label>
                                    <p className="text-sm text-gray-900 mt-1">{proyek.user?.nis_nip || '-'}</p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Tanggal Dibuat</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(proyek.created_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-500">Terakhir Diupdate</label>
                                    <p className="text-sm text-gray-900 mt-1">
                                        {new Date(proyek.updated_at).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Rating Display */}
                        {proyek.penilaian && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Rating</h3>
                                <div className="text-center">
                                    <div className="flex justify-center items-center mb-2">
                                        {Array.from({ length: 5 }, (_, i) => {
                                            const rating = Math.round((proyek.penilaian!.nilai / 100) * 5);
                                            return (
                                                <svg
                                                    key={i}
                                                    className={`w-6 h-6 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                    fill="currentColor"
                                                    viewBox="0 0 20 20"
                                                >
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                </svg>
                                            );
                                        })}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                        {Math.round((proyek.penilaian.nilai / 100) * 5)}/5
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Actions */}
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Aksi</h3>
                            <div className="space-y-3">
                                <button className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm">
                                    Edit Proyek
                                </button>
                                <button
                                    onClick={() => setShowReview(!showReview)}
                                    className="w-full bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors text-sm"
                                >
                                    {showReview ? 'Sembunyikan Review' : 'Lihat Review'}
                                </button>
                                <button className="w-full border border-red-300 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors text-sm">
                                    Hapus Proyek
                                </button>
                            </div>
                        </div>

                        {/* Review Section */}
                        {showReview && proyek.penilaian && (
                            <div className="bg-white rounded-lg shadow-sm border p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Review</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <span className="text-sm font-medium text-blue-600">
                                                {proyek.penilaian.guru?.name?.charAt(0) || 'G'}
                                            </span>
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center space-x-2 mb-1">
                                                <span className="font-medium text-sm text-gray-900">
                                                    {proyek.penilaian.guru?.name || 'Guru'}
                                                </span>
                                                <div className="flex">
                                                    {Array.from({ length: 5 }, (_, i) => {
                                                        const rating = Math.round((proyek.penilaian!.nilai / 100) * 5);
                                                        return (
                                                            <svg
                                                                key={i}
                                                                className={`w-4 h-4 ${i < rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                                                fill="currentColor"
                                                                viewBox="0 0 20 20"
                                                            >
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                            </svg>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                            <p className="text-sm text-gray-700 leading-relaxed">
                                                {proyek.penilaian.catatan || 'Tidak ada catatan dari guru.'}
                                            </p>
                                            <p className="text-xs text-gray-500 mt-2">
                                                {new Date(proyek.penilaian.created_at).toLocaleDateString('id-ID')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
