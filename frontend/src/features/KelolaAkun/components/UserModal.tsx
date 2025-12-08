import { useState, useEffect } from "react";
import { User, CreateUserData, UpdateUserData, Jurusan } from "@/types/proyek";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  user?: User | null;
  jurusans: Jurusan[];
  isLoading?: boolean;
}

const KELAS_OPTIONS = ["10", "11", "12"];

export default function UserModal({ isOpen, onClose, onSubmit, user, jurusans, isLoading }: UserModalProps) {
  const [formData, setFormData] = useState<CreateUserData>({
    name: '',
    email: '',
    password: '',
    role: 'siswa',
    nis_nip: '',
    jurusan_id: 0,
    kelas: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen) {
      if (user) {
        setFormData({
          name: user.name,
          email: user.email,
          password: '',
          role: user.role as 'guru' | 'siswa',
          nis_nip: user.nis_nip || '',
          jurusan_id: user.jurusan_id || 0,
          kelas: user.kelas || ''
        });
      } else {
        setFormData({
          name: '',
          email: '',
          password: '',
          role: 'siswa',
          nis_nip: '',
          jurusan_id: 0,
          kelas: ''
        });
      }
      setErrors({});
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const submitData = { ...formData };
      
      // Remove password if empty for update
      if (user && !submitData.password) {
        delete (submitData as any).password;
      }
      
      // Set kelas to empty if role is guru
      if (submitData.role === 'guru') {
        submitData.kelas = '';
      }

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      if (error.message.includes('validation') && error.errors) {
        setErrors(error.errors);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/40 bg-opacity-50 flex items-center justify-center z-100 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">
              {user ? 'Edit Akun' : 'Tambah Akun Baru'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
              required
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
              required
            />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password {!user && '*'}
              {user && <span className="text-gray-500 text-sm">(Kosongkan jika tidak ingin mengubah)</span>}
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan password"
              required={!user}
            />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Peran *
            </label>
            <select
              id="role"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as 'guru' | 'siswa' })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.role ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
            </select>
            {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role}</p>}
          </div>

          {/* NIS/NIP */}
          <div>
            <label htmlFor="nis_nip" className="block text-sm font-medium text-gray-700 mb-1">
              {formData.role === 'guru' ? 'NIP' : 'NIS'} *
            </label>
            <input
              type="text"
              id="nis_nip"
              value={formData.nis_nip}
              onChange={(e) => setFormData({ ...formData, nis_nip: e.target.value })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.nis_nip ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`Masukkan ${formData.role === 'guru' ? 'NIP' : 'NIS'}`}
              required
            />
            {errors.nis_nip && <p className="mt-1 text-sm text-red-600">{errors.nis_nip}</p>}
          </div>

          {/* Jurusan */}
          <div>
            <label htmlFor="jurusan_id" className="block text-sm font-medium text-gray-700 mb-1">
              Jurusan *
            </label>
            <select
              id="jurusan_id"
              value={formData.jurusan_id}
              onChange={(e) => setFormData({ ...formData, jurusan_id: parseInt(e.target.value) })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                errors.jurusan_id ? 'border-red-500' : 'border-gray-300'
              }`}
              required
            >
              <option value={0}>Pilih Jurusan</option>
              {jurusans.map((jurusan) => (
                <option key={jurusan.id} value={jurusan.id}>
                  {jurusan.nama}
                </option>
              ))}
            </select>
            {errors.jurusan_id && <p className="mt-1 text-sm text-red-600">{errors.jurusan_id}</p>}
          </div>

          {/* Kelas (only for siswa) */}
          {formData.role === 'siswa' && (
            <div>
              <label htmlFor="kelas" className="block text-sm font-medium text-gray-700 mb-1">
                Kelas *
              </label>
              <select
                id="kelas"
                value={formData.kelas}
                onChange={(e) => setFormData({ ...formData, kelas: e.target.value })}
                className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                  errors.kelas ? 'border-red-500' : 'border-gray-300'
                }`}
                required
              >
                <option value="">Pilih Kelas</option>
                {KELAS_OPTIONS.map((kelas) => (
                  <option key={kelas} value={kelas}>
                    Kelas {kelas}
                  </option>
                ))}
              </select>
              {errors.kelas && <p className="mt-1 text-sm text-red-600">{errors.kelas}</p>}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 hover:bg-gray-300 rounded-lg transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {user ? 'Update' : 'Tambah'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}