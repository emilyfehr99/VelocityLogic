import React from 'react';
import Card from './Card';
import { Clock, Mail, FileText, CheckCircle, Settings, Shield } from 'lucide-react';

export default function ActivityFeed({ activities }) {
    const getIcon = (action) => {
        if (!action) return <Clock size={16} />;
        if (action.includes('Email')) return <Mail size={16} />;
        if (action.includes('Draft') || action.includes('Quote')) return <FileText size={16} />;
        if (action.includes('Approved') || action.includes('Sent')) return <CheckCircle size={16} />;
        if (action.includes('Settings') || action.includes('Logo')) return <Settings size={16} />;
        if (action.includes('Pricing')) return <Shield size={16} />;
        return <Clock size={16} />;
    };

    const getColor = (action) => {
        if (!action) return 'bg-gray-100 text-gray-600';
        if (action.includes('Email')) return 'bg-blue-100 text-blue-600';
        if (action.includes('Draft') || action.includes('Quote')) return 'bg-orange-100 text-orange-600';
        if (action.includes('Approved') || action.includes('Sent')) return 'bg-green-100 text-green-600';
        if (action.includes('Settings') || action.includes('Logo')) return 'bg-gray-100 text-gray-600';
        if (action.includes('Pricing')) return 'bg-purple-100 text-purple-600';
        return 'bg-gray-100 text-gray-600';
    };

    const formatTime = (dateString) => {
        if (!dateString) return 'Just now';
        
        try {
            const date = new Date(dateString);
            // Check if date is valid
            if (isNaN(date.getTime())) {
                return 'Recently';
            }
            
            // Calculate relative time
            const now = new Date();
            const diffMs = now - date;
            const diffMins = Math.floor(diffMs / 60000);
            const diffHours = Math.floor(diffMins / 60);
            const diffDays = Math.floor(diffHours / 24);
            
            if (diffMins < 1) return 'Just now';
            if (diffMins < 60) return `${diffMins}m ago`;
            if (diffHours < 24) return `${diffHours}h ago`;
            if (diffDays < 7) return `${diffDays}d ago`;
            
            return date.toLocaleDateString();
        } catch (e) {
            return 'Recently';
        }
    };

    return (
        <Card className="h-full min-h-[400px] flex flex-col">
            <div className="mb-6 flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900">Live Activity</h3>
                <div className="flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                    <span className="relative flex h-2 w-2">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                    </span>
                    Live
                </div>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 space-y-4">
                {(!activities || activities.length === 0) ? (
                    <p className="text-gray-400 text-center py-8">No recent activity</p>
                ) : (
                    activities.map((activity, index) => (
                        <div key={activity.id || index} className="flex gap-3 items-start">
                            <div className={`p-2 rounded-lg shrink-0 ${getColor(activity.action)}`}>
                                {getIcon(activity.action)}
                            </div>
                            <div>
                                <p className="text-sm font-medium text-gray-900">{activity.action || 'Activity'}</p>
                                <p className="text-xs text-gray-500">{activity.details || ''}</p>
                                <p className="text-[10px] text-gray-400 mt-1">
                                    {formatTime(activity.created_at || activity.timestamp)}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </Card>
    );
}
