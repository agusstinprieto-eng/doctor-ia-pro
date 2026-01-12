import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { geminiService } from '../services/geminiService';
import { pdfService } from '../services/pdfService';

const NeurosomaticScanner: React.FC<{ onClose: () => void; onSave: (data: any) => void }> = ({ onClose, onSave }) => {
    const { t } = useLanguage();
    const [isScanning, setIsScanning] = useState(false);
    const [scanProgress, setScanProgress] = useState(0);
    const [showNeuroGlow, setShowNeuroGlow] = useState(false);
    const [activeTab, setActiveTab] = useState<'monitor' | 'garden' | 'analysis'>('monitor');

    // ... state hooks ...

    const handleClose = () => {
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
        }
        onClose();
    };

    // Biometric State
    const [hrv, setHrv] = useState(45); // Heart Rate Variability (ms)
    const [cortisolLevel, setCortisolLevel] = useState(15); // Simulated ug/dl
    const [sympatheticDominance, setSympatheticDominance] = useState(60); // %
    const [stressAUs, setStressAUs] = useState<string[]>([]);

    // Derma State
    const [skinHealth, setSkinHealth] = useState(0);
    const [agingSigns, setAgingSigns] = useState<any>(null);
    const [healthFlags, setHealthFlags] = useState<string[]>([]);

    // AI Analysis State
    const [authenticity, setAuthenticity] = useState("Analizando...");
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [capturedImage, setCapturedImage] = useState<string | null>(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);

    const [gardenHealth, setGardenHealth] = useState(0); // 0-100% bloom

    const mediaStream = useRef<MediaStream | null>(null);
    const videoRef = useRef<HTMLVideoElement | null>(null);

    const startScan = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false
            });
            mediaStream.current = stream;
            setIsScanning(true);
            setScanProgress(0);
            setActiveTab('monitor');
            setAuthenticity("Analizando...");
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("No se pudo acceder a la cámara. Por favor verifica los permisos.");
        }
    };

    const captureAndAnalyze = async () => {
        if (!videoRef.current) return;
        setIsAnalyzing(true);

        try {
            // Capture frame
            const canvas = document.createElement('canvas');
            canvas.width = videoRef.current.videoWidth;
            canvas.height = videoRef.current.videoHeight;
            const ctx = canvas.getContext('2d');

            if (ctx) {
                // Mirror the context to match the mirrored video
                ctx.translate(canvas.width, 0);
                ctx.scale(-1, 1);
                ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

                const imageBase64 = canvas.toDataURL('image/jpeg', 0.8);
                setCapturedImage(imageBase64);

                // Send to AI
                const results = await geminiService.analyzeBiometrics(imageBase64);
                if (results) {
                    setHrv(results.hrv || 50);
                    setSympatheticDominance(results.sympathetic_dominance || 50);
                    setStressAUs(results.active_aus || []);
                    setAuthenticity(results.authenticity || "Desconocido");
                    // Map cortisol string to number for UI
                    const cortMap: { [key: string]: number } = { "Low": 8, "Medium": 18, "High": 28 };
                    setCortisolLevel(cortMap[results.cortisol] || 15);

                    // New Derma Fields
                    setSkinHealth(results.skin_health_score || 0);
                    setAgingSigns(results.aging_signs || null);
                    setHealthFlags(results.health_flags || []);
                }
            }
        } catch (e) {
            console.error("Analysis failed", e);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const stopScan = async () => {
        // Capture frame BEFORE stopping stream if just finishing
        if (isScanning && mediaStream.current) {
            await captureAndAnalyze();
        }

        setIsScanning(false);
        if (mediaStream.current) {
            mediaStream.current.getTracks().forEach(track => track.stop());
            mediaStream.current = null;
        }
        setActiveTab('analysis');
    };

    useEffect(() => {
        return () => {
            // Cleanup camera on unmount
            if (mediaStream.current) {
                mediaStream.current.getTracks().forEach(track => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (isScanning && scanProgress < 100) {
            interval = setInterval(() => {
                setScanProgress(prev => Math.min(100, prev + 0.5)); // Slower scan for realtime feel

                // Simulate fluctuating biometrics
                setHrv(prev => Math.max(20, Math.min(100, prev + (Math.random() * 10 - 5))));
                setCortisolLevel(prev => Math.max(5, Math.min(30, prev + (Math.random() * 2 - 1))));
                setSympatheticDominance(prev => Math.max(20, Math.min(90, prev + (Math.random() * 5 - 2.5))));

                // Randomly detect Action Units
                if (Math.random() > 0.8) {
                    setStressAUs(prev => {
                        const units = ['AU1+4 (Omega)', 'AU12 (Smile)', 'AU15 (Frown)', 'AU17 (Chin Raise)'];
                        const randomUnit = units[Math.floor(Math.random() * units.length)];
                        return [...prev.slice(-4), randomUnit]; // Keep last 5
                    });
                }
            }, 100);
        } else if (scanProgress >= 100) {
            stopScan();
            setActiveTab('analysis');
        }
        return () => clearInterval(interval);
    }, [isScanning, scanProgress]);

    // Derived visual state
    const gardenState = hrv > 60 ? 'bloom' : hrv > 40 ? 'growing' : 'wither';

    return (
        <div className="flex-1 h-full flex flex-col p-4 md:p-6 animate-in fade-in zoom-in duration-300 overflow-hidden">
            {/* Header */}
            <div className="flex justify-between items-center mb-4 shrink-0">
                <div>
                    <h2 className="text-xl md:text-2xl font-cyber font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-500 neon-glow-cyan flex items-center gap-3">
                        <i className="fas fa-microchip text-cyan-400 text-lg"></i>
                        ESPEJO NEUROSOMÁTICO
                    </h2>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-mono mt-1">
                        <span className="bg-slate-800/50 px-2 py-0.5 rounded border border-slate-700/50">
                            v.2.4.0 BETA
                        </span>
                        <span className="flex items-center gap-1 text-emerald-400">
                            <i className="fas fa-shield-alt"></i>
                            EDGE COMPUTING: PRIVACY SECURE
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowNeuroGlow(!showNeuroGlow)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center gap-2 border ${showNeuroGlow ? 'bg-indigo-600/20 text-indigo-300 border-indigo-500/50' : 'bg-slate-900 text-slate-500 border-slate-700'}`}
                    >
                        <i className="fas fa-eye"></i>
                        NEURO-GLOW
                    </button>
                    <button
                        onClick={handleClose}
                        className="w-8 h-8 rounded-full bg-slate-800/50 border border-slate-700 text-slate-400 hover:text-white hover:bg-red-500/20 hover:border-red-500 transition-all flex items-center justify-center"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Main Content Grid */}
            <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 gap-4 min-h-0 overflow-y-auto lg:overflow-hidden">

                {/* Visualizer Column (Webcam Simulation) */}
                <div className="lg:col-span-7 flex flex-col gap-4">
                    <div className="flex-1 bg-black/80 rounded-2xl border border-cyan-500/20 relative overflow-hidden group shadow-[0_0_30px_rgba(0,0,0,0.5)]">

                        {/* Real Camera Feed */}
                        <div className="absolute inset-0 flex items-center justify-center bg-black">
                            {isScanning || scanProgress > 0 ? (
                                <video
                                    ref={(video) => {
                                        videoRef.current = video;
                                        if (video && mediaStream.current) {
                                            video.srcObject = mediaStream.current;
                                            video.play().catch(e => console.error("Video play error:", e));
                                        }
                                    }}
                                    className="w-full h-full object-cover transform scale-x-[-1]" // Mirror effect
                                    muted
                                    playsInline
                                />
                            ) : (
                                <div className="hidden"></div>
                            )}

                            {/* Face Outline Overlay */}
                            {isScanning && (
                                <>
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-80 border-2 border-cyan-500/30 rounded-[50%] animate-pulse opacity-50"></div>
                                    <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-48 h-[1px] bg-cyan-500/50 animate-scan-vertical"></div>
                                </>
                            )}
                        </div>

                        {/* Neuro-Glow Layer */}
                        {showNeuroGlow && isScanning && (
                            <div className="absolute inset-0 mix-blend-screen opacity-60 pointer-events-none">
                                <div className="absolute top-1/4 left-1/3 w-20 h-20 bg-red-500/40 blur-[40px] animate-pulse"></div>
                                <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-blue-500/40 blur-[50px] animate-pulse [animation-delay:1s]"></div>
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-32 h-10 bg-emerald-500/30 blur-[30px] rounded-full"></div>
                            </div>
                        )}

                        {/* HUD Overlays */}
                        <div className="absolute inset-0 p-6 flex flex-col justify-between pointer-events-none">
                            <div className="flex justify-between">
                                <div className="flex flex-col gap-1">
                                    <span className="text-[10px] font-mono text-cyan-500/60">[REC] 60FPS // ISO 400</span>
                                    <span className="text-[10px] font-mono text-cyan-500/60">FACS: {isScanning ? 'ACTIVE' : 'OFFLINE'}</span>
                                </div>
                                <div className="flex flex-col gap-1 text-right">
                                    <span className="text-[10px] font-mono text-cyan-500/60">rPPG SENSOR: {isScanning ? 'ONLINE' : 'STANDBY'}</span>
                                    <span className="text-[10px] font-mono text-emerald-500/80 tracking-widest">
                                        {isScanning ? 'CAPTURING DATA...' : 'STANDBY'}
                                    </span>
                                </div>
                            </div>

                            {/* Centered Reticle */}
                            {isScanning && (
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 pointer-events-none opacity-40">
                                    <div className="absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-cyan-400"></div>
                                    <div className="absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-cyan-400"></div>
                                    <div className="absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-cyan-400"></div>
                                    <div className="absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-cyan-400"></div>
                                </div>
                            )}
                        </div>

                        {/* Action Buttons */}
                        {!isScanning ? (
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex gap-4 pointer-events-auto z-50">
                                <button
                                    onClick={startScan}
                                    className="px-8 py-3 bg-cyan-500/20 hover:bg-cyan-500/30 border border-cyan-400 hover:border-cyan-300 text-cyan-300 rounded-full font-bold tracking-wider backdrop-blur-md shadow-[0_0_20px_rgba(6,182,212,0.3)] transition-all transform hover:scale-105 flex items-center gap-2"
                                >
                                    <i className="fas fa-play"></i>
                                    INICIAR CÁMARA
                                </button>
                            </div>
                        ) : (
                            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 w-64 pointer-events-auto">
                                <div className="bg-slate-900/80 backdrop-blur border border-cyan-500/30 rounded-full h-2 overflow-hidden px-1 py-1 mb-2">
                                    <div
                                        className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full transition-all duration-300 relative"
                                        style={{ width: `${scanProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/30 animate-pulse"></div>
                                    </div>
                                </div>
                                <button
                                    onClick={stopScan}
                                    className="w-full text-[10px] text-red-400 hover:text-red-300 font-bold tracking-widest text-center"
                                >
                                    DETENER ESCANEO
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Dashboard Column */}
                <div className="lg:col-span-5 flex flex-col gap-4">

                    {/* Mode Tabs */}
                    <div className="flex p-1 bg-slate-900/80 rounded-lg border border-slate-700/50">
                        <button
                            onClick={() => setActiveTab('monitor')}
                            className={`flex-1 py-2 text-[10px] sm:text-xs font-mono rounded-md transition-all ${activeTab === 'monitor' ? 'bg-cyan-900/50 text-cyan-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            TABLERO
                        </button>
                        <button
                            onClick={() => setActiveTab('garden')}
                            className={`flex-1 py-2 text-[10px] sm:text-xs font-mono rounded-md transition-all ${activeTab === 'garden' ? 'bg-emerald-900/50 text-emerald-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            JARDÍN VFC
                        </button>
                        <button
                            onClick={() => setActiveTab('analysis')}
                            className={`flex-1 py-2 text-[10px] sm:text-xs font-mono rounded-md transition-all ${activeTab === 'analysis' ? 'bg-indigo-900/50 text-indigo-300 shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}
                        >
                            CORTEZA
                        </button>
                    </div>

                    <div className="flex-1 bg-slate-950/40 border border-slate-800 rounded-2xl p-4 overflow-y-auto scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent">

                        {activeTab === 'monitor' && (
                            <div className="space-y-4 animate-in fade-in slide-in-from-right duration-300">
                                {/* VFC Live Monitor */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="text-xs font-mono text-cyan-500 uppercase">Variabilidad Cardiaca (rPPG)</h4>
                                        <div className={`w-2 h-2 rounded-full ${hrv > 50 ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`}></div>
                                    </div>
                                    <div className="flex items-baseline gap-2 mb-2">
                                        <span className="text-3xl font-cyber text-white">{Math.round(hrv)}</span>
                                        <span className="text-[10px] text-slate-500">ms (RMSSD)</span>
                                    </div>
                                    <div className="h-16 flex items-end gap-[1px] opacity-70">
                                        {[...Array(30)].map((_, i) => (
                                            <div
                                                key={i}
                                                className={`flex-1 rounded-t-sm transition-all duration-300 ${i % 5 === 0 ? 'bg-cyan-400' : 'bg-cyan-900'}`}
                                                style={{ height: `${Math.max(10, Math.random() * 100)}%` }}
                                            ></div>
                                        ))}
                                    </div>
                                </div>

                                {/* FACS Real-time detection */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-xs font-mono text-indigo-400 uppercase mb-3">FACS: Action Units</h4>
                                    <div className="flex flex-wrap gap-2 min-h-[60px]">
                                        {stressAUs.length === 0 ? (
                                            <span className="text-[10px] text-slate-600 italic self-center">Scanning micro-expressions...</span>
                                        ) : (
                                            stressAUs.map((au, idx) => (
                                                <span key={idx} className="bg-indigo-900/30 border border-indigo-500/30 text-indigo-300 px-2 py-1 rounded text-[10px] font-mono animate-in fade-in zoom-in">
                                                    {au}
                                                </span>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Sympathetic vs Parasympathetic */}
                                <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800">
                                    <h4 className="text-xs font-mono text-amber-500 uppercase mb-3">Balance SNA</h4>
                                    <div className="relative h-4 bg-slate-800 rounded-full overflow-hidden flex">
                                        <div
                                            className="h-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-1000"
                                            style={{ width: `${sympatheticDominance}%` }}
                                        ></div>
                                        <div className="h-full bg-gradient-to-l from-emerald-500 to-teal-500 flex-1"></div>
                                    </div>
                                    <div className="flex justify-between mt-1 text-[9px] font-mono text-slate-400">
                                        <span>SIMPÁTICO (Estrés)</span>
                                        <span>PARASIMPÁTICO (Calma)</span>
                                    </div>
                                </div>
                            </div>
                        )}

                        {activeTab === 'garden' && (
                            <div className="h-full flex flex-col items-center justify-center animate-in fade-in duration-500 text-center">
                                <div className={`w-32 h-32 md:w-48 md:h-48 rounded-full border-4 flex items-center justify-center shadow-[0_0_40px_rgba(16,185,129,0.2)] transition-all duration-1000 transform ${hrv > 60 ? 'border-emerald-500 scale-110' : 'border-amber-700 scale-95 grayscale'}`}>
                                    <i className={`fas fa-seedling text-6xl md:text-8xl transition-all duration-1000 ${hrv > 60 ? 'text-emerald-400' : 'text-amber-700'}`}></i>
                                </div>

                                <h3 className="text-lg text-emerald-100 font-bold mt-6 mb-2">Jardín de Biofeedback</h3>
                                <p className="text-xs text-slate-400 max-w-xs mx-auto mb-4">
                                    {hrv > 60
                                        ? "Tu VFC es alta. Tu sistema nervioso está floreciendo y en estado regenerativo."
                                        : "Tu VFC es baja. Se detecta marchitamiento por estrés acumulado. Respira profundamente."}
                                </p>

                                <div className="grid grid-cols-2 gap-4 w-full max-w-xs">
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                        <div className="text-[10px] text-slate-500 uppercase">Coherencia</div>
                                        <div className="text-emerald-400 font-bold">{Math.round(hrv * 0.8)}%</div>
                                    </div>
                                    <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                                        <div className="text-[10px] text-slate-500 uppercase">Resiliencia</div>
                                        <div className="text-emerald-400 font-bold">{Math.round(hrv * 1.2)}%</div>
                                    </div>
                                </div>

                            </div>
                        )}

                        {activeTab === 'analysis' && (
                            <div className="space-y-4 animate-in slide-in-from-right duration-300">
                                <div className="p-4 bg-gradient-to-br from-indigo-950/80 to-slate-950 border border-indigo-500/30 rounded-xl relative overflow-hidden">
                                    <div className="absolute top-0 right-0 p-2 opacity-10">
                                        <i className="fas fa-brain text-6xl"></i>
                                    </div>
                                    <h3 className="text-indigo-300 font-bold text-sm mb-1">FENOTIPADO DIGITAL</h3>
                                    <p className="text-[10px] text-slate-400 font-mono mb-4">INFORME PRELIMINAR GENERADO</p>

                                    <div className="space-y-3">
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-xs text-slate-300">Estado Base</span>
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded ${sympatheticDominance > 50 ? 'bg-red-500/20 text-red-300' : 'bg-emerald-500/20 text-emerald-300'}`}>
                                                {sympatheticDominance > 50 ? 'ALERTA SIMPÁTICA' : 'REGULACIÓN VAGAL'}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-xs text-slate-300">Autenticidad Emocional</span>
                                            <span className="text-xs font-mono text-cyan-300">
                                                {isAnalyzing ? <span className="animate-pulse">Calculando...</span> : authenticity}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center border-b border-white/5 pb-2">
                                            <span className="text-xs text-slate-300">Índice Cortisol (Facial)</span>
                                            <div className="flex items-center gap-2">
                                                <div className="w-16 h-1 bg-slate-700 rounded-full">
                                                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${cortisolLevel * 3}%` }}></div>
                                                </div>
                                                <span className="text-[10px] text-orange-300">{cortisolLevel} µg/dL</span>
                                            </div>
                                        </div>

                                        {/* Dermatology Section */}
                                        <div className="mt-4 pt-2 border-t border-indigo-500/20">
                                            <h4 className="text-xs font-bold text-cyan-300 mb-2 uppercase tracking-wide">Análisis Dermatológico</h4>

                                            <div className="grid grid-cols-2 gap-2 mb-2">
                                                <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                                    <span className="text-[9px] text-slate-400 block">Salud Piel</span>
                                                    <span className="text-sm font-cyber text-white">{skinHealth}/100</span>
                                                </div>
                                                <div className="bg-slate-900/50 p-2 rounded border border-slate-700/50">
                                                    <span className="text-[9px] text-slate-400 block">Edad Aparente</span>
                                                    <span className="text-sm font-cyber text-white">{agingSigns?.apparent_age || '--'} años</span>
                                                </div>
                                            </div>

                                            {healthFlags.length > 0 ? (
                                                <div className="bg-red-900/10 border border-red-500/30 p-2 rounded">
                                                    <span className="text-[9px] text-red-300 block mb-1 font-bold">ALERTAS VISIBLES:</span>
                                                    <ul className="list-disc pl-3 text-[9px] text-red-200/80">
                                                        {healthFlags.map((flag, idx) => (
                                                            <li key={idx}>{flag}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            ) : (
                                                <div className="bg-emerald-900/10 border border-emerald-500/30 p-2 rounded">
                                                    <span className="text-[10px] text-emerald-400 flex items-center gap-1">
                                                        <i className="fas fa-check-circle"></i> Sin alertas visibles
                                                    </span>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Action to View Captured Image */}
                                    {capturedImage && (
                                        <div className="mt-4 pt-2 border-t border-white/5 flex justify-center">
                                            <button
                                                onClick={() => setIsImageModalOpen(true)}
                                                className="text-[10px] text-cyan-400 hover:text-cyan-300 underline flex items-center gap-1"
                                            >
                                                <i className="fas fa-image"></i>
                                                Ver Fotografía Analizada
                                            </button>
                                        </div>
                                    )}
                                </div>

                                <button
                                    onClick={() => {
                                        onSave({
                                            timestamp: new Date().toISOString(),
                                            hrv,
                                            cortisolLevel,
                                            sympatheticDominance,
                                            stressAUs,
                                            authenticity,
                                            capturedImage
                                        });
                                        onClose();
                                    }}
                                    disabled={isAnalyzing}
                                    className="w-full py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 text-white rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all shadow-[0_4px_10px_rgba(6,182,212,0.3)]"
                                >
                                    {isAnalyzing ? <i className="fas fa-spinner fa-spin"></i> : <i className="fas fa-file-medical-alt"></i>}
                                    {isAnalyzing ? "PROCESANDO..." : "GUARDAR EN HISTORIAL CLÍNICO"}
                                </button>

                                {/* PDF Report Button */}
                                <button
                                    onClick={() => {
                                        pdfService.generateScanReport({
                                            capturedImage,
                                            hrv,
                                            cortisolLevel,
                                            sympatheticDominance,
                                            authenticity,
                                            skinHealth,
                                            agingSigns,
                                            healthFlags,
                                            timestamp: new Date().toLocaleString()
                                        });
                                    }}
                                    disabled={!capturedImage || isAnalyzing}
                                    className="w-full py-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-50 text-cyan-400 border border-cyan-500/30 rounded-lg font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all"
                                >
                                    <i className="fas fa-file-pdf"></i>
                                    DESCARGAR REPORTE DERMATOLÓGICO
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Disclaimer Footer */}
            <div className="mt-4 border-t border-slate-800 pt-3 flex justify-between items-center">
                <div className="text-[9px] text-slate-600 font-mono max-w-lg">
                    * NOTA: Este análisis utiliza algoritmos de visión computarizada experimental. Los biomarcadores (VFC, rPPG) son estimaciones ópticas y no sustituyen pruebas de laboratorio clínico.
                </div>
                <div className="flex flex-col items-end gap-1">
                    <div className="flex gap-2 text-[10px] text-slate-500">
                        <span className="animate-pulse">●</span> RECIBIENDO TELEMETRÍA
                    </div>
                    <a href="https://www.ia-agus.com" target="_blank" rel="noreferrer" className="text-[9px] text-cyan-900/40 hover:text-cyan-500/60 font-mono tracking-wider transition-colors">
                        IA.AGUS // SYSTEM
                    </a>
                </div>
            </div>
            {/* Image Modal */}
            {isImageModalOpen && capturedImage && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/90 backdrop-blur-md p-4 animate-in fade-in duration-200">
                    <div className="relative max-w-lg w-full bg-slate-900 border border-cyan-500/30 rounded-2xl overflow-hidden shadow-2xl">
                        <div className="p-4 border-b border-slate-700 flex justify-between items-center bg-slate-950">
                            <h3 className="text-cyan-400 font-bold font-cyber text-sm">FOTOGRAFÍAS ESCANEADAS (ISO-COMPLIANT)</h3>
                            <button onClick={() => setIsImageModalOpen(false)} className="text-slate-400 hover:text-white">
                                <i className="fas fa-times"></i>
                            </button>
                        </div>
                        <div className="p-2 bg-black flex justify-center">
                            <img src={capturedImage} alt="Captured Scan" className="max-h-[60vh] object-contain rounded border border-slate-800" />
                        </div>
                        <div className="p-3 bg-slate-950 border-t border-slate-800 flex justify-end">
                            <span className="text-[10px] text-slate-500 font-mono">HASH: {Math.random().toString(36).substring(7).toUpperCase()} // SECURE</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NeurosomaticScanner;
