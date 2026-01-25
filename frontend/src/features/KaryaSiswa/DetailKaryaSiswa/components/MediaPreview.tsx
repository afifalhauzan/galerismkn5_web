interface MediaPreviewProps {
  proyek: any;
  imageUrl: string;
}

// Helper function to detect if URL is YouTube
const isYouTubeUrl = (url: string): boolean => {
  return url.includes('youtube.com') || url.includes('youtu.be');
};

// Helper function to detect if URL is GitHub
const isGitHubUrl = (url: string): boolean => {
  return url.includes('github.com');
};

// Helper function to detect if URL is Google Drive
const isDriveUrl = (url: string): boolean => {
  return url.includes('drive.google.com') || url.includes('docs.google.com');
};

// Helper function to convert YouTube URL to embed format
const getYouTubeEmbedUrl = (url: string): string => {
  try {
    // Handle youtube.com/watch?v= format
    if (url.includes('youtube.com/watch?v=')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle youtu.be/ format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    
    // Handle embed URLs (already in correct format)
    if (url.includes('youtube.com/embed/')) {
      return url;
    }
    
    return url; // Return original if format not recognized
  } catch (error) {
    return url;
  }
};

export default function MediaPreview({ proyek, imageUrl }: MediaPreviewProps) {
  const renderPreview = () => {
    // Priority 1: YouTube detection from tautan_proyek
    if (proyek.tautan_proyek && isYouTubeUrl(proyek.tautan_proyek)) {
      const embedUrl = getYouTubeEmbedUrl(proyek.tautan_proyek);
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <iframe
            src={embedUrl}
            title={proyek.judul}
            className="w-full h-full"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      );
    }

    // Priority 2: Image if available
    if (proyek.image_url) {
      return (
        <div className="aspect-video bg-gray-100 rounded-lg overflow-hidden">
          <img
            src={`${imageUrl}${proyek.image_url}`}
            alt={proyek.judul}
            className="w-full h-full object-cover"
          />
        </div>
      );
    }

    // Priority 3: External link (non-YouTube)
    if (proyek.tautan_proyek) {
      // Determine link type for conditional heading
      let linkType = "Link Eksternal";
      let linkText = "Kunjungi Link";
      
      if (isGitHubUrl(proyek.tautan_proyek)) {
        linkType = "GitHub Repository";
        linkText = "Lihat di GitHub";
      } else if (isDriveUrl(proyek.tautan_proyek)) {
        linkType = "Google Drive";
        linkText = "Buka di Drive";
      }

      return (
        <div className="aspect-video bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg flex items-center justify-center border-2 border-dashed border-blue-200">
          <div className="text-center p-8">
            <div className="mx-auto h-16 w-16 bg-blue-500 rounded-full flex items-center justify-center mb-4">
              <svg className="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">{linkType}</h3>
            <p className="text-sm text-gray-600 mb-4">Klik tombol di bawah untuk melihat proyek</p>
            <a
              href={proyek.tautan_proyek}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              {linkText}
            </a>
          </div>
        </div>
      );
    }

    // Fallback placeholder
    return (
      <div className="aspect-video bg-gray-100 rounded-lg flex items-center justify-center">
        <div className="text-center">
          <svg className="mx-auto h-16 w-16 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <p className="mt-2 text-sm text-gray-500">Media tidak tersedia</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Preview Karya</h3>
      {renderPreview()}
    </div>
  );
}