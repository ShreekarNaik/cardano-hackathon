
import React from 'react';
import { X, Brain, Terminal, MessageSquare, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AgentNode, AgentActivity } from '../types';

interface AgentHistoryModalProps {
  node: AgentNode;
  onClose: () => void;
}

const AgentHistoryModal: React.FC<AgentHistoryModalProps> = ({ node, onClose }) => {
  if (!node.history) return null;

  const renderActivityItem = (item: AgentActivity, index: number) => {
    switch (item.type) {
      case 'thought':
        return (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-900 border border-zinc-700 flex items-center justify-center shrink-0">
                <Brain size={12} className="text-zinc-500" />
              </div>
              {index !== node.history!.length - 1 && <div className="w-px h-full bg-zinc-800 my-1 group-hover:bg-zinc-700 transition-colors" />}
            </div>
            <div className="pb-6 pt-0.5">
              <div className="text-zinc-500 text-xs font-mono mb-1 flex items-center gap-2">
                <span>THOUGHT</span>
                <span className="text-[10px] opacity-50">{item.timestamp}</span>
              </div>
              <div className="text-zinc-400 text-sm italic leading-relaxed">
                {item.content}
              </div>
            </div>
          </div>
        );

      case 'tool_call':
        return (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-blue-950 border border-blue-800 flex items-center justify-center shrink-0">
                <Terminal size={12} className="text-blue-400" />
              </div>
              {index !== node.history!.length - 1 && <div className="w-px h-full bg-zinc-800 my-1 group-hover:bg-zinc-700 transition-colors" />}
            </div>
            <div className="pb-6 pt-0.5 w-full">
              <div className="text-blue-400 text-xs font-mono mb-2 flex items-center gap-2">
                <span>TOOL CALL: {item.toolName}</span>
                <span className="text-[10px] text-zinc-600">{item.timestamp}</span>
              </div>
              <div className="bg-zinc-950 border border-zinc-800 rounded-md p-3 font-mono text-xs overflow-x-auto relative group-hover:border-zinc-700 transition-colors">
                <div className="absolute top-2 right-2 text-[10px] text-zinc-600">INPUT</div>
                <div className="text-green-400/90">
                  <span className="text-purple-400">function</span> <span className="text-yellow-200">{item.toolName}</span>(
                  <span className="text-zinc-300">
                    {JSON.stringify(item.toolArgs, null, 2)}
                  </span>
                  )
                </div>
              </div>
            </div>
          </div>
        );

      case 'tool_result':
        return (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-emerald-950 border border-emerald-800 flex items-center justify-center shrink-0">
                <CheckCircle2 size={12} className="text-emerald-500" />
              </div>
              {index !== node.history!.length - 1 && <div className="w-px h-full bg-zinc-800 my-1 group-hover:bg-zinc-700 transition-colors" />}
            </div>
            <div className="pb-6 pt-0.5">
              <div className="text-emerald-500 text-xs font-mono mb-1 flex items-center gap-2">
                <span>RESULT</span>
                <span className="text-[10px] opacity-50">{item.timestamp}</span>
              </div>
              <div className="text-zinc-300 text-sm font-mono border-l-2 border-emerald-900 pl-3">
                {item.content}
              </div>
            </div>
          </div>
        );

      case 'output':
        return (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-white text-black flex items-center justify-center shrink-0 shadow-[0_0_10px_rgba(255,255,255,0.2)]">
                <ArrowRight size={14} strokeWidth={3} />
              </div>
              {index !== node.history!.length - 1 && <div className="w-px h-full bg-zinc-800 my-1 group-hover:bg-zinc-700 transition-colors" />}
            </div>
            <div className="pb-8 pt-0.5">
              <div className="text-white text-xs font-bold mb-2 flex items-center gap-2">
                <span>RESPONSE</span>
                <span className="text-[10px] font-normal text-zinc-500">{item.timestamp}</span>
              </div>
              <div className="text-white text-sm leading-relaxed bg-zinc-900/50 p-3 rounded border border-zinc-800">
                {item.content}
              </div>
            </div>
          </div>
        );

      case 'user':
        return (
          <div key={item.id} className="flex gap-4 group">
            <div className="flex flex-col items-center">
              <div className="w-6 h-6 rounded-full bg-zinc-800 border border-zinc-600 flex items-center justify-center shrink-0">
                <MessageSquare size={12} className="text-zinc-300" />
              </div>
              {index !== node.history!.length - 1 && <div className="w-px h-full bg-zinc-800 my-1 group-hover:bg-zinc-700 transition-colors" />}
            </div>
            <div className="pb-6 pt-0.5">
              <div className="text-zinc-400 text-xs font-bold mb-1 flex items-center gap-2">
                <span>USER INPUT</span>
                <span className="text-[10px] font-normal text-zinc-600">{item.timestamp}</span>
              </div>
              <div className="text-zinc-200 text-sm">
                {item.content}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end p-4">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      <div className="glass-popup relative w-full max-w-2xl h-[80vh] rounded-2xl flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-zinc-950">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-white text-black flex items-center justify-center">
              <Brain size={16} />
            </div>
            <div>
              <h3 className="text-base font-bold text-white tracking-wide">{node.title}</h3>
              <p className="text-xs text-zinc-500 font-mono">ID: {node.id} • STATUS: {node.status.toUpperCase()}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-zinc-500 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-black relative">
          <div className="absolute top-0 left-9 bottom-0 w-px bg-zinc-900 pointer-events-none" />
          {node.history.map((item, i) => renderActivityItem(item, i))}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 border-t border-white/10 bg-zinc-950 flex items-center justify-between">
          <span className="text-[10px] text-zinc-600 font-mono">SESSION ID: {Math.random().toString(36).substring(7).toUpperCase()}</span>
          <div className="flex gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
            <span className="text-[10px] text-green-500 font-bold tracking-wider">LIVE STREAM CONNECTED</span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AgentHistoryModal;
