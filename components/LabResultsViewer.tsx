
import React, { useState } from 'react';

interface LabResult {
    parameter: string;
    value: number;
    unit: string;
    refRange: string;
    status: 'normal' | 'low' | 'high' | 'critical';
}

interface LabOrder {
    id: string;
    patientName: string;
    date: string;
    type: string;
    status: 'completed' | 'pending' | 'processing';
    results?: LabResult[];
}

interface LabResultsViewerProps {
    onClose: () => void;
}

const LabResultsViewer: React.FC<LabResultsViewerProps> = ({ onClose }) => {
    const [selectedOrder, setSelectedOrder] = useState<LabOrder | null>(null);

    // Mock Data
    const orders: LabOrder[] = [
        {
            id: 'L-2024-001',
            patientName: 'Carlos Ruiz',
            date: '12/01/2026',
            type: 'Biometría Hemática + QS',
            status: 'completed',
            results: [
                { parameter: 'Hemoglobina', value: 13.5, unit: 'g/dL', refRange: '13.0 - 17.0', status: 'normal' },
                { parameter: 'Leucocitos', value: 12500, unit: '/µL', refRange: '4,000 - 10,000', status: 'high' },
                { parameter: 'Plaquetas', value: 145000, unit: '/µL', refRange: '150,000 - 400,000', status: 'low' },
                { parameter: 'Glucosa', value: 105, unit: 'mg/dL', refRange: '70 - 100', status: 'high' },
                { parameter: 'Colesterol Total', value: 180, unit: 'mg/dL', refRange: '< 200', status: 'normal' },
            ]
        },
        {
            id: 'L-2024-002',
            patientName: 'Ana López',
            date: '10/01/2026',
            type: 'Perfil Hormonal',
            status: 'processing'
        },
        {
            id: 'L-2024-003',
            patientName: 'Roberto Gomez',
            date: '08/01/2026',
            type: 'Examen General de Orina',
            status: 'completed',
            results: [
                { parameter: 'Color', value: 0, unit: '', refRange: 'Amarillo', status: 'normal' }, // Value 0 placeholder for text
                { parameter: 'pH', value: 6.0, unit: '', refRange: '5.0 - 8.0', status: 'normal' },
                { parameter: 'Proteínas', value: 30, unit: 'mg/dL', refRange: 'Negativo', status: 'high' }
            ]
        }
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'normal': return 'text-emerald-400';
            case 'low': return 'text-yellow-400 font-bold';
            case 'high': return 'text-orange-500 font-bold';
            case 'critical': return 'text-red-500 font-bold animate-pulse';
            default: return 'text-slate-400';
        }
    };

    const renderStatusBadge = (status: string) => {
        const styles = {
            completed: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
            pending: 'bg-yellow-500/10 text-yellow-400 border-yellow-500/30',
            processing: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
        };
        return (
            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase tracking-wider ${styles[status as keyof typeof styles]}`}>
                {status}
            </span>
        );
    };

    return (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center">
                        <i className="fas fa-microscope text-cyan-400"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-cyber text-cyan-100 uppercase tracking-wider">Laboratorio Clínico</h2>
                        <p className="text-[10px] text-cyan-400/60 font-mono">RESULTS INTERFACE // LIS</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                >
                    <i className="fas fa-times"></i>
                </button>
            </div>

            <div className="flex-1 overflow-hidden flex flex-col md:flex-row">

                {/* Left Panel: Orders List */}
                <div className="w-full md:w-80 border-r border-slate-800 bg-slate-900/30 overflow-y-auto">
                    <div className="p-4">
                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Órdenes Recientes</h3>
                        <div className="space-y-2">
                            {orders.map(order => (
                                <div
                                    key={order.id}
                                    onClick={() => setSelectedOrder(order)}
                                    className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedOrder?.id === order.id
                                            ? 'bg-cyan-950/50 border-cyan-500/50 shadow-[0_0_15px_rgba(8,145,178,0.1)]'
                                            : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                                        }`}
                                >
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="font-bold text-slate-200 text-sm">{order.patientName}</span>
                                        <span className="text-[10px] text-slate-500 font-mono">{order.date}</span>
                                    </div>
                                    <div className="text-xs text-cyan-400 mb-2">{order.type}</div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-[10px] text-slate-600 font-mono">{order.id}</span>
                                        {renderStatusBadge(order.status)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Right Panel: Results Details */}
                <div className="flex-1 overflow-y-auto p-4 md:p-8 bg-slate-950">
                    {selectedOrder ? (
                        <div className="max-w-3xl mx-auto animate-in fade-in duration-300">

                            {/* Report Header */}
                            <div className="bg-slate-900 border border-slate-800 rounded-t-xl p-6 flex justify-between items-start mb-6">
                                <div>
                                    <h2 className="text-2xl font-bold text-white mb-1">{selectedOrder.patientName}</h2>
                                    <div className="flex gap-4 text-sm text-slate-400">
                                        <span><i className="fas fa-id-card mr-2"></i>Folio: {selectedOrder.id}</span>
                                        <span><i className="far fa-calendar mr-2"></i>{selectedOrder.date}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-lg font-bold text-cyan-400">{selectedOrder.type}</div>
                                    {renderStatusBadge(selectedOrder.status)}
                                </div>
                            </div>

                            {/* Results Table */}
                            {selectedOrder.status === 'completed' && selectedOrder.results ? (
                                <div className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-slate-950 text-slate-500 font-mono uppercase text-xs">
                                            <tr>
                                                <th className="p-4 font-medium">Parámetro</th>
                                                <th className="p-4 font-medium">Resultado</th>
                                                <th className="p-4 font-medium">Referencia</th>
                                                <th className="p-4 font-medium text-right">Estado</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800">
                                            {selectedOrder.results.map((result, idx) => (
                                                <tr key={idx} className="hover:bg-slate-800/30 transition-colors">
                                                    <td className="p-4 text-white font-medium">{result.parameter}</td>
                                                    <td className={`p-4 ${getStatusColor(result.status)}`}>
                                                        {result.value === 0 && result.unit === '' ? result.refRange : `${result.value} ${result.unit}`}
                                                    </td>
                                                    <td className="p-4 text-slate-400 font-mono text-xs">{result.refRange}</td>
                                                    <td className="p-4 text-right">
                                                        {result.status !== 'normal' && (
                                                            <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${result.status === 'high' ? 'bg-orange-500/10 text-orange-400' :
                                                                    result.status === 'low' ? 'bg-yellow-500/10 text-yellow-400' : 'bg-red-500/10 text-red-500'
                                                                }`}>
                                                                <i className="fas fa-exclamation-circle text-[9px]"></i>
                                                                {result.status}
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                    <div className="p-4 bg-slate-950/50 text-[10px] text-slate-500 border-t border-slate-800 text-center">
                                        VALIDADO POR: SISTEMA LIS CENTRAL // FECHA DE IMPRESIÓN: {new Date().toLocaleDateString()}
                                    </div>
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center p-12 border-2 border-dashed border-slate-800 rounded-xl bg-slate-900/20 text-slate-500">
                                    <i className="fas fa-flask text-4xl mb-4 opacity-50"></i>
                                    <p>Resultados en proceso o no disponibles.</p>
                                    <p className="text-xs mt-2">Tiempo estimado: 24h</p>
                                </div>
                            )}

                        </div>
                    ) : (
                        <div className="h-full flex flex-col items-center justify-center text-slate-600">
                            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center mb-4">
                                <i className="fas fa-arrow-left text-xl"></i>
                            </div>
                            <p>Selecciona una orden del panel izquierdo</p>
                            <p className="text-sm">para ver los detalles clínicos.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default LabResultsViewer;
