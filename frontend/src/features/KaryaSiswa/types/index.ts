export interface FormData {
    judul: string;
    deskripsi: string;
    media_type: 'link' | 'image' | 'youtube';
    tautan_proyek?: string;
    youtube_url?: string;
    image?: File;
}

export interface UploadedFile {
    file: File;
    preview: string;
    status: 'uploading' | 'success' | 'error';
}