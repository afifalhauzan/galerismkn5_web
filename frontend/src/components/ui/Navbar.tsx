"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Image from "next/image";
import { HiHome, HiPhotograph, HiQuestionMarkCircle, HiUser, HiLogin, HiClipboardCheck } from "react-icons/hi";
import { FaCircleUser } from "react-icons/fa6";

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
    const pathname = usePathname();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const handleAuthAction = () => {
        if (user) {
            router.push("/dashboard");
        } else {
            router.push("/login");
        }
    };

    const handleLogout = async () => {
        try {
            await logout();
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    return (
        <>
            {/* Desktop Navbar */}
            <nav className={`hidden md:block fixed top-0 left-0 right-0 pt-4 z-50 ${className}`}>
                <div className="max-w-7xl mx-auto px-4">
                    <div className="bg-bluealt-200 shadow-md rounded-full px-6">
                        <div className="flex justify-between items-center h-16">
                            {/* Logo */}
                            <div className="flex-shrink-0 flex items-center">
                                <Link href="/" className="flex flex-row text-white text-xl justify-center items-center font-bold space-x-2">
                                    <Image src="/logosmkn5.png" alt="Logo" width={40} height={40} />
                                    <h1 className="">Galeri SMKN 5</h1>
                                </Link>
                            </div>

                            {/* Desktop Navigation Links */}
                            <div className="flex items-baseline space-x-4">
                                <Link
                                    href="/"
                                    className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/"
                                        ? "bg-sky-600 hover:bg-sky-700"
                                        : "hover:bg-sky-700"
                                        }`}
                                >
                                    Beranda
                                </Link>
                                <Link
                                    href="/galeri"
                                    className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/galeri"
                                        ? "bg-sky-600 hover:bg-sky-700"
                                        : "hover:bg-sky-700"
                                        }`}
                                >
                                    Galeri
                                </Link>

                                {user?.role !== 'admin' && (
                                    <Link
                                        href="/faq"
                                        className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/faq"
                                            ? "bg-sky-600 hover:bg-sky-700"
                                            : "hover:bg-sky-700"
                                            }`}
                                    >
                                        FAQ
                                    </Link>
                                )}
                                {(user?.role === 'admin') && (
                                    <Link
                                        href="/kelolaakun"
                                        className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/kelolaakun"
                                            ? "bg-sky-600 hover:bg-sky-700"
                                            : "hover:bg-sky-700"
                                            }`}
                                    >
                                        Kelola Akun
                                    </Link>
                                )}

                                {user?.role === 'siswa' && (
                                    <Link
                                        href="/karya"
                                        className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/karya"
                                            ? "bg-sky-600 hover:bg-sky-700"
                                            : "hover:bg-sky-700"
                                            }`}
                                    >
                                        Karya
                                    </Link>
                                )}

                                {user?.role === 'guru' && (
                                    <Link
                                        href="/nilaikarya"
                                        className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/nilaikarya"
                                            ? "bg-sky-600 hover:bg-sky-700"
                                            : "hover:bg-sky-700"
                                            }`}
                                    >
                                        Nilai Karya
                                    </Link>
                                )}

                                {user && (
                                    <Link
                                        href="/dashboard"
                                        className={`text-white px-3 py-2 rounded-full text-sm font-medium transition-colors ${pathname === "/dashboard"
                                            ? "bg-sky-600 hover:bg-sky-700"
                                            : "hover:bg-sky-700"
                                            }`}
                                    >
                                        Dashboard
                                    </Link>
                                )}
                            </div>

                            {/* Desktop Auth Buttons */}
                            <div className="flex items-center space-x-4">
                                {isLoading ? (
                                    <div className="animate-pulse bg-blue-500 h-9 w-20 rounded-md"></div>
                                ) : user ? (
                                    <div className="flex items-center space-x-3">
                                        <div className="flex items-center bg-sky-700 bg-opacity-20 backdrop-blur-sm rounded-full px-4 py-[6px] space-x-3">
                                            <FaCircleUser className="text-white text-3xl" />
                                            <div className="text-white">
                                                <div className="text-sm font-medium overflow-hidden text-ellipsis line-clamp-1">Hi, {user.name}</div>
                                                <div className="text-xs text-gray-200">{user.role}</div>
                                            </div>
                                            <button
                                                onClick={handleLogout}
                                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-[6px] rounded-md text-sm font-medium transition-colors"
                                            >
                                                Keluar
                                            </button>
                                        </div>

                                    </div>
                                ) : (
                                    <div className="flex items-center space-x-2">
                                        <button
                                            onClick={handleAuthAction}
                                            className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                        >
                                            Masuk
                                        </button>
                                        <Link
                                            href="/register"
                                            className="bg-white text-slate-600 hover:bg-gray-100 px-4 py-2 rounded-md text-sm font-medium transition-colors border"
                                        >
                                            Daftar
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around items-center py-2">
                    {/* Beranda */}
                    <Link
                        href="/"
                        className={`flex flex-col items-center py-2 px-3 transition-colors ${pathname === "/"
                            ? "text-sky-700"
                            : "text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        <HiHome size={24} />
                        <span className="text-xs mt-1">Beranda</span>
                    </Link>

                    {/* Galeri */}
                    <Link
                        href="/galeri"
                        className={`flex flex-col items-center py-2 px-3 transition-colors ${pathname === "/galeri"
                            ? "text-sky-700"
                            : "text-gray-600 hover:text-blue-600"
                            }`}
                    >
                        <HiPhotograph size={24} />
                        <span className="text-xs mt-1">Galeri</span>
                    </Link>

                    {/* FAQ */}
                    {user?.role !== 'admin' && (
                        <Link
                            href="/faq"
                            className={`flex flex-col items-center py-2 px-3 transition-colors ${pathname === "/faq"
                                ? "text-sky-700"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <HiQuestionMarkCircle size={24} />
                            <span className="text-xs mt-1">FAQ</span>
                        </Link>
                    )}

                    {user?.role === 'siswa' && (
                        <Link
                            href="/karya"
                            className={`flex flex-col items-center py-2 px-3 transition-colors ${pathname === "/karya"
                                ? "text-sky-700"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <HiQuestionMarkCircle size={24} />
                            <span className="text-xs mt-1">Karya</span>
                        </Link>
                    )}

                    {user?.role === 'guru' && (
                        <Link
                            href="/nilaikarya"
                            className={`flex flex-col items-center py-2 px-3 transition-colors ${pathname === "/nilaikarya"
                                ? "text-sky-700"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <HiClipboardCheck size={24} />
                            <span className="text-xs mt-1">Nilai Karya</span>
                        </Link>
                    )}

                    {/* FAQ */}
                    {user?.role === 'admin' && (
                        <Link
                            href="/kelolaakun"
                            className={`flex flex-col items-center py-2 px-3 transition-colors ${pathname === "/faq"
                                ? "text-sky-700"
                                : "text-gray-600 hover:text-blue-600"
                                }`}
                        >
                            <HiQuestionMarkCircle size={24} />
                            <span className="text-xs mt-1">Kelola Akun</span>
                        </Link>
                    )}

                    {/* Profile/Login */}
                    {isLoading ? (
                        <div className="flex flex-col items-center py-2 px-3">
                            <div className="animate-pulse bg-gray-300 h-6 w-6 rounded"></div>
                            <span className="text-xs mt-1 text-gray-400">...</span>
                        </div>
                    ) : user ? (
                        <button
                            onClick={handleAuthAction}
                            className={`flex flex-col items-center pl-0 py-2 px-3 transition-colors ${pathname === "/dashboard"
                                ? "text-sky-700"
                                : "text-gray-600 hover:text-blue-600"
                                }`}>
                            <HiUser size={24} />
                            <span className="text-xs mt-1">Dashboard</span>
                        </button>
                    ) : (
                        <button
                            onClick={handleAuthAction}
                            className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <HiLogin size={24} />
                            <span className="text-xs mt-1">Login</span>
                        </button>
                    )}
                </div>
            </div>
        </>
    );
}
