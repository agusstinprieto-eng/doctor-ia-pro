
import React, { useState } from 'react';
import { Message } from '../types';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isAI = message.role === 'assistant';
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(message.content);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Basic markdown-to-html replacement for better visual clarity
  const formatContent = (content: string) => {
    return content
      .replace(/\*\*(.*?)\*\*/g, '<strong class="text-cyan-400">$1</strong>')
      .replace(/Nivel (\d):/g, '<span class="inline-block px-2 py-0.5 mt-2 rounded bg-cyan-900/50 border border-cyan-500/50 text-cyan-300 font-bold">Nivel $1</span>')
      .replace(/### (.*)/g, '<h3 class="text-lg font-cyber text-cyan-200 mt-4 mb-2">$1</h3>')
      .split('\n').map((line, i) => (
        <p key={i} className="mb-2" dangerouslySetInnerHTML={{ __html: line }} />
      ));
  };

  return (
    <div className={`flex flex-col mb-6 ${isAI ? 'items-start' : 'items-end'}`}>
      <div className={`flex items-start gap-3 max-w-[90%] md:max-w-[75%]`}>
        {isAI && (
          <div className="w-8 h-8 rounded-full bg-cyan-950 border border-cyan-500 flex-shrink-0 flex items-center justify-center mt-1">
            <i className="fas fa-robot text-cyan-400 text-sm"></i>
          </div>
        )}

        <div className={`relative p-4 rounded-lg border shadow-lg ${isAI
          ? 'bg-slate-900/50 border-cyan-500/30'
          : 'bg-cyan-900/20 border-cyan-400/50'
          }`}>
          {/* Metadata for AI messages */}
          {isAI && (
            <div className="flex items-center gap-2 mb-2 text-[10px] font-mono text-cyan-500/60 uppercase border-b border-cyan-500/10 pb-1">
              <span>SCANNING SENSORS...</span>
              <span className="ml-auto">ENCRYPTION: AES-256</span>
            </div>
          )}

          {message.image && (
            <div className="mb-4 relative overflow-hidden rounded border border-cyan-500/30 scanner">
              <img src={message.image} alt="Upload" className="w-full max-h-64 object-cover" />
              <div className="absolute top-0 left-0 w-full h-full bg-cyan-500/5 pointer-events-none"></div>
            </div>
          )}

          <div className={`text-sm leading-relaxed ${isAI ? 'text-slate-200' : 'text-cyan-50'}`}>
            {formatContent(message.content)}
          </div>

          <div className="mt-2 text-[9px] font-mono text-slate-500 flex justify-between">
            <span>
              {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
            {isAI && <span>IA.AGUS_PROTOCOL_EXECUTED</span>}
          </div>

          <div className="flex justify-end mt-2 pt-2 border-t border-cyan-500/10">
            <button
              onClick={handleCopy}
              className="text-[10px] text-cyan-500/60 hover:text-cyan-400 flex items-center gap-1 transition-colors"
              title="Copiar texto"
            >
              <i className={`fas ${isCopied ? 'fa-check' : 'fa-copy'}`}></i>
              {isCopied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {!isAI && (
          <div className="w-8 h-8 rounded-full bg-slate-800 border border-slate-600 flex-shrink-0 flex items-center justify-center mt-1">
            <i className="fas fa-user text-slate-400 text-sm"></i>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
