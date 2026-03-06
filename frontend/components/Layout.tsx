import React from 'react';
import Sidebar from './Sidebar';
import { useAuth } from '../contexts/AuthContext';
import { Eye, X } from 'lucide-react';

export default function Layout({ children, activeTab, onTabChange }) {
    const { impersonatedClient, stopImpersonating } = useAuth();

    return (
        <div className="min-h-screen bg-gray-50">
            <Sidebar activeTab={activeTab} onTabChange={onTabChange} />
            <main className="md:pl-64 min-h-screen flex flex-col">
                {impersonatedClient && (
                    <div className="bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md sticky top-0 z-50">
                        <div className="flex items-center space-x-2">
                            <Eye className="h-5 w-5" />
                            <span className="font-medium">
                                Viewing as: <strong>{impersonatedClient.company_name}</strong>
                            </span>
                        </div>
                        <button
                            onClick={stopImpersonating}
                            className="flex items-center space-x-1 bg-white text-indigo-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-indigo-50 transition-colors"
                        >
                            <X className="h-4 w-4" />
                            <span>Exit View</span>
                        </button>
                    </div>
                )}
                <div className="max-w-7xl mx-auto p-4 md:p-8 flex-1 w-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
