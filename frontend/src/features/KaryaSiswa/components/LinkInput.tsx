import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormData } from "../types";

interface LinkInputProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    disabled?: boolean;
}

export default function LinkInput({ control, errors, disabled }: LinkInputProps) {
    return (
        <div>
            <label htmlFor="tautan_proyek" className="block text-sm font-medium text-gray-700 mb-2">
                Drive/Repo Link <span className="text-red-500">*</span>
            </label>
            <Controller
                name="tautan_proyek"
                control={control}
                rules={{
                    required: 'Link proyek harus diisi',
                    pattern: {
                        value: /^https?:\/\/.+/,
                        message: 'Format URL tidak valid'
                    }
                }}
                render={({ field }) => (
                    <input
                        {...field}
                        type="url"
                        placeholder="Contoh: https://drive.google.com/... atau https://github.com/..."
                        className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.tautan_proyek ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={disabled}
                    />
                )}
            />
            {errors.tautan_proyek && (
                <p className="mt-1 text-sm text-red-600">{errors.tautan_proyek.message}</p>
            )}
            <div className="mt-2 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex">
                    <svg className="h-5 w-5 text-yellow-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5C2.962 18.333 3.924 20 5.464 20z" />
                    </svg>
                    <p className="text-sm text-yellow-800">
                        <strong>Penting:</strong> Pastikan link dapat diakses secara publik agar guru dapat melihat karya Anda.
                    </p>
                </div>
            </div>
        </div>
    );
}