import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginView: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login } = useAuth();
    const { t } = useLanguage();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setIsLoading(true);

        // Simulate network delay for better UX
        await new Promise(resolve => setTimeout(resolve, 800));

        const success = login(username, password);

        if (!success) {
            setError(t.invalidCredentials);
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
            {/* Animated Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500 rounded-full blur-[150px] opacity-20 animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-[150px] opacity-20 animate-pulse [animation-delay:1s]"></div>
            </div>

            {/* Grid Pattern Overlay */}
            <div className="absolute inset-0 z-0 opacity-10" style={{
                backgroundImage: 'linear-gradient(rgba(34, 211, 238, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(34, 211, 238, 0.1) 1px, transparent 1px)',
                backgroundSize: '50px 50px'
            }}></div>

            <div className="glass-panel rounded-3xl p-8 md:p-12 max-w-md w-full relative z-10 scanner border border-cyan-500/30 shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                {/* Logo/Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-cyan-950 border-2 border-cyan-500 mb-4 neon-border-cyan">
                        <i className="fas fa-user-md text-3xl text-cyan-400 neon-glow-cyan"></i>
                    </div>
                    <h1 className="text-4xl font-cyber font-bold text-white mb-2 neon-glow-cyan uppercase tracking-tighter">
                        {t.loginTitle}
                    </h1>
                    <p className="text-cyan-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-80">
                        {t.loginSubtitle}
                    </p>
                    <div className="mt-3 flex items-center justify-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_cyan] animate-pulse"></span>
                        <span className="text-[10px] font-mono text-cyan-500 uppercase tracking-widest">
                            {t.poweredBy}
                        </span>
                    </div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                            <i className="fas fa-user mr-2"></i>{t.username}
                        </label>
                        <input
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full bg-slate-950/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all font-medium"
                            placeholder={t.enterUsername}
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                            <i className="fas fa-lock mr-2"></i>{t.password}
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full bg-slate-950/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all font-medium"
                            placeholder={t.enterPassword}
                            required
                        />
                    </div>

                    {error && (
                        <div className="bg-red-950/50 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-3 rounded-xl transition-all shadow-[0_0_20px_rgba(34,211,238,0.4)] hover:shadow-[0_0_30px_rgba(34,211,238,0.6)] uppercase tracking-wider font-cyber"
                    >
                        {isLoading ? (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-spinner fa-spin"></i>
                                {t.verifying}
                            </span>
                        ) : (
                            <span className="flex items-center justify-center gap-2">
                                <i className="fas fa-sign-in-alt"></i>
                                {t.accessSystem}
                            </span>
                        )}
                    </button>
                </form>

                {/* Demo Credentials Info */}
                <div className="mt-6 p-4 bg-cyan-950/20 border border-cyan-500/20 rounded-lg">
                    <p className="text-cyan-400 text-xs font-mono mb-2 uppercase tracking-wider">
                        <i className="fas fa-info-circle mr-2"></i>{t.demoCredentials}
                    </p>
                    <div className="grid grid-cols-2 gap-2 font-mono text-[11px]">
                        <div className="text-slate-400">{t.username}:</div>
                        <div className="text-cyan-300">negocio</div>
                        <div className="text-slate-400">{t.password}:</div>
                        <div className="text-cyan-300">demo</div>
                    </div>
                </div>

                {/* Footer */}
                <div className="mt-6 text-center flex flex-col items-center gap-1">
                    <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">
                        {t.secureSystem}
                    </p>
                    <a href="https://www.ia-agus.com" target="_blank" rel="noreferrer" className="text-[9px] text-cyan-500/60 hover:text-cyan-400 font-cyber tracking-widest transition-colors">
                        POWERED BY IA.AGUS
                    </a>
                </div>
            </div>
        </div>
    );
};

export default LoginView;
