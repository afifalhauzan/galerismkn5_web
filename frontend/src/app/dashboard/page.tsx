"use client";

import { useAuth } from "@/context/AuthContext";
import { PasswordGuard } from "@/components/guards/PasswordGuard";
import AdminDashboard from "@/features/AdminDashboard/page";
import GuruDashboard from "@/features/GuruDashboard/page";
import SiswaDashboard from "@/features/SiswaDashboard/page";

export default function Dashboard() {
    const { user, logout } = useAuth();

    return (
        <PasswordGuard>
            {/* Route to different dashboards based on user role */}
            {user?.role === 'admin' && <AdminDashboard user={user} logout={logout} />}
            {user?.role === 'guru' && <GuruDashboard user={user} logout={logout} />}
            {user?.role === 'siswa' && <SiswaDashboard user={user} logout={logout} />}
            {!user?.role && (
                <div className="min-h-screen flex items-center justify-center">
                    <div className="text-center">
                        <p className="text-gray-600">Loading user data...</p>
                    </div>
                </div>
            )}
        </PasswordGuard>
    );
}