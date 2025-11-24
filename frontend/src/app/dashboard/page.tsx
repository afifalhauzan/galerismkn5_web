"use client";

import { useAuth } from "@/context/AuthContext";
import AdminDashboard from "@/features/AdminDashboard/page";
import GuruDashboard from "@/features/GuruDashboard/page";
import SiswaDashboard from "@/features/SiswaDashboard/page";

export default function Dashboard() {
    const { user, logout, isLoading } = useAuth();

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Redirecting to login...</p>
                </div>
            </div>
        );
    }

    // Route to different dashboards based on user role
    if (user.role === 'admin') {
        return <AdminDashboard user={user} logout={logout} />;
    } else if (user.role === 'guru') {
        return <GuruDashboard user={user} logout={logout} />;
    } else if (user.role === 'siswa') {
        return <SiswaDashboard user={user} logout={logout} />;
    }

    // Fallback for unknown roles
    return <SiswaDashboard user={user} logout={logout} />;
}