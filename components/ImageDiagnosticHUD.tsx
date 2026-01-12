import React, { useState, useEffect } from 'react';

interface Point {
    x: number;
    y: number;
    label: string;
    description: string;
}

interface ImageDiagnosticHUDProps {
    imageUrl: string;
    onClose: () => void;
}

const ImageDiagnosticHUD: React.FC<ImageDiagnosticHUDProps> = ({ imageUrl, onClose }) => {
    const [scanProgress, setScanProgress] = useState(0);
    const [detectedPoints, setDetectedPoints] = useState<Point[]>([]);

    useEffect(() => {
        const interval = setInterval(() => {
            setScanProgress(prev => {
                if (prev >= 100) {
                    clearInterval(interval);
                    generateMockPoints();
                    return 100;
                }
                return prev + 5;
            });
        }, 100);
        return () => clearInterval(interval);
    }, []);

    const generateMockPoints = () => {
        setDetectedPoints([
            { x: 30, y: 40, label: "ZONA_ALPHA_01", description: "Posible densidad anómala detectada." },
            { x: 70, y: 60, label: "METRIC_BETA_04", description: "Inflamación de tejido blando observada." },
            { x: 50, y: 20, label: "NEURAL_LINK_SIG", description: "Patrón de flujo biológico estable." }
        ]);
    };

    return (
        <div className="fixed inset-0 z-[100] bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-4 animate-in fade-in duration-500">
            <div className="max-w-5xl w-full aspect-video bg-black rounded-2xl border border-cyan-500/30 overflow-hidden relative shadow-[0_0_50px_rgba(8,145,178,0.3)]">

                {/* Header HUD */}
                <div className="absolute top-0 inset-x-0 p-4 flex justify-between items-start z-20 glass-panel border-b border-cyan-500/20">
                    <div>
                        <h2 className="text-cyan-400 font-cyber text-sm tracking-widest uppercase">Deep Bio-Analysis Mode</h2>
                        <p className="text-[10px] font-mono text-cyan-500/60 uppercase mt-1">Sersor ID: AGUS-XRAY-449 // Protocol: Multimodal</p>
                    </div>
                    <div className="flex gap-4 items-center">
                        <div className="text-right">
                            <span className="text-[10px] font-mono text-emerald-400 block uppercase">Encryption: Active</span>
                            <span className="text-xs font-cyber text-cyan-400">{scanProgress}%</span>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-10 h-10 rounded-lg bg-red-950/30 border border-red-500/50 flex items-center justify-center text-red-500 hover:bg-red-900/50 transition-all"
                        >
                            <i className="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="relative w-full h-full flex items-center justify-center p-20">
                    <div className="relative max-w-full max-h-full">
                        <img src={imageUrl} alt="Medical Scan" className="max-w-full max-h-[70vh] rounded-lg shadow-2xl" />

                        {/* Scanning Line */}
                        {scanProgress < 100 && (
                            <div
                                className="absolute left-0 w-full h-[2px] bg-cyan-400 shadow-[0_0_15px_rgba(34,211,238,1)] z-10 transition-all duration-100"
                                style={{ top: `${scanProgress}%` }}
                            />
                        )}

                        {/* Detected Points */}
                        {scanProgress === 100 && detectedPoints.map((point, i) => (
                            <div
                                key={i}
                                className="absolute w-6 h-6 animate-pulse"
                                style={{ left: `${point.x}%`, top: `${point.y}%` }}
                            >
                                <div className="absolute inset-0 border-2 border-cyan-400 rounded shadow-[0_0_10px_#22d3ee]"></div>
                                <div className="absolute top-8 left-0 w-48 p-2 glass-panel border border-cyan-400/50 rounded-lg animate-in slide-in-from-top-2">
                                    <h4 className="text-[10px] font-mono text-cyan-400 font-bold">{point.label}</h4>
                                    <p className="text-[9px] font-mono text-white/80 leading-tight mt-1">{point.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Data Stream Footer */}
                <div className="absolute bottom-4 left-4 right-4 h-12 flex gap-4 pointer-events-none overflow-hidden">
                    <div className="flex-1 border border-cyan-500/10 rounded-lg bg-cyan-500/5 p-2 font-mono text-[8px] text-cyan-500/60 overflow-hidden line-clamp-3">
                        {Array(10).fill("LOADING_NEURAL_WEIGHTS... [OK] // DATA_PACKET_VERIFIED // SIG_ANALYSIS_SYNC...").join(" ")}
                    </div>
                    <div className="w-48 border border-cyan-500/10 rounded-lg bg-cyan-500/5 p-2 flex flex-col justify-between">
                        <div className="flex justify-between text-[8px] font-mono">
                            <span className="text-cyan-500/60 uppercase">System Integrity</span>
                            <span className="text-emerald-500">100%</span>
                        </div>
                        <div className="w-full bg-slate-900 h-1 rounded-full overflow-hidden mt-1">
                            <div className="h-full bg-cyan-500 w-[95%]"></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default ImageDiagnosticHUD;
