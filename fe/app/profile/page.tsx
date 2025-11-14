"use client";

import { useAuth } from "@/hooks/use-auth";
import {
    User as UserIcon,
    Mail,
    Edit2,
    LogOut,
    Calendar
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { userService } from "@/services/userService";
import { User } from "@/interfaces/user/interface";

export default function ProfilePage() {
    const { signOut, isLoading, user } = useAuth();
    const router = useRouter();

    const handleLogout = async () => {
        await signOut()
        router.push("/")
    }

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center space-y-4">
                    <UserIcon className="w-16 h-16 text-slate-400 mx-auto" />
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Not Logged In</h2>
                    <p className="text-slate-600 dark:text-slate-400">Please log in to view your profile</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto space-y-6">

                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden">
                    {/* Cover Image */}
                    <div className="h-32 bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600"></div>

                    {/* Profile Content */}
                    <div className="px-6 pb-6">
                        {/* Avatar & Edit Button */}
                        <div className="flex items-end justify-between -mt-16 mb-4">
                            <div className="w-32 h-32 bg-linear-to-r from-blue-500 to-indigo-600 rounded-2xl border-4 border-white dark:border-slate-900 shadow-lg flex items-center justify-center">
                                {user.image ? (
                                    <img src={user.image} alt={user.name} className="w-full h-full rounded-2xl object-cover" />
                                ) : (
                                    <span className="text-4xl font-bold text-white">
                                        {user.name?.charAt(0).toUpperCase()}
                                    </span>
                                )}
                            </div>
                        </div>

                        {/* User Info */}
                        <div className="space-y-4">

                            <>
                                <div>
                                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">{user.name}</h1>
                                </div>

                                {user.description && (
                                    <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{user.description}</p>
                                )}
                            </>

                        </div>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mt-6">
                            <button
                                onClick={handleLogout}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <LogOut className="w-4 h-4" />
                                Logout
                            </button>
                            <button
                                onClick={() => router.push('/profile/edit')}
                                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                            >
                                <Edit2 className="w-4 h-4" />
                                Edit Profile
                            </button>
                            {user.role === 'PROVIDER' && (
                                <button
                                    onClick={() => router.push('/slots')}
                                    className="flex items-center gap-2 px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors font-medium"
                                >
                                    <Calendar className="w-4 h-4" />
                                    Manage Slots
                                </button>
                            )}
                        </div>
                    </div>

                </div>

                {/* Stats & Info Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Email Card */}
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Mail className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Email</p>
                                <p className="font-semibold text-slate-900 dark:text-white break-all">{user.email || 'Not available'}</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6 hover:shadow-xl transition-shadow">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Role</p>
                                <p className="font-semibold text-slate-900 dark:text-white break-all">{user.role || 'Not available'}</p>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Account Details Card */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                        <UserIcon className="w-5 h-5" />
                        Account Details
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <p className="text-sm text-slate-600 dark:text-slate-400">User ID</p>
                            <p className="font-mono text-sm text-slate-900 dark:text-white bg-slate-100 dark:bg-slate-800 px-3 py-2 rounded">
                                {user.id}
                            </p>
                        </div>
                        <div className="space-y-2">
                            <p className="text-sm text-slate-600 dark:text-slate-400">Member Since</p>
                            <p className="text-slate-900 dark:text-white">
                                {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}