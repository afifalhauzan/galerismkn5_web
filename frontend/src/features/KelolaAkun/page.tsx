"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUsers, useUserMutations } from "@/hooks/UserHooks";
import { useJurusans } from "@/hooks/JurusanHooks";
import { User, CreateUserData, UpdateUserData } from "@/types/proyek";
import UserFilters from "./components/UserFilters";
import UserTable from "./components/UserTable";
import UserTablePagination from "./components/UserTablePagination";
import UserModal from "./components/UserModal";
import { MdAccountCircle } from "react-icons/md";

export default function KelolaAkun({ user, logout }: { user: any, logout: () => void }) {
    const { jurusans } = useJurusans();
    const { createUser, updateUser, deleteUser } = useUserMutations();

    // Filter states
    const [selectedRole, setSelectedRole] = useState("");
    const [selectedJurusan, setSelectedJurusan] = useState("");
    const [selectedKelas, setSelectedKelas] = useState("");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);

    // Modal states
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState<any>(null);

    // Fetch users with filters
    const { users, pagination, isLoading, isError, mutate } = useUsers({
        page: currentPage,
        limit: 10,
        role: selectedRole as 'guru' | 'siswa' | undefined,
        jurusan_id: selectedJurusan ? parseInt(selectedJurusan) : undefined,
        kelas: selectedKelas || undefined,
        search: searchQuery || undefined,
    });

    // Check if user is admin
    if (user?.role !== 'admin') {
        return (
            <div className="min-h-screen bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
                        <p className="text-gray-600">You don't have permission to access this page.</p>
                    </div>
                </div>
            </div>
        );
    }

    // Filter options
    const jurusanOptions = jurusans.map(jurusan => ({
        value: jurusan.id.toString(),
        label: jurusan.nama
    }));

    // Reset page to 1 when any filter changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedRole, selectedJurusan, selectedKelas, searchQuery]);

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleReset = () => {
        setSelectedRole("");
        setSelectedJurusan("");
        setSelectedKelas("");
        setSearchQuery("");
        setCurrentPage(1);
    };

    const handleAddUser = () => {
        setEditingUser(null);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const handleEditUser = (user: User) => {
        setEditingUser(user);
        setSubmitError(null);
        setIsModalOpen(true);
    };

    const handleDeleteUser = async (user: User) => {
        const isConfirmed = window.confirm(
            `Apakah Anda yakin ingin menghapus akun ${user.name}? Tindakan ini tidak dapat dibatalkan.`
        );

        if (isConfirmed) {
            try {
                await deleteUser(user.id);
                await mutate(); // Refresh the data
                alert('Akun berhasil dihapus!');
            } catch (error: any) {
                alert(`Error: ${error.message}`);
            }
        }
    };

    const handleSubmitUser = async (data: CreateUserData | UpdateUserData) => {
        setIsSubmitting(true);
        setSubmitError(null);
        try {
            if (editingUser) {
                await updateUser(editingUser.id, data as UpdateUserData);
                alert('Akun berhasil diperbarui!');
            } else {
                await createUser(data as CreateUserData);
                alert('Akun berhasil ditambahkan!');
            }
            await mutate(); // Refresh the data
            setIsModalOpen(false);
            setSubmitError(null);
        } catch (error: any) {
            console.error('Error submitting user:', error);
            setSubmitError(error);
            // Don't re-throw, let the modal stay open with error
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 md:mt-20">
                {/* Header */}
                <div className="mb-8">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-left md:justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Kelola Akun</h1>
                            <p className="mt-2 text-gray-600">
                                Kelola akun guru dan siswa di sistem galeri karya
                            </p>
                        </div>
                        <button
                            onClick={handleAddUser}
                            className="hidden md:flex bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 mt-4 md:mt-0 rounded-lg font-medium transition-colors items-center space-x-2"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Tambah Akun</span>
                        </button>
                    </div>

                    {/* Stats */}
                    {pagination && (
                        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <MdAccountCircle className="h-10 w-10 text-sky-600"/>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Total Akun {selectedRole ? `(${selectedRole})` : ''}
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {pagination.total}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Halaman Saat Ini
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {pagination.current_page} dari {pagination.last_page}
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="p-5">
                                    <div className="flex items-center">
                                        <div className="flex-shrink-0">
                                            <svg className="h-6 w-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v11a2 2 0 002 2h9.586a1 1 0 00.707-.293l2.414-2.414a1 1 0 00.293-.707V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div className="ml-5 w-0 flex-1">
                                            <dl>
                                                <dt className="text-sm font-medium text-gray-500 truncate">
                                                    Per Halaman
                                                </dt>
                                                <dd className="text-lg font-medium text-gray-900">
                                                    {pagination.per_page} akun
                                                </dd>
                                            </dl>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Filters */}
                <UserFilters
                    selectedRole={selectedRole}
                    selectedJurusan={selectedJurusan}
                    selectedKelas={selectedKelas}
                    searchQuery={searchQuery}
                    onRoleChange={setSelectedRole}
                    onJurusanChange={setSelectedJurusan}
                    onKelasChange={setSelectedKelas}
                    onSearchChange={setSearchQuery}
                    onReset={handleReset}
                    jurusanOptions={jurusanOptions}
                />

                {/* Error State */}
                {isError && (
                    <div className="text-center py-12">
                        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg inline-block">
                            <p className="font-medium">Error memuat data</p>
                            <p className="text-sm">Gagal memuat daftar akun</p>
                        </div>
                    </div>
                )}

                {/* Users Table */}
                <UserTable
                    users={users}
                    onEdit={handleEditUser}
                    onDelete={handleDeleteUser}
                    isLoading={isLoading}
                />

                {/* Pagination */}
                {pagination && pagination.last_page > 1 && (
                    <UserTablePagination
                        currentPage={pagination.current_page || 1}
                        totalPages={pagination.last_page || 1}
                        onPageChange={handlePageChange}
                    />
                )}

                {/* User Modal */}
                <UserModal
                    isOpen={isModalOpen}
                    onClose={() => {
                        setIsModalOpen(false);
                        setSubmitError(null);
                    }}
                    onSubmit={handleSubmitUser}
                    user={editingUser}
                    jurusans={jurusans}
                    isLoading={isSubmitting}
                    error={submitError}
                />
            </div>

            {/* Mobile Floating Add Button */}
            <button
                onClick={handleAddUser}
                className="md:hidden fixed bottom-25 right-6 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-200 hover:shadow-xl z-50"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
            </button>
        </div>
    );
}