import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormData } from "../types";

interface YouTubeInputProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    disabled?: boolean;
}

export default function YouTubeInput({ control, errors, disabled }: YouTubeInputProps) {
    return (
        <div>
            <label htmlFor="youtube_url" className="block text-sm font-medium text-gray-700 mb-2">
                YouTube URL <span className="text-red-500">*</span>
            </label>
            <Controller
                name="youtube_url"
                control={control}
                rules={{
                    required: 'URL YouTube harus diisi',
                    pattern: {
                        value: /^https?:\/\/(www\.)?(youtube\.com|youtu\.be)\/.+/,
                        message: 'Format URL YouTube tidak valid'
                    }
                }}
                render={({ field }) => (
                    <input
                        {...field}
                        type="url"
                        placeholder="Contoh: https://www.youtube.com/watch?v=ID_VIDEO"
                        className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.youtube_url ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={disabled}
                    />
                )}
            />
            {errors.youtube_url && (
                <p className="mt-1 text-sm text-red-600">{errors.youtube_url.message}</p>
            )}
            <p className="mt-1 text-sm text-gray-500">
                Masukkan URL video YouTube yang menampilkan karya Anda.
            </p>
        </div>
    );
}