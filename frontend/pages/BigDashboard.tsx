import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
    Clock, TrendingUp, CheckCircle, AlertCircle, ExternalLink,
    LogOut, AlertTriangle, FileText, Edit2, X, Check, Activity,
    Server, Database, Zap, Download, Filter, Search, ArrowUpDown, Snowflake
} from 'lucide-react';
import Card from '../components/Card';
import RevenueChart from '../components/RevenueChart';
import ActivityFeed from '../components/ActivityFeed';
import DraftEditorModal from '../components/DraftEditorModal';
import { fetchWithAuth } from '../utils/api';
import toast, { Toaster } from 'react-hot-toast';
import { StatCardSkeleton, ChartSkeleton } from '../components/Skeleton';
import QuoteStatusTimeline from '../components/QuoteStatusTimeline';
import VoiceRecorder from '../components/VoiceRecorder';

export default function BigDashboard() {
    const { user, client, logout, impersonatedClient } = useAuth();
    const [drafts, setDrafts] = useState([]);
    const [activities, setActivities] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingDraft, setEditingDraft] = useState(null);
    const [systemHealth, setSystemHealth] = useState({ status: 'UNKNOWN', worker_age: null });

    // Batch Dashboard State
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState('ALL');
    const [sortBy, setSortBy] = useState('priority_score'); // priority_score, total, date
    const [sortOrder, setSortOrder] = useState('desc');

    const isFetchingRef = React.useRef(false);
    const isMountedRef = React.useRef(true);

    const fetchData = async (isInitialLoad = false) => {
        if (isFetchingRef.current && !isInitialLoad) return;
        isFetchingRef.current = true;

        try {
            if (isInitialLoad) setLoading(true);
            const draftsRes = await fetchWithAuth('/api/drafts');
            if (!isMountedRef.current) return;

            if (draftsRes.ok) {
                const draftsData = await draftsRes.json();
                setDrafts(Array.isArray(draftsData) ? draftsData : []);
            }

            // Optional stats/health
            const [healthRes, activityRes] = await Promise.all([
                fetchWithAuth('/api/system/health').catch(() => null),
                fetchWithAuth('/api/activity').catch(() => null)
            ]);

            if (isMountedRef.current) {
                if (healthRes?.ok) setSystemHealth(await healthRes.json());
                if (activityRes?.ok) {
                    const activityData = await activityRes.json();
                    setActivities(Array.isArray(activityData) ? activityData : (activityData.activities || []));
                }
            }
        } catch (error) {
            console.error('Error fetching data:', error);
        } finally {
            isFetchingRef.current = false;
            if (isInitialLoad && isMountedRef.current) setLoading(false);
        }
    };

    useEffect(() => {
        isMountedRef.current = true;
        fetchData(true);
        const interval = setInterval(() => fetchData(false), 15000);
        return () => {
            isMountedRef.current = false;
            clearInterval(interval);
        };
    }, []);

    // Filtered and Sorted Drafts
    const filteredDrafts = useMemo(() => {
        let result = drafts.filter(d =>
            (d.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                d.quote_number?.toLowerCase().includes(searchQuery.toLowerCase())) &&
            (statusFilter === 'ALL' || d.status === statusFilter)
        );

        return result.sort((a, b) => {
            let valA = a[sortBy];
            let valB = b[sortBy];

            if (sortBy === 'created_at') {
                valA = new Date(valA).getTime();
                valB = new Date(valB).getTime();
            }

            if (sortOrder === 'desc') return valB - valA;
            return valA - valB;
        });
    }, [drafts, searchQuery, statusFilter, sortBy, sortOrder]);

    const handleApprove = async (id) => {
        try {
            const res = await fetchWithAuth(`/api/drafts/${id}/approve`, { method: 'POST' });
            if (res.ok) {
                toast.success('Quote approved and sent!');
                fetchData(false);
            }
        } catch (error) { toast.error('Failed to approve'); }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this draft?')) return;
        try {
            const res = await fetchWithAuth(`/api/drafts/${id}/reject`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ reason: 'Rejected from batch dashboard' })
            });
            if (res.ok) { fetchData(false); toast.success('Rejected'); }
        } catch (error) { toast.error('Failed'); }
    };

    const handleSaveDraft = async (updatedDraft) => {
        try {
            const res = await fetchWithAuth(`/api/drafts/${updatedDraft.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updatedDraft)
            });
            if (res.ok) {
                toast.success('Draft saved');
                fetchData(false);
                setEditingDraft(null);
            }
        } catch (error) { toast.error('Failed to save'); }
    };

    const handleExport = async () => {
        const token = localStorage.getItem('token');
        window.open(`/api/quotes/export?token=${token}`, '_blank');
    };

    return (
        <div className="space-y-8 pb-20">
            <Toaster position="top-right" />

            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-black text-slate-900 tracking-tight">
                        {impersonatedClient ? impersonatedClient.company_name : 'Agency Overview'}
                    </h1>
                    <p className="text-slate-500 font-medium">
                        {impersonatedClient
                            ? `Managing ${drafts.length} quotes for this location`
                            : `Global view: ${drafts.length} quotes across all managed businesses`
                        }
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => document.getElementById('jobber-import')?.click()}
                        className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-all shadow-lg shadow-slate-200"
                    >
                        <ExternalLink size={18} /> Import from Jobber
                    </button>
                    <input
                        id="jobber-import"
                        type="file"
                        className="hidden"
                        accept=".csv"
                        onChange={async (e) => {
                            const file = e.target.files?.[0];
                            if (!file) return;
                            const formData = new FormData();
                            formData.append('file', file);
                            const res = await fetchWithAuth('/api/admin/import-csv', {
                                method: 'POST',
                                body: formData
                            });
                            if (res.ok) {
                                toast.success('Data imported successfully!');
                                fetchData(true);
                            } else {
                                toast.error('Import failed');
                            }
                        }}
                    />
                    <button
                        onClick={handleExport}
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm"
                    >
                        <Download size={18} /> Export CSV
                    </button>
                </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="bg-blue-600 text-white border-none shadow-blue-500/20 shadow-xl overflow-hidden relative">
                    <div className="relative z-10">
                        <p className="text-blue-100 text-xs font-bold uppercase tracking-wider">Total Pipeline</p>
                        <p className="text-3xl font-black mt-1">${drafts.reduce((sum, d) => sum + (d.total || 0), 0).toLocaleString()}</p>
                    </div>
                    <TrendingUp className="absolute right-[-10px] bottom-[-10px] text-blue-500/30 w-24 h-24 rotate-[-15deg]" />
                </Card>

                <Card className="bg-white border-slate-100 hover:border-blue-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-amber-100 text-amber-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <AlertTriangle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Needs Review</p>
                            <p className="text-2xl font-black text-slate-900">{drafts.filter(d => d.status === 'NEEDS_REVIEW').length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-white border-slate-100 hover:border-emerald-200 transition-all cursor-pointer group">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-100 text-emerald-600 rounded-2xl group-hover:scale-110 transition-transform">
                            <CheckCircle size={24} />
                        </div>
                        <div>
                            <p className="text-slate-400 text-[10px] font-bold uppercase">Approved Ready</p>
                            <p className="text-2xl font-black text-slate-900">{drafts.filter(d => d.status === 'PENDING_APPROVAL').length}</p>
                        </div>
                    </div>
                </Card>

                <Card className="bg-indigo-100 text-indigo-900 border-none relative overflow-hidden">
                    <div className="relative z-10">
                        <p className="text-indigo-600 text-[10px] font-black uppercase tracking-wider">Agency Efficiency</p>
                        <p className="text-2xl font-black mt-1">94%</p>
                        <p className="text-[10px] font-bold text-indigo-500 mt-1">Avg. Response: 12m</p>
                    </div>
                    <Zap className="absolute right-[-10px] bottom-[-10px] text-indigo-200 w-20 h-20 rotate-12" />
                </Card>
            </div>

            {/* Agency Insights (Only in Global View) */}
            {!impersonatedClient && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card className="lg:col-span-2 bg-white border-slate-100">
                        <h3 className="text-lg font-black text-slate-900 mb-4 flex items-center gap-2">
                            <Activity size={20} className="text-slate-400" />
                            Multi-Contractor Performance
                        </h3>
                        <div className="space-y-4">
                            {[
                                { name: 'Arctic Air Regina', volume: 14200, quotes: 12, health: 'OPTIMAL' },
                                { name: 'Brandon Boiler Co', volume: 8400, quotes: 7, health: 'WARNING' },
                                { name: 'Winnipeg HVAC Pros', volume: 32100, quotes: 24, health: 'OPTIMAL' }
                            ].map((biz, i) => (
                                <div key={i} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl hover:bg-slate-100 transition-colors cursor-pointer border border-transparent hover:border-slate-200">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-10 rounded-full ${biz.health === 'OPTIMAL' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                                        <div>
                                            <p className="font-black text-slate-900 text-sm">{biz.name}</p>
                                            <p className="text-[10px] font-bold text-slate-400 uppercase">{biz.quotes} Pending Quotes</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-slate-900">${biz.volume.toLocaleString()}</p>
                                        <p className="text-[10px] font-bold text-slate-400 uppercase">Pipeline Value</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                    <Card className="bg-slate-900 text-white border-none shadow-2xl">
                        <h3 className="text-lg font-black mb-4 flex items-center gap-2">
                            <AlertTriangle size={20} className="text-amber-400" />
                            Global Risk Radar
                        </h3>
                        <div className="space-y-6">
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                <p className="text-xs font-bold text-white/60 uppercase">Low Confidence Flags</p>
                                <p className="text-3xl font-black text-amber-400 mt-1">4</p>
                                <p className="text-[10px] font-medium text-white/40 mt-1">Quotes requiring manual price override</p>
                            </div>
                            <div className="p-4 bg-white/10 rounded-2xl border border-white/10">
                                <p className="text-xs font-bold text-white/60 uppercase">Stale Quotes (&gt;72h)</p>
                                <p className="text-3xl font-black text-blue-400 mt-1">9</p>
                                <p className="text-[10px] font-medium text-white/40 mt-1">Auto-reminder sequence active</p>
                            </div>
                            <button className="w-full py-3 bg-white text-slate-900 font-black rounded-xl hover:bg-slate-100 transition-all active:scale-95 text-sm">
                                View Full Risk Audit
                            </button>
                        </div>
                    </Card>
                </div>
            )}

            {/* Filters Bar */}
            <div className="flex flex-col lg:flex-row gap-4 items-center p-4 bg-white border border-slate-200 rounded-3xl shadow-sm">
                <div className="relative flex-1 w-full lg:w-auto">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by customer or quote #..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 rounded-2xl outline-none font-medium transition-all"
                    />
                </div>

                <div className="w-full lg:w-96">
                    <VoiceRecorder
                        onTranscript={(data) => {
                            fetchData(false);
                            if (data.quote_data) setEditingDraft(data.quote_data);
                        }}
                    />
                </div>

                <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <Filter size={16} className="text-slate-400" />
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer"
                        >
                            <option value="ALL">All Status</option>
                            <option value="NEEDS_REVIEW">Needs Review</option>
                            <option value="PENDING_APPROVAL">Pending Approval</option>
                            <option value="SENT">Sent</option>
                            <option value="APPROVED">Approved</option>
                        </select>
                    </div>

                    <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 rounded-2xl border border-slate-100">
                        <ArrowUpDown size={16} className="text-slate-400" />
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="bg-transparent font-bold text-slate-700 outline-none text-sm cursor-pointer"
                        >
                            <option value="priority_score">Sort by Priority</option>
                            <option value="total">Sort by Value</option>
                            <option value="created_at">Sort by Date</option>
                        </select>
                        <button
                            onClick={() => setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
                            className="p-1 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-slate-200"
                        >
                            {sortOrder === 'desc' ? 'High to Low' : 'Low to High'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Batch List / Grid */}
            <div className="grid grid-cols-1 gap-4">
                {loading ? (
                    <StatCardSkeleton />
                ) : filteredDrafts.length > 0 ? (
                    filteredDrafts.map(draft => (
                        <div
                            key={draft.id}
                            onClick={() => setEditingDraft(draft)}
                            className={`group p-6 bg-white border-l-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer flex flex-col lg:flex-row lg:items-center gap-8 ${draft.status === 'NEEDS_REVIEW' ? 'border-l-red-500' :
                                draft.status === 'PENDING_APPROVAL' ? 'border-l-amber-500' :
                                    draft.status === 'SENT' ? 'border-l-blue-500' :
                                        'border-l-emerald-500'
                                }`}
                        >
                            {/* Primary Info */}
                            <div className="flex-1 min-w-[200px]">
                                <div className="flex items-center gap-3 mb-2">
                                    <span className={`p-2 rounded-xl ${draft.status === 'NEEDS_REVIEW' ? 'bg-red-50 text-red-600' :
                                        draft.status === 'PENDING_APPROVAL' ? 'bg-amber-50 text-amber-600' :
                                            'bg-slate-50 text-slate-400'
                                        }`}>
                                        {draft.status === 'NEEDS_REVIEW' ? <AlertTriangle size={20} /> : <FileText size={20} />}
                                    </span>
                                    <div>
                                        <h3 className="text-xl font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase tracking-tight">
                                            {draft.customer_name}
                                        </h3>
                                        <p className="text-[10px] font-bold text-slate-400 tracking-widest">{draft.quote_number}</p>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2">
                                    {draft.winter_multiplier_active && (
                                        <span className="flex items-center gap-1 px-2 py-0.5 bg-blue-50 text-blue-600 text-[10px] font-black rounded-lg border border-blue-100">
                                            <Snowflake size={10} /> WINTER SURCHARGE
                                        </span>
                                    )}
                                    {draft.eligible_rebates?.length > 0 && (
                                        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 text-[10px] font-black rounded-lg border border-emerald-100">
                                            SK/MB REBATE
                                        </span>
                                    )}
                                </div>
                            </div>

                            {/* Priority Gauge */}
                            <div className="flex flex-col items-center justify-center px-8 border-x border-slate-50 min-w-[140px]">
                                <p className="text-[10px] font-bold text-slate-400 uppercase mb-2 text-center">Triage Status</p>
                                {draft.priority_score > 80 ? (
                                    <span className="px-2.5 py-1 bg-red-100 text-red-700 text-[10px] font-black rounded-lg border border-red-200 uppercase tracking-tighter">
                                        🚨 Urgent High Value
                                    </span>
                                ) : draft.winter_multiplier_active ? (
                                    <span className="px-2.5 py-1 bg-blue-100 text-blue-700 text-[10px] font-black rounded-lg border border-blue-200 uppercase tracking-tighter">
                                        ❄️ Winter Urgent
                                    </span>
                                ) : (Date.now() - new Date(draft.created_at).getTime()) / (1000 * 3600) > 48 ? (
                                    <span className="px-2.5 py-1 bg-amber-100 text-amber-700 text-[10px] font-black rounded-lg border border-amber-200 uppercase tracking-tighter">
                                        ⏰ 48h+ No Response
                                    </span>
                                ) : (
                                    <span className="px-2.5 py-1 bg-slate-100 text-slate-500 text-[10px] font-black rounded-lg border border-slate-200 uppercase tracking-tighter">
                                        Healthy Queue
                                    </span>
                                )}
                            </div>

                            {/* Status Timeline (Unified) */}
                            <div className="flex-1 hidden xl:block overflow-hidden opacity-60 group-hover:opacity-100 transition-opacity">
                                <QuoteStatusTimeline history={draft.status_history} />
                            </div>

                            {/* Value & Actions */}
                            <div className="flex items-center gap-8 justify-between lg:justify-end">
                                <div className="text-right">
                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Value</p>
                                    <p className="text-2xl font-black text-slate-900">${(draft.total || 0).toLocaleString()}</p>
                                </div>
                                <div className="flex items-center gap-2">
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleApprove(draft.id); }}
                                        className="p-3 bg-emerald-500 text-white rounded-2xl hover:bg-emerald-600 shadow-lg shadow-emerald-500/20 active:scale-90 transition-all"
                                    >
                                        <Check size={20} />
                                    </button>
                                    <button
                                        onClick={(e) => { e.stopPropagation(); handleReject(draft.id); }}
                                        className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 transition-all rounded-2xl"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="py-20 text-center bg-white border-2 border-dashed border-slate-200 rounded-[40px]">
                        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <Search className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-black text-slate-900 uppercase">No Matches Found</h3>
                        <p className="text-slate-400 font-medium">Try adjusting your filters or search terms.</p>
                    </div>
                )}
            </div>

            {/* Quick Insights Sub-grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-8">
                <div className="lg:col-span-2">
                    <RevenueChart drafts={drafts} />
                </div>
                <div>
                    <ActivityFeed activities={activities} />
                </div>
            </div>

            {editingDraft && (
                <DraftEditorModal
                    draft={editingDraft}
                    onClose={() => setEditingDraft(null)}
                    onSave={handleSaveDraft}
                />
            )}
        </div>
    );
}
