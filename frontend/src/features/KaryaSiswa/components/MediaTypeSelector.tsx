import { Control, Controller, FieldErrors } from "react-hook-form";
import { FormData } from "../types";

interface MediaTypeSelectorProps {
    control: Control<FormData>;
    errors: FieldErrors<FormData>;
    disabled?: boolean;
}

export default function MediaTypeSelector({ control, errors, disabled }: MediaTypeSelectorProps) {
    return (
        <div>
            <label htmlFor="media_type" className="block text-sm font-medium text-gray-700 mb-2">
                Jenis Media <span className="text-red-500">*</span>
            </label>
            <Controller
                name="media_type"
                control={control}
                rules={{ required: 'Pilih jenis media' }}
                render={({ field }) => (
                    <select
                        {...field}
                        className={`w-full text-slate-800 px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${
                            errors.media_type ? 'border-red-500' : 'border-gray-300'
                        }`}
                        disabled={disabled}
                    >
                        <option value="link">Drive/Repo Link</option>
                        <option value="youtube">YouTube Video</option>
                        <option value="image">Image File</option>
                    </select>
                )}
            />
            {errors.media_type && (
                <p className="mt-1 text-sm text-red-600">{errors.media_type.message}</p>
            )}
        </div>
    );
}