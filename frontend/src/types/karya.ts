export interface Project {
    id: number;
    judul: string;
    date: string;
    status: string;
}

export interface Student {
    id: number;
    name: string;
    nis: string;
    total_karya?: number;
    projects?: Project[];
}

export interface KelasDetail {
    nama_kelas: string;
    tingkat: number;
    total_siswa: number;
    submitted_count: number;
    pending_count: number;
    percentage_submitted: number;
    students_submitted: Student[];
    students_pending: Student[];
}

export interface JurusanStats {
    jurusan_nama: string;
    jurusan_singkatan: string;
    total_siswa: number;
    total_submitted: number;
    total_pending: number;
    percentage_submitted: number;
    kelas: KelasDetail[];
}

export interface StatsResponse {
    success: boolean;
    data: JurusanStats[];
    summary: {
        total_jurusans: number;
        total_kelas: number;
        grand_total_siswa: number;
        grand_total_submitted: number;
        grand_total_pending: number;
        grand_percentage_submitted: number;
    };
    user_role: string;
    filtered_by_jurusan?: string;
}