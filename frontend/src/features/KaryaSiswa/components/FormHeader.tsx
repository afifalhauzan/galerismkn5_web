import Link from "next/link";

interface FormHeaderProps {
    title: string;
    description: string;
    backHref: string;
}

export default function FormHeader({ title, description, backHref }: FormHeaderProps) {
    return (
        <div className="mb-8">
            <div className="flex items-center space-x-4 mb-4">
                <Link
                    href={backHref}
                    className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                    </svg>
                    Kembali
                </Link>
                <div className="border-l h-6 border-gray-300"></div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
            </div>
            <p className="text-gray-600">{description}</p>
        </div>
    );
}