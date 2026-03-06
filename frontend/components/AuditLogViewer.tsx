import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { Activity, User, Clock, FileText, Filter, Download } from 'lucide-react';
import toast from 'react-hot-toast';

export default function AuditLogViewer() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');

    useEffect(() => {
        fetchLogs();
    }, [filter]);

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const url = filter === 'all'
                ? '/api/audit-logs?limit=50'
                : `/api/audit-logs?limit=50&action=${filter}`;

            const res = await fetchWithAuth(url);
            const data = await res.json();
            setLogs(data.logs || []);
        } catch (error) {
            console.error('Error fetching audit logs:', error);
            toast.error('Failed to load audit logs');
        } finally {
            setLoading(false);
        }
    };

    const exportToCSV = () => {
        const headers = ['Timestamp', 'Action', 'User', 'Resource', 'Details'];
        const rows = logs.map(log => [
            new Date(log.created_at).toLocaleString(),
            log.action,
            log.user_id || 'System',
            `${log.resource_type || ''}/${log.resource_id || ''}`,
            JSON.stringify(log.details || {})
        ]);

        const csv = [headers, ...rows].map(row => row.join(',')).join('\n');
        const blob = new Blob([csv], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `audit_logs_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
    };

    const getActionBadge = (action) => {
        const colors = {
            'APPROVED_QUOTE': 'bg-green-100 text-green-800',
            'REJECTED_QUOTE': 'bg-red-100 text-red-800',
            'UPDATED_SETTINGS': 'bg-blue-100 text-blue-800',
            'CREATED_USER': 'bg-purple-100 text-purple-800',
        };
        return colors[action] || 'bg-gray-100 text-gray-800';
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Activity className="h-6 w-6 text-gray-700" />
                    <h3 className="text-lg font-semibold text-gray-900">Activity Log</h3>
                </div>
                <div className="flex items-center space-x-3">
                    <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="all">All Actions</option>
                        <option value="APPROVED_QUOTE">Approved Quotes</option>
                        <option value="REJECTED_QUOTE">Rejected Quotes</option>
                        <option value="UPDATED_SETTINGS">Settings Changes</option>
                    </select>
                    <button
                        onClick={exportToCSV}
                        className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 flex items-center text-sm"
                    >
                        <Download className="h-4 w-4 mr-2" />
                        Export CSV
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-gray-500 mt-2">Loading activity...</p>
                </div>
            ) : logs.length === 0 ? (
                <div className="text-center py-12 bg-gray-50 rounded-lg">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-500">No activity logged yet</p>
                </div>
            ) : (
                <div className="bg-white border border-gray-200 rounded-lg">
                    <div className="overflow-auto max-h-[420px]">
                        <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Timestamp
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Action
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    User
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Resource
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Details
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {logs.map((log, index) => (
                                <tr key={index} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <Clock className="h-4 w-4 text-gray-400 mr-2" />
                                            {new Date(log.created_at).toLocaleString()}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getActionBadge(log.action)}`}>
                                            {log.action.replace(/_/g, ' ')}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                        <div className="flex items-center">
                                            <User className="h-4 w-4 text-gray-400 mr-2" />
                                            {log.user_id || 'System'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        <div className="flex items-center">
                                            <FileText className="h-4 w-4 text-gray-400 mr-2" />
                                            {log.resource_type && log.resource_id
                                                ? `${log.resource_type}/${log.resource_id.substring(0, 8)}...`
                                                : '-'}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                                        {log.details ? JSON.stringify(log.details).substring(0, 50) + '...' : '-'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
}
