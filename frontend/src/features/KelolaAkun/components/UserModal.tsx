import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { User, CreateUserData, UpdateUserData, Jurusan } from "@/types/proyek";
import { useKelasByJurusan } from "@/hooks/KelasHooks";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateUserData | UpdateUserData) => void;
  user?: User | null;
  jurusans: Jurusan[];
  isLoading?: boolean;
  error?: any;
}

interface FormData {
  name: string;
  email: string;
  password: string;
  role: 'guru' | 'siswa';
  nis_nip: string;
  jurusan_id: number;
  jurusan_ids: number[];
  kelas_id?: number;
}

export default function UserModal({ isOpen, onClose, onSubmit, user, jurusans, isLoading, error }: UserModalProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors: formErrors }
  } = useForm<FormData>({
    defaultValues: {
      name: '',
      email: '',
      password: '',
      role: 'siswa',
      nis_nip: '',
      jurusan_id: 0,
      jurusan_ids: [],
      kelas_id: 0
    }
  });

  const watchedRole = watch('role');
  const watchedJurusanId = watch('jurusan_id');

  // Fetch kelas based on selected jurusan
  const { kelas, isLoading: kelasLoading } = useKelasByJurusan(watchedJurusanId > 0 ? watchedJurusanId : null);

  // Combine frontend (RHF) errors with backend errors
  const backendErrors = error?.errors || {};
  const allErrors = { ...formErrors, ...backendErrors };

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (isOpen) {
      if (user) {
        reset({
          name: user.name || '',
          email: user.email || '',
          password: '',
          role: user.role as 'guru' | 'siswa',
          nis_nip: user.nis_nip || '',
          jurusan_id: user.jurusan_id || 0,
          jurusan_ids: user.jurusan_ids || [],
          kelas_id: user.kelas_id || 0
        });
      } else {
        reset({
          name: '',
          email: '',
          password: '',
          role: 'siswa',
          nis_nip: '',
          jurusan_id: 0,
          jurusan_ids: [],
          kelas_id: 0
        });
      }
    }
  }, [isOpen, user, reset]);

  // Reset kelas_id when jurusan changes
  useEffect(() => {
    setValue('kelas_id', 0);
  }, [watchedJurusanId, setValue]);

  // Reset jurusan selections when role changes
  useEffect(() => {
    if (watchedRole === 'siswa') {
      setValue('jurusan_ids', []);
    } else if (watchedRole === 'guru') {
      setValue('jurusan_id', 0);
    }
  }, [watchedRole, setValue]);

  // Auto-set jurusan_id when guru selects jurusan_ids (for backend compatibility)
  const watchedJurusanIds = watch('jurusan_ids');
  useEffect(() => {
    if (watchedRole === 'guru' && watchedJurusanIds && watchedJurusanIds.length > 0) {
      setValue('jurusan_id', watchedJurusanIds[0]);
    }
  }, [watchedJurusanIds, watchedRole, setValue]);

  const onFormSubmit = async (data: FormData) => {
    try {
      const submitData: CreateUserData | UpdateUserData = { ...data };
      
      // Remove password if empty for update
      if (user && !submitData.password) {
        delete (submitData as any).password;
      }
      
      // Handle different data structure for guru vs siswa
      if (submitData.role === 'guru') {
        submitData.kelas_id = undefined;
        // For guru, if jurusan_ids is provided but not jurusan_id, use first selected jurusan as primary
        if (submitData.jurusan_ids && submitData.jurusan_ids.length > 0 && !submitData.jurusan_id) {
          submitData.jurusan_id = submitData.jurusan_ids[0];
        }
      } else {
        // For siswa, use single jurusan_id and remove jurusan_ids
        delete (submitData as any).jurusan_ids;
      }

      await onSubmit(submitData);
      onClose();
    } catch (error: any) {
      console.error('Form submission error:', error);
    }
  };

  const handleClose = () => {
    reset();
    onClose();
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
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit(onFormSubmit)} className="px-6 py-4 space-y-4">
          {/* Error Message */}
          {Object.keys(allErrors).length > 0 && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">
                    Terdapat kesalahan dalam form
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <ul className="list-disc pl-5 space-y-1">
                      {Object.entries(allErrors).map(([field, error]) => {
                        return (
                          <li key={field}>{Array.isArray(error) ? error.join(', ') : String(error)}</li>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Name */}
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
              Nama Lengkap *
            </label>
            <input
              type="text"
              id="name"
              {...register('name', {
                required: 'Nama lengkap harus diisi',
                minLength: {
                  value: 2,
                  message: 'Nama minimal 2 karakter'
                }
              })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                allErrors.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan nama lengkap"
            />
            {allErrors.name && (
              <p className="mt-1 text-sm text-red-600">
                {allErrors.name.message || allErrors.name}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="email"
              {...register('email', {
                required: 'Email harus diisi',
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: 'Format email tidak valid'
                }
              })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                allErrors.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan email"
            />
            {allErrors.email && (
              <p className="mt-1 text-sm text-red-600">
                {allErrors.email.message || allErrors.email}
              </p>
            )}
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
              {...register('password', {
                required: !user ? 'Password harus diisi' : false,
                minLength: {
                  value: 6,
                  message: 'Password minimal 6 karakter'
                }
              })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                allErrors.password ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Masukkan password"
            />
            {allErrors.password && (
              <p className="mt-1 text-sm text-red-600">
                {allErrors.password.message || allErrors.password}
              </p>
            )}
          </div>

          {/* Role */}
          <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Peran *
            </label>
            <select
              id="role"
              {...register('role', {
                required: 'Peran harus dipilih'
              })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                allErrors.role ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="siswa">Siswa</option>
              <option value="guru">Guru</option>
            </select>
            {allErrors.role && (
              <p className="mt-1 text-sm text-red-600">
                {allErrors.role.message || allErrors.role}
              </p>
            )}
          </div>

          {/* NIS/NIP */}
          <div>
            <label htmlFor="nis_nip" className="block text-sm font-medium text-gray-700 mb-1">
              {watchedRole === 'guru' ? 'NIP' : 'NIS'} *
            </label>
            <input
              type="text"
              id="nis_nip"
              {...register('nis_nip', {
                required: `${watchedRole === 'guru' ? 'NIP' : 'NIS'} harus diisi`,
                minLength: {
                  value: 3,
                  message: `${watchedRole === 'guru' ? 'NIP' : 'NIS'} minimal 3 karakter`
                }
              })}
              className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                allErrors.nis_nip ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={`Masukkan ${watchedRole === 'guru' ? 'NIP' : 'NIS'}`}
            />
            {allErrors.nis_nip && (
              <p className="mt-1 text-sm text-red-600">
                {allErrors.nis_nip.message || allErrors.nis_nip}
              </p>
            )}
          </div>

          {/* Jurusan */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Jurusan *
            </label>
            
            {/* For Siswa - Single Select */}
            {watchedRole === 'siswa' && (
              <Controller
                name="jurusan_id"
                control={control}
                rules={{
                  required: 'Jurusan harus dipilih',
                  validate: (value) => value > 0 || 'Jurusan harus dipilih'
                }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="jurusan_id"
                    className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      allErrors.jurusan_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                  >
                    <option value={0}>Pilih Jurusan</option>
                    {jurusans.map((jurusan) => (
                      <option key={jurusan.id} value={jurusan.id}>
                        {jurusan.nama}
                      </option>
                    ))}
                  </select>
                )}
              />
            )}

            {/* For Guru - Multiple Checkboxes */}
            {watchedRole === 'guru' && (
              <Controller
                name="jurusan_ids"
                control={control}
                rules={{
                  required: 'Minimal satu jurusan harus dipilih',
                  validate: (value) => (value && value.length > 0) || 'Minimal satu jurusan harus dipilih'
                }}
                render={({ field }) => (
                  <div className={`border rounded-lg p-3 space-y-2 max-h-40 overflow-y-auto ${
                    allErrors.jurusan_ids ? 'border-red-500' : 'border-gray-300'
                  }`}>
                    {jurusans.map((jurusan) => (
                      <label key={jurusan.id} className="flex items-center space-x-2 cursor-pointer">
                        <input
                          type="checkbox"
                          value={jurusan.id}
                          checked={field.value?.includes(jurusan.id) || false}
                          onChange={(e) => {
                            const currentValues = field.value || [];
                            if (e.target.checked) {
                              field.onChange([...currentValues, jurusan.id]);
                            } else {
                              field.onChange(currentValues.filter(id => id !== jurusan.id));
                            }
                          }}
                          className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                        />
                        <span className="text-sm text-gray-700">{jurusan.nama}</span>
                      </label>
                    ))}
                  </div>
                )}
              />
            )}

            {(allErrors.jurusan_id || allErrors.jurusan_ids) && (
              <p className="mt-1 text-sm text-red-600">
                {allErrors.jurusan_id?.message || allErrors.jurusan_id || allErrors.jurusan_ids?.message || allErrors.jurusan_ids}
              </p>
            )}
          </div>

          {/* Kelas (only for siswa) */}
          {watchedRole === 'siswa' && (
            <div>
              <label htmlFor="kelas_id" className="block text-sm font-medium text-gray-700 mb-1">
                Kelas *
              </label>
              <Controller
                name="kelas_id"
                control={control}
                rules={{
                  required: watchedRole === 'siswa' ? 'Kelas harus dipilih' : false,
                  validate: (value) => watchedRole === 'siswa' ? (value && value > 0) || 'Kelas harus dipilih' : true
                }}
                render={({ field }) => (
                  <select
                    {...field}
                    id="kelas_id"
                    className={`w-full px-3 py-2 text-gray-600 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
                      allErrors.kelas_id ? 'border-red-500' : 'border-gray-300'
                    }`}
                    disabled={kelasLoading || watchedJurusanId === 0}
                  >
                    <option value={0}>
                      {watchedJurusanId === 0 
                        ? 'Pilih jurusan terlebih dahulu' 
                        : kelasLoading 
                          ? 'Memuat kelas...' 
                          : 'Pilih Kelas'
                      }
                    </option>
                    {kelas.map((kelasItem) => (
                      <option key={kelasItem.id} value={kelasItem.id}>
                        {kelasItem.nama_kelas}
                      </option>
                    ))}
                  </select>
                )}
              />
              {allErrors.kelas_id && (
                <p className="mt-1 text-sm text-red-600">
                  {allErrors.kelas_id.message || allErrors.kelas_id}
                </p>
              )}
              {watchedJurusanId > 0 && kelas.length === 0 && !kelasLoading && (
                <p className="mt-1 text-sm text-yellow-600">Belum ada kelas untuk jurusan ini</p>
              )}
            </div>
          )}

          {/* Buttons */}
          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={handleClose}
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