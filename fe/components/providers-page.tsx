"use client"

import { Star, Clock } from "lucide-react"
import { User } from "@/interfaces/user/interface"
import { useRouter } from "next/navigation";
import Image from "next/image";

interface ProvidersPageProps {
  providers: User[];
}

export default function ProvidersPage({ providers }: ProvidersPageProps) {
  const router = useRouter();
  return (
    <div className="min-h-screen bg-linear-to-r from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950">
      <div className="max-w-7xl mx-auto py-12 px-12 sm:px-16 lg:px-24">
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Expert Consultants</h1>
          <p className="text-slate-600 dark:text-slate-300">
            Choose from our pool of experienced professionals across various fields
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div
              key={provider.id}
              className="bg-white dark:bg-slate-950 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-800 overflow-hidden"
            >
              <div className="relative h-48 bg-linear-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
                <Image
                  placeholder="blur"
                  blurDataURL="/placeholder.svg"
                  src={`https://ui-avatars.com/api/?name=${provider.name}&background=random`}
                  alt={provider.name}
                  fill
                  className="object-cover"
                />
              </div>

              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">{provider.name}</h3>
                  <p className="text-sm text-blue-600 dark:text-blue-400 font-medium pt-1">{provider.category}</p>
                </div>

                <p className="text-sm text-slate-600 dark:text-slate-400">{provider.description}</p>

                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-1">
                    <div className="flex items-center gap-1">
                      <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                      <span className="font-semibold text-slate-900 dark:text-white">{4.5}</span>
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">(360 reviews)</span>
                  </div>
                  <div className="text-lg font-bold text-slate-900 dark:text-white">
                    ${provider.hourlyRate}
                    <span className="text-xs text-slate-600 dark:text-slate-400">/hr</span>
                  </div>
                </div>
                <button
                  onClick={() => router.push(`/providers/${provider.id}`)}
                  className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  View Available Slots
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
