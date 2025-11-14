export default function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-slate-200 dark:border-slate-500 bg-gray-200 dark:bg-slate-800">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-18">
                <div className="h-16 flex flex-col sm:flex-row items-center justify-between gap-3">
                    {/* Brand */}
                    <div className="flex items-center gap-2">
                        <span className="inline-flex h-8 w-8 items-center justify-center rounded bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-bold">
                            O
                        </span>
                        <span className="text-2xl font-semibold text-slate-900 dark:text-white">
                            WorkBagel
                        </span>
                    </div>

                    {/* Links */}
                    <nav className="flex items-center gap-4">
                        <a
                            href="/about"
                            className="text-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            About
                        </a>
                        <a
                            href="/privacy"
                            className="text-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Privacy
                        </a>
                        <a
                            href="/contact"
                            className="text-xl text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
                        >
                            Contact
                        </a>
                    </nav>

                    {/* Copyright */}
                    <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        © {year} WorkBagel. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
}