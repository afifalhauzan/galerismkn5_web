import { useState } from "react";
import { HeroImage } from "@/hooks/useHeroImageCrud";

interface HeroImageTableProps {
  heroImages: HeroImage[];
  onEdit: (heroImage: HeroImage) => void;
  onDelete: (heroImage: HeroImage) => void;
  onToggleActive: (heroImage: HeroImage) => void;
  isLoading: boolean;
}

export default function HeroImageTable({ 
  heroImages, 
  onEdit, 
  onDelete, 
  onToggleActive, 
  isLoading 
}: HeroImageTableProps) {
  const [sortField, setSortField] = useState<keyof HeroImage>('sort_order');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSort = (field: keyof HeroImage) => {
    console.log(`📊 Sorting by ${field}`);
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
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

  const handleImageClick = (imageUrl: string) => {
    console.log('🖼️ Opening image preview:', imageUrl);
    setSelectedImage(imageUrl);
  };

  const handleEdit = (heroImage: HeroImage) => {
    console.log('✏️ Editing hero image:', heroImage);
    onEdit(heroImage);
  };

  const handleDelete = (heroImage: HeroImage) => {
    console.log('🗑️ Attempting to delete hero image:', heroImage);
    onDelete(heroImage);
  };

  const handleToggleActive = (heroImage: HeroImage) => {
    console.log(`🔄 Toggling active status for hero image ${heroImage.id}:`, heroImage.is_active, '→', !heroImage.is_active);
    onToggleActive(heroImage);
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2 text-gray-600">Loading hero images...</span>
        </div>
      </div>
    );
  }

  if (heroImages.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="text-center py-12">
          <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 mx-4">
            <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada gambar hero ditemukan</h3>
            <p className="text-gray-600">Tambahkan gambar hero pertama untuk carousel website</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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
                          e.currentTarget.src = '/placeholder-image.png';
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
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      onClick={() => handleDelete(heroImage)}
                      className="inline-flex items-center px-3 py-1 bg-red-100 hover:bg-red-200 text-red-700 rounded-md transition-colors"
                      title="Delete"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

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
    </>
  );
}