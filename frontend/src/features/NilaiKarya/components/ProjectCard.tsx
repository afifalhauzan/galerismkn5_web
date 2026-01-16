import { HiEye, HiClock, HiUser, HiPhotograph } from "react-icons/hi";
import Link from "next/link";
import Image from "next/image";
import { Proyek } from "@/types/proyek";

interface ProjectCardProps {
    proyek: Proyek;
    onGraded: () => void;
}

export function ProjectCard({ proyek, onGraded }: ProjectCardProps) {
    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    return (
        <div className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow">
            {/* Project Image */}
            <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                {proyek.image_url ? (
                    <Image
                        src={proyek.image_url}
                        alt={proyek.judul}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <HiPhotograph className="w-12 h-12 text-gray-400" />
                    </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-2 left-2">
                    <span className="bg-orange-100 text-orange-800 px-2 py-1 text-xs font-medium rounded-full">
                        Menunggu Penilaian
                    </span>
                </div>
            </div>

            {/* Project Content */}
            <div className="p-4">
                <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
                    {proyek.judul}
                </h3>

                <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center space-x-2">
                        <HiUser className="w-4 h-4" />
                        <span>{proyek.user?.name}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                        <HiClock className="w-4 h-4" />
                        <span>Dikirim {formatDate(proyek.created_at)}</span>
                    </div>
                    {proyek.user?.kelas && (
                        <div className="flex items-center space-x-2">
                            <span className="w-4 h-4 text-center text-xs font-bold">K</span>
                            <span>{proyek.user.kelas.nama_kelas}</span>
                        </div>
                    )}
                </div>

                {/* Action Button */}
                <Link
                    href={`/karya/${proyek.id}`}
                    className="w-full bg-sky-600 text-white py-2 px-4 rounded-lg hover:bg-sky-700 transition-colors flex items-center justify-center space-x-2"
                >
                    <HiEye className="w-4 h-4" />
                    <span>Lihat & Nilai</span>
                </Link>
            </div>
        </div>
    );
}