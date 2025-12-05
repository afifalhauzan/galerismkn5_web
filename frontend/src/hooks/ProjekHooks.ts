import useSWR, { mutate } from 'swr';
import useSWRMutation from 'swr/mutation';
import { fetcher, poster, putter, deleter } from '@/lib/axios';
import {
    Proyek,
    CreateProjekData,
    UpdateProjekData,
    ProjekQueryParams,
    PaginatedResponse,
    ApiResponse,
    KaryaItem,
    proyekToKaryaItem,
} from '@/types/proyek';

// Helper function to build query string
function buildQueryString(params: ProjekQueryParams): string {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page.toString());
    if (params.limit) queryParams.append('limit', params.limit.toString());
    if (params.status) queryParams.append('status', params.status);
    if (params.jurusan_id) queryParams.append('jurusan_id', params.jurusan_id.toString());
    if (params.search) queryParams.append('search', params.search);
    
    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
}

/**
 * Hook to fetch all projects with optional filtering and pagination
 */
export function useProjeks(params: ProjekQueryParams = {}) {
    const queryString = buildQueryString(params);
    const { data, error, isLoading, mutate } = useSWR(
        `/proyeks${queryString}`,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 30000, // 30 seconds
        }
    );

    return {
        proyeks: (data as PaginatedResponse<Proyek>)?.data || [],
        pagination: (data as PaginatedResponse<Proyek>)?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch projects as KaryaItems for gallery display
 */
export function useKaryaItems(params: ProjekQueryParams = {}) {
    const { proyeks, pagination, isLoading, isError, mutate } = useProjeks(params);
    
    const karyaItems: KaryaItem[] = proyeks.map(proyek => proyekToKaryaItem(proyek));

    return {
        karyaItems,
        pagination,
        isLoading,
        isError,
        mutate,
    };
}

/**
 * Hook to fetch current user's projects
 */
export function useMyProjeks(params: Omit<ProjekQueryParams, 'jurusan_id'> = {}) {
    const queryString = buildQueryString(params);
    const { data, error, isLoading, mutate } = useSWR(
        `/my-proyeks${queryString}`,
        fetcher,
        {
            revalidateOnFocus: true,
            revalidateOnReconnect: true,
            dedupingInterval: 30000,
        }
    );

    return {
        proyeks: (data as PaginatedResponse<Proyek>)?.data || [],
        pagination: (data as PaginatedResponse<Proyek>)?.pagination,
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to fetch a single project by ID
 */
export function useProyek(id: number | string) {
    const { data, error, isLoading, mutate } = useSWR(
        id ? `/proyeks/${id}` : null,
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateOnReconnect: true,
            dedupingInterval: 60000, // 1 minute
        }
    );

    return {
        proyek: (data as ApiResponse<Proyek>)?.data,
        isLoading,
        isError: error,
        mutate,
    };
}

/**
 * Hook to create a new project
 */
export function useCreateProyek() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/proyeks',
        (url: string, { arg }: { arg: CreateProjekData }) => {
            return poster(url, arg);
        }
    );

    const createProyek = async (proyekData: CreateProjekData) => {
        try {
            const result = await trigger(proyekData);
            // Revalidate projects lists after successful creation
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        createProyek,
        isCreating: isMutating,
        error,
    };
}

/**
 * Hook to update an existing project
 */
export function useUpdateProyek(id: number | string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/proyeks/${id}`,
        (url: string, { arg }: { arg: UpdateProjekData }) => {
            return putter(url, arg);
        }
    );

    const updateProyek = async (proyekData: UpdateProjekData) => {
        try {
            const result = await trigger(proyekData);
            // Revalidate specific project and lists
            mutate(`/proyeks/${id}`);
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        updateProyek,
        isUpdating: isMutating,
        error,
    };
}

/**
 * Hook to delete a project
 */
export function useDeleteProyek() {
    const { trigger, isMutating, error } = useSWRMutation(
        '/proyeks',
        (url: string, { arg }: { arg: { proyekId: number | string } }) => {
            return deleter(`${url}/${arg.proyekId}`);
        }
    );

    const deleteProyek = async (proyekId: number | string) => {
        try {
            const result = await trigger({ proyekId });
            // Revalidate projects lists after successful deletion
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        deleteProyek,
        isDeleting: isMutating,
        error,
    };
}

/**
 * Hook to submit a project (change status to 'terkirim')
 */
export function useSubmitProyek(id: number | string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/proyeks/${id}`,
        (url: string) => {
            return putter(url, { status: 'terkirim' });
        }
    );

    const submitProyek = async () => {
        try {
            const result = await trigger();
            // Revalidate specific project and lists
            mutate(`/proyeks/${id}`);
            mutate((key) => typeof key === 'string' && (key.startsWith('/proyeks') || key.startsWith('/my-proyeks')));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        submitProyek,
        isSubmitting: isMutating,
        error,
    };
}

/**
 * Hook for teachers to grade a project (change status to 'dinilai')
 */
export function useGradeProyek(id: number | string) {
    const { trigger, isMutating, error } = useSWRMutation(
        `/proyeks/${id}`,
        (url: string) => {
            return putter(url, { status: 'dinilai' });
        }
    );

    const gradeProyek = async () => {
        try {
            const result = await trigger();
            // Revalidate specific project and lists
            mutate(`/proyeks/${id}`);
            mutate((key) => typeof key === 'string' && key.startsWith('/proyeks'));
            return result;
        } catch (error) {
            throw error;
        }
    };

    return {
        gradeProyek,
        isGrading: isMutating,
        error,
    };
}

/**
 * Hook to get project statistics for dashboards
 */
export function useProjekStats() {
    const { data, error, isLoading } = useSWR('/proyeks/stats', fetcher, {
        revalidateOnFocus: true,
        refreshInterval: 300000, // Refresh every 5 minutes
    });

    return {
        stats: data || {
            totalProjects: 0,
            submittedProjects: 0,
            gradedProjects: 0,
            myProjects: 0,
            recentProjects: [],
        },
        isLoading,
        isError: error,
    };
}