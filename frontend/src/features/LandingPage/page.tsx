"use client";

import { useAuth } from "@/context/AuthContext";
import Link from "next/link";

interface LandingPageProps {
    user?: any;
    logout?: () => Promise<void>;
    isLoading?: boolean;
}

export default function LandingPage({ user, logout, isLoading }: LandingPageProps) {
    return (
        <div className="flex min-h-screen w-full max-w-6xl flex-col items-center justify-center py-20 px-8">
            {/* Hero Section */}
            <div className="text-center mb-16">
                <h1 className="text-5xl font-bold text-gray-800 mb-6">
                    Welcome to Galeri Digital SMKN 5
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
                    Explore our collection of digital artworks, projects, and achievements created by our talented students and dedicated staff.
                </p>
                
                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    {user ? (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/dashboard"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Go to Dashboard
                            </Link>
                            <Link
                                href="/galeri"
                                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Browse Gallery
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Login to Access
                            </Link>
                            <Link
                                href="/register"
                                className="border border-blue-600 text-blue-600 hover:bg-blue-50 px-8 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    )}
                </div>
            </div>

            {/* Features Section */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-4xl">
                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Digital Gallery</h3>
                    <p className="text-gray-600">Browse through our extensive collection of student artworks and projects.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Community</h3>
                    <p className="text-gray-600">Connect with fellow students and teachers in our creative community.</p>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-md">
                    <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Innovation</h3>
                    <p className="text-gray-600">Showcase innovative projects and technological achievements.</p>
                </div>
            </div>

            {/* Stats Section */}
            {user && (
                <div className="mt-16 w-full max-w-4xl">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg p-8 text-white">
                        <h2 className="text-2xl font-bold mb-6 text-center">Welcome back, {user.name}!</h2>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                            <div>
                                <div className="text-3xl font-bold mb-2">150+</div>
                                <div className="text-blue-100">Artworks</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-2">50+</div>
                                <div className="text-blue-100">Artists</div>
                            </div>
                            <div>
                                <div className="text-3xl font-bold mb-2">25+</div>
                                <div className="text-blue-100">Projects</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Login prompt for non-users */}
            {!user && (
                <div className="mt-16 w-full max-w-4xl">
                    <div className="bg-gray-100 rounded-lg p-8 text-center">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                            Ready to explore?
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Log in to access your personalized dashboard, upload your own artwork, and connect with the SMKN 5 community.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/login"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Sign In
                            </Link>
                            <Link
                                href="/register"
                                className="border border-gray-300 text-gray-700 hover:bg-gray-50 px-6 py-3 rounded-lg font-semibold transition-colors"
                            >
                                Create Account
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}