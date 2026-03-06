import React from 'react';

export function CardSkeleton() {
    return (
        <div className="animate-pulse bg-gray-200 rounded-xl h-32"></div>
    );
}

export function TableSkeleton({ rows = 5 }) {
    return (
        <div className="space-y-3">
            {[...Array(rows)].map((_, i) => (
                <div key={i} className="h-12 bg-gray-200 rounded-lg animate-pulse"></div>
            ))}
        </div>
    );
}

export function StatCardSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
                <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                    <div className="h-6 bg-gray-200 rounded w-16"></div>
                </div>
            </div>
        </div>
    );
}

export function ChartSkeleton() {
    return (
        <div className="animate-pulse bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="h-6 bg-gray-200 rounded w-48 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
        </div>
    );
}
