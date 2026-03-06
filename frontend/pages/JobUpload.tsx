import React, { useState } from 'react';
import { Upload, Camera, Mic, CheckCircle2 } from 'lucide-react';

export default function JobUpload() {
    const [isUploading, setIsUploading] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleSimulateUpload = () => {
        setIsUploading(true);
        setTimeout(() => {
            setIsUploading(false);
            setIsComplete(true);
        }, 2000);
    };

    return (
        <div className="space-y-6">
            <div className="border-b border-slate-700 pb-4">
                <h2 className="text-2xl font-bold text-white">Upload Job Details</h2>
                <p className="text-slate-400 mt-2">
                    Upload photos or a voice note describing the plumbing issue in Moose Jaw.
                    The AI Agent will securely process this in <strong className="text-cyan-400">ca-central-1</strong>.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Photo Upload Area */}
                <button
                    onClick={handleSimulateUpload}
                    className="relative block w-full border-2 border-slate-600 border-dashed rounded-xl p-12 text-center hover:border-cyan-500 hover:bg-slate-800/50 focus:outline-none transition-colors bg-slate-800"
                >
                    <Camera className="mx-auto h-12 w-12 text-slate-400" />
                    <span className="mt-4 block text-sm font-medium text-white">
                        Upload Job Site Photos
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                        (Simulate uploading a frozen pipe photo)
                    </span>
                </button>

                {/* Voice Note Area */}
                <button
                    onClick={handleSimulateUpload}
                    className="relative block w-full border-2 border-slate-600 border-dashed rounded-xl p-12 text-center hover:border-cyan-500 hover:bg-slate-800/50 focus:outline-none transition-colors bg-slate-800"
                >
                    <Mic className="mx-auto h-12 w-12 text-slate-400" />
                    <span className="mt-4 block text-sm font-medium text-white">
                        Record Voice Note
                    </span>
                    <span className="mt-1 block text-sm text-slate-400">
                        "The pipe under the sink froze and burst..."
                    </span>
                </button>
            </div>

            {isUploading && (
                <div className="p-4 bg-cyan-900/30 border border-cyan-500/50 rounded-lg text-cyan-400 flex items-center gap-3">
                    <Upload className="animate-bounce" size={20} />
                    Processing securely via AWS ca-central-1...
                </div>
            )}

            {isComplete && (
                <div className="p-4 bg-emerald-900/30 border border-emerald-500/50 rounded-lg text-emerald-400 flex items-center gap-3">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                    <div>
                        <h4 className="font-semibold text-emerald-300">Upload Complete!</h4>
                        <p className="text-sm">Job data analysis in progress. Please review the AI Quoting tab.</p>
                    </div>
                </div>
            )}
        </div>
    );
}
