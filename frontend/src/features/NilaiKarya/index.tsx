"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import { useUngradedProjeks } from "@/hooks/ProjekHooks";
import Navbar from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/spinner";
import Modal, { ModalBody, ModalFooter } from "@/components/ui/Modal";
import {
    HiSearch,
    HiFilter,
    HiEye,
    HiStar,
    HiClock,
    HiChevronLeft,
    HiChevronRight,
    HiClipboardCheck,
} from "react-icons/hi";
import { ProjectCard } from "./components/ProjectCard";
import { Proyek } from "@/types/proyek";
import { MdNoAccounts } from "react-icons/md";

export default function NilaiKaryaPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();

    // Search and filter states
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedYear, setSelectedYear] = useState<string>("");
    const [selectedKelas, setSelectedKelas] = useState<string>("");
    const [currentPage, setCurrentPage] = useState(1);
    
    // Modal state for error handling
    const [showErrorModal, setShowErrorModal] = useState(false);

    // Fetch ungraded projects
    const {
        proyeks,
        pagination,
        message,
        isLoading,
        isError,
        error,
        mutate
    } = useUngradedProjeks({
        page: currentPage,
        limit: 12,
        search: searchTerm || undefined,
        year: selectedYear ? parseInt(selectedYear) : undefined,
        kelas: selectedKelas || undefined,
    });

    // Helper function to translate backend error messages
    const getErrorMessage = (error: any) => {
        if (!error) return "Gagal memuat data karya. Silahkan coba lagi.";
        
        const errorMessage = error?.message || error?.response?.data?.message || error?.toString() || "";
        
        if (errorMessage.includes("No assigned departments found. Please contact administrator.")) {
            return "Halo Bapak/Ibu Guru,";
        }
        
        return "Gagal memuat data karya. Silahkan coba lagi.";
    };

    // Redirect if not authenticated or not a teacher
    useEffect(() => {
        if (!authLoading && (!user || user.role !== 'guru')) {
            router.push('/login');
        }
    }, [user, authLoading, router]);

    // Show error modal when there's an error
    useEffect(() => {
        if (isError && error) {
            setShowErrorModal(true);
        }
    }, [isError, error]);

    const handleCloseErrorModal = () => {
        setShowErrorModal(false);
    };

    const handleRetry = () => {
        setShowErrorModal(false);
        mutate();
    };

    // Handle search
    const handleSearch = (value: string) => {
        setSearchTerm(value);
        setCurrentPage(1); // Reset to first page when searching
    };

    // Handle filter changes
    const handleFilterChange = (filterType: string, value: string) => {
        if (filterType === 'year') {
            setSelectedYear(value);
        } else if (filterType === 'kelas') {
            setSelectedKelas(value);
        }
        setCurrentPage(1); // Reset to first page when filtering
    };

    // Generate year options for filter
    const currentYear = new Date().getFullYear();
    const yearOptions = Array.from({ length: 5 }, (_, i) => currentYear - i);

    // Generate kelas options
    const kelasOptions = ['10', '11', '12'];

    if (authLoading) {
        return <Spinner />;
    }

    if (!user || user.role !== 'guru') {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />

            <main className="pt-8 md:pt-24 pb-20 md:pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

                    {/* Header Section */}
                    <div className="mb-4">
                        <div className="bg-white rounded-lg shadow-sm  p-6">
                            <div className="flex items-center space-x-3 mb-4">
                                <div className="bg-sky-100 p-2 rounded-lg">
                                    <HiClipboardCheck className="w-6 h-6 text-sky-600" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">
                                        Nilai Karya Siswa
                                    </h1>
                                    <p className="text-gray-600">
                                        {user?.jurusans && user.jurusans.length > 1 
                                            ? `Menilai karya siswa dari ${user.jurusans.length} jurusan yang Anda ampu`
                                            : user?.jurusans && user.jurusans.length === 1
                                            ? `Menilai karya siswa dari jurusan ${user.jurusans[0].nama}`
                                            : `Menilai karya siswa dari jurusan ${user?.jurusan?.nama || 'Anda'}`
                                        }
                                    </p>
                                </div>
                            </div>

                            {/* Stats */}
                            <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                                <div className="flex items-center space-x-2">
                                    <HiClock className="w-5 h-5 text-orange-600" />
                                    <span className="text-sm font-medium text-orange-800">
                                        {pagination?.total || 0} karya menunggu penilaian
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Search and Filter Section */}
                    <div className="bg-white rounded-lg shadow-sm p-6 mb-4">
                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">

                            {/* Search Bar */}
                            <div className="flex-1 max-w-md">
                                <div className="relative">
                                    <HiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                                    <input
                                        type="text"
                                        placeholder="Cari judul karya..."
                                        value={searchTerm}
                                        onChange={(e) => handleSearch(e.target.value)}
                                        className="w-full text-gray-700 pl-10 pr-4 py-2 border border-gray-400 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                    />
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
                                {/* <select
                                    value={selectedYear}
                                    onChange={(e) => handleFilterChange('year', e.target.value)}
                                    className="px-4 py-2 border text-gray-700 border-gray-400 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option value="">Semua Tahun</option>
                                    {yearOptions.map(year => (
                                        <option key={year} value={year}>{year}</option>
                                    ))}
                                </select> */}

                                <select
                                    value={selectedKelas}
                                    onChange={(e) => handleFilterChange('kelas', e.target.value)}
                                    className="px-4 py-2 border text-gray-700 border-gray-400 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500"
                                >
                                    <option value="">Semua Kelas</option>
                                    {kelasOptions.map(kelas => (
                                        <option key={kelas} value={kelas}>Kelas {kelas}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {isError && 
                    <div className="bg-red-50 border border-red-200 text-red-800 rounded-lg p-4 mb-6">
                        <p className="text-center">
                            {getErrorMessage(error)}. Hubungi admin IT sekolah untuk mengatur jurusan pada akun Anda.
                        </p>
                    </div>
                    }

                    {/* Projects Grid */}
                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Spinner />
                        </div>
                    ) : !isError && proyeks.length === 0 ? (
                        <div className="text-center py-12">
                            <HiStar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">
                                Tidak ada karya yang perlu dinilai
                            </h3>
                            <p className="text-gray-600">
                                {searchTerm || selectedYear || selectedKelas
                                    ? "Coba ubah filter pencarian Anda"
                                    : "Semua karya dari jurusan Anda sudah dinilai"}
                            </p>
                        </div>
                    ) : (
                        <>
                            {/* Projects Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mb-8">
                                {proyeks.map((proyek: Proyek) => (
                                    <ProjectCard key={proyek.id} proyek={proyek} onGraded={mutate} />
                                ))}
                            </div>

                            {/* Pagination */}
                            {pagination && pagination.last_page > 1 && (
                                <div className="flex justify-center items-center space-x-2">
                                    <button
                                        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                                        disabled={currentPage === 1}
                                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        <HiChevronLeft className="w-5 h-5 mr-1" />
                                        Previous
                                    </button>

                                    <span className="px-4 py-2 text-sm text-gray-700">
                                        Page {pagination.current_page} of {pagination.last_page}
                                    </span>

                                    <button
                                        onClick={() => setCurrentPage(Math.min(pagination.last_page, currentPage + 1))}
                                        disabled={currentPage === pagination.last_page}
                                        className="flex items-center px-3 py-2 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                        <HiChevronRight className="w-5 h-5 ml-1" />
                                    </button>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </main>

            {/* Error Modal */}
            <Modal
                isOpen={showErrorModal}
                onClose={handleCloseErrorModal}
                title="Akses Dashboard Penilai"
                size="md"
                closeOnBackdrop={true}
                closeOnEscape={true}
            >
                <ModalBody className="text-center py-2">
                    <div className="text-sky-600">
                        <MdNoAccounts className="w-20 h-20 mx-auto mb-4 opacity-80" />
                        <p className="text-xl font-medium mb-3 text-gray-800">
                            {getErrorMessage(error)}
                        </p>
                        {error?.message?.includes("No assigned departments found. Please contact administrator.") ? (
                            <p className="text-base text-gray-600 leading-relaxed max-w-md mx-auto">
                                Akun Anda telah aktif, namun saat ini belum terhubung dengan jurusan tertentu. Mohon hubungi Admin IT Sekolah untuk menetapkan jurusan agar Bapak/Ibu dapat mulai melakukan penilaian karya siswa.
                            </p>
                        ) : (
                            <p className="text-base text-gray-600 leading-relaxed">
                                Terjadi kesalahan saat memuat data. Silakan coba lagi.
                            </p>
                        )}
                    </div>
                </ModalBody>
                
                <ModalFooter className="flex justify-center space-x-3">
                    <button
                        onClick={handleCloseErrorModal}
                        className="px-6 py-2 w-full border-1 border-gray-500 hover:bg-sky-00 bg-sky-600 text-white rounded-lg transition-colors duration-200"
                    >
                        Mengerti
                    </button>
                    {!error?.message?.includes("No assigned departments") && (
                        <button
                            onClick={handleRetry}
                            className="px-6 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg transition-colors duration-200"
                        >
                            Coba Lagi
                        </button>
                    )}
                </ModalFooter>
            </Modal>
        </div>
    );
}

export { default as NilaiKaryaPage } from '.';