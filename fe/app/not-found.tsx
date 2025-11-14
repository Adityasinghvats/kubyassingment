import Link from "next/link";

export default function NotFound() {
    return (
        <section className="min-h-[calc(100vh-4rem)] flex items-center justify-center bg-white dark:bg-slate-950 px-4">
            <div className="text-center">
                <p className="text-sm font-semibold text-blue-600 dark:text-blue-400">404</p>
                <h1 className="mt-2 text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
                    Page not found
                </h1>
                <p className="mt-2 text-slate-600 dark:text-slate-400">
                    Sorry, we couldn’t find the page you’re looking for.
                </p>
                <div className="mt-6">
                    <Link
                        href="/"
                        className="inline-flex items-center px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                        Go to Homepage
                    </Link>
                </div>
            </div>
        </section>
    );
}