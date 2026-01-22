import { useState } from 'react';
import { Eye, EyeOff, Globe, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useUpdatePublicationStatus } from '@/hooks/ProjekHooks';
import type { Proyek, User } from '@/types/proyek';

interface PublishSectionProps {
    proyek: Proyek;
    user: User;
    onPublicationStatusChanged?: () => void;
}

export default function PublishSection({ proyek, user, onPublicationStatusChanged }: PublishSectionProps) {
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [pendingStatus, setPendingStatus] = useState<boolean | null>(null);

    const { updatePublicationStatus, isUpdating } = useUpdatePublicationStatus(proyek.id);

    const isAdmin = user?.role === 'admin';
    const isGuru = user?.role === 'guru';
    const isSiswa = user?.role === 'siswa';
    const isProjectOwner = proyek.user_id === user?.id;
    
    // Check if guru can manage this project's jurusan
    const isProjectFromSameJurusan = isGuru 
        ? (user?.jurusan_ids && user.jurusan_ids.includes(proyek.jurusan_id)) ||
          (user?.jurusan_id === proyek.jurusan_id)
        : false;
    
    const isProjectGraded = proyek.status === 'dinilai';
    const isCurrentlyPublished = proyek.is_published;

    // Permission logic
    const canManagePublication = (
        isAdmin ||
        (isGuru && isProjectFromSameJurusan) ||
        (isSiswa && isProjectOwner)
    );

    const canPublish = canManagePublication && isProjectGraded;
    const canUnpublish = canManagePublication;

    const handlePublicationToggle = async (newStatus: boolean) => {
        if (showConfirmation && pendingStatus !== null) {
            try {
                await updatePublicationStatus(pendingStatus);
                setShowConfirmation(false);
                setPendingStatus(null);
                onPublicationStatusChanged?.();

                const statusText = pendingStatus ? 'dipublikasikan' : 'disembunyikan dari publik';
                alert(`Karya berhasil ${statusText}!`);
            } catch (error: any) {
                console.error('Error updating publication status:', error);
                alert(error?.response?.data?.message || 'Terjadi kesalahan saat mengubah status publikasi');
            }
        } else {
            setPendingStatus(newStatus);
            setShowConfirmation(true);
        }
    };

    const handleCancel = () => {
        setShowConfirmation(false);
        setPendingStatus(null);
    };

    if (!canManagePublication) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm border">
            {/* Header */}
            <div className="p-6 border-b">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {isCurrentlyPublished ? (
                            <Eye className="w-5 h-5 text-green-600" />
                        ) : (
                            <EyeOff className="w-5 h-5 text-gray-500" />
                        )}
                        <h3 className="text-lg font-semibold text-gray-900">
                            Status Publikasi
                        </h3>
                    </div>

                    {isCurrentlyPublished ? (
                        <div className="flex items-center gap-2 text-green-600">
                            <Globe className="w-4 h-4" />
                            <span className="text-sm font-medium">Dipublikasikan</span>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2 text-gray-500">
                            <Lock className="w-4 h-4" />
                            <span className="text-sm font-medium">Tidak Dipublikasikan</span>
                        </div>
                    )}
                </div>
            </div>

            <div className="p-6">
                {/* Permission Messages */}
                {!isProjectGraded && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-800 mb-1">
                                    Karya belum dapat dipublikasikan
                                </h4>
                                <p className="text-sm text-amber-700">
                                    Karya harus sudah dinilai oleh guru terlebih dahulu sebelum dapat dipublikasikan ke galeri publik.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {!isProjectFromSameJurusan && isGuru && (
                    <div className="mb-4 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                        <div className="flex items-start gap-3">
                            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div>
                                <h4 className="text-sm font-medium text-amber-800 mb-1">
                                    Tidak dapat mengelola publikasi karya dari jurusan yang tidak diampu
                                </h4>
                                <p className="text-sm text-amber-700">
                                    Anda hanya dapat mengelola publikasi karya dari siswa di jurusan yang Anda ampu.
                                    Karya ini dari jurusan <strong>{proyek.jurusan?.nama}</strong>.
                                    {user?.jurusans && user.jurusans.length > 0 && (
                                        <span>
                                            {' '}Anda mengampu jurusan: <strong>
                                                {user.jurusans.map(j => j.nama).join(', ')}
                                            </strong>
                                        </span>
                                    )}
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                {/* Current Status Display */}
                <div className="mb-6">
                    <div className={`p-4 rounded-lg border ${isCurrentlyPublished
                        ? 'bg-green-50 border-green-200'
                        : 'bg-gray-50 border-gray-200'
                        }`}>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                {isCurrentlyPublished ? (
                                    <>
                                        <Globe className="w-6 h-6 text-green-600" />
                                        <p className="text-sm text-green-700">
                                            Karya ini dapat dilihat oleh publik di galeri
                                        </p>
                                    </>
                                ) : (
                                    <>
                                        <Lock className="w-6 h-6 text-gray-600" />
                                        <div>
                                            <h4 className="text-sm font-medium text-gray-900">
                                                Karya Tidak Dipublikasikan
                                            </h4>
                                            <p className="text-sm text-gray-700">
                                                Karya ini hanya dapat dilihat oleh siswa, guru, dan admin
                                            </p>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                {!showConfirmation && (
                    <div className="flex gap-3">
                        {!isCurrentlyPublished && canPublish && (
                            <button
                                onClick={() => handlePublicationToggle(true)}
                                disabled={isUpdating}
                                className="flex-1 bg-green-600 text-white py-3 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <Globe className="w-4 h-4" />
                                {isUpdating ? 'Memproses...' : 'Publikasikan Karya'}
                            </button>
                        )}

                        {isCurrentlyPublished && canUnpublish && (
                            <button
                                onClick={() => handlePublicationToggle(false)}
                                disabled={isUpdating}
                                className="flex-1 bg-red-600 text-white py-3 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                            >
                                <EyeOff className="w-4 h-4" />
                                {isUpdating ? 'Memproses...' : 'Batalkan Publikasi'}
                            </button>
                        )}
                    </div>
                )}

                {/* Confirmation */}
                {showConfirmation && pendingStatus !== null && (
                    <div className="space-y-4">
                        <div className={`p-4 rounded-lg border ${pendingStatus
                            ? 'bg-green-50 border-green-200'
                            : 'bg-red-50 border-red-200'
                            }`}>
                            <div className="flex items-start gap-3">
                                {pendingStatus ? (
                                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                                ) : (
                                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                                )}
                                <div>
                                    <h4 className={`text-sm font-medium mb-1 ${pendingStatus ? 'text-green-800' : 'text-red-800'
                                        }`}>
                                        Konfirmasi {pendingStatus ? 'Publikasi' : 'Pembatalan Publikasi'} Karya
                                    </h4>
                                    <p className={`text-sm ${pendingStatus ? 'text-green-700' : 'text-red-700'
                                        }`}>
                                        {pendingStatus
                                            ? 'Karya akan dipublikasikan dan dapat dilihat oleh semua pengunjung di galeri publik.'
                                            : 'Karya akan disembunyikan dari galeri publik dan hanya dapat dilihat oleh siswa, guru, dan admin.'
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-3">
                            <button
                                onClick={() => handlePublicationToggle(pendingStatus)}
                                disabled={isUpdating}
                                className={`flex-1 py-3 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white ${pendingStatus
                                        ? 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
                                        : 'bg-red-600 hover:bg-red-700 focus:ring-red-500'
                                    }`}
                            >
                                {isUpdating ? (
                                    <div className="flex items-center justify-center gap-2">
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        Memproses...
                                    </div>
                                ) : (
                                    `Ya, ${pendingStatus ? 'Publikasikan' : 'Batalkan Publikasi'}`
                                )}
                            </button>

                            <button
                                onClick={handleCancel}
                                disabled={isUpdating}
                                className="px-6 py-3 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                )}

                {/* No Permission Message */}
                {!canPublish && !canUnpublish && isProjectGraded && (
                    <div className="text-center py-6 text-gray-500">
                        <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                        <p>Anda tidak memiliki akses untuk mengelola publikasi karya ini</p>
                    </div>
                )}
            </div>
        </div>
    );
}