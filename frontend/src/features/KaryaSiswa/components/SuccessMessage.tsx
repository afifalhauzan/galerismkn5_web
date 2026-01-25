interface SuccessMessageProps {
    message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
    return (
        <div className="p-4 border-b bg-green-50 border-green-200">
            <div className="flex items-center">
                <svg className="h-5 w-5 text-green-400 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm text-green-700">{message}</p>
            </div>
        </div>
    );
}