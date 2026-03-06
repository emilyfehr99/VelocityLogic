import React, { useState, useEffect } from 'react';
import { fetchWithAuth } from '../utils/api';
import { Download, Upload, Eye, AlertCircle, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CSVPreviewModal({ isOpen, onClose, onConfirm }) {
    const [file, setFile] = useState(null);
    const [preview, setPreview] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileSelect = async (e) => {
        const selectedFile = e.target.files[0];
        if (!selectedFile) return;

        if (!selectedFile.name.endsWith('.csv')) {
            toast.error('Please select a CSV file');
            return;
        }

        setFile(selectedFile);
        setLoading(true);

        // Read and parse CSV for preview
        const reader = new FileReader();
        reader.onload = (event) => {
            const text = event.target.result;
            const lines = text.split('\n').filter(line => line.trim());
            const headers = lines[0].split(',');
            const rows = lines.slice(1, 6).map(line => line.split(','));

            setPreview({ headers, rows, totalRows: lines.length - 1 });
            setLoading(false);
        };
        reader.readAsText(selectedFile);
    };

    const handleConfirm = () => {
        if (file && preview) {
            onConfirm(file, preview);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                    <h2 className="text-2xl font-bold text-gray-900">Import Pricing CSV</h2>
                    <p className="text-sm text-gray-600 mt-1">Preview your data before importing</p>
                </div>

                <div className="p-6 overflow-y-auto max-h-[60vh]">
                    {!preview ? (
                        <div className="space-y-4">
                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                                <label className="cursor-pointer">
                                    <span className="text-blue-600 hover:text-blue-700 font-medium">
                                        Choose a CSV file
                                    </span>
                                    <input
                                        type="file"
                                        accept=".csv"
                                        onChange={handleFileSelect}
                                        className="hidden"
                                    />
                                </label>
                                <p className="text-sm text-gray-500 mt-2">
                                    or drag and drop
                                </p>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                <div className="flex items-start">
                                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3" />
                                    <div>
                                        <h4 className="font-medium text-blue-900">Need a template?</h4>
                                        <p className="text-sm text-blue-700 mt-1">
                                            Download our sample CSV to see the correct format
                                        </p>
                                        <button
                                            onClick={async () => {
                                                const res = await fetchWithAuth('/api/settings/pricing/template');
                                                const blob = await res.blob();
                                                const url = window.URL.createObjectURL(blob);
                                                const a = document.createElement('a');
                                                a.href = url;
                                                a.download = 'pricing_template.csv';
                                                a.click();
                                            }}
                                            className="mt-2 text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center"
                                        >
                                            <Download className="h-4 w-4 mr-1" />
                                            Download Template
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-lg p-4">
                                <div className="flex items-center">
                                    <CheckCircle className="h-5 w-5 text-green-600 mr-3" />
                                    <div>
                                        <p className="font-medium text-green-900">{file.name}</p>
                                        <p className="text-sm text-green-700">
                                            {preview.totalRows} rows ready to import
                                        </p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => {
                                        setFile(null);
                                        setPreview(null);
                                    }}
                                    className="text-green-600 hover:text-green-700 text-sm font-medium"
                                >
                                    Change File
                                </button>
                            </div>

                            <div>
                                <h3 className="font-medium text-gray-900 mb-2">Preview (First 5 rows)</h3>
                                <div className="overflow-x-auto border border-gray-200 rounded-lg">
                                    <table className="min-w-full divide-y divide-gray-200">
                                        <thead className="bg-gray-50">
                                            <tr>
                                                {preview.headers.map((header, i) => (
                                                    <th key={i} className="px-4 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                                                        {header.trim()}
                                                    </th>
                                                ))}
                                            </tr>
                                        </thead>
                                        <tbody className="bg-white divide-y divide-gray-200">
                                            {preview.rows.map((row, i) => (
                                                <tr key={i} className="hover:bg-gray-50">
                                                    {row.map((cell, j) => (
                                                        <td key={j} className="px-4 py-3 text-sm text-gray-900">
                                                            {cell.trim()}
                                                        </td>
                                                    ))}
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                    <button
                        onClick={onClose}
                        className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                    >
                        Cancel
                    </button>
                    {preview && (
                        <button
                            onClick={handleConfirm}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Import {preview.totalRows} Items
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
}
