
import React, { useState } from 'react';

interface TestRecord {
    id: string;
    employeeId: string;
    employeeName: string;
    date: string;
    panel: '5-Panel' | '10-Panel' | 'Alcohol';
    result: 'Negativo' | 'Positivo' | 'Pendiente';
    substances?: string[]; // If positive, which ones
}

interface AntidopingDashboardProps {
    onClose: () => void;
}

const AntidopingDashboard: React.FC<AntidopingDashboardProps> = ({ onClose }) => {
    const [activeTab, setActiveTab] = useState<'overview' | 'register'>('overview');

    // Mock Data
    const [records, setRecords] = useState<TestRecord[]>([
        { id: '1', employeeId: 'EMP-004', employeeName: 'Carlos Ruiz', date: '2024-03-10', panel: '5-Panel', result: 'Negativo' },
        { id: '2', employeeId: 'EMP-012', employeeName: 'Ana López', date: '2024-03-11', panel: '10-Panel', result: 'Positivo', substances: ['THC'] },
        { id: '3', employeeId: 'EMP-007', employeeName: 'Juan Pérez', date: '2024-03-11', panel: 'Alcohol', result: 'Negativo' },
    ]);

    // Form State
    const [newTest, setNewTest] = useState({
        employeeId: '',
        employeeName: '',
        panel: '5-Panel',
        substances: [] as string[]
    });

    const handleRegister = (e: React.FormEvent) => {
        e.preventDefault();
        const isPositive = newTest.substances.length > 0;

        const record: TestRecord = {
            id: Date.now().toString(),
            employeeId: newTest.employeeId,
            employeeName: newTest.employeeName,
            date: new Date().toISOString().split('T')[0],
            panel: newTest.panel as any,
            result: isPositive ? 'Positivo' : 'Negativo',
            substances: newTest.substances
        };

        setRecords([record, ...records]);
        setActiveTab('overview');
        // Reset form
        setNewTest({ employeeId: '', employeeName: '', panel: '5-Panel', substances: [] });
    };

    const toggleSubstance = (sub: string) => {
        if (newTest.substances.includes(sub)) {
            setNewTest({ ...newTest, substances: newTest.substances.filter(s => s !== sub) });
        } else {
            setNewTest({ ...newTest, substances: [...newTest.substances, sub] });
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-4 border-b border-indigo-500/20 bg-indigo-950/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/50 flex items-center justify-center">
                        <i className="fas fa-flask text-indigo-400"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-cyber text-indigo-100 uppercase tracking-wider">Salud Ocupacional</h2>
                        <p className="text-[10px] text-indigo-400/60 font-mono">MÓDULO DE TOXICOLOGÍA // EMPRESARIAL</p>
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
                {/* Sidebar Nav */}
                <div className="w-full md:w-64 bg-slate-900/50 border-r border-indigo-500/10 p-4 flex flex-col gap-2">
                    <button
                        onClick={() => setActiveTab('overview')}
                        className={`p-3 rounded-lg text-left transition-all flex items-center gap-3 ${activeTab === 'overview' ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
                            }`}
                    >
                        <i className="fas fa-chart-pie w-5"></i>
                        Dashboard
                    </button>
                    <button
                        onClick={() => setActiveTab('register')}
                        className={`p-3 rounded-lg text-left transition-all flex items-center gap-3 ${activeTab === 'register' ? 'bg-indigo-600/20 text-indigo-200 border border-indigo-500/30' : 'text-slate-400 hover:bg-white/5'
                            }`}
                    >
                        <i className="fas fa-plus-circle w-5"></i>
                        Nueva Prueba
                    </button>
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">

                    {activeTab === 'overview' && (
                        <div className="space-y-6">
                            {/* KPIs */}
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
                                    <span className="text-xs text-slate-500 uppercase">Total Pruebas</span>
                                    <div className="text-2xl font-bold text-white mt-1">{records.length}</div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-emerald-900/50">
                                    <span className="text-xs text-emerald-500 uppercase">Negativos</span>
                                    <div className="text-2xl font-bold text-emerald-400 mt-1">
                                        {records.filter(r => r.result === 'Negativo').length}
                                    </div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-red-900/50">
                                    <span className="text-xs text-red-500 uppercase">Positivos</span>
                                    <div className="text-2xl font-bold text-red-400 mt-1">
                                        {records.filter(r => r.result === 'Positivo').length}
                                    </div>
                                </div>
                                <div className="bg-slate-900 p-4 rounded-xl border border-amber-900/50">
                                    <span className="text-xs text-amber-500 uppercase">Pendientes</span>
                                    <div className="text-2xl font-bold text-amber-400 mt-1">
                                        {records.filter(r => r.result === 'Pendiente').length}
                                    </div>
                                </div>
                            </div>

                            {/* Table */}
                            <div className="bg-slate-900/50 rounded-xl border border-slate-800 overflow-hidden">
                                <table className="w-full text-sm text-left">
                                    <thead className="text-xs text-slate-400 uppercase bg-slate-900/80 border-b border-slate-700">
                                        <tr>
                                            <th className="px-6 py-3">Empleado</th>
                                            <th className="px-6 py-3">Fecha</th>
                                            <th className="px-6 py-3">Panel</th>
                                            <th className="px-6 py-3">Resultado</th>
                                            <th className="px-6 py-3">Sustancias</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-800">
                                        {records.map(record => (
                                            <tr key={record.id} className="hover:bg-slate-800/50 transition-colors">
                                                <td className="px-6 py-4 font-medium text-white">
                                                    <div className="flex flex-col">
                                                        <span>{record.employeeName}</span>
                                                        <span className="text-[10px] text-slate-500 font-mono">{record.employeeId}</span>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 text-slate-400">{record.date}</td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-slate-800 text-slate-300 px-2 py-1 rounded text-xs border border-slate-600">
                                                        {record.panel}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${record.result === 'Negativo' ? 'bg-emerald-950 text-emerald-400 border border-emerald-900' :
                                                            record.result === 'Positivo' ? 'bg-red-950 text-red-400 border border-red-900' :
                                                                'bg-amber-950 text-amber-400 border border-amber-900'
                                                        }`}>
                                                        {record.result}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 text-xs font-mono text-red-300">
                                                    {record.substances?.join(', ') || '-'}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {activeTab === 'register' && (
                        <div className="max-w-2xl mx-auto bg-slate-900 border border-slate-800 rounded-xl p-8">
                            <h3 className="text-lg font-bold text-white mb-6 border-b border-slate-800 pb-2">Registrar Nueva Prueba</h3>

                            <form onSubmit={handleRegister} className="space-y-6">
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">ID Empleado</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTest.employeeId}
                                            onChange={e => setNewTest({ ...newTest, employeeId: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-slate-400 mb-1">Nombre Completo</label>
                                        <input
                                            type="text"
                                            required
                                            value={newTest.employeeName}
                                            onChange={e => setNewTest({ ...newTest, employeeName: e.target.value })}
                                            className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Tipo de Panel</label>
                                    <select
                                        value={newTest.panel}
                                        onChange={e => setNewTest({ ...newTest, panel: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white focus:border-indigo-500 outline-none"
                                    >
                                        <option>5-Panel</option>
                                        <option>10-Panel</option>
                                        <option>Alcohol</option>
                                    </select>
                                </div>

                                <div className="bg-slate-950/50 p-4 rounded border border-slate-800">
                                    <label className="block text-xs text-slate-400 mb-3 uppercase tracking-wider">Detección de Sustancias (Marcar si es positivo)</label>
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                        {['THC (Marihuana)', 'COC (Cocaína)', 'AMP (Anfetaminas)', 'OPI (Opiáceos)', 'PCP (Fenciclidina)', 'MET (Metanfetaminas)'].map(drug => (
                                            <label key={drug} className="flex items-center gap-3 p-2 rounded hover:bg-slate-900 cursor-pointer border border-transparent hover:border-slate-700 transition-all">
                                                <div className={`w-5 h-5 rounded border flex items-center justify-center transition-colors ${newTest.substances.includes(drug.split(' ')[0])
                                                        ? 'bg-red-500 border-red-500 text-white'
                                                        : 'border-slate-600 bg-slate-800'
                                                    }`}>
                                                    {newTest.substances.includes(drug.split(' ')[0]) && <i className="fas fa-check text-xs"></i>}
                                                </div>
                                                <input
                                                    type="checkbox"
                                                    className="hidden"
                                                    checked={newTest.substances.includes(drug.split(' ')[0])}
                                                    onChange={() => toggleSubstance(drug.split(' ')[0])}
                                                />
                                                <span className="text-sm text-slate-300">{drug}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 flex justify-end gap-3">
                                    <button
                                        type="button"
                                        onClick={() => setActiveTab('overview')}
                                        className="px-4 py-2 rounded text-slate-400 hover:text-white transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="bg-indigo-600 hover:bg-indigo-500 text-white px-6 py-2 rounded font-medium shadow-lg shadow-indigo-500/20 transition-all"
                                    >
                                        Guardar Registro
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                </div>
            </div>
        </div>
    );
};

export default AntidopingDashboard;
