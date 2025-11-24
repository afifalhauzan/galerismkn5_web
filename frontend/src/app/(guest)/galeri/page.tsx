"use client";

export default function Galeri() {
    return (
        <div className="flex min-h-screen w-full flex-col items-center justify-center py-20 px-8">
            <div className="max-w-6xl w-full text-center">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Galeri
                </h1>
                <p className="text-xl text-gray-600 mb-8">
                    Explore our collection of digital artworks and creative projects.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
                    {/* Placeholder for gallery items */}
                    {[1, 2, 3, 4, 5, 6].map((item) => (
                        <div key={item} className="bg-gray-200 aspect-square rounded-lg flex items-center justify-center">
                            <span className="text-gray-500">Gallery Item {item}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}