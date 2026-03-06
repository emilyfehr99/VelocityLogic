import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { fetchWithAuth } from '../utils/api';
import { Users, Eye, X } from 'lucide-react';

export default function ClientSwitcher() {
    const { user, impersonate, stopImpersonating, impersonatedClient } = useAuth();
    const [clients, setClients] = useState([]);
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (user?.role === 'super_admin') {
            fetchClients();
        }
    }, [user]);

    const fetchClients = async () => {
        try {
            const res = await fetchWithAuth('/api/admin/clients');
            if (res.ok) {
                const data = await res.json();
                setClients(data);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
        }
    };

    if (user?.role !== 'super_admin') return null;

    return (
        <div className="relative px-4 py-2">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 transition-all shadow-md"
            >
                <Users className="h-5 w-5" />
                <span>{impersonatedClient ? 'Switch Client' : 'View as Client'}</span>
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-10"
                        onClick={() => setIsOpen(false)}
                    ></div>
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-md shadow-lg py-1 z-20 max-h-96 overflow-y-auto ring-1 ring-black ring-opacity-5">
                        <div className="px-4 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100 flex justify-between items-center">
                            <span>Select Contractor</span>
                            {impersonatedClient && (
                                <button
                                    onClick={() => { stopImpersonating(); setIsOpen(false); }}
                                    className="text-indigo-600 hover:text-indigo-800 font-bold"
                                >
                                    Global View
                                </button>
                            )}
                        </div>
                        {clients.map((client) => (
                            <button
                                key={client.id}
                                onClick={() => {
                                    impersonate(client);
                                    setIsOpen(false);
                                }}
                                className={`block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 transition-colors ${impersonatedClient?.id === client.id ? 'bg-indigo-50 text-indigo-700 border-l-4 border-indigo-600' : 'text-gray-700'}`}
                            >
                                <div className="font-medium">{client.company_name}</div>
                                <div className="text-xs text-secondary truncate">{client.industry || 'Trade Business'}</div>
                            </button>
                        ))}
                        {clients.length === 0 && (
                            <div className="px-4 py-2 text-sm text-gray-500">No clients found</div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
