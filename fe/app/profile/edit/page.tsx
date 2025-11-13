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
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (currentUserData.isError || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <p className="text-red-600">Failed to load profile</p>
                    <Link href="/profile" className="mt-4 text-indigo-600 hover:text-indigo-500">
                        Go back to profile
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Edit Your Profile
                    </h2>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {error && (
                        <div className="rounded-md bg-red-50 p-4">
                            <div className="text-sm text-red-800">{error}</div>
                        </div>
                    )}

                    <div className="rounded-md shadow-sm space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                                Name
                            </label>
                            <input
                                id="name"
                                name="name"
                                type="text"
                                required
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                placeholder="Full name"
                            />
                        </div>

                        {user?.role === "PROVIDER" && (
                            <>
                                <div>
                                    <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-2">
                                        Category
                                    </label>
                                    <select
                                        id="category"
                                        name="category"
                                        required
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                    >
                                        {Object.values(Category).map((cat) => (
                                            <option key={cat} value={cat}>
                                                {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label htmlFor="hourlyRate" className="block text-sm font-medium text-gray-700 mb-2">
                                        Hourly Rate ($)
                                    </label>
                                    <input
                                        id="hourlyRate"
                                        name="hourlyRate"
                                        type="number"
                                        step="0.01"
                                        min="0"
                                        required
                                        value={formData.hourlyRate}
                                        onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
                                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="50.00"
                                    />
                                </div>

                                <div>
                                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                        Description
                                    </label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        required
                                        value={formData.description}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                                        placeholder="Experienced plumber with 5 years in residential repairs"
                                        rows={3}
                                    />
                                </div>
                            </>
                        )}
                    </div>

                    <div className="flex gap-3">
                        <Link
                            href="/profile"
                            className="flex-1 flex justify-center py-2 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        >
                            Cancel
                        </Link>
                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isPending ? "Updating..." : "Update Profile"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}