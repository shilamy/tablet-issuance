"use client";

import { useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
    const { logout } = useAuth();
    const router = useRouter();

    useEffect(() => {
        logout();
        const timer = setTimeout(() => {
            router.push("/auth/login");
        }, 1500);
        return () => clearTimeout(timer);
    }, [logout, router]);

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-50">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900">Signing out...</h1>
                <p className="text-gray-500 mt-2">Please wait a moment.</p>
            </div>
        </div>
    );
}
