import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';

const LoginView: React.FC = () => {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [successMsg, setSuccessMsg] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { login, signUp } = useAuth();
    const { t } = useLanguage();

    // Auto-detect "Register Mode" from URL (Redirected from Stripe)
    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        if (params.get('register') === 'true') {
            setIsRegistering(true);
        }
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccessMsg('');
        setIsLoading(true);

        try {
            if (isRegistering) {
                const { error } = await signUp(email, password);
                if (error) throw error;
                setSuccessMsg('Cuenta creada exitosamente. Por favor inicia sesión.');
                setIsRegistering(false);
            } else {
                const { error } = await login(email, password);
                if (error) throw error;
            }
        } catch (err: any) {
            setError(err.message || 'Error de autenticación');
        } finally {
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
                        {isRegistering ? 'Crear Cuenta' : t.loginTitle}
                    </h1>
                    <p className="text-cyan-400 text-[10px] font-mono tracking-[0.3em] uppercase opacity-80">
                        {isRegistering ? 'NUEVO USUARIO' : t.loginSubtitle}
                    </p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-cyan-400 text-sm font-mono mb-2 uppercase tracking-wider">
                            <i className="fas fa-envelope mr-2"></i>Email
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full bg-slate-950/50 border border-cyan-500/30 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/30 transition-all font-medium"
                            placeholder="doctor@ejemplo.com"
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
                            placeholder="••••••••"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-950/50 border border-red-500/50 rounded-lg px-4 py-3 text-red-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
                            <i className="fas fa-exclamation-triangle"></i>
                            <span>{error}</span>
                        </div>
                    )}

                    {successMsg && (
                        <div className="bg-emerald-950/50 border border-emerald-500/50 rounded-lg px-4 py-3 text-emerald-400 text-sm flex items-center gap-2 animate-in slide-in-from-top-2 fade-in">
                            <i className="fas fa-check-circle"></i>
                            <span>{successMsg}</span>
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
                                <i className={`fas ${isRegistering ? 'fa-user-plus' : 'fa-sign-in-alt'}`}></i>
                                {isRegistering ? 'Registrarse' : t.accessSystem}
                            </span>
                        )}
                    </button>
                </form>

                {/* Toggle Register/Login */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => { setIsRegistering(!isRegistering); setError(''); setSuccessMsg(''); }}
                        className="text-cyan-400 hover:text-cyan-300 text-xs font-mono tracking-wider underline decoration-cyan-500/30 hover:decoration-cyan-400 underline-offset-4 transition-all"
                    >
                        {isRegistering ? '¿Ya tienes cuenta? Inicia Sesión' : '¿No tienes cuenta? Regístrate aquí'}
                    </button>
                </div>

                {/* Footer */}
                <div className="mt-8 text-center flex flex-col items-center gap-1">
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

