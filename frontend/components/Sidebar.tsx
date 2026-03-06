import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { LayoutDashboard, MessageSquarePlus, FileText, Settings, BarChart3, Users, Menu, X, Sparkles } from 'lucide-react';
import { clsx } from 'clsx';
import ClientSwitcher from './ClientSwitcher';
import SyncIndicator from './SyncIndicator';

export default function Sidebar({ activeTab, onTabChange }) {
    const { user } = useAuth();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    // Base menu items for all users
    const baseMenuItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'quotes', label: 'Quote Generator', icon: MessageSquarePlus },
        { id: 'history', label: 'History', icon: FileText },
        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
        { id: 'customers', label: 'Customers', icon: Users },
        { id: 'settings', label: 'Settings', icon: Settings },
    ];

    // Add Master Admin option only for admin users
    const menuItems = user?.role === 'super_admin' || user?.role === 'admin'
        ? [...baseMenuItems, { id: 'admin', label: 'Master Admin', icon: LayoutDashboard }]
        : baseMenuItems;

    const handleTabChange = (tabId) => {
        onTabChange(tabId);
        setMobileMenuOpen(false); // Close mobile menu after selection
    };

    return (
        <>
            {/* Mobile Menu Button */}
            <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-xl shadow-lg border border-gray-200 hover:bg-gray-50 transition-colors"
            >
                {mobileMenuOpen ? <X size={24} className="text-gray-700" /> : <Menu size={24} className="text-gray-700" />}
            </button>

            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
                    onClick={() => setMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar */}
            <div className={clsx(
                "w-64 h-screen bg-gray-50/80 backdrop-blur-xl border-r border-gray-200 flex flex-col p-4 fixed left-0 top-0 z-50 transition-transform duration-300",
                "md:translate-x-0",
                mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="px-4 py-6 mb-2">
                    <div className="flex items-center gap-3 mb-1">
                        <img src="/logo.png" alt="Velocity Logic" className="w-8 h-8 object-contain" />
                        <span className="text-xl font-semibold tracking-tight text-gray-900">
                            {user?.client?.company_name || 'Velocity Logic'}
                        </span>
                    </div>
                    <p className="text-[10px] text-gray-500 font-medium leading-tight">Turn Emails into Estimates Instantly</p>
                </div>

                <nav className="space-y-1 flex-1">
                    {menuItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;

                        return (
                            <button
                                key={item.id}
                                data-tour={item.id}
                                onClick={() => handleTabChange(item.id)}
                                className={clsx(
                                    "w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200",
                                    isActive
                                        ? "bg-white text-apple-blue shadow-sm ring-1 ring-black/5"
                                        : "text-gray-500 hover:text-gray-900 hover:bg-gray-100/50"
                                )}
                            >
                                <Icon size={20} className={isActive ? "text-apple-blue" : "text-gray-400"} />
                                {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 mt-auto space-y-3">
                    {/* Client Switcher (Super Admin Only) */}
                    <ClientSwitcher />

                    {/* Take Tour Button */}
                    <button
                        onClick={() => {
                            localStorage.setItem('force_tour', 'true');
                            window.location.reload();
                        }}
                        className="w-full px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all flex items-center justify-center gap-2 text-sm font-medium shadow-lg shadow-blue-500/30"
                        title="Start onboarding tour"
                    >
                        <Sparkles size={16} />
                        Take Tour
                    </button>

                    {/* Sync Status */}
                    <SyncIndicator />

                    {/* Agent Status */}
                    <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-4 text-white shadow-xl">
                        <p className="text-xs text-gray-400 mb-1">Agent Status</p>
                        <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm font-medium">Active</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
