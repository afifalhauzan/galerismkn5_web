import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormData } from "../types";

interface BasicFieldsProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    disabled?: boolean;
}

export default function BasicFields({ control, errors, disabled }: BasicFieldsProps) {
    return (
        <>
            {/* Judul Field */}
            <div>
                <label htmlFor="judul" className="block text-sm font-medium text-gray-700 mb-2">
                    Judul <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="judul"
                    control={control}
                    rules={{
                        required: 'Judul karya harus diisi',
                        minLength: {
                            value: 3,
                            message: 'Judul minimal 3 karakter'
                        }
                    }}
                    render={({ field }) => (
                        <input
                            {...field}
                            type="text"
                            placeholder="Isi judul karya..."
                            className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                                errors.judul ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={disabled}
                        />
                    )}
                />
                {errors.judul && (
                    <p className="mt-1 text-sm text-red-600">{errors.judul.message}</p>
                )}
            </div>

            {/* Deskripsi Field */}
            <div>
                <label htmlFor="deskripsi" className="block text-sm font-medium text-gray-700 mb-2">
                    Deskripsi <span className="text-red-500">*</span>
                </label>
                <Controller
                    name="deskripsi"
                    control={control}
                    rules={{
                        required: 'Deskripsi karya harus diisi',
                        minLength: {
                            value: 10,
                            message: 'Deskripsi minimal 10 karakter'
                        }
                    }}
                    render={({ field }) => (
                        <textarea
                            {...field}
                            rows={6}
                            placeholder="Isi deskripsi karya..."
                            className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors resize-none ${
                                errors.deskripsi ? 'border-red-500' : 'border-gray-300'
                            }`}
                            disabled={disabled}
                        />
                    )}
                />
                {errors.deskripsi && (
                    <p className="mt-1 text-sm text-red-600">{errors.deskripsi.message}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                    Minimal 10 karakter. Jelaskan karya Anda dengan detail.
                </p>
            </div>
        </>
    );
}