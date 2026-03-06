import React, { useState, useEffect } from 'react';
import { Wifi, WifiOff, RefreshCcw } from 'lucide-react';

export default function SyncIndicator() {
    const [isOnline, setIsOnline] = useState(navigator.onLine);
    const [queueCount, setQueueCount] = useState(0);

    useEffect(() => {
        const handleStatusChange = () => {
            setIsOnline(navigator.onLine);
        };

        const checkQueue = () => {
            const queue = JSON.parse(localStorage.getItem('velocity_offline_queue') || '[]');
            setQueueCount(queue.length);
        };

        window.addEventListener('online', handleStatusChange);
        window.addEventListener('offline', handleStatusChange);

        const interval = setInterval(checkQueue, 2000);

        return () => {
            window.removeEventListener('online', handleStatusChange);
            window.removeEventListener('offline', handleStatusChange);
            clearInterval(interval);
        };
    }, []);

    if (isOnline && queueCount === 0) return null;

    return (
        <div className={`mt-4 p-4 rounded-2xl flex items-center gap-3 transition-all ${!isOnline ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
            }`}>
            {!isOnline ? (
                <WifiOff size={20} className="animate-pulse" />
            ) : (
                <RefreshCcw size={20} className="animate-spin" />
            )}
            <div>
                <p className="text-xs font-black uppercase tracking-widest leading-none">
                    {!isOnline ? 'Offline' : 'Syncing Data'}
                </p>
                <p className="text-[10px] font-bold opacity-80 mt-1">
                    {!isOnline
                        ? `${queueCount} quotes queued locally`
                        : `Re-syncing ${queueCount} items...`}
                </p>
            </div>
        </div>
    );
}
