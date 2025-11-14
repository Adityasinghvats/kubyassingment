import Link from "next/link";

export default function UnauthorizedPage() {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-slate-950 px-4">
            <div className="text-center">
                <p className="text-sm font-semibold text-red-600 dark:text-red-400">403</p>
                <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                    Access Denied
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    You don't have permission to access this page.
                </p>
                <div className="mt-6 flex gap-3 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                        Go to Homepage
                    </Link>
                    <Link
                        href="/profile"
                        className="inline-flex items-center px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 text-sm font-medium transition-colors"
                    >
                        My Profile
                    </Link>
                </div>
            </div>
        </section>
    );
}