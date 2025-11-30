
import React, { useState } from 'react';
import { Send, CornerDownLeft, Maximize2 } from 'lucide-react';
import { AgentNode } from '../types';

interface InteractionPanelProps {
  node: AgentNode;
  onSubmit: (text: string) => void;
}

const InteractionPanel: React.FC<InteractionPanelProps> = ({ node, onSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    onSubmit(input);
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const headerText = node.title ? `Guidance for ${node.title}` : 'Guidance for Agent';

  return (
    <div
      className="glass-panel w-[400px] p-6 rounded-[20px] min-h-[140px] flex flex-col justify-between group transition-colors relative overflow-hidden z-20"
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        left: 'auto',
        top: 'auto'
      }}
    >
      <div className="space-y-3 z-10">
        <p className="font-semibold text-xs uppercase tracking-widest text-white/40">{headerText}</p>
        <form onSubmit={handleSubmit} className="relative">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Enter guidance..."
            className="w-full bg-transparent text-white/90 text-lg leading-snug placeholder:text-white/20 focus:outline-none"
            autoFocus
          />
        </form>
      </div>
      <div className="flex items-end justify-between z-10 pt-4">
        <p className="text-white/50 text-sm">{node.title}</p>
        <button
          onClick={handleSubmit}
          disabled={!input.trim()}
          className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center opacity-60 hover:opacity-100 transition-all hover:scale-110 disabled:opacity-20 disabled:cursor-not-allowed"
        >
          <Send size={16} className="text-white" />
        </button>
      </div>
      <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-[40px] group-hover:bg-blue-500/20 transition-all duration-500 pointer-events-none"></div>
    </div>
  );
};

export default InteractionPanel;