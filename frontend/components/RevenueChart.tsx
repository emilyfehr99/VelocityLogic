import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import Card from './Card';

export default function RevenueChart({ drafts }) {
    // Calculate data from drafts
    const data = [
        {
            name: 'Pending',
            amount: drafts
                .filter(d => d.status === 'PENDING_APPROVAL')
                .reduce((sum, d) => sum + (d.total || 0), 0),
            color: '#F59E0B' // Amber-500
        },
        {
            name: 'Approved',
            amount: drafts
                .filter(d => d.status === 'SENT' || d.status === 'APPROVED')
                .reduce((sum, d) => sum + (d.total || 0), 0),
            color: '#10B981' // Emerald-500
        },
        {
            name: 'Rejected',
            amount: drafts
                .filter(d => d.status === 'REJECTED') // Assuming we keep rejected drafts for stats
                .reduce((sum, d) => sum + (d.total || 0), 0),
            color: '#EF4444' // Red-500
        }
    ];

    const totalVolume = data.reduce((sum, item) => sum + item.amount, 0);

    return (
        <Card className="h-full min-h-[400px] flex flex-col">
            <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-900">Revenue Overview</h3>
                <p className="text-sm text-gray-500">Total Quote Volume: ${totalVolume.toLocaleString()}</p>
            </div>

            <div className="flex-1 w-full min-h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                        <XAxis
                            dataKey="name"
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            dy={10}
                        />
                        <YAxis
                            axisLine={false}
                            tickLine={false}
                            tick={{ fill: '#6B7280', fontSize: 12 }}
                            tickFormatter={(value) => `$${value}`}
                        />
                        <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{
                                backgroundColor: 'rgba(255, 255, 255, 0.9)',
                                borderRadius: '12px',
                                border: 'none',
                                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
                            }}
                            formatter={(value) => [`$${value.toLocaleString()}`, 'Amount']}
                        />
                        <Bar dataKey="amount" radius={[8, 8, 0, 0]} barSize={60}>
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </Card>
    );
}
