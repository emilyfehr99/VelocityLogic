// Helper function to make authenticated API calls with offline support
const OFFLINE_QUEUE = 'velocity_offline_queue';

export const fetchWithAuth = async (url: string, options: any = {}) => {
    const token = localStorage.getItem('token');
    const impersonatedClient = localStorage.getItem('impersonatedClient');

    const headers = {
        ...options.headers,
        ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
        ...(impersonatedClient ? { 'X-Impersonate-Client-ID': JSON.parse(impersonatedClient).id } : {}),
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache'
    };

    let finalUrl = url;
    if (!options.method || options.method === 'GET') {
        const separator = url.includes('?') ? '&' : '?';
        finalUrl = `${url}${separator}_t=${Date.now()}`;
    }

    try {
        const response = await fetch(finalUrl, {
            ...options,
            headers,
            cache: 'no-store'
        });

        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            localStorage.removeItem('client');
            window.location.hash = '#/login';
        }

        return response;
    } catch (error) {
        // If it's a mutation and network is down, queue it
        if (options.method && options.method !== 'GET' && !navigator.onLine) {
            const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE) || '[]');
            queue.push({ url, options, timestamp: Date.now() });
            localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(queue));

            // Return a mock success response to the UI
            return {
                ok: true,
                status: 202,
                json: async () => ({ success: true, queued: true, message: "Offline: Saved locally and will sync later." })
            } as any;
        }
        throw error;
    }
};

// Background sync logic
export const syncOfflineQueue = async () => {
    if (!navigator.onLine) return;

    const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE) || '[]');
    if (queue.length === 0) return;

    const remaining = [];
    for (const item of queue) {
        try {
            await fetchWithAuth(item.url, item.options);
        } catch (e) {
            remaining.push(item);
        }
    }
    localStorage.setItem(OFFLINE_QUEUE, JSON.stringify(remaining));
};

// Initial sync on startup
if (typeof window !== 'undefined') {
    window.addEventListener('online', syncOfflineQueue);
}
