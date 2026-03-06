import React, { useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithAuth } from '../utils/api';

export default function NotificationManager() {
    const { isAuthenticated } = useAuth();
    const lastDraftCount = useRef(0);
    const isFirstLoad = useRef(true);

    useEffect(() => {
        if (!isAuthenticated) return;

        // Request permission on mount
        if (Notification.permission === 'default') {
            Notification.requestPermission();
        }

        const checkDrafts = async () => {
            try {
                const res = await fetchWithAuth('/api/drafts');
                if (res.ok) {
                    const drafts = await res.json();
                    const pendingDrafts = drafts.filter(d => d.status === 'PENDING_APPROVAL');
                    const currentCount = pendingDrafts.length;

                    if (!isFirstLoad.current && currentCount > lastDraftCount.current) {
                        // New draft detected!
                        const newDraftsCount = currentCount - lastDraftCount.current;

                        if (Notification.permission === 'granted') {
                            new Notification('Velocity Logic Agent', {
                                body: `🚀 ${newDraftsCount} new quote(s) ready for review!`,
                                icon: '/vite.svg' // Fallback icon
                            });
                        }

                        // Play sound
                        try {
                            const audio = new Audio('/notification.mp3'); // Ensure this exists or fail silently
                            audio.play().catch(e => console.log('Audio play failed', e));
                        } catch (e) { }
                    }

                    lastDraftCount.current = currentCount;
                    isFirstLoad.current = false;
                }
            } catch (error) {
                console.error('Notification check failed:', error);
            }
        };

        // Check immediately and then every 30 seconds
        checkDrafts();
        const interval = setInterval(checkDrafts, 30000);

        return () => clearInterval(interval);
    }, [isAuthenticated]);

    return null; // Renderless component
}
