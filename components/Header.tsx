import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { voiceService } from '../services/voiceService';

interface HeaderProps {
  isVoiceEnabled: boolean;
  onToggleVoice: () => void;
  onToggleSidebar: () => void;
  onOpenGallery: () => void;
  imageCount: number;
}

const Header: React.FC<HeaderProps> = ({ isVoiceEnabled, onToggleVoice, onToggleSidebar, onOpenGallery, imageCount }) => {
  const { username, logout } = useAuth();
  const { language, setLanguage, t } = useLanguage();

  const toggleLanguage = () => {
    setLanguage(language === 'es' ? 'en' : 'es');
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-cyan-500/30 px-4 py-3 flex justify-between items-center md:pl-4">
      <div className="flex items-center gap-3">
        {/* Mobile Menu Toggle */}
        <button
          onClick={onToggleSidebar}
          className="md:hidden w-10 h-10 rounded bg-cyan-950/30 border border-cyan-500/30 flex items-center justify-center text-cyan-400"
        >
          <i className="fas fa-bars"></i>
        </button>

        <div className="md:hidden flex items-center gap-3">
          {/* Logo - only visible on mobile now since Sidebar has it */}
          <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-400 flex items-center justify-center neon-border-cyan">
            <i className="fas fa-microchip text-cyan-400"></i>
          </div>
          <h1 className="font-cyber text-lg font-bold tracking-tighter text-cyan-400 neon-glow-cyan">
            DOCTOR <span className="text-white">IA</span>
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-3 text-xs font-mono">

        {/* Gallery Button */}
        <button
          onClick={onOpenGallery}
          className="hidden md:flex bg-indigo-950/30 hover:bg-indigo-900/50 border border-indigo-500/30 hover:border-indigo-400 px-3 py-1.5 rounded-lg transition-all items-center gap-2 group"
          title="Ver imágenes enviadas a Gemini"
        >
          <div className="relative">
            <i className="fas fa-images text-indigo-400 group-hover:text-indigo-300"></i>
            {imageCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-cyan-500 text-white text-[9px] w-3.5 h-3.5 flex items-center justify-center rounded-full animate-pulse">
                {imageCount}
              </span>
            )}
          </div>
          <span className="text-indigo-300 group-hover:text-indigo-200 hidden lg:inline">CONTEXTO VISUAL</span>
        </button>


        {/* Voice Toggle */}
        <button
          onClick={onToggleVoice}
          className={`bg-cyan-950/30 hover:bg-cyan-900/50 border ${isVoiceEnabled ? 'border-emerald-500/50' : 'border-cyan-500/30'} px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 group`}
          title={isVoiceEnabled ? t.voiceActive : t.voiceDisabled}
        >
          <i className={`fas ${isVoiceEnabled ? 'fa-volume-up text-emerald-400' : 'fa-volume-mute text-slate-500'} group-hover:scale-110 transition-transform`}></i>
        </button>

        {/* Language Toggle */}
        <button
          onClick={toggleLanguage}
          className="bg-cyan-950/30 hover:bg-cyan-900/50 border border-cyan-500/30 hover:border-cyan-400 px-3 py-1.5 rounded-lg transition-all flex items-center gap-3 group"
          title={language === 'es' ? 'Switch to English' : 'Cambiar a Español'}
        >
          <span className={`text-xs font-bold transition-colors ${language === 'en' ? 'text-cyan-400' : 'text-slate-400/50'}`}>EN</span>
          <div className="w-[1px] h-3 bg-cyan-500/30"></div>
          <span className={`text-xs font-bold transition-colors ${language === 'es' ? 'text-cyan-400' : 'text-slate-400/50'}`}>ES</span>
        </button>

        {username && (
          <div className="hidden md:flex items-center gap-2 bg-cyan-950/30 border border-cyan-500/30 px-3 py-1.5 rounded-lg">
            <i className="fas fa-user-md text-cyan-400"></i>
            <span className="text-cyan-300 font-semibold">{username}</span>
          </div>
        )}

        <div className="hidden lg:flex flex-col items-end">
          <span className="text-emerald-400 font-bold">{t.biometricActive}</span>
        </div>

        <button
          onClick={logout}
          className="bg-red-950/30 hover:bg-red-900/50 border border-red-500/50 px-3 py-1.5 rounded transition-all text-red-400 hover:text-red-300 flex items-center gap-2"
          title={t.logout}
        >
          <i className="fas fa-sign-out-alt"></i>
          <span className="hidden md:inline font-bold">{t.logout}</span>
        </button>
      </div>
    </header>
  );
};

export default Header;
