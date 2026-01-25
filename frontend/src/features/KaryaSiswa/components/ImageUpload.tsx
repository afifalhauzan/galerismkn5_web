import { useRef, useEffect } from "react";
import { UseFormSetValue } from "react-hook-form";
import Dropzone from "dropzone";
import "dropzone/dist/dropzone.css";
import "../../../styles/dropzone.css";
import { FormData, UploadedFile } from "../types";

interface ImageUploadProps {
    uploadedFile: UploadedFile | null;
    setUploadedFile: (file: UploadedFile | null) => void;
    setValue: UseFormSetValue<FormData>;
    disabled?: boolean;
}

export default function ImageUpload({ uploadedFile, setUploadedFile, setValue, disabled }: ImageUploadProps) {
    const dropzoneRef = useRef<HTMLDivElement>(null);
    const dropzoneInstance = useRef<Dropzone | null>(null);

    useEffect(() => {
        if (dropzoneRef.current && !dropzoneInstance.current && !disabled) {
            dropzoneInstance.current = new Dropzone(dropzoneRef.current, {
                url: "/api/upload", // Placeholder URL
                autoProcessQueue: false,
                maxFiles: 1,
                acceptedFiles: "image/*",
                maxFilesize: 2, // 2MB
                addRemoveLinks: true,
                dictDefaultMessage: "Klik atau seret gambar proyek ke sini",
                dictRemoveFile: "Hapus",
                dictFileTooBig: "File terlalu besar. Maksimal 2MB.",
                dictInvalidFileType: "Tipe file tidak valid. Hanya gambar yang diperbolehkan.",
                dictMaxFilesExceeded: "Hanya boleh upload 1 gambar.",
                previewTemplate: `
                    <div class="dz-preview dz-file-preview">
                        <div class="dz-image"><img data-dz-thumbnail /></div>
                        <div class="dz-details">
                            <div class="dz-size"><span data-dz-size></span></div>
                            <div class="dz-filename"><span data-dz-name></span></div>
                        </div>
                        <div class="dz-progress"><span class="dz-upload" data-dz-uploadprogress></span></div>
                        <div class="dz-error-message"><span data-dz-errormessage></span></div>
                        <div class="dz-success-mark">✓</div>
                        <div class="dz-error-mark">✗</div>
                    </div>
                `
            });

            dropzoneInstance.current.on('addedfile', (file) => {
                setUploadedFile({
                    file,
                    preview: URL.createObjectURL(file),
                    status: 'success'
                });
                setValue('image', file);
            });

            dropzoneInstance.current.on('removedfile', () => {
                setUploadedFile(null);
                setValue('image', undefined);
            });

            dropzoneInstance.current.on('error', (file, errorMessage) => {
                if (uploadedFile) {
                    setUploadedFile({
                        ...uploadedFile,
                        status: 'error' as const
                    });
                }
            });
        }

        return () => {
            if (dropzoneInstance.current) {
                dropzoneInstance.current.destroy();
                dropzoneInstance.current = null;
            }
        };
    }, [setValue, setUploadedFile, disabled]);

    // Clear dropzone when switching media types
    useEffect(() => {
        return () => {
            if (dropzoneInstance.current) {
                dropzoneInstance.current.removeAllFiles(true);
            }
        };
    }, []);

    return (
        <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Gambar <span className="text-red-500">*</span>
            </label>
            <div 
                ref={dropzoneRef}
                className="dropzone border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors"
            >
                {/* Dropzone will replace this content */}
            </div>
            {uploadedFile && (
                <div className={`mt-2 p-3 border rounded-lg ${
                    uploadedFile.status === 'success' ? 'bg-green-50 border-green-200' :
                    uploadedFile.status === 'error' ? 'bg-red-50 border-red-200' :
                    'bg-blue-50 border-blue-200'
                }`}>
                    <div className="flex items-center space-x-2">
                        {uploadedFile.status === 'success' && (
                            <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        )}
                        {uploadedFile.status === 'error' && (
                            <svg className="h-4 w-4 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
                            </svg>
                        )}
                        {uploadedFile.status === 'uploading' && (
                            <svg className="animate-spin h-4 w-4 text-blue-500" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        )}
                        <div className="flex-1">
                            <p className={`text-sm font-medium ${
                                uploadedFile.status === 'success' ? 'text-green-700' :
                                uploadedFile.status === 'error' ? 'text-red-700' :
                                'text-blue-700'
                            }`}>
                                {uploadedFile.file.name}
                            </p>
                            <p className={`text-xs ${
                                uploadedFile.status === 'success' ? 'text-green-600' :
                                uploadedFile.status === 'error' ? 'text-red-600' :
                                'text-blue-600'
                            }`}>
                                {Math.round(uploadedFile.file.size / 1024)} KB • {uploadedFile.file.type}
                                {uploadedFile.status === 'success' && " • Siap diunggah"}
                                {uploadedFile.status === 'uploading' && " • Mengunggah..."}
                                {uploadedFile.status === 'error' && " • Upload gagal"}
                            </p>
                        </div>
                    </div>
                </div>
            )}
            <p className="mt-1 text-sm text-gray-500">
                Upload gambar screenshot atau foto dari proyek Anda (maksimal 2MB).
            </p>
        </div>
    );
}