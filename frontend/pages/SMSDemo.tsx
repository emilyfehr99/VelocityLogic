import React, { useState } from 'react';
import { Smartphone, Send } from 'lucide-react';

export default function SMSDemo() {
    const [messages, setMessages] = useState([
        {
            id: 1,
            sender: 'agent',
            text: "Velocity Logic AI: Hi! We received your plumbing report. We're prioritizing your frozen pipe due to the -38C Environment Canada warning.",
            time: '12:01 PM'
        },
        {
            id: 2,
            sender: 'agent',
            text: "Your quote is ready: $424.02 CAD (inc. SK PST/GST). Reply YES to approve and secure our emergency tech for 2:00 PM today.",
            time: '12:05 PM'
        }
    ]);

    const [input, setInput] = useState('');

    const handleSend = (e) => {
        e.preventDefault();
        if (!input.trim()) return;

        // Add user message
        const newMsg = { id: Date.now(), sender: 'user', text: input, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
        setMessages(prev => [...prev, newMsg]);
        setInput('');

        // Simulate AI response
        setTimeout(() => {
            let aiResponseText = "Awesome! Your 2:00 PM slot is confirmed. Tech will text you when they are 15 minutes away. Stay warm!";

            // Basic mock upsell trigger
            if (input.toLowerCase().includes('yes')) {
                aiResponseText = "Slot confirmed for 2:00 PM. We also noticed your area is eligible for the SaskEnergy preventative winterization rebate. Would you like the tech to run a quick diagnostic while there for +$49?";
            }

            const responseMsg = { id: Date.now() + 1, sender: 'agent', text: aiResponseText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
            setMessages(prev => [...prev, responseMsg]);
        }, 1500);

    };

    return (
        <div className="space-y-6 max-w-lg mx-auto">
            <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-white">SMS Upsell & Updates</h2>
                <p className="text-slate-400 mt-2">Agent-driven, conversational text interactions.</p>
            </div>

            <div className="bg-slate-900 rounded-3xl overflow-hidden border border-slate-700 shadow-2xl mx-auto flex flex-col h-[500px]">
                {/* Phone Header */}
                <div className="bg-slate-800 px-6 py-4 border-b border-slate-700 flex justify-between items-center shrink-0">
                    <div className="flex items-center gap-3">
                        <div className="bg-cyan-500 text-slate-900 rounded-full p-2">
                            <Smartphone size={20} />
                        </div>
                        <div>
                            <p className="font-bold text-sm text-white">Velocity Logic AI Agent</p>
                            <p className="text-xs text-cyan-400">Automated Dispatch</p>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 bg-[#0f172a]">
                    <div className="text-center text-xs text-slate-500 mb-2 font-medium">Today</div>
                    {messages.map(msg => (
                        <div key={msg.id} className={`max-w-[85%] rounded-2xl px-4 py-2 ${msg.sender === 'user' ? 'bg-cyan-600 text-white self-end rounded-br-none shadow-md' : 'bg-slate-800 text-slate-200 self-start rounded-bl-none shadow border border-slate-700'}`}>
                            <p className="text-sm">{msg.text}</p>
                            <p className={`text-[10px] mt-1 text-right ${msg.sender === 'user' ? 'text-cyan-200' : 'text-slate-500'}`}>{msg.time}</p>
                        </div>
                    ))}
                </div>

                {/* Input */}
                <div className="p-3 bg-slate-800 border-t border-slate-700 shrink-0">
                    <form onSubmit={handleSend} className="flex gap-2">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Text Message"
                            className="flex-1 rounded-full bg-slate-900 border border-slate-700 px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 placeholder-slate-500"
                        />
                        <button
                            type="submit"
                            className="bg-cyan-500 text-slate-900 rounded-full p-2 w-10 h-10 flex items-center justify-center hover:bg-cyan-400 disabled:opacity-50 disabled:bg-slate-700 disabled:text-slate-500 transition-colors"
                            disabled={!input.trim()}
                        >
                            <Send size={16} className="-ml-1 mt-1" />
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
