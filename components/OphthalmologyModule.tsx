import React, { useState } from 'react';
import { Eye, Save, Activity, Glasses } from 'lucide-react';

interface VisualAcuity {
    od: string; // Ojo Derecho
    oi: string; // Ojo Izquierdo
    ae: string; // Ambos Ojos
}

interface RefractionData {
    sph: string;
    cyl: string;
    axis: string;
    add: string;
}

export function OphthalmologyModule() {
    const [acuity, setAcuity] = useState<VisualAcuity>({ od: '20/20', oi: '20/20', ae: '20/20' });
    const [refractionOD, setRefractionOD] = useState<RefractionData>({ sph: '', cyl: '', axis: '', add: '' });
    const [refractionOI, setRefractionOI] = useState<RefractionData>({ sph: '', cyl: '', axis: '', add: '' });
    const [iop, setIop] = useState<{ od: string; oi: string }>({ od: '15', oi: '15' }); // Intraocular Pressure

    return (
        <div className="flex flex-col h-full bg-slate-950 text-slate-200 p-6 overflow-y-auto">

            {/* Header */}
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter flex items-center gap-3">
                        <span className="bg-cyan-500/10 p-2 rounded-lg border border-cyan-500/20 text-cyan-400">
                            <Eye size={24} />
                        </span>
                        Oftalmología Clínica
                    </h2>
                    <p className="text-slate-400 text-sm mt-1">Evaluación de Agudeza Visual y Refracción</p>
                </div>
                <button className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-colors">
                    <Save size={16} />
                    Guardar Evaluación
                </button>
            </div>

            <div className="grid lg:grid-cols-2 gap-8">

                {/* Visual Acuity Card */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Activity size={18} className="text-cyan-400" />
                        Agudeza Visual (Snellen)
                    </h3>

                    <div className="space-y-6">
                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 text-right pt-2 text-sm text-slate-400 font-bold uppercase">Ojo Derecho (OD)</div>
                            <div className="col-span-2">
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                                    value={acuity.od}
                                    onChange={(e) => setAcuity({ ...acuity, od: e.target.value })}
                                >
                                    <option>20/200</option><option>20/100</option><option>20/70</option>
                                    <option>20/50</option><option>20/40</option><option>20/30</option>
                                    <option>20/25</option><option>20/20</option><option>20/15</option>
                                </select>
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="col-span-1 text-right pt-2 text-sm text-slate-400 font-bold uppercase">Ojo Izquierdo (OI)</div>
                            <div className="col-span-2">
                                <select
                                    className="w-full bg-slate-950 border border-slate-700 rounded-lg p-2 text-white outline-none focus:border-cyan-500"
                                    value={acuity.oi}
                                    onChange={(e) => setAcuity({ ...acuity, oi: e.target.value })}
                                >
                                    <option>20/200</option><option>20/100</option><option>20/70</option>
                                    <option>20/50</option><option>20/40</option><option>20/30</option>
                                    <option>20/25</option><option>20/20</option><option>20/15</option>
                                </select>
                            </div>
                        </div>

                        <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-700 mt-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-bold text-slate-400 uppercase">Presión Intraocular (mmHg)</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mt-3">
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">OD</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                        value={iop.od}
                                        onChange={(e) => setIop({ ...iop, od: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="text-xs text-slate-500 block mb-1">OI</label>
                                    <input
                                        type="number"
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-2 text-white"
                                        value={iop.oi}
                                        onChange={(e) => setIop({ ...iop, oi: e.target.value })}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Refraction Card */}
                <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
                    <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                        <Glasses size={18} className="text-indigo-400" />
                        Refracción y Graduación
                    </h3>

                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-slate-500 border-b border-slate-700">
                                    <th className="py-2">Ojo</th>
                                    <th className="py-2">Esfera (SPH)</th>
                                    <th className="py-2">Cilindro (CYL)</th>
                                    <th className="py-2">Eje (AXIS)</th>
                                    <th className="py-2">Adición (ADD)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800">
                                {/* OD Row */}
                                <tr className="group hover:bg-slate-800/30">
                                    <td className="py-3 font-bold text-cyan-400">OD</td>
                                    <td className="p-1">
                                        <input type="text" placeholder="-0.50" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOD.sph} onChange={e => setRefractionOD({ ...refractionOD, sph: e.target.value })} />
                                    </td>
                                    <td className="p-1">
                                        <input type="text" placeholder="-0.25" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOD.cyl} onChange={e => setRefractionOD({ ...refractionOD, cyl: e.target.value })} />
                                    </td>
                                    <td className="p-1">
                                        <input type="text" placeholder="90°" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOD.axis} onChange={e => setRefractionOD({ ...refractionOD, axis: e.target.value })} />
                                    </td>
                                    <td className="p-1">
                                        <input type="text" placeholder="+1.00" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOD.add} onChange={e => setRefractionOD({ ...refractionOD, add: e.target.value })} />
                                    </td>
                                </tr>

                                {/* OI Row */}
                                <tr className="group hover:bg-slate-800/30">
                                    <td className="py-3 font-bold text-cyan-400">OI</td>
                                    <td className="p-1">
                                        <input type="text" placeholder="-0.50" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOI.sph} onChange={e => setRefractionOI({ ...refractionOI, sph: e.target.value })} />
                                    </td>
                                    <td className="p-1">
                                        <input type="text" placeholder="-0.25" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOI.cyl} onChange={e => setRefractionOI({ ...refractionOI, cyl: e.target.value })} />
                                    </td>
                                    <td className="p-1">
                                        <input type="text" placeholder="95°" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOI.axis} onChange={e => setRefractionOI({ ...refractionOI, axis: e.target.value })} />
                                    </td>
                                    <td className="p-1">
                                        <input type="text" placeholder="+1.00" className="w-full bg-slate-950/50 border border-slate-700 rounded p-2 text-center text-white"
                                            value={refractionOI.add} onChange={e => setRefractionOI({ ...refractionOI, add: e.target.value })} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

            </div>

            <div className="mt-8 bg-slate-900/30 border border-slate-800 rounded-xl p-6">
                <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Notas y Diagnóstico</h3>
                <textarea
                    className="w-full bg-slate-950 border border-slate-800 rounded-lg p-4 text-slate-300 focus:border-cyan-500 outline-none h-32"
                    placeholder="Escriba aquí los hallazgos del fondo de ojo, anexos o cuerpo extraño..."
                ></textarea>
            </div>

        </div>
    );
}
