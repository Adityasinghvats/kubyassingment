"use client"

import { useState } from "react"
import { X, Calendar, CheckCircle } from "lucide-react"
import dayjs, { Dayjs } from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { slotAPI } from "@/services/slotService";
import { useRouter } from "next/navigation";
import { useRequireAuth } from "@/hooks/use-auth";


export default function SlotModal() {
    const [isAdded, setIsAdded] = useState(false)
    const [startTime, setStartTime] = useState<Dayjs | null>(dayjs());
    const [endTime, setEndTime] = useState<Dayjs | null>(dayjs().add(1, 'hour'));
    const queryClient = useQueryClient();
    const router = useRouter();
    const { session } = useRequireAuth('PROVIDER');
    if (!session) {
        return null;
    }

    const { mutate: createSlot, isPending: isAdding } = useMutation({
        mutationFn: slotAPI.addSlot,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["slots"] });
            setIsAdded(true);
        },
        onError: (error: Error) => {
            console.error("Error creating slot:", error);
            setIsAdded(false);
        },
    });

    const handleAdd = async () => {
        try {
            const formattedStartTime = startTime?.toISOString();
            const formattedEndTime = endTime?.toISOString();
            const duration = startTime && endTime ? endTime.diff(startTime, 'minute') : 0;
            const formattedDuration = duration.toString();
            if (duration <= 0) {
                throw new Error("End time must be after start time");
            }
            createSlot({
                startTime: formattedStartTime!,
                endTime: formattedEndTime!,
                duration: formattedDuration,
            });
        } catch (error) {
            console.error("Error adding slot:", error);
        }
    }

    if (isAdded) {
        return (
            <div className="bg-white dark:bg-slate-950 min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 z-50">
                <div className="bg-white dark:bg-slate-950 rounded-xl max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800 p-4 text-center space-y-3">
                    <div className="flex justify-center">
                        <div className="w-8 h-8 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center">
                            <CheckCircle className="w-2 h-2 text-green-600 dark:text-green-400" />
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Slot Added</h2>
                        <p className="text-slate-600 dark:text-slate-400">You have successfully added your slot.</p>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4 text-left space-y-3 border border-blue-200 dark:border-blue-800">

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">Start Date & Time</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{startTime?.format('YYYY-MM-DD HH:mm')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-slate-600 dark:text-slate-400">End Date & Time</p>
                                <p className="font-semibold text-slate-900 dark:text-white">{endTime?.format('YYYY-MM-DD HH:mm')}</p>
                            </div>
                        </div>
                    </div>

                    <button
                        onClick={() => router.push('/slots')}
                        className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        Done
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-white dark:bg-slate-950 min-h-[calc(100vh-4rem)] w-full flex items-center justify-center p-4 z-50" onClick={() => router.push('/slots')}>
            <div
                className="bg-white dark:bg-slate-950 rounded-xl max-w-sm w-full shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-linear-to-r from-blue-50 to-indigo-50 dark:from-slate-900 dark:to-slate-800">
                    <h2 className="text-xl font-bold text-slate-900 dark:text-white">Add Slot</h2>
                    <button
                        onClick={() => router.push('/slots')}
                        className="p-1 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-4 space-y-4">
                    {/* Booking Details */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-2 space-y-3 border border-blue-200 dark:border-blue-800">
                        <div className="flex flex-row gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 text-sm" /> <p>Start Time</p>
                        </div>

                        <div className="flex items-start gap-3">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="Start Date & Time"
                                    value={startTime}
                                    onChange={(newValue) => setStartTime(newValue)}

                                />
                            </LocalizationProvider>
                        </div>

                        <div className="flex flex-row gap-2">
                            <Calendar className="w-4 h-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0 text-sm" /> <p>End Time</p>
                        </div>
                        <div className="flex items-start gap-3 pt-2 dark:border-blue-800">
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateTimePicker
                                    label="End Date & Time"
                                    value={endTime}
                                    onChange={(newValue) => setEndTime(newValue)}

                                />
                            </LocalizationProvider>
                        </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-3">
                        <button
                            onClick={() => router.push('/slots')}
                            className="flex-1 py-2 border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-900 transition-colors font-medium"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleAdd}
                            disabled={isAdding}
                            className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                        >
                            {isAdding ? "Adding..." : "Add Now"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    )
}