'use client'

import { useState } from "react"
import {
    Plus,
    Calendar,
    Clock,
    Trash2,
    AlertCircle,
    CheckCircle,
    User,
    CalendarCheck,
    Filter,
    Search
} from "lucide-react"
import { slotAPI } from "@/services/slotService"
import { Slot } from "@/interfaces/slot/interface"
import { useAuth, useRequireAuth } from "@/hooks/use-auth"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { formatDate, formatDuration, formatTime } from "@/lib/format"
import { useRouter } from "next/navigation"

export default function SlotsPage() {
    const queryClient = useQueryClient();
    const { user } = useAuth()
    const [filterStatus, setFilterStatus] = useState<'ALL' | 'AVAILABLE' | 'BOOKED'>('ALL')
    const [searchTerm, setSearchTerm] = useState("")
    const [deleteSlotId, setDeleteSlotId] = useState<string | null>(null)
    const router = useRouter();
    const { session } = useRequireAuth('PROVIDER');
    if (!session) {
        return null;
    }

    const slotsData = useQuery({
        queryKey: ["slots"],
        queryFn: () => slotAPI.getMySlots(),
        enabled: !!user,
    })
    const slots: Slot[] = slotsData.data?.data?.slots || []

    const { mutate: deleteSlot, isPending: isdeleting } = useMutation({
        mutationFn: slotAPI.deleteSlotById,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
        },
        onError: (error: Error) => {
            console.error("Error deleting slot:", error);
        },
    });

    const handleDelete = (slotId: string) => {
        console.log("Deleting slot with ID:", slotId);
        setDeleteSlotId(slotId)
        deleteSlot(slotId)
    }

    const filteredSlots = slots.filter(slot => {
        const matchesStatus = filterStatus === 'ALL' || slot.status === filterStatus
        const matchesSearch = searchTerm === "" ||
            formatDate(slot.startTime).toLowerCase().includes(searchTerm.toLowerCase()) ||
            formatTime(slot.startTime).toLowerCase().includes(searchTerm.toLowerCase())
        return matchesStatus && matchesSearch
    })

    const stats = {
        total: slots.length,
        available: slots.filter(s => s.status === 'AVAILABLE').length,
        booked: slots.filter(s => s.status === 'BOOKED').length
    }

    if (!slotsData.isError && slotsData.isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900">
                <div className="text-center space-y-4">
                    <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400">Loading slots...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-6">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
                                <Calendar className="w-8 h-8 text-blue-600" />
                                My Slots
                            </h1>
                            <p className="text-slate-600 dark:text-slate-400 mt-1">
                                Manage your availability and bookings
                            </p>
                        </div>
                        <button
                            onClick={() => router.push('/slots/new')}
                            className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium shadow-lg hover:shadow-xl"
                        >
                            <Plus className="w-5 h-5" />
                            Add New Slot
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Total Slots</p>
                                <p className="text-3xl font-bold text-slate-900 dark:text-white mt-1">{stats.total}</p>
                            </div>
                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                <Calendar className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Available</p>
                                <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-1">{stats.available}</p>
                            </div>
                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-lg flex items-center justify-center">
                                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-6">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Booked</p>
                                <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-1">{stats.booked}</p>
                            </div>
                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                <CalendarCheck className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Filters & Search */}
                <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-4">
                    <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Search by date or time..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setFilterStatus('ALL')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'ALL'
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                All
                            </button>
                            <button
                                onClick={() => setFilterStatus('AVAILABLE')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'AVAILABLE'
                                    ? 'bg-green-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Available
                            </button>
                            <button
                                onClick={() => setFilterStatus('BOOKED')}
                                className={`px-4 py-2 rounded-lg font-medium transition-colors ${filterStatus === 'BOOKED'
                                    ? 'bg-purple-600 text-white'
                                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                                    }`}
                            >
                                Booked
                            </button>
                        </div>
                    </div>
                </div>

                {/* Slots Grid */}
                {filteredSlots.length === 0 ? (
                    <div className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 p-12 text-center">
                        <Calendar className="w-16 h-16 text-slate-400 mx-auto mb-4" />
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                            {searchTerm || filterStatus !== 'ALL' ? 'No slots found' : 'No slots yet'}
                        </h3>
                        <p className="text-slate-600 dark:text-slate-400 mb-6">
                            {searchTerm || filterStatus !== 'ALL'
                                ? 'Try adjusting your filters'
                                : 'Create your first slot to get started'}
                        </p>
                        {!searchTerm && filterStatus === 'ALL' && (
                            <button
                                onClick={() => router.push('/slots/new')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                            >
                                <Plus className="w-5 h-5" />
                                Add Your First Slot
                            </button>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredSlots.map((slot) => (
                            <div
                                key={slot.id}
                                className="bg-white dark:bg-slate-900 rounded-xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-2xl transition-shadow"
                            >
                                {/* Status Badge */}
                                <div className={`px-4 py-2 ${slot.status === 'AVAILABLE'
                                    ? 'bg-green-50 dark:bg-green-900/20 border-b border-green-200 dark:border-green-800'
                                    : 'bg-purple-50 dark:bg-purple-900/20 border-b border-purple-200 dark:border-purple-800'
                                    }`}>
                                    <span className={`inline-flex items-center gap-2 text-sm font-semibold ${slot.status === 'AVAILABLE'
                                        ? 'text-green-700 dark:text-green-300'
                                        : 'text-purple-700 dark:text-purple-300'
                                        }`}>
                                        {slot.status === 'AVAILABLE' ? (
                                            <CheckCircle className="w-4 h-4" />
                                        ) : (
                                            <CalendarCheck className="w-4 h-4" />
                                        )}
                                        {slot.status}
                                    </span>
                                </div>

                                {/* Slot Content */}
                                <div className="p-6 space-y-4">
                                    {/* Date */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/20 rounded-lg flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Date</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {formatDate(slot.startTime)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Time Range */}
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                            <Clock className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-slate-600 dark:text-slate-400">Time</p>
                                            <p className="font-semibold text-slate-900 dark:text-white">
                                                {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-3 border border-slate-200 dark:border-slate-700">
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-slate-600 dark:text-slate-400">Duration</span>
                                            <span className="font-semibold text-slate-900 dark:text-white">
                                                {formatDuration(slot.duration)}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Bookings Info */}
                                    {slot.bookings && slot.bookings.length > 0 && (
                                        <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-3 border border-purple-200 dark:border-purple-800">
                                            <div className="flex items-center gap-2">
                                                <User className="w-4 h-4 text-purple-600 dark:text-purple-400" />
                                                <span className="text-sm text-purple-700 dark:text-purple-300 font-medium">
                                                    {slot.bookings.length} Booking(s)
                                                </span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Delete Button */}
                                    {slot.status === 'AVAILABLE' && (
                                        <button
                                            onClick={() => handleDelete(slot.id)}
                                            disabled={isdeleting}
                                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed border border-red-200 dark:border-red-800"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                            {slot.id === deleteSlotId ? (
                                                isdeleting ? 'Deleting...' : 'Delete Slot'
                                            ) : (
                                                'Delete Slot'
                                            )}

                                        </button>
                                    )}
                                </div>

                                {/* Metadata Footer */}
                                <div className="px-6 py-3 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                                    <p className="text-xs text-slate-600 dark:text-slate-400">
                                        Created: {formatDate(slot.createdAt)}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}