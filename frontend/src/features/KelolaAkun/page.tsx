"use client";

import { useAuth } from "@/context/AuthContext";
import { useUserStats } from "@/hooks/useApi";

export default function KelolaAkun({ user, logout }: { user: any, logout: () => void }) {

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Your KelolaAkun content goes here */}
            <h1 className="text-2xl font-bold mb-6">Kelola Akun</h1>
            <p>Welcome to the account management page, {user.name}!</p>
        </div>
    );
}