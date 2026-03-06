import React from 'react';
import { CheckCircle2, Clock, Mail, MessageSquare, AlertCircle, Eye } from 'lucide-react';

interface StatusEvent {
    status: string;
    timestamp: string;
    message: string;
}

interface QuoteStatusTimelineProps {
    history: StatusEvent[];
}

const QuoteStatusTimeline: React.FC<QuoteStatusTimelineProps> = ({ history }) => {
    const getIcon = (status: string) => {
        switch (status) {
            case 'RECEIVED': return <Mail className="w-4 h-4" />;
            case 'AI_PARSING': return <Clock className="w-4 h-4 text-amber-500" />;
            case 'PDF_GENERATED': return <CheckCircle2 className="w-4 h-4 text-green-500" />;
            case 'OPENED': return <Eye className="w-4 h-4 text-blue-500" />;
            case 'APPROVED': return <MessageSquare className="w-4 h-4 text-green-600" />;
            case 'INVOICED': return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
            default: return <AlertCircle className="w-4 h-4" />;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'APPROVED':
            case 'INVOICED':
                return 'bg-green-100 text-green-800 border-green-200';
            case 'OPENED':
                return 'bg-blue-100 text-blue-800 border-blue-200';
            case 'AI_PARSING':
                return 'bg-amber-100 text-amber-800 border-amber-200';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-200';
        }
    };

    return (
        <div className="space-y-4">
            <h4 className="text-sm font-semibold text-gray-900 border-b pb-2">AI Decision Chain & Tracking</h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-[11px] before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-200">
                {history.map((event, index) => (
                    <div key={index} className="relative">
                        <div className={`absolute -left-8 p-1 rounded-full bg-white border-2 ${index === 0 ? 'border-primary' : 'border-gray-200'} z-10`}>
                            {getIcon(event.status)}
                        </div>
                        <div className="flex flex-col">
                            <div className="flex items-center gap-2">
                                <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${getStatusColor(event.status)}`}>
                                    {event.status.replace('_', ' ')}
                                </span>
                                <span className="text-[10px] text-gray-400">
                                    {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-gray-700 mt-1">{event.message}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default QuoteStatusTimeline;
