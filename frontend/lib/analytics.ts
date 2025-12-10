import { supabase } from './supabaseClient';
// Simple UUID generator if uuid package is not available, or use library
// Since we don't have 'uuid' package installed, let's use a simple random string for session
const generateSessionId = () => {
    return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const getSessionId = () => {
    let sessionId = sessionStorage.getItem('vl_session_id');
    if (!sessionId) {
        sessionId = generateSessionId();
        sessionStorage.setItem('vl_session_id', sessionId);
    }
    return sessionId;
};

export interface AnalyticsEvent {
    name: string;
    data?: Record<string, any>;
}

export const trackEvent = async (eventName: string, data: Record<string, any> = {}) => {
    try {
        const sessionId = getSessionId();
        const { error } = await supabase.from('analytics_events').insert([
            {
                event_name: eventName,
                event_data: data,
                page_path: window.location.pathname,
                session_id: sessionId,
                referrer: document.referrer,
            },
        ]);

        if (error) {
            console.error('Error tracking event:', error);
        }
    } catch (err) {
        console.error('Analytics error:', err);
    }
};

export const trackPageView = (path: string) => {
    trackEvent('page_view', { path });
};
