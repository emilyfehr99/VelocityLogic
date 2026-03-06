import React from 'react';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, Snowflake, MapPin } from 'lucide-react';
import Card from './Card';

export default function JobCalendar({ jobs = [] }) {
    const [currentDate, setCurrentDate] = React.useState(new Date());

    const weekDays = React.useMemo(() => {
        const days = [];
        const startOfWeek = new Date(currentDate);
        startOfWeek.setDate(currentDate.getDate() - currentDate.getDay());

        for (let i = 0; i < 7; i++) {
            const day = new Date(startOfWeek);
            day.setDate(startOfWeek.getDate() + i);
            days.push(day);
        }
        return days;
    }, [currentDate]);

    const hours = Array.from({ length: 12 }, (_, i) => i + 8); // 8 AM to 8 PM

    const getJobForSlot = (day, hour) => {
        return jobs.find(job => {
            const jobDate = new Date(job.start);
            return jobDate.toDateString() === day.toDateString() && jobDate.getHours() === hour;
        });
    };

    return (
        <Card className="p-0 overflow-hidden bg-white border-slate-100 flex flex-col h-[700px]">
            {/* Calendar Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-blue-600 text-white rounded-xl shadow-lg shadow-blue-500/20">
                        <CalendarIcon size={20} />
                    </div>
                    <div>
                        <h3 className="text-xl font-black text-slate-900 leading-tight">Job Schedule</h3>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            {currentDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200">
                    <button
                        onClick={() => {
                            const d = new Date(currentDate);
                            d.setDate(d.getDate() - 7);
                            setCurrentDate(d);
                        }}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <ChevronLeft size={18} className="text-slate-600" />
                    </button>
                    <button
                        onClick={() => setCurrentDate(new Date())}
                        className="px-4 py-1.5 text-xs font-black text-slate-900 border-x border-slate-100"
                    >
                        Today
                    </button>
                    <button
                        onClick={() => {
                            const d = new Date(currentDate);
                            d.setDate(d.getDate() + 7);
                            setCurrentDate(d);
                        }}
                        className="p-2 hover:bg-slate-50 rounded-xl transition-all"
                    >
                        <ChevronRight size={18} className="text-slate-600" />
                    </button>
                </div>
            </div>

            {/* Calendar Grid */}
            <div className="flex-1 overflow-auto">
                <div className="min-w-[800px]">
                    <div className="grid grid-cols-8 border-b border-slate-100 sticky top-0 bg-white z-10">
                        <div className="p-4 border-r border-slate-100 bg-slate-50"></div>
                        {weekDays.map(day => (
                            <div key={day.toISOString()} className={`p-4 border-r border-slate-100 text-center ${day.toDateString() === new Date().toDateString() ? 'bg-blue-50/50' : ''}`}>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-1">{day.toLocaleDateString('en-US', { weekday: 'short' })}</p>
                                <p className={`text-lg font-black ${day.toDateString() === new Date().toDateString() ? 'text-blue-600' : 'text-slate-900'}`}>{day.getDate()}</p>
                            </div>
                        ))}
                    </div>

                    {hours.map(hour => (
                        <div key={hour} className="grid grid-cols-8 border-b border-slate-50 group hover:bg-slate-50/30 transition-colors">
                            <div className="p-4 border-r border-slate-100 flex flex-col items-end justify-center bg-slate-50/30">
                                <span className="text-[10px] font-black text-slate-400">{hour > 12 ? hour - 12 : hour} {hour >= 12 ? 'PM' : 'AM'}</span>
                            </div>
                            {weekDays.map(day => {
                                const job = getJobForSlot(day, hour);
                                return (
                                    <div key={day.toISOString()} className="h-24 border-r border-slate-100 p-1 relative">
                                        {job && (
                                            <div className={`h-full w-full rounded-xl p-3 shadow-md border flex flex-col justify-between transition-all hover:scale-[1.02] cursor-pointer ${job.is_winter_urgent
                                                    ? 'bg-blue-600 text-white border-blue-400 shadow-blue-500/20'
                                                    : 'bg-white text-slate-900 border-slate-200'
                                                }`}>
                                                <div>
                                                    <div className="flex items-center justify-between mb-1">
                                                        <p className="text-[10px] font-black uppercase truncate leading-tight">{job.customer_name}</p>
                                                        {job.is_winter_urgent && <Snowflake size={10} />}
                                                    </div>
                                                    <p className={`text-[9px] font-bold ${job.is_winter_urgent ? 'text-blue-200' : 'text-slate-400'} flex items-center gap-1`}>
                                                        <Clock size={8} /> 1 Hour
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <MapPin size={8} />
                                                    <span className="text-[8px] font-bold truncate">Moose Jaw, SK</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
}
