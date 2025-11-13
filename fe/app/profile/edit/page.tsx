"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Category, SignUpData, User } from "@/interfaces/user/interface";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userService } from "@/services/userService";

export default function EditProfilePage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [formData, setFormData] = useState({
        name: "",
        category: Category.OTHER,
        description: "",
        hourlyRate: "0.00",
    });
    const queryClient = useQueryClient();

    const currentUserData = useQuery({
        queryKey: ["currentUser"],
        queryFn: () => userService.getCurrentUser()
    });

    const user: User = currentUserData.data?.data?.user;

    // Use useEffect to set form data when user data is loaded
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || "",
                category: user.category || Category.OTHER,
                description: user.description || "",
                hourlyRate: user.hourlyRate || "0.00",
            });
        }
    }, [user]);

    const { mutate: updateProfile, isPending } = useMutation({
        mutationFn: userService.updateProfile,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["currentUser"] });
            router.push("/profile");
        },
        onError: (error: Error) => {
            setError(error.message || "Profile update failed");
        },
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        const payload: Partial<SignUpData> = {
            name: formData.name,
            hourlyRate: user?.role === "PROVIDER" ? formData.hourlyRate : undefined,
            description: user?.role === "PROVIDER" ? formData.description : undefined,
            category: user?.role === "PROVIDER" ? formData.category : undefined,
        };
        console.log("Updating profile with data:", payload);
        updateProfile(payload);
    };

    if (currentUserData.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-4">
                    <div className="w-10 h-10 border-4 border-blue-600/70 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400 text-sm">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (currentUserData.isError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950">
                <div className="text-center space-y-3">
                    <p className="text-red-600 dark:text-red-300">Failed to load profile</p>
                    <Link href="/profile" className="inline-block text-blue-600 hover:underline">
                        Go back to profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 py-10 px-4">
            <div className="max-w-lg mx-auto">
                <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 text-center">Edit Profile</h2>

                    <form onSubmit={handleSubmit} className="mt-6 space-y-5">
                        {error && (
                            <div className="rounded-lg border border-red-300/50 bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 p-3 text-sm">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <label htmlFor="name" className="block text-sm text-slate-700 dark:text-slate-300">Name</label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                placeholder="Full name"
                            />
                        </div>

                        {user?.role === "PROVIDER" && (
                            <>
                                <div className="space-y-2">
                                    <label htmlFor="category" className="block text-sm text-slate-700 dark:text-slate-300">Category</label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        {Object.values(Category).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="hourlyRate" className="block text-sm text-slate-700 dark:text-slate-300">Hourly Rate ($)</label>
                                    <input
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="50.00"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label htmlFor="description" className="block text-sm text-slate-700 dark:text-slate-300">Description</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                                        placeholder="Your professional summary..."
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}

                        <div className="flex gap-3 pt-2">
                            <Link
                                href="/profile"
                                className="flex-1 inline-flex justify-center rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={isPending}
                                className="flex-1 inline-flex justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                            >
                                {isPending ? "Updating..." : "Update Profile"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}