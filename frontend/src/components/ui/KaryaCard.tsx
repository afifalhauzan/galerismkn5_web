"use client";

import Image from "next/image";

interface Karya {
    id: number;
    title: string;
    description: string;
    imageUrl: string;
    author: string;
    jurusan: string;
}

interface KaryaCardProps {
    karya: Karya;
}

export default function KaryaCard({ karya }: KaryaCardProps) {
    return (
        <div className="bg-white rounded-lg shadow-lg overflow-hidden mx-2 h-full flex flex-col">
            {/* Image Section */}
            <div className="relative w-full h-48 bg-gray-200">
                <Image
                    src={karya.imageUrl}
                    alt={karya.title}
                    fill
                    className="object-cover"
                    onError={(e) => {
                        // Fallback to gray placeholder if image fails to load
                        e.currentTarget.style.display = 'none';
                    }}
                />
                {/* Fallback placeholder */}
                <div className="absolute inset-0 bg-gray-300 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                </div>
            </div>
            
            {/* Content Section */}
            <div className="bg-sky-700 text-white p-4 flex-1 flex flex-col">
                <h3 className="text-lg font-semibold mb-2">{karya.title}</h3>
                <p className="text-sm text-blue-100 mb-4 flex-1 leading-relaxed line-clamp-3">
                    {karya.description}
                </p>
                
                {/* View Button */}
                <button className="bg-sky-800 hover:bg-slate-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors w-full">
                    Lihat
                </button>
            </div>
        </div>
    );
}