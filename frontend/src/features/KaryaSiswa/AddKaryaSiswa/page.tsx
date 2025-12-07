"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCreateProyek } from "@/hooks/ProjekHooks";
import { useAuth } from "@/context/AuthContext";

interface FormData {
    judul: string;
    deskripsi: string;
    tautan_proyek: string;
}

interface FormErrors {
    judul?: string;
    deskripsi?: string;
    tautan_proyek?: string;
}

export default function AddKaryaSiswa({ user, logout }: { user: any; logout: () => void }) {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const { createProyek, isCreating, error } = useCreateProyek();
    
    const [formData, setFormData] = useState<FormData>({
        judul: "",
        deskripsi: "",
        tautan_proyek: "",
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.judul.trim()) {
            newErrors.judul = "Judul karya harus diisi";
        }

        if (!formData.deskripsi.trim()) {
            newErrors.deskripsi = "Deskripsi karya harus diisi";
        } else if (formData.deskripsi.trim().length < 10) {
            newErrors.deskripsi = "Deskripsi minimal 10 karakter";
        }

        // Validate URL format if provided
        if (formData.tautan_proyek.trim()) {
            try {
                new URL(formData.tautan_proyek);
            } catch {
                newErrors.tautan_proyek = "Format URL tidak valid";
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Clear error for this field when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        if (!authUser?.jurusan_id) {
            setErrors({ judul: "User tidak memiliki jurusan yang valid" });
            return;
        }

        setIsSubmitting(true);

        try {
            await createProyek({
                judul: formData.judul.trim(),
                deskripsi: formData.deskripsi.trim(),
                tautan_proyek: formData.tautan_proyek.trim() || undefined,
                jurusan_id: authUser.jurusan_id,
                status: 'terkirim'
            });

            // Redirect to karya list on success
            router.push('/karya');
        } catch (err: any) {
            console.error('Error creating proyek:', err);
            
            // Handle validation errors from backend
            if (err.response?.data?.errors) {
                setErrors(err.response.data.errors);
            } else {
                setErrors({ 
                    judul: err.response?.data?.message || "Terjadi kesalahan saat menyimpan karya" 
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-10 md:pt-20">
            <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                        <Link
                            href="/karya"
                            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                        >
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            Kembali
                        </Link>
                        <div className="border-l h-6 border-gray-300"></div>
                        <h1 className="text-2xl font-bold text-gray-900">Unggah Karya</h1>
                    </div>
                    <p className="text-gray-600">Bagikan karya terbaikmu dengan komunitas SMKN 5!</p>
                </div>

                {/* Form */}
                <div className="bg-white rounded-lg shadow-sm border">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        {/* Judul Field */}
                        <div>
                            <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                                Judul <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="judul"
                                name="judul"
                                value={formData.judul}
                                onChange={handleInputChange}
                                placeholder="Isi judul karya..."
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.judul ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={isSubmitting}
                            />
                            {errors.judul && (
                                <p className="mt-1 text-sm text-red-600">{errors.judul}</p>
                            )}
                        </div>

                        {/* Deskripsi Field */}
                        <div>
                            <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                                Deskripsi <span className="text-red-500">*</span>
                            </label>
                            <textarea
                                id="deskripsi"
                                name="deskripsi"
                                rows={6}
                                value={formData.deskripsi}
                                onChange={handleInputChange}
                                placeholder="Isi deskripsi karya..."
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                    errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={isSubmitting}
                            />
                            {errors.deskripsi && (
                                <p className="mt-1 text-sm text-red-600">{errors.deskripsi}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Minimal 10 karakter. Jelaskan karya Anda dengan detail.
                            </p>
                        </div>

                        {/* File/Link Field */}
                        <div>
                            <label htmlFor="tautan_proyek" className="block text-sm font-medium text-gray-700 mb-2">
                                File/Link Proyek
                            </label>
                            <input
                                type="url"
                                id="tautan_proyek"
                                name="tautan_proyek"
                                value={formData.tautan_proyek}
                                onChange={handleInputChange}
                                placeholder="https://github.com/username/project atau link lainnya..."
                                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                    errors.tautan_proyek ? 'border-red-500' : 'border-gray-300'
                                }`}
                                disabled={isSubmitting}
                            />
                            {errors.tautan_proyek && (
                                <p className="mt-1 text-sm text-red-600">{errors.tautan_proyek}</p>
                            )}
                            <p className="mt-1 text-sm text-gray-500">
                                Opsional. Tambahkan link ke GitHub, portfolio online, atau platform lainnya.
                            </p>
                        </div>

                        {/* Info Section */}
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                            <div className="flex">
                                <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <div className="text-sm">
                                    <p className="text-blue-800 font-medium">Informasi Penting</p>
                                    <p className="text-blue-700 mt-1">
                                        Karya Anda akan otomatis tersimpan dengan status "Terkirim" dan siap untuk dinilai oleh guru.
                                        Pastikan semua informasi sudah benar sebelum mengunggah.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <div className="flex justify-end space-x-3 pt-6 border-t">
                            <Link
                                href="/karya"
                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
                            >
                                Batal
                            </Link>
                            <button
                                type="submit"
                                disabled={isSubmitting || isCreating}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
                            >
                                {(isSubmitting || isCreating) ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Mengunggah...
                                    </>
                                ) : (
                                    'Unggah Karya'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
