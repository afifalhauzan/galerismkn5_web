import MediaPreview from './MediaPreview';

interface ProjectDetailsProps {
  proyek: any;
  imageUrl: string;
}

export default function ProjectDetails({ proyek, imageUrl }: ProjectDetailsProps) {
  return (
    <div className="space-y-6">
      {/* Project Details */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">{proyek.judul}</h2>
            <span className={`px-3 py-1 text-sm font-medium rounded-full ${proyek.status === 'terkirim'
              ? 'bg-blue-100 text-blue-800'
              : proyek.status === 'dinilai'
                ? 'bg-green-100 text-green-800'
                : 'bg-gray-100 text-gray-800'
              }`}>
              {proyek.status === 'terkirim' ? 'Terkirim' :
                proyek.status === 'dinilai' ? 'Dinilai' : proyek.status}
            </span>
          </div>

          <div className="prose max-w-none">
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Deskripsi</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
              {proyek.deskripsi}
            </p>
          </div>

          {proyek.tautan_proyek && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tautan Proyek</h3>
              <a
                href={proyek.tautan_proyek}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-blue-600 hover:text-blue-800"
              >
                <svg className="hidden md:block w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
                {proyek.tautan_proyek}
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Dynamic Media Preview */}
      <MediaPreview proyek={proyek} imageUrl={imageUrl} />
    </div>
  );
}