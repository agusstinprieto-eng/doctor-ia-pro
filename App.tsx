
import React, { useState, useRef, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ChatMessage from './components/ChatMessage';
import LabResultsViewer from './components/LabResultsViewer';
import LoginView from './components/LoginView';
import HistoryPanel from './components/HistoryPanel';
import BiometricDashboard from './components/BiometricDashboard';
import ImageDiagnosticHUD from './components/ImageDiagnosticHUD';
import NaturalHub from './components/NaturalHub';
import AntidopingDashboard from './components/AntidopingDashboard';
import CalendarDashboard from './components/CalendarDashboard';
import PrescriptionGenerator from './components/PrescriptionGenerator';
import NeurosomaticScanner from './components/NeurosomaticScanner';
import { DentalModule } from './components/DentalModule';
import { OphthalmologyModule } from './components/OphthalmologyModule';
import { MedicalLibrary } from './components/MedicalLibrary';
import { Message } from './types';
import { geminiService } from './services/geminiService';
import { pdfService } from './services/pdfService';
import { voiceService } from './services/voiceService';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';

const AppContent: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const username = user?.email?.split('@')[0] || 'Doctor';
  const { language, t } = useLanguage();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const [history, setHistory] = useState<any[]>([]);
  const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isVoiceEnabled, setIsVoiceEnabled] = useState(false);
  const [activeView, setActiveView] = useState('chat'); // chat, history, calendar, natural, antidoping
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isHUDOpen, setIsHUDOpen] = useState(false);
  const [hudImageUrl, setHudImageUrl] = useState<string | null>(null);
  const [isListening, setIsListening] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load history from localStorage on mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('doctor_ia_history');
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Initialize welcome message
  useEffect(() => {
    if (messages.length === 0) {
      setMessages([{
        id: '1',
        role: 'assistant',
        content: `${t.systemActive}\n\n${t.welcomeMessage}\n\n${t.whatCanIHelp}`,
        timestamp: new Date()
      }]);
    }
  }, [t, messages.length]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const saveCurrentSession = (updatedMessages: Message[]) => {
    const sessionId = currentSessionId || Date.now().toString();
    const preview = updatedMessages.find(m => m.role === 'user')?.content || 'Nueva Consulta';

    const sessionData = {
      id: sessionId,
      timestamp: new Date().toISOString(),
      preview: preview.substring(0, 60),
      messages: updatedMessages
    };

    const newHistory = [...history.filter(h => h.id !== sessionId), sessionData];
    setHistory(newHistory);
    localStorage.setItem('doctor_ia_history', JSON.stringify(newHistory));
    setCurrentSessionId(sessionId);
  };

  const loadSession = (id: string) => {
    const session = history.find(h => h.id === id);
    if (session) {
      setMessages(session.messages);
      setCurrentSessionId(id);
    }
  };

  const startNewSession = () => {
    setCurrentSessionId(null);
    setMessages([{
      id: Date.now().toString(),
      role: 'assistant',
      content: `${t.systemActive}\n\n${t.welcomeMessage}\n\n${t.whatCanIHelp}`,
      timestamp: new Date()
    }]);
  };

  const handleExportPDF = async () => {
    if (messages.length === 0) return;
    setIsGeneratingPDF(true);
    try {
      await pdfService.generateConsultationReport(messages, t, username || 'Demo User');
    } catch (error) {
      console.error('PDF Error:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim() && !selectedImage) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      image: selectedImage || undefined,
      timestamp: new Date()
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    if (selectedImage) {
      setHudImageUrl(selectedImage);
      setIsHUDOpen(true);
    }

    setInput('');
    setSelectedImage(null);
    setIsTyping(true);

    const historyForAi = updatedMessages.map(m => ({
      role: m.role,
      content: m.content,
      image: m.image
    }));

    try {
      const response = await geminiService.analyzeSymptoms(historyForAi);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      const finalMessages = [...updatedMessages, aiMessage];
      setMessages(finalMessages);
      saveCurrentSession(finalMessages);

      // Play voice if enabled
      voiceService.speak(response, language);
    } catch (error) {
      console.error(error);
    } finally {
      setIsTyping(false);
    }
  };

  const toggleVoice = () => {
    const newState = !isVoiceEnabled;
    setIsVoiceEnabled(newState);
    voiceService.setEnabled(newState, language);
    if (!newState) {
      voiceService.stop();
    }
  };

  const handleMicClick = () => {
    if (isListening) {
      voiceService.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      voiceService.startListening(
        (text) => {
          setInput(prev => prev + ' ' + text);
          setIsListening(false);
        },
        (error) => {
          console.error("Speech verification error:", error);
          setIsListening(false);
        },
        language
      );
    }
  };

  if (!isAuthenticated) {
    return <LoginView />;
  }

  return (
    <div className="flex flex-col h-screen max-h-screen bg-slate-950 md:pl-64 transition-all duration-300">

      <Sidebar
        activeView={activeView}
        onNavigate={(view) => setActiveView(view)}
        isOpen={isSidebarOpen}
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
      />

      <Header
        isVoiceEnabled={isVoiceEnabled}
        onToggleVoice={toggleVoice}
        onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)}
        onOpenGallery={() => setIsGalleryOpen(true)}
        imageCount={messages.filter(m => m.image).length}
      />

      <div className="fixed inset-0 pointer-events-none opacity-20 z-0">
        <div className="absolute top-1/4 left-0 w-64 h-64 bg-cyan-500 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-1/4 right-0 w-64 h-64 bg-blue-600 rounded-full blur-[120px]"></div>
      </div>

      <main className="flex-1 overflow-y-auto p-4 md:px-8 lg:px-32 relative z-10 scrollbar-hide">
        {activeView === 'chat' && (
          <div className="max-w-4xl mx-auto py-8">
            {messages.map((msg) => (
              <ChatMessage key={msg.id} message={msg} />
            ))}

            {isTyping && (
              <div className="flex flex-col gap-3 mb-6 animate-in fade-in slide-in-from-left duration-500">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500 flex items-center justify-center animate-pulse">
                    <i className="fas fa-brain text-cyan-400 text-xs"></i>
                  </div>
                  <div className="bg-slate-900/50 border border-cyan-500/20 px-4 py-2 rounded-lg">
                    <div className="flex gap-1 items-center">
                      <span className="text-[10px] font-mono text-cyan-400 mr-2 uppercase tracking-tighter animate-pulse">{t.deepScanInit}</span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]"></span>
                      <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]"></span>
                    </div>
                  </div>
                </div>
                <div className="ml-10 w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent relative overflow-hidden">
                  <div className="absolute inset-0 bg-cyan-400 w-1/4 h-full animate-bio-scan"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
        )}

        {activeView === 'calendar' && (
          <CalendarDashboard onClose={() => setActiveView('chat')} />
        )}

        {activeView === 'labs' && (
          <LabResultsViewer onClose={() => setActiveView('chat')} />
        )}

        {activeView === 'prescription' && (
          <PrescriptionGenerator onClose={() => setActiveView('chat')} />
        )}

        {activeView === 'natural' && (
          <NaturalHub onClose={() => setActiveView('chat')} />
        )}

        {activeView === 'antidoping' && (
          <AntidopingDashboard onClose={() => setActiveView('chat')} />
        )}

        {activeView === 'neuroscan' && (
          <NeurosomaticScanner
            onClose={() => setActiveView('chat')}
            onSave={(data) => {
              // Create a summary message from the report
              const reportMessage: Message = {
                id: Date.now().toString(),
                role: 'assistant',
                content: `**INFORME DE FENOTIPADO DIGITAL (NeuroScan)**\n\n**Autenticidad:** ${data.authenticity}\n**VFC (HRV):** ${data.hrv}ms\n**Nivel Cortisol:** ${data.cortisolLevel} µg/dL\n**Dominancia Simpática:** ${data.sympatheticDominance}%\n\n**Marcadores FACS Detectados:**\n${data.stressAUs.join(', ') || 'Ninguno significativo'}\n\n*Este análisis se ha guardado en su historial clínico.*`,
                timestamp: new Date(),
                image: data.capturedImage
              };
              setMessages(prev => [...prev, reportMessage]);
              saveCurrentSession([...messages, reportMessage]);
              setActiveView('chat');
            }}
          />
        )}

        {activeView === 'dental' && (
          <DentalModule />
        )}

        {activeView === 'ophthalmology' && (
          <OphthalmologyModule />
        )}

        {activeView === 'library' && (
          <MedicalLibrary />
        )}


        {/* IA.AGUS Branding Footer */}
        <div className="mt-auto py-6 flex flex-col items-center justify-center gap-2 opacity-60 hover:opacity-100 transition-opacity">
          <div className="h-[1px] w-32 bg-gradient-to-r from-transparent via-cyan-900 to-transparent"></div>
          <p className="text-[10px] text-slate-500 font-mono tracking-[0.2em]">
            POWERED BY <span className="text-cyan-500 font-bold glow-text">IA.AGUS</span>
          </p>
          <a
            href="https://www.ia-agus.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[9px] text-slate-600 hover:text-cyan-400 transition-colors font-cyber tracking-widest uppercase"
          >
            WWW.IA-AGUS.COM
          </a>
        </div>
      </main>

      {/* Sent Images Gallery Modal */}
      {isGalleryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-cyan-500/30 rounded-2xl w-full max-w-4xl max-h-[80vh] flex flex-col shadow-2xl relative overflow-hidden">

            {/* Modal Header */}
            <div className="p-4 border-b border-cyan-500/20 bg-slate-950/50 flex justify-between items-center">
              <div>
                <h3 className="text-cyan-400 font-cyber font-bold text-lg flex items-center gap-2">
                  <i className="fas fa-layer-group"></i>
                  CONTEXTO VISUAL ACTIVO
                </h3>
                <p className="text-[10px] text-slate-400 font-mono mt-1">
                  GEMINI MEMORY: {messages.filter(m => m.image).length} IMÁGENES EN SESIÓN
                </p>
              </div>
              <button
                onClick={() => setIsGalleryOpen(false)}
                className="text-slate-500 hover:text-white transition-colors"
              >
                <i className="fas fa-times text-xl"></i>
              </button>
            </div>

            {/* Gallery Grid */}
            <div className="flex-1 overflow-y-auto p-6 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
              {messages.filter(m => m.image).length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-4 opacity-50">
                  <i className="fas fa-images text-6xl"></i>
                  <p className="font-mono text-sm">NO HAY IMÁGENES EN EL CONTEXTO ACTUAL</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {messages.map((msg, idx) => (
                    msg.image && (
                      <div key={msg.id} className="group relative aspect-square rounded-lg overflow-hidden border border-slate-700 hover:border-cyan-500/50 transition-all bg-slate-950">
                        <img
                          src={msg.image}
                          alt={`Context ${idx}`}
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2">
                          <span className="text-[10px] text-cyan-300 font-mono truncate">
                            {msg.role === 'user' ? 'SUBIDO POR USUARIO' : 'GENERADO POR AI'}
                          </span>
                          <span className="text-[9px] text-slate-400">
                            {new Date(msg.timestamp).toLocaleTimeString()}
                          </span>
                        </div>
                        <button
                          onClick={() => {
                            setHudImageUrl(msg.image!);
                            setIsHUDOpen(true);
                          }}
                          className="absolute top-2 right-2 bg-black/60 hover:bg-cyan-600 text-white w-6 h-6 rounded flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-all"
                        >
                          <i className="fas fa-expand"></i>
                        </button>
                      </div>
                    )
                  ))}
                </div>
              )}
            </div>

            {/* Info Footer */}
            <div className="p-3 bg-cyan-950/20 border-t border-cyan-500/10 text-center">
              <p className="text-[10px] text-cyan-500/60 font-mono">
                * TODAS LAS IMÁGENES SON RE-PROCESADAS POR GEMINI EN CADA INTERACCIÓN PARA MANTENER LA CONTINUIDAD VISUAL.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Persistent Components */}
      {activeView === 'chat' && <BiometricDashboard />}

      <HistoryPanel
        isOpen={activeView === 'history'}
        onClose={() => setActiveView('chat')}
        sessions={history}
        onLoadSession={(id) => {
          loadSession(id);
          setActiveView('chat');
        }}
        onNewSession={() => {
          startNewSession();
          setActiveView('chat');
        }}
      />

      <footer className={`glass-panel border-t border-cyan-500/20 p-4 relative z-20 ${activeView !== 'chat' ? 'hidden' : ''}`}>
        <div className="max-w-4xl mx-auto">
          {selectedImage && (
            <div className="mb-4 relative w-32 group">
              <img src={selectedImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg border border-cyan-400 neon-border-cyan" />
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 shadow-lg"
              >
                <i className="fas fa-times"></i>
              </button>
            </div>
          )}

          <div className="flex gap-2 relative mb-4">
            <button
              onClick={handleExportPDF}
              disabled={isGeneratingPDF || messages.length <= 1}
              className="flex-1 max-w-[200px] bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/50 text-emerald-400 text-xs font-mono py-2 rounded-lg flex items-center justify-center gap-2 transition-all disabled:opacity-50"
            >
              <i className={isGeneratingPDF ? "fas fa-spinner fa-spin" : "fas fa-file-pdf"}></i>
              {isGeneratingPDF ? t.generatingPDF : t.exportPDF}
            </button>

            {currentSessionId && (
              <div className="px-3 py-2 bg-cyan-500/10 border border-cyan-500/30 rounded-lg text-[10px] font-mono text-cyan-400 flex items-center gap-2">
                <i className="fas fa-check-circle"></i>
                {t.saveSession}
              </div>
            )}
          </div>

          <form onSubmit={handleSendMessage} className="flex gap-2 md:gap-4 items-end">
            <div className="flex-1 relative">
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder={t.describeSymptomsPlaceholder}
                className="w-full bg-slate-950/80 border border-cyan-500/30 rounded-xl px-4 py-3 text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400/50 transition-all resize-none max-h-32 font-medium"
                rows={1}
              />

              <div className="absolute right-3 bottom-3 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-cyan-500/70 hover:text-cyan-400 transition-colors p-1"
                  title={t.uploadMedicalImage}
                >
                  <i className="fas fa-camera text-xl"></i>
                </button>
                <button
                  type="button"
                  onClick={handleMicClick}
                  className={`transition-all p-1 ${isListening ? 'text-red-500 animate-pulse' : 'text-cyan-500/70 hover:text-cyan-400'}`}
                  title="Activar micrófono"
                >
                  <i className={`fas ${isListening ? 'fa-stop-circle' : 'fa-microphone'} text-xl`}></i>
                </button>
                <input
                  type="file"
                  hidden
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onloadend = () => setSelectedImage(reader.result as string);
                      reader.readAsDataURL(file);
                    }
                  }}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isTyping || (!input.trim() && !selectedImage)}
              className="bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white w-12 h-12 rounded-xl flex items-center justify-center transition-all shadow-[0_0_15px_rgba(8,145,178,0.4)]"
            >
              <i className="fas fa-paper-plane"></i>
            </button>
          </form>

          <div className="mt-2 flex justify-between items-center px-1">
            <span className="text-[10px] font-mono text-cyan-500/50 tracking-widest">
              {t.terminal}: AGUS-MD-001 // {t.secureChannelReady}
            </span>
            <div className="flex gap-3">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shadow-[0_0_5px_cyan]"></span>
                <span className="text-[9px] font-mono text-cyan-400 uppercase">{t.integrativeBase}</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-600"></span>
                <span className="text-[9px] font-mono text-slate-500 uppercase">{t.legacySupport}</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div >
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppContent />
      </LanguageProvider>
    </AuthProvider>
  );
};

export default App;
