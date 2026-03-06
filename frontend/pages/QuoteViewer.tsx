import React from 'react';
import { Package, Receipt, Snowflake } from 'lucide-react';

export default function QuoteViewer() {
    return (
        <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-bold text-white">AI Generated Quote</h2>
                <p className="text-slate-400 mt-2">
                    Real-time generated estimate based on mock supplier data. Includes Saskatchewan GST/PST.
                </p>
            </div>

            {/* Quote summary cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Package size={16} /> Materials (Mock Rona/HD)
                    </p>
                    <p className="text-xl font-bold text-white mt-1">$145.50 CAD</p>
                </div>
                <div className="p-4 bg-slate-800 rounded-lg border border-slate-700">
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                        <Receipt size={16} /> Labor Estimate
                    </p>
                    <p className="text-xl font-bold text-white mt-1">$220.00 CAD</p>
                </div>
                <div className="p-4 bg-cyan-900/20 rounded-lg border border-cyan-500/30 text-cyan-400">
                    <p className="text-sm flex items-center gap-2">
                        <Snowflake size={16} /> Winter Urgency Premium
                    </p>
                    <p className="text-xl font-bold text-cyan-300 mt-1">$75.00 CAD</p>
                </div>
            </div>

            {/* Breakdown table */}
            <div className="overflow-x-auto rounded-lg border border-slate-700">
                <table className="w-full text-sm text-left text-slate-400">
                    <thead className="text-xs text-slate-300 uppercase bg-slate-800 border-b border-slate-700">
                        <tr>
                            <th className="px-6 py-3">Item / Service</th>
                            <th className="px-6 py-3">Qty</th>
                            <th className="px-6 py-3">Unit Price (CAD)</th>
                            <th className="px-6 py-3">Total (CAD)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700 bg-slate-900/50">
                        <tr>
                            <td className="px-6 py-4 font-medium text-white">1/2" PEX Pipe (10ft)</td>
                            <td className="px-6 py-4">2</td>
                            <td className="px-6 py-4">$15.50</td>
                            <td className="px-6 py-4">$31.00</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-medium text-white">PEX Brass SharkBite Fittings</td>
                            <td className="px-6 py-4">4</td>
                            <td className="px-6 py-4">$14.00</td>
                            <td className="px-6 py-4">$56.00</td>
                        </tr>
                        <tr>
                            <td className="px-6 py-4 font-medium text-white">Plumber Labor (Emergency/Frozen)</td>
                            <td className="px-6 py-4">2 hrs</td>
                            <td className="px-6 py-4">$110.00</td>
                            <td className="px-6 py-4">$220.00</td>
                        </tr>
                        <tr className="font-bold text-white border-t-2 border-slate-600 bg-slate-800/50">
                            <td className="px-6 py-4 text-right" colSpan={3}>Subtotal</td>
                            <td className="px-6 py-4">$382.00</td>
                        </tr>
                        <tr className="text-slate-400 bg-slate-800/30">
                            <td className="px-6 py-2 text-right" colSpan={3}>GST (5%)</td>
                            <td className="px-6 py-2">$19.10</td>
                        </tr>
                        <tr className="text-slate-400 bg-slate-800/30">
                            <td className="px-6 py-2 text-right" colSpan={3}>SK PST (6%)</td>
                            <td className="px-6 py-2">$22.92</td>
                        </tr>
                        <tr className="font-bold text-cyan-400 text-lg border-t border-slate-600 bg-slate-800">
                            <td className="px-6 py-4 text-right" colSpan={3}>Total CAD</td>
                            <td className="px-6 py-4">$424.02</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div className="flex justify-end mt-4">
                <button className="bg-cyan-600 text-white px-6 py-3 rounded-md font-medium hover:bg-cyan-500 transition shadow-[0_0_15px_rgba(6,182,212,0.5)]">
                    Approve Quote & Proceed to Scheduling
                </button>
            </div>
        </div>
    );
}
