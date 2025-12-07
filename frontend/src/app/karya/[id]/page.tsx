"use client";

import AuthLayout from "@/components/layouts/AuthLayout";
import { useAuth } from "@/context/AuthContext";
import DetailKaryaSiswa from "@/features/KaryaSiswa/DetailKaryaSiswa/page";

export default function Karya() {
    const { user, logout } = useAuth();

    return (
        <AuthLayout>
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <DetailKaryaSiswa user={user} logout={logout} />
            </div>
        </AuthLayout>
    );
}