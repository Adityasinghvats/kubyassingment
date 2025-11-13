"use client"

import { useRouter } from "next/navigation"

export default function Home() {
  const router = useRouter()

  return (
    <div className="bg-white dark:bg-slate-950">
      {/* Hero */}
      <section className="min-h-[calc(100vh-4rem)] bg-linear-to-br from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 flex items-center">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div className="space-y-6 text-center lg:text-left">
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300">
                ✨ New · Book expert consultations instantly
              </span>
              <h1 className="text-4xl md:text-6xl font-bold leading-tight text-slate-900 dark:text-white">
                Find the right expert. Book with confidence.
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300">
                ConsultHub connects you with vetted providers across categories like Healthcare,
                Legal, Tutoring, and more. Transparent pricing, real availability.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 sm:justify-center lg:justify-start">
                <button
                  onClick={() => router.push("/register")}
                  className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
                >
                  Get Started
                </button>
                <button
                  onClick={() => router.push("/providers")}
                  className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium"
                >
                  Browse Providers
                </button>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">2k+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Bookings</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">500+</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Providers</div>
                </div>
                <div className="rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">4.9</div>
                  <div className="text-xs text-slate-600 dark:text-slate-400">Avg. Rating</div>
                </div>
              </div>
            </div>

            {/* Visual card */}
            <div className="relative">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/70 backdrop-blur p-6 shadow-xl">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 text-lg">
                      💬
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Instant Booking</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Real-time availability</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 text-lg">
                      🛡️
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Verified Experts</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Vetted professionals</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 dark:text-emerald-400 text-lg">
                      ⏱
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900 dark:text-white">Flexible Slots</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">Pick a time that fits</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-300">Next available</p>
                      <p className="text-base font-semibold text-slate-900 dark:text-white">Today, 3:00 PM</p>
                    </div>
                    <button
                      onClick={() => router.push("/slots")}
                      className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium transition-colors"
                    >
                      See Slots
                    </button>
                  </div>
                </div>
              </div>

              {/* Decorative glow */}
              <div className="absolute -inset-6 -z-10 bg-gradient-to-tr from-blue-200/40 to-indigo-200/30 dark:from-blue-500/10 dark:to-indigo-500/10 blur-2xl rounded-3xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">Why ConsultHub</h2>
            <p className="text-slate-600 dark:text-slate-400 mt-2">Simple, transparent, and reliable.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: "🔎", title: "Discover Experts", desc: "Browse vetted providers across categories." },
              { icon: "📅", title: "Real Availability", desc: "Book slots that actually work for you." },
              { icon: "💳", title: "Clear Pricing", desc: "Know your cost upfront before you book." },
              { icon: "⭐", title: "Trusted Reviews", desc: "Decide confidently with ratings." },
            ].map((f) => (
              <div key={f.title} className="rounded-xl border border-slate-200 dark:border-slate-800 p-5 bg-white dark:bg-slate-900 hover:shadow-sm transition">
                <div className="h-10 w-10 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg mb-3">
                  <span>{f.icon}</span>
                </div>
                <h3 className="font-semibold text-slate-900 dark:text-white">{f.title}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-14 bg-slate-50 dark:bg-slate-900/40">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 dark:text-white">Popular Categories</h2>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Healthcare",
              "Legal",
              "Consulting",
              "Tutoring",
              "Electrical",
              "Plumbing",
              "Carpentry",
              "Cleaning",
            ].map((c) => (
              <span
                key={c}
                className="px-3 py-1 rounded-full text-xs border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900"
              >
                {c}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white dark:bg-slate-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 p-8 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800 text-center">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Ready to get started?</h3>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Create an account and book your first consultation in minutes.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <button
                onClick={() => router.push("/register")}
                className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors"
              >
                Create Account
              </button>
              <button
                onClick={() => router.push("/login")}
                className="px-6 py-3 rounded-lg border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors font-medium"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
