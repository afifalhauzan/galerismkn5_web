"use client";

import React, { useState, useEffect } from 'react';
import { Trash2, AlertTriangle, RefreshCcw, ShieldAlert, BarChart3, CheckCircle, XCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useNuclearButtons, ResetResponse } from '@/hooks/NuclearButtonHooks';

interface ResetOption {
  id: string;
  title: string;
  desc: string;
  color: string;
  verify: string;
  level: number;
}

const NuclearMaintenancePage = () => {
  const { user, logout } = useAuth();
  const router = useRouter();
  const {
    isLoading,
    systemStats,
    statsLoading,
    error,
    fetchSystemStats,
    resetProjectsOnly,
    resetAcademicYear,
    totalSystemReset,
    clearError
  } = useNuclearButtons();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [target, setTarget] = useState<ResetOption | null>(null);
  const [confirmText, setConfirmText] = useState('');
  const [lastResult, setLastResult] = useState<ResetResponse | null>(null);
  const [showResult, setShowResult] = useState(false);

  // Check if user is admin
  useEffect(() => {
    if (user && user.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, router]);

  // Fetch system stats on mount
  useEffect(() => {
    fetchSystemStats();
  }, []);

  const resetOptions: ResetOption[] = [
    {
      id: 'projects',
      title: 'Reset Karya & Penilaian',
      desc: 'Menghapus seluruh karya siswa dan data nilai guru. Siswa dan guru tetap aman.',
      color: 'blue',
      verify: 'HAPUS KARYA',
      level: 1
    },
    {
      id: 'academic',
      title: 'Reset Tahun Ajaran',
      desc: 'Menghapus semua siswa, guru, karya, dan nilai. Struktur jurusan dan kelas tetap ada.',
      color: 'orange',
      verify: 'RESET TAHUN',
      level: 2
    },
    {
      id: 'total',
      title: 'Total System Reset',
      desc: 'NUCLEAR: Menghapus SEMUA data kecuali jurusan. Admin baru akan dibuat otomatis.',
      color: 'red',
      verify: 'NUCLEAR RESET',
      level: 3
    }
  ];

  const openModal = (option: ResetOption) => {
    setTarget(option);
    setIsModalOpen(true);
    setConfirmText('');
    clearError();
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setTarget(null);
    setConfirmText('');
    clearError();
  };

  const executeReset = async () => {
    if (!target || confirmText !== target.verify) return;

    try {
      let result: ResetResponse;

      switch (target.id) {
        case 'projects':
          result = await resetProjectsOnly();
          break;
        case 'academic':
          result = await resetAcademicYear();
          break;
        case 'total':
          result = await totalSystemReset();
          break;
        default:
          throw new Error('Invalid reset option');
      }

      setLastResult(result);
      setShowResult(true);
      closeModal();

      // If total reset, logout and redirect to login after showing result
      if (target.id === 'total') {
        setTimeout(async () => {
          await logout();
          router.push('/login');
        }, 5000);
      }

    } catch (error) {
      // Error is handled by the hook
    }
  };

  const closeResultModal = () => {
    setShowResult(false);
    setLastResult(null);
  };

  if (user?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Akses Ditolak</h1>
          <p className="text-gray-600">Halaman ini hanya untuk administrator.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-5 md:pt-30 bg-gray-50 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
            <ShieldAlert className="text-red-600" /> Nuclear Maintenance
          </h1>
          <p className="text-gray-600 mt-2">
            Manajemen siklus data SMKN 5 Malang - <span className="text-red-600 font-semibold">GUNAKAN DENGAN HATI-HATI</span>
          </p>
        </header>

        {/* System Stats */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm mb-8 p-6">
          <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2 mb-4">
            <BarChart3 className="text-blue-600" /> Statistik Sistem
          </h2>
          
          {statsLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : systemStats ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">{systemStats.users.total}</div>
                <div className="text-sm text-gray-500">Total Users</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{systemStats.users.siswa}</div>
                <div className="text-sm text-gray-500">Siswa</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">{systemStats.users.guru}</div>
                <div className="text-sm text-gray-500">Guru</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{systemStats.projects.total}</div>
                <div className="text-sm text-gray-500">Proyek</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{systemStats.assessments.total}</div>
                <div className="text-sm text-gray-500">Penilaian</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-indigo-600">{systemStats.structure.kelas}</div>
                <div className="text-sm text-gray-500">Kelas</div>
              </div>
            </div>
          ) : (
            <div className="text-center py-4 text-gray-500">Gagal memuat statistik</div>
          )}
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 mb-6">
            <div className="flex items-center gap-2 text-red-800">
              <XCircle className="w-5 h-5" />
              <span className="font-semibold">Error:</span>
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Nuclear Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {resetOptions.map((opt) => (
            <div key={opt.id} className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm hover:shadow-md transition">
              <div className={`w-12 h-12 rounded-xl bg-${opt.color}-50 flex items-center justify-center mb-4`}>
                <RefreshCcw className={`text-${opt.color}-600 w-6 h-6`} />
              </div>
              <div className="flex items-center gap-2 mb-2">
                <h3 className="font-bold text-gray-800">{opt.title}</h3>
                <div className={`px-2 py-1 rounded-full text-xs font-bold text-white bg-${opt.color}-600`}>
                  Level {opt.level}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2 mb-6 h-16">{opt.desc}</p>
              <button 
                onClick={() => openModal(opt)}
                disabled={isLoading}
                className={`w-full py-3 rounded-lg font-semibold border-2 transition ${
                  opt.color === 'blue' 
                    ? 'border-blue-200 text-blue-600 hover:bg-blue-50' 
                    : opt.color === 'orange'
                    ? 'border-orange-200 text-orange-600 hover:bg-orange-50'
                    : 'border-red-200 text-red-600 hover:bg-red-50'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {isLoading ? '⚡ Processing...' : `🔥 Execute Level ${opt.level}`}
              </button>
            </div>
          ))}
        </div>

        {/* Confirmation Modal */}
        {isModalOpen && target && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-md w-full rounded-2xl p-6 shadow-2xl animate-in zoom-in duration-200">
              <div className="flex items-center gap-3 text-red-600 mb-4">
                <AlertTriangle className="w-8 h-8" />
                <h2 className="text-xl font-bold">⚠️ KONFIRMASI DESTRUKSI</h2>
              </div>
              
              <p className="text-gray-700 text-sm leading-relaxed mb-4">
                Anda akan melakukan <span className="font-bold text-red-600">{target.title}</span>. 
              </p>
              
              <p className="text-red-600 font-semibold text-sm mb-6">
                ⚠️ TINDAKAN INI PERMANEN DAN TIDAK DAPAT DIBATALKAN!
              </p>

              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200 mb-6">
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block mb-2">
                  Ketik "<span className="text-red-600">{target.verify}</span>" untuk melanjutkan
                </label>
                <input 
                  type="text" 
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value.toUpperCase())}
                  placeholder="..."
                  className="w-full p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-red-500 font-mono text-center"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <button 
                  onClick={closeModal}
                  className="flex-1 py-3 text-gray-600 font-semibold hover:bg-gray-100 rounded-lg transition"
                  disabled={isLoading}
                >
                  Batal
                </button>
                <button 
                  onClick={executeReset}
                  disabled={confirmText !== target.verify || isLoading}
                  className={`flex-1 py-3 rounded-lg font-bold text-white transition ${
                    confirmText === target.verify && !isLoading
                      ? 'bg-red-600 hover:bg-red-700' 
                      : 'bg-gray-300 cursor-not-allowed'
                  }`}
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Executing...
                    </div>
                  ) : (
                    '🔥 Ya, Execute!'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Result Modal */}
        {showResult && lastResult && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white max-w-lg w-full rounded-2xl p-6 shadow-2xl">
              <div className={`flex items-center gap-3 mb-4 ${lastResult.success ? 'text-green-600' : 'text-red-600'}`}>
                {lastResult.success ? <CheckCircle className="w-8 h-8" /> : <XCircle className="w-8 h-8" />}
                <h2 className="text-xl font-bold">
                  {lastResult.success ? '✅ Reset Berhasil' : '❌ Reset Gagal'}
                </h2>
              </div>
              
              <p className="text-gray-700 mb-4">{lastResult.message}</p>
              
              {lastResult.admin_recreated && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-800 mb-2">🔑 Admin Baru Dibuat:</h4>
                  <p className="text-sm text-blue-700">
                    Email: <code className="bg-white px-1 rounded">{lastResult.admin_recreated.email}</code><br/>
                    Password: <code className="bg-white px-1 rounded">{lastResult.admin_recreated.password}</code>
                  </p>
                </div>
              )}
              
              {lastResult.note && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                  <p className="text-yellow-800 text-sm">{lastResult.note}</p>
                </div>
              )}
              
              <button 
                onClick={closeResultModal}
                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition"
              >
                Tutup
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default NuclearMaintenancePage;
