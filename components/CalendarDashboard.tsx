
import React, { useState } from 'react';

interface Appointment {
    id: string;
    patientName: string;
    day: string; // 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
    time: string; // '09:00', '10:00', etc.
    type: 'Consulta General' | 'Seguimiento' | 'Urgencia' | 'Antidoping';
    duration: number; // in hours
}

interface CalendarDashboardProps {
    onClose: () => void;
}

const CalendarDashboard: React.FC<CalendarDashboardProps> = ({ onClose }) => {
    const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
    const hours = Array.from({ length: 11 }, (_, i) => `${i + 8}:00`); // 8:00 to 18:00

    const [activeTab, setActiveTab] = useState<'week' | 'list'>('week');
    const [appointments, setAppointments] = useState<Appointment[]>([
        { id: '1', patientName: 'Carlos Ruiz', day: 'Lun', time: '09:00', type: 'Antidoping', duration: 1 },
        { id: '2', patientName: 'Ana López', day: 'Mié', time: '11:00', type: 'Consulta General', duration: 1 },
        { id: '3', patientName: 'Roberto Gomez', day: 'Vie', time: '16:00', type: 'Urgencia', duration: 1 },
    ]);

    const [showNewApptModal, setShowNewApptModal] = useState(false);
    const [newAppt, setNewAppt] = useState({
        patientName: '',
        day: 'Lun',
        time: '09:00',
        type: 'Consulta General'
    });

    const getDayIndex = (day: string) => days.indexOf(day);

    const handleSaveAppt = (e: React.FormEvent) => {
        e.preventDefault();
        const appt: Appointment = {
            id: Date.now().toString(),
            patientName: newAppt.patientName,
            day: newAppt.day,
            time: newAppt.time,
            type: newAppt.type as any,
            duration: 1
        };
        setAppointments([...appointments, appt]);
        setShowNewApptModal(false);
        setNewAppt({ patientName: '', day: 'Lun', time: '09:00', type: 'Consulta General' });
    };

    const getApptStyle = (type: string) => {
        switch (type) {
            case 'Consulta General': return 'bg-cyan-600/80 border-cyan-400';
            case 'Seguimiento': return 'bg-emerald-600/80 border-emerald-400';
            case 'Urgencia': return 'bg-red-600/80 border-red-400';
            case 'Antidoping': return 'bg-indigo-600/80 border-indigo-400';
            default: return 'bg-slate-600/80 border-slate-400';
        }
    };

    return (
        <div className="absolute inset-0 bg-slate-950 z-50 flex flex-col animate-in slide-in-from-bottom duration-300">
            {/* Header */}
            <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/10 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/50 flex items-center justify-center">
                        <i className="fas fa-calendar-alt text-cyan-400"></i>
                    </div>
                    <div>
                        <h2 className="text-xl font-cyber text-cyan-100 uppercase tracking-wider">Agenda Médica</h2>
                        <p className="text-[10px] text-cyan-400/60 font-mono">SEMANA ACTUAL // CITAS</p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowNewApptModal(true)}
                        className="bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition-all shadow-lg shadow-cyan-500/20"
                    >
                        <i className="fas fa-plus"></i>
                        Nueva Cita
                    </button>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full hover:bg-white/5 flex items-center justify-center text-slate-400 hover:text-white transition-colors"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>
            </div>

            {/* Grid Content */}
            <div className="flex-1 overflow-auto p-4 md:p-8">
                <div className="min-w-[800px] bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-2xl">
                    {/* Header Row */}
                    <div className="grid grid-cols-7 border-b border-slate-800 bg-slate-950">
                        <div className="p-3 text-center border-r border-slate-800 text-slate-500 text-xs font-mono uppercase">Hora</div>
                        {days.map(day => (
                            <div key={day} className="p-3 text-center border-r border-slate-800 text-cyan-400 font-bold uppercase tracking-wider last:border-r-0">
                                {day}
                            </div>
                        ))}
                    </div>

                    {/* Time Rows */}
                    <div className="relative">
                        {hours.map(hour => (
                            <div key={hour} className="grid grid-cols-7 h-24 border-b border-slate-800/50 hover:bg-slate-800/20 transition-colors">
                                <div className="p-2 text-right border-r border-slate-800 text-slate-500 text-xs font-mono">{hour}</div>
                                {days.map((day, dayIndex) => (
                                    <div key={`${day}-${hour}`} className="border-r border-slate-800/30 relative group">
                                        {/* Render Appointments */}
                                        {appointments
                                            .filter(a => a.day === day && a.time === hour)
                                            .map(appt => (
                                                <div
                                                    key={appt.id}
                                                    className={`absolute inset-1 p-2 rounded-lg border text-xs font-medium text-white shadow-lg cursor-pointer hover:scale-[1.02] transition-transform z-10 ${getApptStyle(appt.type)}`}
                                                >
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-bold truncate">{appt.patientName}</span>
                                                        <i className="fas fa-ellipsis-v opacity-50 text-[10px]"></i>
                                                    </div>
                                                    <div className="opacity-80 mt-1 text-[10px]">{appt.type}</div>
                                                </div>
                                            ))}

                                        {/* Hover Add Button */}
                                        <button
                                            className="absolute inset-0 w-full h-full opacity-0 group-hover:opacity-100 flex items-center justify-center bg-cyan-500/10 text-cyan-400 transition-all"
                                            onClick={() => {
                                                setNewAppt({ ...newAppt, day, time: hour });
                                                setShowNewApptModal(true);
                                            }}
                                        >
                                            <i className="fas fa-plus"></i>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* New Appointment Modal */}
            {showNewApptModal && (
                <div className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                    <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-md p-6 shadow-[0_0_50px_rgba(8,145,178,0.2)] animate-in zoom-in-95 duration-200">
                        <h3 className="text-xl font-bold text-white mb-6">Agendar Nueva Cita</h3>
                        <form onSubmit={handleSaveAppt} className="space-y-4">
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Paciente</label>
                                <input
                                    type="text"
                                    required
                                    autoFocus
                                    value={newAppt.patientName}
                                    onChange={e => setNewAppt({ ...newAppt, patientName: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                    placeholder="Nombre del paciente..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Día</label>
                                    <select
                                        value={newAppt.day}
                                        onChange={e => setNewAppt({ ...newAppt, day: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                    >
                                        {days.map(d => <option key={d} value={d}>{d}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs text-slate-400 mb-1">Hora</label>
                                    <select
                                        value={newAppt.time}
                                        onChange={e => setNewAppt({ ...newAppt, time: e.target.value })}
                                        className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                    >
                                        {hours.map(h => <option key={h} value={h}>{h}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs text-slate-400 mb-1">Tipo de Cita</label>
                                <select
                                    value={newAppt.type}
                                    onChange={e => setNewAppt({ ...newAppt, type: e.target.value })}
                                    className="w-full bg-slate-950 border border-slate-700 rounded p-3 text-white focus:border-cyan-500 outline-none"
                                >
                                    <option>Consulta General</option>
                                    <option>Seguimiento</option>
                                    <option>Urgencia</option>
                                    <option>Antidoping</option>
                                </select>
                            </div>

                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setShowNewApptModal(false)}
                                    className="px-4 py-2 rounded text-slate-400 hover:text-white transition-colors"
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    className="bg-cyan-600 hover:bg-cyan-500 text-white px-6 py-2 rounded-lg font-medium shadow-lg shadow-cyan-500/20"
                                >
                                    Confirmar Cita
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

        </div>
    );
};

export default CalendarDashboard;
