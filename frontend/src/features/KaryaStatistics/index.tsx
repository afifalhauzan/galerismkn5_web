"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";
import Navbar from "@/components/ui/Navbar";
import { Spinner } from "@/components/ui/spinner";
import StudentProjectTrigger from "@/components/dashboard/StudentProjectTrigger";
import axios from "@/lib/axios";
import {
    HiChartBar,
    HiUsers,
    HiCheckCircle,
    HiClock,
    HiChevronDown,
    HiChevronRight,
    HiPrinter,
    HiRefresh
} from "react-icons/hi";
import { SummaryCards } from "./components/SummaryCards";
import { SearchBar } from "./components/SearchBar";
import { useKaryaStatisticsFilter } from "./hooks/useKaryaStatisticsFilter";
import { StatsResponse } from "../../types/karya";

export default function KaryaStatisticsPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [stats, setStats] = useState<StatsResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [expandedJurusan, setExpandedJurusan] = useState<string[]>([]);
    const [activeKelasTab, setActiveKelasTab] = useState<Record<string, 'submitted' | 'pending'>>({});
    const [searchTerm, setSearchTerm] = useState('');

    // Filter stats based on search term
    const filteredStats = useKaryaStatisticsFilter(stats, searchTerm);

    // Auto-expand all jurusan when searching, collapse when search is cleared
    useEffect(() => {
        if (searchTerm.trim() && filteredStats?.data) {
            // Expand all filtered jurusan when searching
            setExpandedJurusan(filteredStats.data.map(j => j.jurusan_nama));
        } else if (!searchTerm.trim() && stats?.data) {
            // When search is cleared, collapse all except first jurusan
            setExpandedJurusan(stats.data.length > 0 ? [stats.data[0].jurusan_nama] : []);
        }
    }, [searchTerm, filteredStats, stats]);

    // Role Guard: Redirect siswa to dashboard
    useEffect(() => {
        if (!authLoading && user?.role === 'siswa') {
            router.push('/dashboard');
            return;
        }
    }, [user, authLoading, router]);

    // Fetch dashboard stats
    const fetchStats = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await axios.get<StatsResponse>('/dashboard/stats');
            setStats(response.data);
            
            // Auto-expand first jurusan if data exists
            if (response.data.data.length > 0 && expandedJurusan.length === 0) {
                setExpandedJurusan([response.data.data[0].jurusan_nama]);
            }
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal memuat data statistik');
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && user.role !== 'siswa') {
            fetchStats();
        }
    }, [user, authLoading]);

    const toggleJurusan = (jurusanName: string) => {
        setExpandedJurusan(prev => 
            prev.includes(jurusanName) 
                ? prev.filter(j => j !== jurusanName)
                : [...prev, jurusanName]
        );
    };

    const setKelasTab = (kelasKey: string, tab: 'submitted' | 'pending') => {
        setActiveKelasTab(prev => ({
            ...prev,
            [kelasKey]: tab
        }));
    };

    const getKelasKey = (jurusan: string, kelas: string) => `${jurusan}-${kelas}`;

    const handlePrint = () => {
        window.print();
    };

    if (authLoading || (user?.role === 'siswa')) {
        return <Spinner />;
    }

    if (!user || !['admin', 'guru'].includes(user.role)) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 print:bg-white">
            <Navbar />
            
            <main className="pt-8 md:pt-24 pb-20 md:pb-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    
                    {/* Header Section */}
                    <div className="mb-8">
                        <div className="bg-white rounded-lg shadow-sm p-6">
                            <div className="flex flex-col md:flex-row items-center justify-between">
                                <div className="flex items-center text-center md:text-left space-x-3">
                                    <div className="hidden md:block bg-emerald-100 p-2 rounded-lg">
                                        <HiChartBar className="w-6 h-6 text-emerald-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900">
                                            Monitoring Pengumpulan Karya
                                        </h1>
                                        <p className="text-gray-600 mt-2 md:mt-0">
                                            {stats?.user_role === 'admin' 
                                                ? 'Statistik pengumpulan karya seluruh jurusan'
                                                : `Statistik pengumpulan karya jurusan ${stats?.filtered_by_jurusan || 'Anda'}`
                                            }
                                        </p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-row justify-between mt-4 text-slate-700 md:mt-0 space-x-4 print:hidden">
                                    <button
                                        onClick={fetchStats}
                                        disabled={isLoading}
                                        className="flex items-center w-full px-3 py-2 border border-slate-300 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                                    >
                                        <HiRefresh className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                                        Refresh
                                    </button>
                                    <button
                                        onClick={handlePrint}
                                        className="flex items-center w-full px-3 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
                                    >
                                        <HiPrinter className="w-4 h-4 mr-2" />
                                        Cetak
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {isLoading ? (
                        <div className="flex justify-center items-center py-12">
                            <Spinner />
                        </div>
                    ) : error ? (
                        <div className="text-center py-12">
                            <div className="text-red-600 mb-4">
                                <HiClock className="w-12 h-12 mx-auto mb-2" />
                                <p className="font-medium">Gagal Memuat Data</p>
                                <p className="text-sm">{error}</p>
                            </div>
                            <button
                                onClick={fetchStats}
                                className="bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700"
                            >
                                Coba Lagi
                            </button>
                        </div>
                    ) : (
                        <>
                            {/* Summary Cards */}
                            {filteredStats && <SummaryCards summary={filteredStats.summary} />}

                            {/* Search Bar */}
                            <SearchBar onSearch={setSearchTerm} />

                            {/* No Results Found */}
                            {filteredStats && filteredStats.data.length === 0 ? (
                                <div className="text-center py-12">
                                    <div className="text-gray-600 mb-4">
                                        <HiUsers className="w-12 h-12 mx-auto mb-2 text-gray-400" />
                                        <p className="font-medium">Tidak ada hasil ditemukan</p>
                                        <p className="text-sm">Tidak ada jurusan yang cocok dengan pencarian "{searchTerm}"</p>
                                    </div>
                                    <button
                                        onClick={() => setSearchTerm('')}
                                        className="text-emerald-600 hover:text-emerald-700 text-sm"
                                    >
                                        Hapus pencarian
                                    </button>
                                </div>
                            ) : (
                                <>
                                    {/* Jurusan Accordion */}
                                    {filteredStats && (
                                        <div className="space-y-4">
                                            {filteredStats.data.map((jurusan) => (
                                        <div key={jurusan.jurusan_nama} className="bg-white rounded-lg shadow-sm">
                                            <div 
                                                className="p-4 cursor-pointer hover:bg-gray-50"
                                                onClick={() => toggleJurusan(jurusan.jurusan_nama)}
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="text-emerald-600">
                                                            {expandedJurusan.includes(jurusan.jurusan_nama) ? (
                                                                <HiChevronDown className="w-5 h-5" />
                                                            ) : (
                                                                <HiChevronRight className="w-5 h-5" />
                                                            )}
                                                        </div>
                                                        <div>
                                                            <h3 className="font-semibold text-gray-900">
                                                                {jurusan.jurusan_nama} ({jurusan.jurusan_singkatan})
                                                            </h3>
                                                            <p className="text-sm text-gray-600">
                                                                {jurusan.total_siswa} siswa • {jurusan.total_submitted} mengumpulkan • {jurusan.total_pending} belum
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="text-right">
                                                        <div className="text-lg font-bold text-emerald-600">
                                                            {jurusan.percentage_submitted.toFixed(1)}%
                                                        </div>
                                                        <div className="w-24 bg-gray-200 rounded-full h-2">
                                                            <div 
                                                                className="bg-emerald-600 h-2 rounded-full"
                                                                style={{ width: `${Math.min(jurusan.percentage_submitted, 100)}%` }}
                                                            />
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            {expandedJurusan.includes(jurusan.jurusan_nama) && (
                                                <div className="border-t border-gray-200 p-4 space-y-4">
                                                    {jurusan.kelas.map((kelas) => {
                                                        const kelasKey = getKelasKey(jurusan.jurusan_nama, kelas.nama_kelas);
                                                        const activeTab = activeKelasTab[kelasKey] || 'submitted';
                                                        
                                                        return (
                                                            <div key={kelas.nama_kelas} className="bg-gray-50 rounded-lg p-4">
                                                                <div className="flex items-center justify-between mb-3">
                                                                    <h4 className="font-medium text-gray-900">
                                                                        {kelas.nama_kelas}
                                                                    </h4>
                                                                    <div className="text-sm text-gray-600">
                                                                        {kelas.total_siswa} siswa • {kelas.percentage_submitted.toFixed(1)}% mengumpulkan
                                                                    </div>
                                                                </div>

                                                                {/* Tabs */}
                                                                <div className="flex flex-col md:flex-row space-x-1 mb-4">
                                                                    <button
                                                                        onClick={() => setKelasTab(kelasKey, 'submitted')}
                                                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                                            activeTab === 'submitted'
                                                                                ? 'bg-emerald-600 text-white'
                                                                                : 'bg-white text-gray-600 hover:text-gray-900'
                                                                        }`}
                                                                    >
                                                                        <span className="flex items-center space-x-2">
                                                                            <HiCheckCircle className="w-4 h-4" />
                                                                            <span>Sudah Mengumpulkan ({kelas.submitted_count})</span>
                                                                        </span>
                                                                    </button>
                                                                    <button
                                                                        onClick={() => setKelasTab(kelasKey, 'pending')}
                                                                        className={`px-3 py-2 text-sm font-medium rounded-lg ${
                                                                            activeTab === 'pending'
                                                                                ? 'bg-orange-600 text-white'
                                                                                : 'bg-white text-gray-600 hover:text-gray-900'
                                                                        }`}
                                                                    >
                                                                        <span className="flex items-center space-x-2">
                                                                            <HiClock className="w-4 h-4" />
                                                                            <span>Belum Mengumpulkan ({kelas.pending_count})</span>
                                                                        </span>
                                                                    </button>
                                                                </div>

                                                                {/* Student Lists */}
                                                                <div className="bg-white rounded-lg p-3">
                                                                    {activeTab === 'submitted' ? (
                                                                        kelas.students_submitted.length > 0 ? (
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                                {kelas.students_submitted.map((student) => (
                                                                                    <StudentProjectTrigger
                                                                                        key={student.id}
                                                                                        name={student.name}
                                                                                        nis={student.nis}
                                                                                        projects={student.projects || []}
                                                                                        totalKarya={student.total_karya || 0}
                                                                                    />
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-center py-4 text-gray-500">
                                                                                Belum ada siswa yang mengumpulkan karya
                                                                            </div>
                                                                        )
                                                                    ) : (
                                                                        kelas.students_pending.length > 0 ? (
                                                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                                                                                {kelas.students_pending.map((student) => (
                                                                                    <div key={student.id} className="flex items-center space-x-2 p-2 bg-orange-50 rounded text-orange-800">
                                                                                        <HiClock className="w-4 h-4 text-orange-600 flex-shrink-0" />
                                                                                        <div className="flex-1 min-w-0">
                                                                                            <div className="text-sm font-medium truncate">{student.name}</div>
                                                                                            <div className="text-xs text-orange-600">NIS: {student.nis}</div>
                                                                                        </div>
                                                                                    </div>
                                                                                ))}
                                                                            </div>
                                                                        ) : (
                                                                            <div className="text-center py-4 text-gray-500">
                                                                                Semua siswa sudah mengumpulkan karya
                                                                            </div>
                                                                        )
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </>
                    )}
                </>
            )}
        </div>
    </main>
</div>
    );
}