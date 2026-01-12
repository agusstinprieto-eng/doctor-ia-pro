
import React from 'react';

interface SidebarProps {
    activeView: string;
    onNavigate: (view: string) => void;
    isOpen: boolean;
    onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, onNavigate, isOpen, onToggle }) => {

    const menuItems = [
        { id: 'chat', label: 'Consulta IA', icon: 'fa-brain' },
        { id: 'labs', label: 'Laboratorios', icon: 'fa-microscope' },
        { id: 'history', label: 'Historial', icon: 'fa-history' },
        { id: 'calendar', label: 'Agenda Médica', icon: 'fa-calendar-alt' },
        { id: 'prescription', label: 'Generar Receta', icon: 'fa-file-prescription' },
        { id: 'natural', label: 'Tienda Naturista', icon: 'fa-leaf' },
        { id: 'antidoping', label: 'Salud Ocupacional', icon: 'fa-flask' },
        { id: 'neuroscan', label: 'NeuroScan', icon: 'fa-head-side-mask' },
        { id: 'dental', label: 'Odontología', icon: 'fa-tooth' },
        { id: 'ophthalmology', label: 'Oftalmología', icon: 'fa-eye' },
        { id: 'library', label: 'Biblioteca Médica', icon: 'fa-book-medical' },
    ];

    return (
        <>
            {/* Mobile Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={onToggle}
            ></div>

            {/* Sidebar Container */}
            <div className={`fixed left-0 top-0 bottom-0 w-64 bg-slate-950 border-r border-cyan-500/20 z-50 transition-transform duration-300 transform md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>

                {/* Logo Area */}
                <div className="p-6 border-b border-cyan-500/20 flex items-center gap-3">
                    <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-400 flex items-center justify-center neon-border-cyan">
                        <i className="fas fa-microchip text-cyan-400"></i>
                    </div>
                    <div>
                        <h1 className="font-cyber text-lg font-bold tracking-tighter text-cyan-400 neon-glow-cyan">
                            DOCTOR <span className="text-white">IA PRO</span>
                        </h1>
                    </div>
                </div>

                {/* Navigation */}
                <div className="p-4 space-y-2 flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
                    <div className="text-[10px] text-slate-500 font-mono uppercase tracking-widest pl-3 mb-2">Plataforma</div>

                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            onClick={() => {
                                onNavigate(item.id);
                                if (window.innerWidth < 768) onToggle();
                            }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${activeView === item.id
                                ? 'bg-cyan-950/50 text-cyan-400 border border-cyan-500/30'
                                : 'text-slate-400 hover:bg-slate-900 hover:text-white'
                                }`}
                        >
                            <i className={`fas ${item.icon} w-5 text-center ${activeView === item.id ? 'text-cyan-400' : 'text-slate-500 group-hover:text-cyan-400'}`}></i>
                            <span className="font-medium text-sm">{item.label}</span>
                            {activeView === item.id && (
                                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]"></div>
                            )}
                        </button>
                    ))}
                </div>

                {/* System Status Footer */}
                <div className="p-4 border-t border-slate-900 bg-slate-950 shrink-0">
                    <div className="flex items-center justify-center gap-2 text-[10px] text-slate-500 font-mono">
                        <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                        SYSTEM ONLINE
                    </div>
                    <div className="mt-2 pt-2 border-t border-slate-900/50">
                        <a href="https://www.ia-agus.com" target="_blank" rel="noreferrer" className="block text-[10px] text-center text-cyan-400 hover:text-cyan-200 font-cyber tracking-widest transition-all drop-shadow-[0_0_8px_rgba(34,211,238,0.6)] hover:drop-shadow-[0_0_12px_rgba(34,211,238,1)]">
                            POWERED BY IA.AGUS
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Sidebar;
