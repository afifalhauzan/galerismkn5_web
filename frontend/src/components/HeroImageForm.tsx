import { useState, useRef, useEffect } from 'react';
import { HeroImage, CreateHeroImageData, UpdateHeroImageData } from '@/hooks/useHeroImageCrud';

interface HeroImageFormProps {
  heroImage?: HeroImage | null;
  onSubmit: (data: CreateHeroImageData | UpdateHeroImageData) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export default function HeroImageForm({ 
  heroImage, 
  onSubmit, 
  onCancel, 
  isLoading 
}: HeroImageFormProps) {
  const [formData, setFormData] = useState({
    title: heroImage?.title || '',
    subtitle: heroImage?.subtitle || '',
    is_active: heroImage?.is_active ?? true,
    sort_order: heroImage?.sort_order || 1,
  });
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(
    heroImage?.image_url || null
  );
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    console.log('📝 HeroImageForm initialized:', {
      mode: heroImage ? 'edit' : 'create',
      heroImage,
      formData
    });
  }, [heroImage, formData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;
    
    const newValue = type === 'checkbox' ? checked : 
                    type === 'number' ? parseInt(value) || 0 : value;
    
    console.log(`📝 Input changed: ${name} = ${newValue}`);
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('📁 File selected:', file);
    
    if (file) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
      if (!allowedTypes.includes(file.type)) {
        console.error('❌ Invalid file type:', file.type);
        setErrors(prev => ({
          ...prev,
          image: 'File harus berupa gambar (JPEG, PNG, JPG, GIF, atau WebP)'
        }));
        return;
      }

      // Validate file size (2MB)
      const maxSize = 2 * 1024 * 1024; // 2MB
      if (file.size > maxSize) {
        console.error('❌ File too large:', file.size);
        setErrors(prev => ({
          ...prev,
          image: 'File tidak boleh lebih dari 2MB'
        }));
        return;
      }

      setSelectedFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        console.log('🖼️ Image preview created');
        setImagePreview(result);
      };
      reader.readAsDataURL(file);
      
      // Clear any previous error
      setErrors(prev => ({
        ...prev,
        image: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Judul wajib diisi';
    }
    
    if (!formData.subtitle.trim()) {
      newErrors.subtitle = 'Subtitle wajib diisi';
    }
    
    if (!heroImage && !selectedFile) {
      newErrors.image = 'Gambar wajib diupload';
    }
    
    if (formData.sort_order < 0) {
      newErrors.sort_order = 'Urutan tidak boleh kurang dari 0';
    }

    console.log('✅ Form validation:', { isValid: Object.keys(newErrors).length === 0, errors: newErrors });
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('🚀 Form submitted:', {
      formData,
      selectedFile,
      mode: heroImage ? 'edit' : 'create'
    });

    if (!validateForm()) {
      console.error('❌ Form validation failed');
      return;
    }

    try {
      if (heroImage) {
        // Update mode
        const updateData: UpdateHeroImageData = {
          title: formData.title,
          subtitle: formData.subtitle,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        };
        
        if (selectedFile) {
          updateData.image = selectedFile;
        }
        
        console.log('🔄 Updating hero image with data:', updateData);
        await onSubmit(updateData);
      } else {
        // Create mode
        const createData: CreateHeroImageData = {
          title: formData.title,
          subtitle: formData.subtitle,
          image: selectedFile!,
          is_active: formData.is_active,
          sort_order: formData.sort_order,
        };
        
        console.log('➕ Creating hero image with data:', createData);
        await onSubmit(createData);
      }
      
      console.log('✅ Form submission successful');
    } catch (error) {
      console.error('❌ Form submission failed:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto m-4">
        <form onSubmit={handleSubmit} className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-900">
              {heroImage ? 'Edit Hero Image' : 'Tambah Hero Image'}
            </h2>
            <button
              type="button"
              onClick={() => {
                console.log('❌ Form cancelled');
                onCancel();
              }}
              className="text-gray-400 hover:text-gray-600"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Judul *
              </label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan judul hero image"
              />
              {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
            </div>

            {/* Subtitle */}
            <div>
              <label htmlFor="subtitle" className="block text-sm font-medium text-gray-700 mb-1">
                Subtitle *
              </label>
              <textarea
                id="subtitle"
                name="subtitle"
                rows={3}
                value={formData.subtitle}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.subtitle ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="Masukkan subtitle hero image"
              />
              {errors.subtitle && <p className="mt-1 text-sm text-red-600">{errors.subtitle}</p>}
            </div>

            {/* Image Upload */}
            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Gambar {!heroImage && '*'}
              </label>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mb-3">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-48 object-cover rounded-md border border-gray-300"
                  />
                </div>
              )}
              
              <input
                type="file"
                id="image"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
              />
              
              <button
                type="button"
                onClick={() => {
                  console.log('📁 Opening file picker');
                  fileInputRef.current?.click();
                }}
                className="w-full px-4 py-2 border-2 border-dashed border-gray-300 rounded-md text-gray-600 hover:border-blue-400 hover:text-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {imagePreview ? 'Ganti Gambar' : 'Pilih Gambar'}
              </button>
              
              {errors.image && <p className="mt-1 text-sm text-red-600">{errors.image}</p>}
              
              <p className="mt-1 text-sm text-gray-500">
                Format yang didukung: JPEG, PNG, JPG, GIF, WebP. Maksimal 2MB.
              </p>
            </div>

            {/* Sort Order */}
            <div>
              <label htmlFor="sort_order" className="block text-sm font-medium text-gray-700 mb-1">
                Urutan Tampilan *
              </label>
              <input
                type="number"
                id="sort_order"
                name="sort_order"
                min="0"
                value={formData.sort_order}
                onChange={handleInputChange}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.sort_order ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.sort_order && <p className="mt-1 text-sm text-red-600">{errors.sort_order}</p>}
              <p className="mt-1 text-sm text-gray-500">
                Angka yang lebih kecil akan ditampilkan lebih dulu
              </p>
            </div>

            {/* Active Status */}
            <div>
              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="is_active"
                  checked={formData.is_active}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">
                  Aktif (tampilkan di carousel)
                </span>
              </label>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => {
                console.log('❌ Form cancelled');
                onCancel();
              }}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  {heroImage ? 'Mengupdate...' : 'Menyimpan...'}
                </div>
              ) : (
                heroImage ? 'Update' : 'Simpan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}