"use client"

import { Star, Clock } from "lucide-react"
import { Provider } from "@/interfaces/user/interface"
import { useRouter } from "next/navigation";
import Image from "next/image";

// const mockProviders: Provider[] = [
//   {
//     id: "1",
//     name: "Dr. Sarah Anderson",
//     specialty: "Business Strategy",
//     rating: 4.9,
//     reviews: 248,
//     image: "/professional-woman-consultant.png",
//     hourlyRate: 150,
//     availability: "Available today",
//     description: "Expert in corporate strategy and business development with 15+ years of experience",
//   },
//   {
//     id: "2",
//     name: "Mark Johnson",
//     specialty: "Marketing & Growth",
//     rating: 4.8,
//     reviews: 186,
//     image: "/professional-man-consultant.png",
//     hourlyRate: 120,
//     availability: "Available today",
//     description: "Specialized in digital marketing and growth hacking strategies",
//   },
//   {
//     id: "3",
//     name: "Emma Wilson",
//     specialty: "Financial Planning",
//     rating: 4.95,
//     reviews: 312,
//     image: "/professional-woman-financial-advisor.png",
//     hourlyRate: 180,
//     availability: "Available tomorrow",
//     description: "Financial advisor with expertise in investment and wealth management",
//   },
//   {
//     id: "4",
//     name: "James Chen",
//     specialty: "Tech Leadership",
//     rating: 4.7,
//     reviews: 145,
//     image: "/professional-man-tech-consultant.jpg",
//     hourlyRate: 160,
//     availability: "Available today",
//     description: "Tech executive coach for leadership and product development",
//   },
//   {
//     id: "5",
//     name: "Lisa Rodriguez",
//     specialty: "HR & Recruitment",
//     rating: 4.85,
//     reviews: 201,
//     image: "/professional-woman-hr.png",
//     hourlyRate: 130,
//     availability: "Available today",
//     description: "HR consultant specializing in talent acquisition and team building",
//   },
//   {
//     id: "6",
//     name: "David Kumar",
//     specialty: "Sales Excellence",
//     rating: 4.88,
//     reviews: 267,
//     image: "/professional-man-sales.jpg",
//     hourlyRate: 140,
//     availability: "Available tomorrow",
//     description: "Sales strategist with proven track record in enterprise sales",
//   },
// ]

interface ProvidersPageProps {
  providers: Provider[];
}

export default function ProvidersPage({ providers }: ProvidersPageProps) {
  const router = useRouter();
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Expert Consultants</h1>
        <p className="text-slate-600 dark:text-slate-300">
          Choose from our pool of experienced professionals across various fields
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {providers.map((provider) => (
          <div
            key={provider.id}
            className="bg-white dark:bg-slate-950 rounded-xl shadow-md hover:shadow-lg transition-shadow border border-slate-200 dark:border-slate-800 overflow-hidden"
          >
            <div className="relative h-48 bg-gradient-to-br from-blue-400 to-indigo-600 flex items-center justify-center">
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
                {/* <p className="text-sm text-blue-600 dark:text-blue-400 font-medium">{provider.specialty}</p> */}
              </div>

              {/* <p className="text-sm text-slate-600 dark:text-slate-400">{provider.description}</p> */}

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
  )
}
