import React, { useState, useEffect } from 'react';

const BiometricDashboard: React.FC = () => {
    const [bpm, setBpm] = useState(72);
    const [spo2, setSpo2] = useState(98);
    const [stress, setStress] = useState(24);

    useEffect(() => {
        const interval = setInterval(() => {
            setBpm(prev => {
                const change = Math.floor(Math.random() * 3) - 1;
                return Math.max(60, Math.min(100, prev + change));
            });
            setSpo2(prev => {
                if (Math.random() > 0.8) {
                    const change = Math.floor(Math.random() * 3) - 1;
                    return Math.max(95, Math.min(100, prev + change));
                }
                return prev;
            });
            setStress(prev => {
                const change = Math.floor(Math.random() * 3) - 1;
                return Math.max(10, Math.min(40, prev + change));
            });
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="hidden lg:flex flex-col gap-4 w-64 fixed right-8 top-24 z-10 glass-panel border border-cyan-500/20 p-4 animate-in fade-in slide-in-from-right duration-700">
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan] animate-pulse"></span>
                    Live Biometrics
                </h3>
                <span className="text-[8px] font-mono text-cyan-500/40">AES-256 SECURED</span>
            </div>

            {/* Heart Rate */}
            <div className="bg-slate-950/50 border border-cyan-500/10 p-3 rounded-lg flex flex-col gap-2">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Heart Rate</span>
                    <span className="text-xl font-cyber text-cyan-400 leading-none">{bpm} <span className="text-[10px]">BPM</span></span>
                </div>
                <div className="h-8 flex items-end gap-[2px]">
                    {[...Array(20)].map((_, i) => (
                        <div
                            key={i}
                            className="w-full bg-cyan-500/20 rounded-t-sm transition-all duration-1000"
                            style={{ height: `${Math.random() * 100}%` }}
                        />
                    ))}
                </div>
            </div>

            {/* Oxygen SpO2 */}
            <div className="bg-slate-950/50 border border-cyan-500/10 p-3 rounded-lg">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Oxygen SpO2</span>
                    <span className="text-xl font-cyber text-emerald-400 leading-none">{spo2}%</span>
                </div>
                <div className="w-full bg-slate-900 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="h-full bg-emerald-500 shadow-[0_0_10px_#10b981] transition-all duration-1000"
                        style={{ width: `${spo2}%` }}
                    />
                </div>
            </div>

            {/* Stress Index */}
            <div className="bg-slate-950/50 border border-cyan-500/10 p-3 rounded-lg">
                <div className="flex justify-between items-end mb-2">
                    <span className="text-[9px] font-mono text-slate-400 uppercase">Stress Index</span>
                    <span className="text-xl font-cyber text-amber-400 leading-none">{stress} <span className="text-[10px]">LVL</span></span>
                </div>
                <div className="grid grid-cols-10 gap-1">
                    {[...Array(10)].map((_, i) => (
                        <div
                            key={i}
                            className={`h-1.5 rounded-sm transition-all duration-500 ${i < Math.floor(stress / 10) ? 'bg-amber-500 shadow-[0_0_5px_#f59e0b]' : 'bg-slate-800'}`}
                        />
                    ))}
                </div>
            </div>

            {/* Scanning Animation */}
            <div className="mt-2 p-2 border border-cyan-500/20 rounded bg-cyan-500/5 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/10 to-transparent animate-scan"></div>
                <div className="text-[8px] font-mono text-cyan-500/60 leading-tight">
                    ANALYZING NEURAL PATTERNS...<br />
                    ID: AGUS-BIO-LNK-03<br />
                    STATUS: SYNCHRONIZED
                </div>
            </div>
        </div>
    );
};

export default BiometricDashboard;
