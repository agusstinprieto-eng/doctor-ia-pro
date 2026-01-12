import React, { useState } from 'react';
import { Save, AlertCircle, Check, FileText } from 'lucide-react';

// Types representing tooth status
type ToothStatus = 'healthy' | 'caries' | 'extraction' | 'endodontics' | 'crown';

interface ToothData {
    id: number;
    number: number; // ISO 3950 numbering
    status: ToothStatus;
    notes: string;
}

const INITIAL_TEETH: ToothData[] = [
    // Upper Right (Quadrant 1)
    { id: 18, number: 18, status: 'healthy', notes: '' },
    { id: 17, number: 17, status: 'healthy', notes: '' },
    { id: 16, number: 16, status: 'healthy', notes: '' },
    { id: 15, number: 15, status: 'healthy', notes: '' },
    { id: 14, number: 14, status: 'healthy', notes: '' },
    { id: 13, number: 13, status: 'healthy', notes: '' },
    { id: 12, number: 12, status: 'healthy', notes: '' },
    { id: 11, number: 11, status: 'healthy', notes: '' },
    // Upper Left (Quadrant 2)
    { id: 21, number: 21, status: 'healthy', notes: '' },
    { id: 22, number: 22, status: 'healthy', notes: '' },
    { id: 23, number: 23, status: 'healthy', notes: '' },
    { id: 24, number: 24, status: 'healthy', notes: '' },
    { id: 25, number: 25, status: 'healthy', notes: '' },
    { id: 26, number: 26, status: 'healthy', notes: '' },
    { id: 27, number: 27, status: 'healthy', notes: '' },
    { id: 28, number: 28, status: 'healthy', notes: '' },
    // Lower Left (Quadrant 3)
    { id: 38, number: 38, status: 'healthy', notes: '' },
    { id: 37, number: 37, status: 'healthy', notes: '' },
    { id: 36, number: 36, status: 'healthy', notes: '' },
    { id: 35, number: 35, status: 'healthy', notes: '' },
    { id: 34, number: 34, status: 'healthy', notes: '' },
    { id: 33, number: 33, status: 'healthy', notes: '' },
    { id: 32, number: 32, status: 'healthy', notes: '' },
    { id: 31, number: 31, status: 'healthy', notes: '' },
    // Lower Right (Quadrant 4)
    { id: 41, number: 41, status: 'healthy', notes: '' },
    { id: 42, number: 42, status: 'healthy', notes: '' },
    { id: 43, number: 43, status: 'healthy', notes: '' },
    { id: 44, number: 44, status: 'healthy', notes: '' },
    { id: 45, number: 45, status: 'healthy', notes: '' },
    { id: 46, number: 46, status: 'healthy', notes: '' },
    { id: 47, number: 47, status: 'healthy', notes: '' },
    { id: 48, number: 48, status: 'healthy', notes: '' },
];

export function DentalModule() {
    const [teeth, setTeeth] = useState<ToothData[]>(INITIAL_TEETH);
    const [selectedTool, setSelectedTool] = useState<ToothStatus>('healthy');
    const [selectedTooth, setSelectedTooth] = useState<ToothData | null>(null);
    const [isSaving, setIsSaving] = useState(false);

    const handleToothClick = (tooth: ToothData) => {
        // If just selecting to view notes vs applying tool
        if (selectedTool === 'healthy' && tooth.status === 'healthy') {
            setSelectedTooth(tooth);
            return;
        }

        // Apply selected tool
        const updatedTeeth = teeth.map(t =>
            t.id === tooth.id ? { ...t, status: selectedTool } : t
        );
        setTeeth(updatedTeeth);

        // Also select it for details
        const updatedTooth = updatedTeeth.find(t => t.id === tooth.id);
        if (updatedTooth) setSelectedTooth(updatedTooth);
    };

    const handleNoteChange = (note: string) => {
        if (!selectedTooth) return;
        const updatedTeeth = teeth.map(t =>
            t.id === selectedTooth.id ? { ...t, notes: note } : t
        );
        setTeeth(updatedTeeth);
        setSelectedTooth({ ...selectedTooth, notes: note });
    };

    const getToothColor = (status: ToothStatus) => {
        switch (status) {
            case 'caries': return 'bg-red-500 border-red-400';
            case 'extraction': return 'bg-slate-700 border-slate-600 opacity-50'; // Missing
            case 'endodontics': return 'bg-blue-500 border-blue-400';
            case 'crown': return 'bg-yellow-500 border-yellow-400';
            case 'healthy':
            default: return 'bg-white border-slate-300';
        }
    };

    const renderQuadrant = (start: number, end: number, reverse = false) => {
        // Filter teeth belonging to this quadrant logic (based on ISO ID ranges roughly)
        // 11-18, 21-28, 31-38, 41-48
        // Helper to just slice array for simplicity based on provided order in INITIAL_TEETH
        let quadrantTeeth: ToothData[] = [];

        if (start === 18) quadrantTeeth = teeth.slice(0, 8); // Q1
        else if (start === 21) quadrantTeeth = teeth.slice(8, 16); // Q2
        else if (start === 38) quadrantTeeth = teeth.slice(16, 24); // Q3 backwards in ISO visual?
        else if (start === 41) quadrantTeeth = teeth.slice(24, 32); // Q4

        // ISO visual chart: 
        // 18 17 16 ... 11 | 21 ... 26 27 28
        // ---------------------------------
        // 48 47 46 ... 41 | 31 ... 36 37 38

        // Actually let's just filter by ID ranges for robustness
        if (start === 10) quadrantTeeth = teeth.filter(t => t.id >= 11 && t.id <= 18).sort((a, b) => b.id - a.id); // 18-11
        else if (start === 20) quadrantTeeth = teeth.filter(t => t.id >= 21 && t.id <= 28).sort((a, b) => a.id - b.id); // 21-28
        else if (start === 30) quadrantTeeth = teeth.filter(t => t.id >= 31 && t.id <= 38).sort((a, b) => a.id - b.id); // 31-38 left side? No, standard chart is Right | Left
        else if (start === 40) quadrantTeeth = teeth.filter(t => t.id >= 41 && t.id <= 48).sort((a, b) => b.id - a.id); // 48-41

        // Visualize:
        // Q1 (Right Upper) | Q2 (Left Upper)
        // 18 .. 11         | 21 .. 28 

        // Q4 (Right Lower) | Q3 (Left Lower)
        // 48 .. 41         | 31 .. 38

        return (
            <div className="flex gap-2">
                {quadrantTeeth.map(tooth => (
                    <div key={tooth.id} className="flex flex-col items-center gap-1 group">
                        <span className="text-[10px] text-slate-500 font-mono">{tooth.number}</span>
                        <button
                            onClick={() => handleToothClick(tooth)}
                            className={`w-8 h-10 md:w-10 md:h-12 rounded-t-sm rounded-b-[1rem] border-2 transition-all shadow-sm ${getToothColor(tooth.status)} ${selectedTooth?.id === tooth.id ? 'ring-2 ring-cyan-400 ring-offset-2 ring-offset-slate-900' : 'hover:scale-105'}`}
                            title={`Diente ${tooth.number} - ${tooth.status}`}
                        >
                            {tooth.status === 'extraction' && <span className="text-white font-bold text-xs">X</span>}
                        </button>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-6 overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 text-cyan-400">
                            🦷
                        </span>
                        Odontología Digital
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Odontograma interactivo y plan de tratamiento</p>
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                    <Save size={16} />
                    Guardar Cambios
                </button>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">

                {/* Main Work Area - Odontogram */}
                <div className="lg:col-span-2 bg-slate-900/50 border border-slate-800 rounded-2xl p-8 relative">

                    {/* Toolbar */}
                    <div className="absolute top-4 left-0 right-0 flex justify-center gap-3 px-4">
                        <ToolBtn label="Sano" status="healthy" current={selectedTool} set={setSelectedTool} color="bg-white" />
                        <ToolBtn label="Caries" status="caries" current={selectedTool} set={setSelectedTool} color="bg-red-500" />
                        <ToolBtn label="Extracción" status="extraction" current={selectedTool} set={setSelectedTool} color="bg-slate-700" />
                        <ToolBtn label="Endodoncia" status="endodontics" current={selectedTool} set={setSelectedTool} color="bg-blue-500" />
                        <ToolBtn label="Corona" status="crown" current={selectedTool} set={setSelectedTool} color="bg-yellow-500" />
                    </div>

                    <div className="mt-20 flex flex-col items-center gap-12">

                        {/* Upper Jaw */}
                        <div className="relative">
                            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest">Maxilar Superior</div>
                            <div className="flex gap-8 pb-4 border-b border-slate-700/30">
                                {/* Q1: 18-11 */}
                                {renderQuadrant(10, 0)}
                                {/* Q2: 21-28 */}
                                {renderQuadrant(20, 0)}
                            </div>
                        </div>

                        {/* Lower Jaw */}
                        <div className="relative">
                            <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs font-bold text-slate-500 uppercase tracking-widest">Mandíbula Inferior</div>
                            <div className="flex gap-8 pt-4 border-t border-slate-700/30">
                                {/* Q4: 48-41 */}
                                {renderQuadrant(40, 0)}
                                {/* Q3: 31-38 */}
                                {renderQuadrant(30, 0)}
                            </div>
                        </div>

                    </div>
                </div>

                {/* Sidebar Controls */}
                <div className="space-y-6">

                    {/* Tooth Detail */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <FileText size={18} className="text-cyan-400" />
                            Detalle del Diente {selectedTooth ? selectedTooth.number : '--'}
                        </h3>

                        {selectedTooth ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                        <span className="block text-slate-500 text-[10px] uppercase font-bold">Estado Actual</span>
                                        <span className="text-white font-medium capitalize block mt-1">{selectedTooth.status}</span>
                                    </div>
                                    <div className="bg-slate-950 p-3 rounded-lg border border-slate-800">
                                        <span className="block text-slate-500 text-[10px] uppercase font-bold">Cuadrante</span>
                                        <span className="text-white font-medium block mt-1">
                                            {Math.floor(selectedTooth.number / 10)}
                                        </span>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-slate-400 text-xs font-bold uppercase block mb-2">Notas Clínicas</label>
                                    <textarea
                                        className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-300 focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none resize-none h-32"
                                        placeholder="Escriba observaciones específicas..."
                                        value={selectedTooth.notes}
                                        onChange={(e) => handleNoteChange(e.target.value)}
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-10 text-slate-600 italic text-sm">
                                Seleccione un diente del odontograma para ver o editar detalles.
                            </div>
                        )}
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Resumen Paciente</h4>
                        <div className="space-y-2">
                            <StatRow label="Dientes Sanos" value={teeth.filter(t => t.status === 'healthy').length.toString()} color="text-white" />
                            <StatRow label="Caries Detectadas" value={teeth.filter(t => t.status === 'caries').length.toString()} color="text-red-400" />
                            <StatRow label="Piezas Tratadas" value={teeth.filter(t => ['endodontics', 'crown'].includes(t.status)).length.toString()} color="text-yellow-400" />
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
}

function ToolBtn({ label, status, current, set, color }: { label: string, status: ToothStatus, current: ToothStatus, set: (s: ToothStatus) => void, color: string }) {
    const isSelected = current === status;
    return (
        <button
            onClick={() => set(status)}
            className={`px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wide transition-all border ${isSelected ? 'border-cyan-400 bg-cyan-400/10 text-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.3)]' : 'border-transparent bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
        >
            <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${color}`}></span>
                {label}
            </div>
        </button>
    );
}

function StatRow({ label, value, color }: { label: string, value: string, color: string }) {
    return (
        <div className="flex justify-between items-center py-2 border-b border-slate-800/50 last:border-0">
            <span className="text-slate-400 text-sm">{label}</span>
            <span className={`font-mono font-bold ${color}`}>{value}</span>
        </div>
    );
}
