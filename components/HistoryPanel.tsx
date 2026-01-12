import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface Session {
    id: string;
    timestamp: string;
    preview: string;
}

interface HistoryPanelProps {
    isOpen: boolean;
    onClose: () => void;
    sessions: Session[];
    onLoadSession: (id: string) => void;
    onNewSession: () => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
    isOpen,
    onClose,
    sessions,
    onLoadSession,
    onNewSession
}) => {
    const { t } = useLanguage();

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 md:left-64 z-[100] flex overflow-hidden">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm transition-opacity"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xs md:max-w-sm glass-panel border-r border-cyan-500/30 h-full flex flex-col animate-in slide-in-from-left duration-300">
                <div className="p-4 border-b border-cyan-500/20 flex justify-between items-center bg-cyan-950/20">
                    <h2 className="font-cyber font-bold text-cyan-400 tracking-wider">
                        {t.historyTitle}
                    </h2>
                    <button
                        onClick={onClose}
                        className="text-cyan-500 hover:text-cyan-300"
                    >
                        <i className="fas fa-times"></i>
                    </button>
                </div>

                <div className="p-4 border-b border-cyan-500/10">
                    <button
                        onClick={() => {
                            onNewSession();
                            onClose();
                        }}
                        className="w-full bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-500/50 rounded-lg py-2 text-cyan-300 font-bold flex items-center justify-center gap-2 transition-all"
                    >
                        <i className="fas fa-plus"></i>
                        {t.newConsultation}
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-hide">
                    {sessions.length === 0 ? (
                        <div className="text-center py-10">
                            <i className="fas fa-folder-open text-3xl text-slate-700 mb-2"></i>
                            <p className="text-slate-500 text-xs font-mono">{t.noHistory}</p>
                        </div>
                    ) : (
                        sessions.map((session) => (
                            <button
                                key={session.id}
                                onClick={() => {
                                    onLoadSession(session.id);
                                    onClose();
                                }}
                                className="w-full text-left glass-panel border border-cyan-500/10 hover:border-cyan-500/40 p-3 rounded-xl transition-all group"
                            >
                                <div className="flex justify-between items-start mb-1">
                                    <span className="text-[10px] font-mono text-cyan-500/50">
                                        {new Date(session.timestamp).toLocaleString()}
                                    </span>
                                    <i className="fas fa-chevron-right text-[10px] text-cyan-500/20 group-hover:text-cyan-500 group-hover:translate-x-1 transition-all"></i>
                                </div>
                                <p className="text-xs text-slate-300 truncate font-medium">
                                    {session.preview}
                                </p>
                            </button>
                        ))
                    )}
                </div>

                <div className="p-4 border-t border-cyan-500/20 bg-cyan-950/10">
                    <div className="flex items-center gap-2 text-[9px] font-mono text-cyan-500/40 uppercase">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/40 animate-pulse"></span>
                        Storage: Local Interface Ready
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HistoryPanel;
