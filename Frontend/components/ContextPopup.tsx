
import React, { useMemo } from 'react';
import { X, MessageSquare, User, Bot } from 'lucide-react';
import { AgentNode } from '../types';

interface ContextPopupProps {
  node: AgentNode;
  onClose: () => void;
}

const ContextPopup: React.FC<ContextPopupProps> = ({ node, onClose }) => {
  if (!node.details) return null;

  const parsedMessages = useMemo(() => {
    return node.details!.split('\n').map((line, index) => {
      const match = line.match(/^\[(.*?)\] (.*?): (.*)$/);
      if (match) {
        return {
          id: index,
          timestamp: match[1],
          sender: match[2],
          content: match[3],
          isUser: match[2].toLowerCase() === 'user',
        };
      }
      return { id: index, content: line, isUser: false, sender: null, timestamp: null };
    });
  }, [node.details]);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="glass-popup relative w-full max-w-lg rounded-xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center">
              <MessageSquare size={16} className="text-zinc-300" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white tracking-wide">{node.title}</h3>
              <p className="text-xs text-zinc-500 font-mono">CONTEXT STREAM</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-500 hover:text-white hover:bg-zinc-800 rounded-md transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Chat Content */}
        <div className="p-5 overflow-y-auto max-h-[60vh] bg-black flex flex-col gap-4">
          {parsedMessages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-3 ${msg.isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`
                    w-8 h-8 rounded-full flex items-center justify-center shrink-0 border
                    ${msg.isUser
                  ? 'bg-zinc-800 border-zinc-600 text-zinc-300'
                  : 'bg-indigo-950 border-indigo-800 text-indigo-300'}
                `}>
                {msg.isUser ? <User size={14} /> : <Bot size={14} />}
              </div>

              {/* Bubble */}
              <div className={`flex flex-col max-w-[80%] ${msg.isUser ? 'items-end' : 'items-start'}`}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-zinc-500 uppercase">
                    {msg.sender || 'System'}
                  </span>
                  {msg.timestamp && (
                    <span className="text-[10px] font-mono text-zinc-600">
                      {msg.timestamp}
                    </span>
                  )}
                </div>
                <div className={`
                        px-3 py-2 rounded-lg text-sm leading-relaxed border
                        ${msg.isUser
                    ? 'bg-zinc-900 border-zinc-700 text-zinc-200 rounded-tr-none'
                    : 'bg-zinc-950 border-zinc-800 text-zinc-300 rounded-tl-none'}
                    `}>
                  {msg.content}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContextPopup;
