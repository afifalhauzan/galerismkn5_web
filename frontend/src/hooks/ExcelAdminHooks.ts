import useSWR from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, poster } from '@/lib/axios';
import { ApiResponse } from '@/types/proyek';
import { env } from 'next-runtime-env';

// Types for Excel import operations
export interface ImportStats {
    total_siswa: number;
    active_siswa: number;
    inactive_siswa: number;
    recent_imports_7_days: number;
    import_guidelines: {
        required_columns: string[];
        supported_formats: string[];
        max_file_size: string;
        notes: string[];
    };
}

export interface TeacherImportStats {
    total_guru: number;
    active_guru: number;
    inactive_guru: number;
    recent_imports_7_days: number;
    import_guidelines: {
        required_columns: string[];
        supported_formats: string[];
        max_file_size: string;
        email_generation: string;
        default_password: string;
        security_note: string;
        jurusan_assignment: string;
    };
}

export interface ImportResult {
    imported_rows: number;
    total_rows: number;
    error_rows: number;
    errors: any[];
    message: string;
}

export function useImportStatus() {
    const { data, error, mutate, isValidating } = useSWR<ApiResponse<ImportStats>>(
        '/admin/students/import/status',
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 30000, // Refresh every 30 seconds
        }
    );

    return {
        stats: data?.data,
        isLoading: !error && !data,
        isError: error,
        isValidating,
        mutate
    };
}

export function useTeacherImportStatus() {
    const { data, error, mutate, isValidating } = useSWR<ApiResponse<TeacherImportStats>>(
        '/admin/teachers/import/status',
        fetcher,
        {
            revalidateOnFocus: false,
            refreshInterval: 30000, // Refresh every 30 seconds
        }
    );

    return {
        stats: data?.data,
        isLoading: !error && !data,
        isError: error,
        isValidating,
        mutate
    };
}

// Custom hook for Excel import operations using SWR mutations
export function useExcelMutations() {
    // Import students mutation
    const { 
        trigger: importTrigger, 
        isMutating: isImporting, 
        error: importError 
    } = useSWRMutation(
        '/admin/import-students',
        (url: string, { arg }: { arg: FormData }) => poster(url, arg)
    );

    // Import teachers mutation
    const { 
        trigger: importTeacherTrigger, 
        isMutating: isImportingTeachers, 
        error: importTeacherError 
    } = useSWRMutation(
        '/admin/import-teachers',
        (url: string, { arg }: { arg: FormData }) => poster(url, arg)
    );

    // Download student template mutation
    const { 
        trigger: downloadTrigger, 
        isMutating: isDownloading, 
        error: downloadError 
    } = useSWRMutation(
        '/admin/templates/students',
        async (url: string) => {
            const response = await fetch(
                `${env('NEXT_PUBLIC_API_URL') || 'http://localhost:8000/api'}${url}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        })
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Template download failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        }
    );

    // Download teacher template mutation
    const { 
        trigger: downloadTeacherTrigger, 
        isMutating: isDownloadingTeacher, 
        error: downloadTeacherError 
    } = useSWRMutation(
        '/admin/templates/teachers',
        async (url: string) => {
            const response = await fetch(
                `${env('NEXT_PUBLIC_API_URL') || 'http://localhost:8000/api'}${url}`,
                {
                    method: 'GET',
                    headers: {
                        'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                        ...(typeof window !== 'undefined' && localStorage.getItem('token') && {
                            'Authorization': `Bearer ${localStorage.getItem('token')}`
                        })
                    },
                }
            );

            if (!response.ok) {
                throw new Error(`Template download failed: ${response.status} ${response.statusText}`);
            }

            return response.blob();
        }
    );

    const importStudents = async (file: File): Promise<ImportResult> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await importTrigger(formData);
            
            if (!result.success) {
                throw new Error(result.message || 'Import failed');
            }

            return result.data as ImportResult;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please login again.');
            } else if (error.response?.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else if (error.response?.status === 422) {
                const validationErrors = error.response?.data?.errors || {};
                const errorMessages = Object.values(validationErrors).flat();
                throw new Error(`Validation error: ${errorMessages.join(', ')}`);
            } else if (error.message?.includes('non-JSON')) {
                throw new Error('Server returned invalid response format');
            } else {
                throw new Error(error.message || 'Failed to import Excel file');
            }
        }
    };

    const importTeachers = async (file: File): Promise<ImportResult> => {
        try {
            const formData = new FormData();
            formData.append('file', file);

            const result = await importTeacherTrigger(formData);
            
            if (!result.success) {
                throw new Error(result.message || 'Import failed');
            }

            return result.data as ImportResult;
        } catch (error: any) {
            if (error.response?.status === 401) {
                throw new Error('Unauthorized access. Please login again.');
            } else if (error.response?.status === 403) {
                throw new Error('Access denied. Admin privileges required.');
            } else if (error.response?.status === 422) {
                const validationErrors = error.response?.data?.errors || {};
                const errorMessages = Object.values(validationErrors).flat();
                throw new Error(`Validation error: ${errorMessages.join(', ')}`);
            } else if (error.message?.includes('non-JSON')) {
                throw new Error('Server returned invalid response format');
            } else {
                throw new Error(error.message || 'Failed to import Excel file');
            }
        }
    };

    const downloadTemplate = async (): Promise<void> => {
        try {
            const blob = await downloadTrigger();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template_import_siswa.xlsx';
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            throw new Error(error.message || 'Failed to download template');
        }
    };

    const downloadTeacherTemplate = async (): Promise<void> => {
        try {
            const blob = await downloadTeacherTrigger();
            
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'template_import_guru.xlsx';
            document.body.appendChild(a);
            a.click();
            
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
        } catch (error: any) {
            throw new Error(error.message || 'Failed to download teacher template');
        }
    };

    return {
        importStudents,
        importTeachers,
        downloadTemplate,
        downloadTeacherTemplate,
        isImporting,
        isImportingTeachers,
        isDownloading,
        isDownloadingTeacher,
        importError,
        importTeacherError,
        downloadError,
        downloadTeacherError,
    };
}

// Combined hook for Excel admin operations
export function useExcelAdmin() {
    const { stats, isLoading: isLoadingStats, isError: statsError, mutate: mutateStats } = useImportStatus();
    const { stats: teacherStats, isLoading: isLoadingTeacherStats, isError: teacherStatsError, mutate: mutateTeacherStats } = useTeacherImportStatus();
    const { 
        importStudents,
        importTeachers,
        downloadTemplate,
        downloadTeacherTemplate,
        isImporting,
        isImportingTeachers,
        isDownloading,
        isDownloadingTeacher,
        importError,
        importTeacherError,
        downloadError,
        downloadTeacherError,
    } = useExcelMutations();

    return {
        // Student import status
        stats,
        isLoadingStats,
        statsError,
        mutateStats,
        
        // Teacher import status
        teacherStats,
        isLoadingTeacherStats,
        teacherStatsError,
        mutateTeacherStats,
        
        // Import operations
        importStudents,
        importTeachers,
        downloadTemplate,
        downloadTeacherTemplate,
        isImporting,
        isImportingTeachers,
        isDownloading,
        isDownloadingTeacher,
        importError,
        importTeacherError,
        downloadError,
        downloadTeacherError,
    };
}