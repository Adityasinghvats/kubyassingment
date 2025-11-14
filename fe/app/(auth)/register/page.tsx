"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import Link from "next/link";
import { Category, SignUpData } from "@/interfaces/user/interface";

export default function RegisterPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        name: "",
        role: "CLIENT" as "CLIENT" | "PROVIDER",
        category: Category.OTHER,
        description: "",
        hourlyRate: "0.00",
    });
    const { signUp } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setIsLoading(true);

        try {
            const payload: SignUpData = {
                email: formData.email,
                password: formData.password,
                name: formData.name,
                role: formData.role,
                hourlyRate: formData.role === "PROVIDER" ? formData.hourlyRate : undefined,
                description: formData.role === "PROVIDER" ? formData.description : undefined,
                category: formData.role === "PROVIDER" ? formData.category : undefined,
            };
            await signUp(payload);
            router.push("/");
        } catch (err: any) {
            setError(err.message || "Sign up failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-950 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-6">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
                        Join us and start booking consultations.
                    </p>
                </div>

                <div className="bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {error && (
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3">
                                <div className="text-sm text-red-800 dark:text-red-400">{error}</div>
                            </div>
                        )}

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Full name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    placeholder="John Doe"
                                />
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Email address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    autoComplete="email"
                                    required
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    placeholder="you@example.com"
                                />
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    autoComplete="new-password"
                                    required
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                    placeholder="••••••••"
                                />
                            </div>

                            <div>
                                <label htmlFor="role" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                    Account Type
                                </label>
                                <select
                                    id="role"
                                    name="role"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as "CLIENT" | "PROVIDER" })}
                                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                >
                                    <option value="CLIENT">Client - Book appointments</option>
                                    <option value="PROVIDER">Provider - Offer services</option>
                                </select>
                            </div>

                            {formData.role === "PROVIDER" && (
                                <>
                                    <div>
                                        <label htmlFor="category" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Category
                                        </label>
                                        <select
                                            id="category"
                                            name="category"
                                            required
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                        >
                                            {Object.values(Category).map((cat) => (
                                                <option key={cat} value={cat}>
                                                    {cat.charAt(0) + cat.slice(1).toLowerCase()}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label htmlFor="hourlyRate" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
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
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors"
                                            placeholder="50.00"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
                                            Description
                                        </label>
                                        <textarea
                                            id="description"
                                            name="description"
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-colors resize-none"
                                            placeholder="Experienced plumber with 5 years in residential repairs"
                                            rows={3}
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-2.5 px-4 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                        >
                            {isLoading ? "Creating account..." : "Sign up"}
                        </button>
                    </form>
                </div>

                <p className="text-center text-sm text-slate-600 dark:text-slate-400">
                    Already have an account?{" "}
                    <Link href="/login" className="font-medium text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}