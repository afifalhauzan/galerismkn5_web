"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { useCreateProyek } from "@/hooks/ProjekHooks";
import { useAuth } from "@/context/AuthContext";

// Import components
import FormHeader from "../components/FormHeader";
import BasicFields from "../components/BasicFields";
import MediaTypeSelector from "../components/MediaTypeSelector";
import LinkInput from "../components/LinkInput";
import YouTubeInput from "../components/YouTubeInput";
import ImageUpload from "../components/ImageUpload";
import InfoSection from "../components/InfoSection";
import FormActions from "../components/FormActions";
import SuccessMessage from "../components/SuccessMessage";
import { FormData, UploadedFile } from "../types";


export default function AddKaryaSiswa({ user, logout }: { user: any; logout: () => void }) {
    const router = useRouter();
    const { user: authUser } = useAuth();
    const { createProyek, isCreating, error } = useCreateProyek();
    
    const [uploadedFile, setUploadedFile] = useState<UploadedFile | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string>("");

    // React Hook Form setup
    const {
        control,
        handleSubmit,
        watch,
        setValue,
        reset,
        formState: { errors, isValid },
    } = useForm<FormData>({
        mode: 'onChange',
        defaultValues: {
            judul: "",
            deskripsi: "",
            media_type: "link",
            tautan_proyek: "",
            youtube_url: "",
            image: undefined,
        },
    });

    const watchedMediaType = watch('media_type');

    // Handle media type change - clear previous inputs
    useEffect(() => {
        if (watchedMediaType === 'link') {
            setValue('youtube_url', '');
            setValue('image', undefined);
            setUploadedFile(null);
        } else if (watchedMediaType === 'youtube') {
            setValue('tautan_proyek', '');
            setValue('image', undefined);
            setUploadedFile(null);
        } else if (watchedMediaType === 'image') {
            setValue('tautan_proyek', '');
            setValue('youtube_url', '');
        }
    }, [watchedMediaType, setValue]);

    const onSubmit = async (data: FormData) => {
        if (!authUser?.jurusan_id) {
            return;
        }

        setIsSubmitting(true);

        try {
            const proyekData = {
                judul: data.judul.trim(),
                deskripsi: data.deskripsi.trim(),
                media_type: data.media_type,
                tautan_proyek: data.media_type === 'link' ? data.tautan_proyek?.trim() : undefined,
                youtube_url: data.media_type === 'youtube' ? data.youtube_url?.trim() : undefined,
                jurusan_id: authUser.jurusan_id,
                status: 'terkirim' as const,
                image: data.media_type === 'image' ? data.image : undefined
            };

            const result = await createProyek(proyekData);
            
            // Handle success message with upload info
            if (result?.upload_info) {
                setSuccessMessage(
                    `Karya berhasil diunggah! Gambar "${result.upload_info.original_name}" (${result.upload_info.size_formatted}) telah tersimpan.`
                );
            } else {
                setSuccessMessage("Karya berhasil diunggah!");
            }

            // Show success message briefly before redirect
            setTimeout(() => {
                router.push('/karya');
            }, 1500);
        } catch (err: any) {
            console.error('Error creating proyek:', err);
            
            let errorMessage = "Terjadi kesalahan saat menyimpan karya";
            
            // Handle different types of errors
            if (err.response?.data) {
                const errorData = err.response.data;
                
                // Handle validation errors
                if (errorData.errors) {
                    // Set form errors using RHF
                    Object.keys(errorData.errors).forEach(key => {
                        // Handle the errors appropriately
                    });
                    return;
                }
                
                // Handle upload-specific errors
                if (errorData.upload_details) {
                    errorMessage = `Gagal mengunggah gambar "${errorData.upload_details.original_name}" (${errorData.upload_details.size}): ${errorData.error}`;
                } else if (errorData.message) {
                    errorMessage = errorData.message;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }
            
            // Show general error message
            setSuccessMessage(''); // Clear success message
            console.error(errorMessage);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-10 md:pt-20">
            <div className="max-w-2xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
                <FormHeader 
                    title="Unggah Karya"
                    description="Bagikan karya terbaikmu dengan komunitas SMKN 5!"
                    backHref="/karya"
                />

                <div className="bg-white rounded-lg shadow-sm border">
                    {successMessage && <SuccessMessage message={successMessage} />}

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-6">
                        <BasicFields 
                            control={control}
                            errors={errors}
                            disabled={isSubmitting}
                        />

                        <MediaTypeSelector 
                            control={control}
                            errors={errors}
                            disabled={isSubmitting}
                        />

                        {/* Dynamic Media Input */}
                        {watchedMediaType === 'link' && (
                            <LinkInput 
                                control={control}
                                errors={errors}
                                disabled={isSubmitting}
                            />
                        )}

                        {watchedMediaType === 'youtube' && (
                            <YouTubeInput 
                                control={control}
                                errors={errors}
                                disabled={isSubmitting}
                            />
                        )}

                        {watchedMediaType === 'image' && (
                            <ImageUpload 
                                uploadedFile={uploadedFile}
                                setUploadedFile={setUploadedFile}
                                setValue={setValue}
                                disabled={isSubmitting}
                            />
                        )}

                        <InfoSection />

                        <FormActions 
                            isSubmitting={isSubmitting}
                            isCreating={isCreating}
                            cancelHref="/karya"
                        />
                    </form>
                </div>
            </div>
        </div>
    );
}
