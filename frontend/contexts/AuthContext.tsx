import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [client, setClient] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);

    const [impersonatedClient, setImpersonatedClient] = useState(null);
    const [originalAdminToken, setOriginalAdminToken] = useState(null);  // Store original admin token

    useEffect(() => {
        // Check for stored auth on mount
        try {
            const storedToken = localStorage.getItem('token');
            const storedUser = localStorage.getItem('user');
            const storedClient = localStorage.getItem('client');
            const storedImpersonatedClient = localStorage.getItem('impersonatedClient');

            if (storedToken && storedUser && storedClient) {
                // 🔒 THREAT 75 FIX: Validate Token Expiry
                // Simple check to ensure we don't use stale tokens
                try {
                    const payload = JSON.parse(atob(storedToken.split('.')[1]));
                    const exp = payload.exp * 1000; // Convert to ms
                    if (Date.now() >= exp) {
                        console.warn("⚠️ Token expired, clearing session.");
                        throw new Error("Token expired");
                    }

                    setToken(storedToken);
                    setUser(JSON.parse(storedUser));
                    setClient(JSON.parse(storedClient));
                } catch (e) {
                    // Token invalid or expired
                    localStorage.removeItem('token');
                    localStorage.removeItem('user');
                    localStorage.removeItem('client');
                    localStorage.removeItem('impersonatedClient');
                }
            }
            if (storedImpersonatedClient) {
                setImpersonatedClient(JSON.parse(storedImpersonatedClient));
            }
        } catch (error) {
            console.error("Failed to parse stored auth data:", error);
            try {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                localStorage.removeItem('client');
                localStorage.removeItem('impersonatedClient');
            } catch (e) {
                console.warn("Could not clear localStorage:", e);
            }
        } finally {
            setLoading(false);
        }

        // Listen for storage changes from other tabs
        const handleStorageChange = (e) => {
            if (e.key === 'token' || e.key === 'user' || e.key === 'client') {
                // Another tab changed auth - reload to sync
                const newToken = localStorage.getItem('token');
                const newUser = localStorage.getItem('user');
                const newClient = localStorage.getItem('client');

                if (newToken && newUser && newClient) {
                    setToken(newToken);
                    setUser(JSON.parse(newUser));
                    setClient(JSON.parse(newClient));
                } else {
                    // Logged out in another tab
                    setToken(null);
                    setUser(null);
                    setClient(null);
                    setImpersonatedClient(null);
                    localStorage.removeItem('impersonatedClient');
                }
            }
        };

        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    const login = async (email, password) => {
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Login failed');
        }

        const data = await response.json();

        // Store auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('client', JSON.stringify(data.client));

        setToken(data.token);
        setUser(data.user);
        setClient(data.client);

        // Navigate to dashboard after successful login
        window.location.hash = '';
        window.history.pushState(null, '', '/');

        return data;
    };

    const signup = async (companyName, email, password, fullName, industry) => {
        const response = await fetch('/api/auth/signup', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                company_name: companyName,
                email,
                password,
                full_name: fullName,
                industry
            })
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'Signup failed');
        }

        const data = await response.json();

        // Store auth data
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('client', JSON.stringify(data.client));

        setToken(data.token);
        setUser(data.user);
        setClient(data.client);

        return data;
    };

    const impersonate = async (client) => {
        // 🔒 GOD MODE: Impersonate a client
        try {
            // Save current admin token to sessionStorage
            const currentToken = localStorage.getItem('token');
            if (currentToken) {
                sessionStorage.setItem('originalAdminToken', currentToken);
                setOriginalAdminToken(currentToken);
            }

            // Call impersonation endpoint
            const response = await fetch('/api/auth/impersonate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${currentToken}`
                },
                body: JSON.stringify({ target_client_id: client.id })
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Impersonation failed');
            }

            const data = await response.json();

            // Replace token with impersonation token
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data.user));
            localStorage.setItem('client', JSON.stringify(data.client));
            localStorage.setItem('impersonatedClient', JSON.stringify(data.client));

            setToken(data.token);
            setUser(data.user);
            setClient(data.client);
            setImpersonatedClient(data.client);

            // Reload page to apply new auth context
            window.location.reload();
        } catch (error) {
            console.error('Impersonation error:', error);
            throw error;
        }
    };

    const stopImpersonating = () => {
        // 🔒 GOD MODE: Exit impersonation and restore admin token
        const originalToken = sessionStorage.getItem('originalAdminToken');

        if (originalToken) {
            // Restore original admin token
            localStorage.setItem('token', originalToken);
            sessionStorage.removeItem('originalAdminToken');

            // Clear impersonated client
            localStorage.removeItem('impersonatedClient');
            setImpersonatedClient(null);
            setOriginalAdminToken(null);

            // Reload page to apply original auth context
            window.location.reload();
        } else {
            // Fallback: just clear impersonation
            setImpersonatedClient(null);
            localStorage.removeItem('impersonatedClient');
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        localStorage.removeItem('client');
        localStorage.removeItem('impersonatedClient');
        setToken(null);
        setUser(null);
        setClient(null);
        setImpersonatedClient(null);
    };

    const getAuthHeaders = () => {
        return token ? { 'Authorization': `Bearer ${token}` } : {};
    };

    return (
        <AuthContext.Provider value={{
            user,
            client,
            token,
            loading,
            login,
            signup,
            logout,
            impersonate,
            stopImpersonating,
            impersonatedClient,
            getAuthHeaders,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};
