import Link from "next/link";

interface FormActionsProps {
    isSubmitting: boolean;
    isCreating?: boolean;
    cancelHref: string;
    submitText?: string;
    loadingText?: string;
}

export default function FormActions({ 
    isSubmitting, 
    isCreating, 
    cancelHref, 
    submitText = "Unggah Karya",
    loadingText = "Mengunggah..." 
}: FormActionsProps) {
    return (
        <div className="flex justify-end space-x-3 pt-6 border-t">
            <Link
                href={cancelHref}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
            >
                Batal
            </Link>
            <button
                type="submit"
                disabled={isSubmitting || isCreating}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors font-medium flex items-center"
            >
                {(isSubmitting || isCreating) ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {loadingText}
                    </>
                ) : (
                    submitText
                )}
            </button>
        </div>
    );
}