
'use client';

import { useState, useEffect } from 'react';
import { Zap, RefreshCcw } from 'lucide-react';

export default function DailyPulse() {
    const [pulse, setPulse] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const fetchPulse = async () => {
        setLoading(true);
        try {
            const res = await fetch('/api/pulse');
            const data = await res.json();
            setPulse(data.text);
        } catch (err) {
            console.error('Failed to fetch pulse', err);
            setPulse('The alignment is shifting. Focus on structural integrity today.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPulse();
    }, []);

    return (
        <div className="w-full mt-12 p-8 rounded-[2.5rem] bg-indigo-600/5 border border-indigo-500/10 relative overflow-hidden group">
            <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.1)]">
                        <Zap className="w-6 h-6 text-indigo-400 fill-indigo-400/20" />
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Daily Strategic Pulse</h3>
                        <p className="text-xs text-indigo-400/50 mt-1 font-mono uppercase">Calculated: {new Date().toLocaleDateString()}</p>
                    </div>
                </div>
                <button
                    onClick={fetchPulse}
                    disabled={loading}
                    className="p-2 text-indigo-400/40 hover:text-indigo-400 transition-colors disabled:opacity-20"
                >
                    <RefreshCcw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            <div className="mt-8 relative">
                {loading ? (
                    <div className="space-y-3">
                        <div className="h-4 w-3/4 bg-indigo-500/10 rounded animate-pulse" />
                        <div className="h-4 w-1/2 bg-indigo-500/10 rounded animate-pulse" />
                    </div>
                ) : (
                    <blockquote className="text-2xl font-light text-gray-200 leading-relaxed italic">
                        "{pulse}"
                    </blockquote>
                )}
            </div>

            {/* Decorative Pulse Line */}
            <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent" />
        </div>
    );
}
