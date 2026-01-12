
import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { pdfService } from '../services/pdfService';

interface Medication {
    id: string;
    name: string;
    dosage: string;
    frequency: string;
    duration: string;
}

interface PrescriptionGeneratorProps {
    onClose: () => void;
    onGenerate?: (data: any) => void;
}

const PrescriptionGenerator: React.FC<PrescriptionGeneratorProps> = ({ onClose, onGenerate }) => {
    const { t } = useLanguage();
    const [patientName, setPatientName] = useState('');
    const [diagnosis, setDiagnosis] = useState('');
    const [medications, setMedications] = useState<Medication[]>([]);
    const [instructions, setInstructions] = useState('');
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [formData, setFormData] = useState<any>(null);

    const [newMed, setNewMed] = useState({
        name: '',
        dosage: '',
        frequency: '',
        duration: ''
    });

    const handleAddMedication = () => {
        if (!newMed.name || !newMed.dosage) return;
        setMedications([
            ...medications,
            { ...newMed, id: Date.now().toString() }
        ]);
        setNewMed({ name: '', dosage: '', frequency: '', duration: '' });
    };

    const handleRemoveMedication = (id: string) => {
        setMedications(medications.filter(m => m.id !== id));
    };

    const handlePreview = (e: React.FormEvent) => {
        e.preventDefault();
        const data = {
            patientName,
            diagnosis,
            medications,
            instructions,
            date: new Date().toLocaleDateString()
        };
        setFormData(data);

        // Generate Blob URL for preview
        const blobUrl = pdfService.generatePrescription(data, true);
        setPreviewUrl(blobUrl as string);
    };

    const handleConfirmDownload = () => {
        if (formData) {
            pdfService.generatePrescription(formData, false); // Download
            if (onGenerate) onGenerate(formData);
            onClose(); // Close generator
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center">
                        <i className="fas fa-file-prescription text-cyan-400"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-cyber text-cyan-100 uppercase tracking-wider">Generador de Recetas</h2>
                        <p className="text-[10px] text-cyan-400/60 font-mono">RX SYSTEM // PDF</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 md:p-8">
                <form onSubmit={handlePreview} className="max-w-4xl mx-auto space-y-8">

                    {/* Patient Info */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <i className="fas fa-user-injured"></i> Datos del Paciente
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Nombre Completo</label>
                                <input
                                    type="text"
                                    required
                                    value={patientName}
                                    onChange={e => setPatientName(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ej. Juan Pérez"
                                />
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Diagnóstico (CIE-10 Opcional)</label>
                                <input
                                    type="text"
                                    value={diagnosis}
                                    onChange={e => setDiagnosis(e.target.value)}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ej. Rinofaringitis Aguda (J00)"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Medications */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <i className="fas fa-pills"></i> Medicamentos
                        </h3>

                        {/* Add Med Form */}
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-end mb-6 bg-slate-800/30 p-4 rounded-lg border border-slate-700/50">
                            <div className="md:col-span-4">
                                <label className="block text-[10px] text-slate-500 mb-1">Medicamento (Sustancia/Comercial)</label>
                                <input
                                    type="text"
                                    value={newMed.name}
                                    onChange={e => setNewMed({ ...newMed, name: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ej. Paracetamol"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] text-slate-500 mb-1">Dosis</label>
                                <input
                                    type="text"
                                    value={newMed.dosage}
                                    onChange={e => setNewMed({ ...newMed, dosage: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ej. 500mg"
                                />
                            </div>
                            <div className="md:col-span-3">
                                <label className="block text-[10px] text-slate-500 mb-1">Frecuencia</label>
                                <input
                                    type="text"
                                    value={newMed.frequency}
                                    onChange={e => setNewMed({ ...newMed, frequency: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ej. C/8 horas"
                                />
                            </div>
                            <div className="md:col-span-2">
                                <label className="block text-[10px] text-slate-500 mb-1">Duración</label>
                                <input
                                    type="text"
                                    value={newMed.duration}
                                    onChange={e => setNewMed({ ...newMed, duration: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-sm text-white focus:border-cyan-500 outline-none"
                                    placeholder="Ej. 5 días"
                                />
                            </div>
                            <div className="md:col-span-1">
                                <button
                                    type="button"
                                    onClick={handleAddMedication}
                                    className="w-full bg-cyan-600 hover:bg-cyan-500 text-white p-2 rounded text-sm transition-colors"
                                >
                                    <i className="fas fa-plus"></i>
                                </button>
                            </div>
                        </div>

                        {/* Meds List */}
                        {medications.length > 0 ? (
                            <div className="space-y-2">
                                {medications.map((med, idx) => (
                                    <div key={med.id} className="flex items-center justify-between bg-slate-950 p-3 rounded border border-slate-800">
                                        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm">
                                            <span className="text-white font-medium"><span className="text-cyan-500 mr-2">{idx + 1}.</span>{med.name}</span>
                                            <span className="text-slate-400">{med.dosage}</span>
                                            <span className="text-slate-400">{med.frequency}</span>
                                            <span className="text-slate-400">{med.duration}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveMedication(med.id)}
                                            className="text-red-500 hover:text-red-400 ml-4"
                                        >
                                            <i className="fas fa-trash"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-slate-600 text-sm italic">
                                No hay medicamentos agregados aún.
                            </div>
                        )}
                    </div>

                    {/* Instructions */}
                    <div className="bg-slate-900/50 border border-slate-800 rounded-xl p-6">
                        <h3 className="text-sm font-bold text-cyan-400 mb-4 uppercase tracking-wider flex items-center gap-2">
                            <i className="fas fa-clipboard-list"></i> Indicaciones Generales
                        </h3>
                        <textarea
                            value={instructions}
                            onChange={e => setInstructions(e.target.value)}
                            className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none h-32 resize-none"
                            placeholder="Dieta, cuidados generales, próximas citas, etc..."
                        />
                    </div>

                    {/* Actions */}
                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={medications.length === 0 || !patientName}
                            className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-bold tracking-wide shadow-lg shadow-emerald-500/20 flex items-center gap-2 transition-all hover:scale-105"
                        >
                            <i className="fas fa-print"></i>
                            EMITIR RECETA PDF
                        </button>
                    </div>

                </form>

                {/* PDF Preview Modal */}
                {previewUrl && (
                    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 animate-in fade-in duration-300">
                        <div className="flex flex-col w-full max-w-5xl h-[90vh] bg-slate-900 rounded-2xl border border-cyan-500/30 overflow-hidden shadow-2xl">
                            <div className="p-4 bg-slate-950 border-b border-cyan-500/20 flex justify-between items-center">
                                <h3 className="text-cyan-400 font-bold font-cyber">VISTA PRELIMINAR (COMPLIANCE CHECK)</h3>
                                <button onClick={() => setPreviewUrl(null)} className="text-slate-400 hover:text-white">
                                    <i className="fas fa-times"></i>
                                </button>
                            </div>

                            <div className="flex-1 bg-white relative">
                                <iframe
                                    src={previewUrl}
                                    className="w-full h-full"
                                    title="Prescription Preview"
                                />
                            </div>

                            <div className="p-4 bg-slate-950 border-t border-cyan-500/20 flex justify-end gap-4">
                                <button
                                    onClick={() => setPreviewUrl(null)}
                                    className="px-6 py-2 rounded-lg text-slate-400 hover:text-white border border-slate-700 hover:border-slate-500 transition-colors"
                                >
                                    CANCELAR
                                </button>
                                <button
                                    onClick={handleConfirmDownload}
                                    className="px-8 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold shadow-lg shadow-emerald-500/20 animate-pulse"
                                >
                                    <i className="fas fa-file-pdf mr-2"></i>
                                    CONFIRMAR Y DESCARGAR
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                <div className="mt-12 text-center border-t border-slate-800/50 pt-6">
                    <p className="text-[10px] text-slate-600 font-mono tracking-widest mb-1">
                        SISTEMA DESARROLLADO POR <span className="text-cyan-500 font-bold">IA.AGUS</span>
                    </p>
                    <a href="https://www.ia-agus.com" target="_blank" rel="noreferrer" className="text-[9px] text-slate-700 hover:text-cyan-400 font-cyber tracking-wider">
                        WWW.IA-AGUS.COM
                    </a>
                </div>
            </div>
        </div>
    );
};

export default PrescriptionGenerator;
