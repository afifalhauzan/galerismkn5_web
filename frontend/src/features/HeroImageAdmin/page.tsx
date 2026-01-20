"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/spinner";
import {
    HiPhotograph,
    HiPlus,
    HiPencil,
    HiTrash,
    HiEye,
    HiX,
    HiCheck,
    HiExclamation,
} from "react-icons/hi";
import { useHeroImageCrud, HeroImage, CreateHeroImageData, UpdateHeroImageData } from '@/hooks/useHeroImageCrud';
import { HeroImageForm } from '@/features/HeroImageAdmin/components/HeroImageForm';

export default function HeroImageAdminPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    
    // Hero Image CRUD hook
    const {
        heroImages,
        isLoading,
        isError,
        createHeroImage,
        updateHeroImage,
        deleteHeroImage,
        toggleActive,
        isCreating,
        isUpdating,
        isDeleting,
    } = useHeroImageCrud();

    // UI State
    const [showForm, setShowForm] = useState(false);
    const [editingHeroImage, setEditingHeroImage] = useState<HeroImage | null>(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [deletingHeroImage, setDeletingHeroImage] = useState<HeroImage | null>(null);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [sortField, setSortField] = useState<keyof HeroImage>('sort_order');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    console.log('🎭 HeroImageAdminPage rendered:', {
        heroImagesCount: heroImages.length,
        isLoading,
        isError,
        showForm,
        editingHeroImage: editingHeroImage?.id
    });

    // Role Guard: Redirect if not admin
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'admin')) {
            router.push('/login');
            return;
        }
    }, [user, authLoading, router]);

    if (authLoading) {
        return <Spinner />;
    }

    if (!user || user.role !== 'admin') {
        return null;
    }

    // Event Handlers
    const handleCreate = () => {
        console.log('➕ Opening create form');
        setEditingHeroImage(null);
        setShowForm(true);
    };

    const handleEdit = (heroImage: HeroImage) => {
        console.log('✏️ Opening edit form for hero image:', heroImage.id);
        setEditingHeroImage(heroImage);
        setShowForm(true);
    };

    const handleDelete = (heroImage: HeroImage) => {
        console.log('🗑️ Opening delete confirmation for hero image:', heroImage.id);
        setDeletingHeroImage(heroImage);
        setShowDeleteModal(true);
    };

    const handleFormSubmit = async (data: CreateHeroImageData | UpdateHeroImageData) => {
        try {
            if (editingHeroImage) {
                console.log('🔄 Updating hero image:', editingHeroImage.id, data);
                await updateHeroImage(editingHeroImage.id, data as UpdateHeroImageData);
                console.log('✅ Hero image updated successfully');
            } else {
                console.log('➕ Creating new hero image:', data);
                await createHeroImage(data as CreateHeroImageData);
                console.log('✅ Hero image created successfully');
            }
            
            setShowForm(false);
            setEditingHeroImage(null);
        } catch (error) {
            console.error('❌ Form submission failed:', error);
            // Error is already logged in the hook
        }
    };

    const handleFormCancel = () => {
        console.log('❌ Form cancelled');
        setShowForm(false);
        setEditingHeroImage(null);
    };

    const confirmDelete = async () => {
        if (!deletingHeroImage) return;
        
        try {
            console.log('🗑️ Confirming delete for hero image:', deletingHeroImage.id);
            await deleteHeroImage(deletingHeroImage.id);
            console.log('✅ Hero image deleted successfully');
            setShowDeleteModal(false);
            setDeletingHeroImage(null);
        } catch (error) {
            console.error('❌ Delete failed:', error);
            // Error is already logged in the hook
        }
    };

    const cancelDelete = () => {
        console.log('❌ Delete cancelled');
        setShowDeleteModal(false);
        setDeletingHeroImage(null);
    };

    const handleToggleActive = async (heroImage: HeroImage) => {
        try {
            console.log('🔄 Toggling active status for hero image:', heroImage.id);
            await toggleActive(heroImage.id, heroImage.is_active);
            console.log('✅ Active status toggled successfully');
        } catch (error) {
            console.error('❌ Toggle active failed:', error);
            // Error is already logged in the hook
        }
    };

    const handleImageClick = (imageUrl: string) => {
        console.log('🖼️ Opening image preview:', imageUrl);
        setSelectedImage(imageUrl);
    };

    const handleSort = (field: keyof HeroImage) => {
        console.log(`📊 Sorting by ${field}`);
        if (sortField === field) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortField(field);
            setSortDirection('asc');
        }
    };

    // Utility functions
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusBadge = (isActive: boolean) => {
        const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
        return isActive
            ? `${baseClasses} bg-green-100 text-green-800`
            : `${baseClasses} bg-red-100 text-red-800`;
    };

    const sortedHeroImages = [...heroImages].sort((a, b) => {
        let aValue = a[sortField];
        let bValue = b[sortField];

        // Handle different data types
        if (typeof aValue === 'string' && typeof bValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }

        if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
        return 0;
    });

    if (isError) {
        console.error('❌ Failed to load hero images:', isError);
        return (
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="pt-8 md:pt-24 pb-20 md:pb-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
                            <div className="text-red-600 mb-2">
                                <HiExclamation className="mx-auto h-12 w-12 mb-4" />
                            </div>
                            <h3 className="text-lg font-medium text-red-900 mb-2">Gagal Memuat Data</h3>
                            <p className="text-red-700">
                                Terjadi kesalahan saat memuat hero images. Silakan coba refresh halaman atau hubungi administrator.
                            </p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            
            <main className="pt-8 md:pt-24 pb-20 md:pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm border p-6">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <div className="bg-blue-100 p-2 rounded-lg">
                                        <HiPhotograph className="w-6 h-6 text-blue-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Kelola Gambar Halaman Utama
                                        </h1>
                                        <p className="text-gray-600">
                                            Atur carousel dan gambar hero untuk halaman utama
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleCreate}
                                    className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm transition-colors"
                                >
                                    <HiPlus className="w-5 h-5 mr-2" />
                                    Tambah Hero Image
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="bg-blue-100 p-2 rounded-lg">
                                    <HiPhotograph className="w-6 h-6 text-blue-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Total Images</p>
                                    <p className="text-2xl font-semibold text-gray-900">{heroImages.length}</p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="bg-green-100 p-2 rounded-lg">
                                    <HiCheck className="w-6 h-6 text-green-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Active Images</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {heroImages.filter(img => img.is_active).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                        
                        <div className="bg-white rounded-lg shadow-sm p-4">
                            <div className="flex items-center">
                                <div className="bg-yellow-100 p-2 rounded-lg">
                                    <HiX className="w-6 h-6 text-yellow-600" />
                                </div>
                                <div className="ml-4">
                                    <p className="text-sm text-gray-500">Inactive Images</p>
                                    <p className="text-2xl font-semibold text-gray-900">
                                        {heroImages.filter(img => !img.is_active).length}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Hero Images Table */}
                    {isLoading ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="flex justify-center items-center py-12">
                                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                <span className="ml-2 text-gray-600">Loading hero images...</span>
                            </div>
                        </div>
                    ) : heroImages.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="text-center py-12">
                                <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mx-4">
                                    <HiPhotograph className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                                    <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada gambar hero ditemukan</h3>
                                    <p className="text-gray-600 mb-4">Tambahkan gambar hero pertama untuk carousel website</p>
                                    <button
                                        onClick={handleCreate}
                                        className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
                                    >
                                        <HiPlus className="w-4 h-4 mr-2" />
                                        Tambah Hero Image
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-blue-600">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Preview
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700"
                                                onClick={() => handleSort('title')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Judul</span>
                                                    {sortField === 'title' && (
                                                        <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Subtitle
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700"
                                                onClick={() => handleSort('sort_order')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Urutan</span>
                                                    {sortField === 'sort_order' && (
                                                        <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700"
                                                onClick={() => handleSort('is_active')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Status</span>
                                                    {sortField === 'is_active' && (
                                                        <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th 
                                                className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider cursor-pointer hover:bg-blue-700"
                                                onClick={() => handleSort('created_at')}
                                            >
                                                <div className="flex items-center space-x-1">
                                                    <span>Dibuat</span>
                                                    {sortField === 'created_at' && (
                                                        <svg className={`w-4 h-4 ${sortDirection === 'desc' ? 'transform rotate-180' : ''}`} fill="currentColor" viewBox="0 0 20 20">
                                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                                        </svg>
                                                    )}
                                                </div>
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                                Aksi
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {sortedHeroImages.map((heroImage, index) => (
                                            <tr key={heroImage.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div 
                                                        className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden cursor-pointer hover:shadow-md transition-shadow"
                                                        onClick={() => handleImageClick(heroImage.image_url)}
                                                    >
                                                        <img
                                                            src={heroImage.image_url}
                                                            alt={heroImage.title}
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                console.error('🖼️ Image failed to load:', heroImage.image_url);
                                                                // e.currentTarget.src = '/placeholder-image.png';
                                                            }}
                                                        />
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                                                        {heroImage.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="text-sm text-gray-500 max-w-md truncate">
                                                        {heroImage.subtitle}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                                    {heroImage.sort_order}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <button
                                                        onClick={() => handleToggleActive(heroImage)}
                                                        className="focus:outline-none"
                                                    >
                                                        <span className={getStatusBadge(heroImage.is_active)}>
                                                            {heroImage.is_active ? 'Aktif' : 'Tidak Aktif'}
                                                        </span>
                                                    </button>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(heroImage.created_at)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                                                    <button
                                                        onClick={() => handleEdit(heroImage)}
                                                        className="inline-flex items-center px-3 py-1 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-md transition-colors"
                                                        title="Edit"
                                                    >
                                                        <HiPencil className="w-4 h-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(heroImage)}
                                                        className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                                                        title="Delete"
                                                    >
                                                        <HiTrash className="w-4 h-4" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* Form Modal */}
                    {showForm && (
                        <HeroImageForm
                            heroImage={editingHeroImage}
                            onSubmit={handleFormSubmit}
                            onCancel={handleFormCancel}
                            isLoading={isCreating || isUpdating}
                        />
                    )}

                    {/* Delete Confirmation Modal */}
                    {showDeleteModal && deletingHeroImage && (
                        <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50">
                            <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                                <div className="p-6">
                                    <div className="flex items-center mb-4">
                                        <div className="bg-red-100 p-2 rounded-full mr-3">
                                            <HiTrash className="w-6 h-6 text-red-600" />
                                        </div>
                                        <h3 className="text-lg font-medium text-gray-900">Hapus Hero Image</h3>
                                    </div>
                                    
                                    <div className="mb-6">
                                        <p className="text-gray-600 mb-4">
                                            Apakah Anda yakin ingin menghapus hero image "{deletingHeroImage.title}"?
                                        </p>
                                        
                                        {/* Image Preview */}
                                        <div className="w-full h-32 bg-gray-200 rounded-lg overflow-hidden">
                                            <img
                                                src={deletingHeroImage.image_url}
                                                alt={deletingHeroImage.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        
                                        <p className="text-red-600 text-sm mt-2 font-medium">
                                            Tindakan ini tidak dapat dibatalkan.
                                        </p>
                                    </div>
                                    
                                    <div className="flex justify-end space-x-3">
                                        <button
                                            onClick={cancelDelete}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            disabled={isDeleting}
                                        >
                                            Batal
                                        </button>
                                        <button
                                            onClick={confirmDelete}
                                            disabled={isDeleting}
                                            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isDeleting ? (
                                                <div className="flex items-center">
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    Menghapus...
                                                </div>
                                            ) : (
                                                'Hapus'
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Image Preview Modal */}
                    {selectedImage && (
                        <div 
                            className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
                            onClick={() => {
                                console.log('🖼️ Closing image preview');
                                setSelectedImage(null);
                            }}
                        >
                            <div className="max-w-4xl max-h-full p-4">
                                <img
                                    src={selectedImage}
                                    alt="Preview"
                                    className="max-w-full max-h-full object-contain rounded-lg"
                                    onClick={(e) => e.stopPropagation()}
                                />
                                <button
                                    onClick={() => setSelectedImage(null)}
                                    className="absolute top-4 right-4 text-white hover:text-gray-300 text-2xl font-bold bg-black bg-opacity-50 rounded-full w-10 h-10 flex items-center justify-center"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}