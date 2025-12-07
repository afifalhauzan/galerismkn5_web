export interface User {
    id: number;
    name: string;
    email: string;
    email_verified_at?: string;
    role: 'admin' | 'guru' | 'siswa';
    nis_nip?: string;
    jurusan_id?: number;
    jurusan_name?: string;
    created_at: string;
    updated_at: string;
}

export interface Jurusan {
    id: number;
    kode_jurusan: string;
    nama: string;
    deskripsi?: string;
    created_at: string;
    updated_at: string;
}

export interface Penilaian {
    id: number;
    proyek_id: number;
    guru_id: number;
    nilai: number;
    catatan?: string;
    created_at: string;
    updated_at: string;
    guru?: User;
}

export interface Proyek {
    id: number;
    user_id: number;
    jurusan_id: number;
    judul: string;
    deskripsi: string;
    tautan_proyek?: string;
    image_url?: string;
    status: 'terkirim' | 'dinilai';
    created_at: string;
    updated_at: string;
    user?: User;
    jurusan?: Jurusan;
    penilaian?: Penilaian;
}

export interface PaginationMeta {
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
    from: number | null;
    to: number | null;
}

export interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data?: T;
    errors?: Record<string, string[]>;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
    pagination?: PaginationMeta;
}

// Form data types for creating/updating projects
export interface CreateProjekData {
    judul: string;
    deskripsi: string;
    tautan_proyek?: string;
    image_url?: string;
    image?: File;
    jurusan_id: number;
    status?: 'terkirim' | 'dinilai';
}

export interface UpdateProjekData extends Partial<CreateProjekData> {}

// Query params for filtering projects
export interface ProjekQueryParams {
    page?: number;
    limit?: number;
    status?: 'terkirim' | 'dinilai';
    jurusan_id?: number;
    search?: string;
}

// KaryaCard interface compatibility
export interface KaryaItem {
    id: number;
    imageUrl?: string;
    title: string;
    description: string;
    author: string;
    jurusan: string;
    createdAt: string;
    status?: 'terkirim' | 'dinilai';
}

// Helper function to transform Proyek to KaryaItem
export function proyekToKaryaItem(proyek: Proyek): KaryaItem {
    return {
        id: proyek.id,
        imageUrl: proyek.image_url,
        title: proyek.judul,
        description: proyek.deskripsi,
        author: proyek.user?.name || 'Unknown',
        jurusan: proyek.jurusan?.nama || 'Unknown',
        createdAt: proyek.created_at,
        status: proyek.status,
    };
}