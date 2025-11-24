"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiHome, HiPhotograph, HiQuestionMarkCircle, HiUser, HiLogin } from "react-icons/hi";

interface NavbarProps {
    className?: string;
}

export default function Navbar({ className = "" }: NavbarProps) {
    const { user, logout, isLoading } = useAuth();
    const router = useRouter();
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
            <nav className={`bg-bluealt-200 shadow-md hidden md:block ${className}`}>
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <div className="flex-shrink-0">
                            <Link href="/" className="text-white text-xl font-bold">
                                LOGO
                            </Link>
                        </div>

                        {/* Desktop Navigation Links */}
                        <div className="flex items-baseline space-x-8">
                            <Link 
                                href="/" 
                                className="text-white hover:bg-slate-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium border-b-2 border-white"
                            >
                                Beranda
                            </Link>
                            <Link 
                                href="/galeri" 
                                className="text-white hover:bg-slate-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                Galeri
                            </Link>
                            <Link 
                                href="/faq" 
                                className="text-white hover:bg-slate-500 hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                            >
                                FAQ
                            </Link>
                        </div>

                        {/* Desktop Auth Buttons */}
                        <div className="flex items-center space-x-4">
                            {isLoading ? (
                                <div className="animate-pulse bg-slate-500 h-9 w-20 rounded-md"></div>
                            ) : user ? (
                                <div className="flex items-center space-x-3">
                                    <span className="text-white text-sm">
                                        Hello, {user.name}
                                    </span>
                                    <button
                                        onClick={handleAuthAction}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Dashboard
                                    </button>
                                    <button
                                        onClick={handleLogout}
                                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
                                    >
                                        Logout
                                    </button>
                                </div>
                            ) : (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={handleAuthAction}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors"
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
            </nav>

            {/* Mobile Bottom Navigation */}
            <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50">
                <div className="flex justify-around items-center py-2">
                    {/* Beranda */}
                    <Link 
                        href="/" 
                        className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <HiHome size={24} />
                        <span className="text-xs mt-1">Beranda</span>
                    </Link>

                    {/* Galeri */}
                    <Link 
                        href="/galeri" 
                        className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <HiPhotograph size={24} />
                        <span className="text-xs mt-1">Galeri</span>
                    </Link>

                    {/* FAQ */}
                    <Link 
                        href="/faq" 
                        className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
                    >
                        <HiQuestionMarkCircle size={24} />
                        <span className="text-xs mt-1">FAQ</span>
                    </Link>

                    {/* Profile/Login */}
                    {isLoading ? (
                        <div className="flex flex-col items-center py-2 px-3">
                            <div className="animate-pulse bg-gray-300 h-6 w-6 rounded"></div>
                            <span className="text-xs mt-1 text-gray-400">...</span>
                        </div>
                    ) : user ? (
                        <button
                            onClick={handleAuthAction}
                            className="flex flex-col items-center py-2 px-3 text-gray-600 hover:text-blue-600 transition-colors"
                        >
                            <HiUser size={24} />
                            <span className="text-xs mt-1">Profile</span>
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
