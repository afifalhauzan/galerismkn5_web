'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import { Lock, ShieldCheck, Info, ArrowRight, CheckCircle } from 'lucide-react';
import { usePasswordRequirements, changePassword } from '@/hooks/usePasswordCheck';

interface ChangePasswordForm {
  current_password: string;
  new_password: string;
  new_password_confirmation: string;
}

export default function ChangePasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const router = useRouter();
  // const { requirements, isLoading: loadingRequirements } = usePasswordRequirements();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isValid },
    reset,
  } = useForm<ChangePasswordForm>({
    mode: 'onChange',
    defaultValues: {
      current_password: '',
      new_password: '',
      new_password_confirmation: '',
    },
  });

  const newPassword = watch('new_password');

  const onSubmit = async (data: ChangePasswordForm) => {
    setIsLoading(true);
    try {
      const response = await changePassword(data);

      if (response.success) {
        setShowSuccessPopup(true);
        reset(); // Clear form
        // Show popup for 2 seconds before navigating
        setTimeout(() => {
          router.push('/dashboard');
          router.refresh(); // Refresh to update proxy state
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to change password';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      {/* Success Popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-sm mx-4 text-center shadow-2xl">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="text-green-600 w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">Berhasil!</h3>
            <p className="text-gray-600 text-sm mb-4">
              Kata sandi Anda telah berhasil diubah.
            </p>
            <p className="text-blue-600 font-semibold text-sm">
              Selamat datang di Dashboard Penilaian!
            </p>
          </div>
        </div>
      )}

      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">

        {/* Header dengan Ikon Keamanan */}
        <div className="bg-blue-600 p-6 text-center">
          {/* <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-full mb-4">
            <ShieldCheck className="text-white w-8 h-8" />
          </div> */}
          {/* <h2 className="text-2xl font-bold text-white">Keamanan Akun</h2> */}
          <p className="font-bold text-lg text-white">
            Selamat Datang di Galeri Proyek Akhir SMKN 5 Malang!
          </p>
        </div>

        <div className="p-8">
          {/* Narasi Pembuka */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800">Perbarui Kata Sandi</h3>
            <p className="text-gray-600 text-sm mt-1">
              Demi keamanan, Bapak/Ibu diwajibkan mengganti kata sandi bawaan (default) sebelum dapat mengakses dashboard penilaian.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
            {/* Input Kata Sandi Saat Ini */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata Sandi Saat Ini (Default)
              </label>
              <div className="relative">
                <Controller
                  name="current_password"
                  control={control}
                  rules={{
                    required: 'Kata sandi saat ini wajib diisi',
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      placeholder="Masukkan kata sandi bawaan"
                      className={`w-full pl-10 pr-4 py-2 border text-sm text-slate-500 ${errors.current_password ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                    />
                  )}
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              {errors.current_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.current_password.message}
                </p>
              )}
            </div>

            <hr className="border-gray-100 my-2" />

            {/* Input Kata Sandi Baru */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Kata Sandi Baru
              </label>
              <div className="relative">
                <Controller
                  name="new_password"
                  control={control}
                  rules={{
                    required: 'Kata sandi baru wajib diisi',
                    minLength: {
                      value: 8,
                      message: `Kata sandi harus minimal 8 karakter`,
                    },
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      placeholder="Buat kata sandi baru"
                      className={`w-full pl-10 pr-4 py-2 border text-sm text-slate-500 ${errors.new_password ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                    />
                  )}
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              {errors.new_password && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.new_password.message}
                </p>
              )}
            </div>

            {/* Konfirmasi Kata Sandi Baru */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Konfirmasi Kata Sandi Baru
              </label>
              <div className="relative">
                <Controller
                  name="new_password_confirmation"
                  control={control}
                  rules={{
                    required: 'Harap konfirmasi kata sandi baru Anda',
                    validate: (value) =>
                      value === newPassword || 'Kata sandi tidak cocok',
                  }}
                  render={({ field }) => (
                    <input
                      {...field}
                      type="password"
                      placeholder="Ulangi kata sandi baru"
                      className={`w-full pl-10 pr-4 py-2 border text-sm text-slate-500 ${errors.new_password_confirmation ? 'border-red-500' : 'border-gray-300'
                        } rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition`}
                    />
                  )}
                />
                <Lock className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
              </div>
              {errors.new_password_confirmation && (
                <p className="mt-1 text-sm text-red-600">
                  {errors.new_password_confirmation.message}
                </p>
              )}
            </div>

            {/* Info Box Ketentuan */}
            <div className="bg-blue-50 p-4 rounded-xl border border-blue-100 flex gap-3">
              <Info className="text-blue-500 w-5 h-5 shrink-0 mt-0.5" />
              <div className="text-xs text-blue-800 leading-relaxed">
                <strong>Ketentuan Kata Sandi:</strong>
                <ul className="list-disc ml-4 mt-1 space-y-1">
                  <li>Minimal 8 karakter.</li>
                  <li>Gunakan kombinasi huruf dan angka agar lebih kuat.</li>
                  <li>Jangan gunakan informasi yang mudah ditebak (seperti tanggal lahir).</li>
                </ul>
              </div>
            </div>

            {/* Tombol Simpan */}
            <button
              type="submit"
              disabled={isLoading || !isValid}
              className={`w-full font-bold py-3 rounded-xl transition flex items-center justify-center gap-2 group ${isLoading || !isValid
                  ? 'bg-gray-400 cursor-not-allowed text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Mengubah Kata Sandi...
                </>
              ) : (
                <>
                  Simpan & Masuk Dashboard
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Footer Bantuan */}
          <p className="text-center text-xs text-gray-500 mt-8">
            Butuh bantuan teknis? <br />
            Silakan hubungi <strong>Admin IT SMKN 5 Malang</strong>.
          </p>
        </div>
      </div>
    </div>
  );
}