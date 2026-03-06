import React, { useState, useEffect } from 'react';
import { CloudSnow, AlertTriangle, Loader2 } from 'lucide-react';
import JobCalendar from '../components/JobCalendar';
import { fetchWithAuth } from '../utils/api';

export default function ScheduleManager() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCalendar = async () => {
            try {
                const res = await fetchWithAuth('/api/calendar');
                if (res.ok) {
                    const data = await res.json();
                    setJobs(data);
                }
            } catch (error) {
                console.error("Failed to fetch calendar:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchCalendar();
    }, []);

    return (
        <div className="space-y-8 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">Smart Dispatch</h1>
                    <p className="text-slate-500 font-medium">Weather-aware scheduling for Moose Jaw & District</p>
                </div>

                <div className="bg-blue-600 px-6 py-4 rounded-3xl shadow-xl shadow-blue-500/20 text-right min-w-[240px] border border-blue-400">
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest mb-1">Live Conditions</p>
                    <div className="flex items-center justify-end gap-3 text-white">
                        <CloudSnow className="text-blue-200" size={32} />
                        <span className="text-3xl font-black">-38°C</span>
                    </div>
                    <p className="text-[10px] font-bold text-blue-200 mt-1 uppercase tracking-tighter">Ground Frost Depth: 1.4m (CRITICAL)</p>
                </div>
            </div>

            {/* Weather Alert */}
            <div className="bg-amber-50 border border-amber-200 rounded-[32px] p-8 flex flex-col md:flex-row gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                    <AlertTriangle size={120} className="text-amber-500" />
                </div>
                <div className="p-4 bg-amber-100 text-amber-600 rounded-3xl h-fit">
                    <AlertTriangle size={32} />
                </div>
                <div className="relative z-10">
                    <h4 className="font-black text-amber-900 text-xl uppercase tracking-tight">Extreme Cold Protocol Active</h4>
                    <p className="text-amber-800 mt-2 leading-relaxed font-medium">
                        Velocity AI has auto-prioritized emergency furnace repairs and frozen pipe calls.
                        Non-essential exterior tasks have been flagged with <span className="text-emerald-700 font-bold">"Reschedule Match"</span> tags in your calendar.
                    </p>
                </div>
            </div>

            {/* Main Calendar View */}
            {loading ? (
                <div className="h-[600px] bg-white rounded-[40px] border-2 border-dashed border-slate-100 flex items-center justify-center">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="text-blue-600 animate-spin" size={48} />
                        <p className="text-slate-400 font-bold uppercase tracking-widest">Optimizing Routes...</p>
                    </div>
                </div>
            ) : (
                <JobCalendar jobs={jobs} />
            )}
        </div>
    );
}
