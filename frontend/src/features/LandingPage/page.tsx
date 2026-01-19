"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import KaryaCarousel from "@/components/ui/KaryaCarousel";
import KaryaCarouselServer from "@/components/ui/KaryaCarouselServer";
import Image from "next/image";
import HeroCarousel from "@/components/ui/HeroCarousel";

interface LandingPageProps {
    user?: any;
    logout?: () => Promise<void>;
    isLoading?: boolean;
}

export default function LandingPage({ user, logout, isLoading }: LandingPageProps) {
    return (
        <div className="flex min-h-screen w-full flex-col items-center">
            <div className="flex md:hidden items-center justify-center w-full mt-0 mb-4">
                {/* <div className="flex flex-row text-white text-xl justify-center items-center font-bold space-x-2 py-2 pb-8">
                    <Image src="/logosmkn5.png" alt="Logo" width={50} height={50} />
                    <h1 className="text-blue-600">Galeri SMKN 5 Malang</h1>
                </div> */}
                <div className="flex flex-row w-full text-center bg-bluealt-200 text-white rounded-full text-lg font-semibold py-3 justify-center items-center space-x-6">
                    <Image src="/logosmkn5.png" alt="Logo" width={50} height={50} />
                    <h1 className="text-white text-xl">Galeri SMKN 5 Malang</h1>
                </div>
            </div>

            <div className="w-full max-w-6xl px-0 md:px-8 md:py-8 md:py-20">
                <HeroCarousel />

                <KaryaCarousel className="mb-12" />

                {/* Login prompt for non-users */}
                {!user && (
                    <div className="mt-16 w-full max-w-4xl mx-auto">
                        <div className="bg-sky-50 rounded-lg p-8 text-center">
                            <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                                Siap untuk bergabung dan berbagi karyamu?
                            </h2>
                            <p className="text-gray-600 mb-6">
                                Masuk untuk mengakses dashboard pribadi, unggah karya kamu sendiri, dan terhubung dengan komunitas SMKN 5.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link
                                    href="/login"
                                    className="bg-sky-600 hover:bg-sky-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Masuk
                                </Link>
                                <Link
                                    href="/register"
                                    className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                                >
                                    Buat Akun
                                </Link>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}