import React, { useState, useRef } from 'react';
import { Mic, Square, Loader2, Play, Trash2, Zap } from 'lucide-react';
import toast from 'react-hot-toast';

interface VoiceRecorderProps {
    onTranscript: (quoteData: any) => void;
    city?: string;
    province?: string;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscript, city, province }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [audioUrl, setAudioUrl] = useState<string | null>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const chunksRef = useRef<Blob[]>([]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            const mediaRecorder = new MediaRecorder(stream);
            mediaRecorderRef.current = mediaRecorder;
            chunksRef.current = [];

            mediaRecorder.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorder.onstop = () => {
                const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
                setAudioUrl(URL.createObjectURL(blob));
            };

            mediaRecorder.start();
            setIsRecording(true);
            toast.success('Recording started...');
        } catch (err) {
            console.error('Error accessing microphone:', err);
            toast.error('Microphone access denied');
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
        }
    };

    const processVoice = async () => {
        if (chunksRef.current.length === 0) return;

        setIsProcessing(true);
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const formData = new FormData();
        formData.append('audio', blob, 'voice_intake.webm');
        if (city) formData.append('city', city);
        if (province) formData.append('province', province || 'Manitoba');

        try {
            const token = localStorage.getItem('token');
            const impersonatedClientId = localStorage.getItem('impersonatedClient')
                ? JSON.parse(localStorage.getItem('impersonatedClient')!).id
                : null;

            const response = await fetch('/api/process-voice', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    ...(impersonatedClientId && { 'X-Impersonate-Client-ID': impersonatedClientId })
                },
                body: formData
            });

            if (!response.ok) throw new Error('Transcription failed');

            const data = await response.json();
            toast.success('Quote generated from voice!');
            onTranscript(data);
            setAudioUrl(null);
            chunksRef.current = [];
        } catch (err) {
            console.error('Voice processing error:', err);
            toast.error('Failed to process voice note');
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <div className="flex flex-col gap-3 p-4 bg-slate-50 border border-slate-200 rounded-3xl">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                    <Mic size={16} className="text-blue-500" />
                    Field Intake (Voice)
                </h3>
                {isRecording && (
                    <span className="flex items-center gap-1.5 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] font-black rounded-full animate-pulse">
                        <span className="w-1.5 h-1.5 bg-red-600 rounded-full"></span>
                        RECORDING
                    </span>
                )}
            </div>

            <div className="flex items-center gap-3">
                {!isRecording && !audioUrl ? (
                    <button
                        onClick={startRecording}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-blue-200"
                    >
                        <Mic size={20} />
                        Hold to Speak Quote
                    </button>
                ) : isRecording ? (
                    <button
                        onClick={stopRecording}
                        className="flex-1 flex items-center justify-center gap-2 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-red-200"
                    >
                        <Square size={20} />
                        Stop Recording
                    </button>
                ) : (
                    <div className="flex-1 flex items-center gap-2">
                        <button
                            disabled={isProcessing}
                            onClick={processVoice}
                            className="flex-[2] flex items-center justify-center gap-2 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-2xl transition-all active:scale-95 shadow-lg shadow-emerald-200 disabled:opacity-50"
                        >
                            {isProcessing ? (
                                <Loader2 size={20} className="animate-spin" />
                            ) : (
                                <Zap size={20} />
                            )}
                            {isProcessing ? 'AI Processing...' : 'Generate Quote'}
                        </button>
                        <button
                            onClick={() => { setAudioUrl(null); chunksRef.current = []; }}
                            className="flex-1 py-3 bg-slate-200 hover:bg-slate-300 text-slate-600 font-bold rounded-2xl transition-all"
                        >
                            <Trash2 size={20} className="mx-auto" />
                        </button>
                    </div>
                )}
            </div>
            <p className="text-[10px] text-slate-400 text-center font-medium">
                Example: "New furnace for John Smith in Brandon, about 1500 sq ft."
            </p>
        </div>
    );
};

export default VoiceRecorder;
