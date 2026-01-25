export default function InfoSection() {
    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex">
                <svg className="h-5 w-5 text-blue-400 mr-3 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="text-sm">
                    <p className="text-blue-800 font-medium">Informasi Penting</p>
                    <p className="text-blue-700 mt-1">
                        Karya Anda akan otomatis tersimpan dengan status "Terkirim" dan siap untuk dinilai oleh guru.
                        Pastikan semua informasi sudah benar sebelum mengunggah.
                    </p>
                </div>
            </div>
        </div>
    );
}