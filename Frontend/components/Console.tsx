import React, { useEffect, useRef, useState } from 'react';
import { LogEntry } from '../types';
import { Minus, Maximize2 } from 'lucide-react';

interface ConsoleProps {
  logs: LogEntry[];
}

const Console: React.FC<ConsoleProps> = ({ logs }) => {
  const endRef = useRef<HTMLDivElement>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    if (!isMinimized) {
      endRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [logs, isMinimized]);

  return (
    <div
      className={`glass-panel w-[400px] rounded-[24px] flex flex-col overflow-hidden z-50 transition-all duration-300 ease-in-out ${isMinimized ? 'h-14' : 'h-[250px]'}`}
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        left: '1.5rem',
        top: 'auto',
        right: 'auto'
      }}
    >
      {/* Header with Shiny Bottom Border */}
      <div className="relative h-14 flex items-center justify-between px-6 shrink-0 bg-white/[0.02]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
          <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
          <span className="font-mono text-white/40 text-sm ml-2">Console</span>
        </div>
        <button
          onClick={() => setIsMinimized(!isMinimized)}
          className="text-white/30 hover:text-white transition-colors"
        >
          {isMinimized ? <Maximize2 size={16} /> : <Minus size={16} />}
        </button>

        {/* The Shiny Gradient Line */}
        <div className="absolute bottom-0 left-0 w-full h-[1px]"
          style={{ background: 'linear-gradient(90deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 59%, 0.59) 20%, hsla(0, 0%, 30%, 0.8) 45%, hsla(0, 0%, 57%, 0.57) 60%, hsla(0, 0%, 100%, 1) 85%, hsla(0, 0%, 0%, 0) 100%)', opacity: 0.9 }}>
        </div>
      </div>

      <div className={`flex-1 p-6 overflow-y-auto font-mono text-sm custom-scrollbar leading-loose ${isMinimized ? 'opacity-0' : 'opacity-100'} transition-opacity duration-200`}>
        {logs.map((log) => (
          <div key={log.id} className="mb-1 break-words">
            <span className="text-white/40 mr-2">[{log.timestamp}]</span>
            <span className={`
              ${log.level === 'error' ? 'text-red-400 font-bold' : ''}
              ${log.level === 'warn' ? 'text-yellow-300/80 italic' : ''}
              ${log.level === 'info' ? 'text-white/80' : ''}
              ${log.level === 'debug' ? 'text-white/40' : ''}
            `}>
              {log.message}
            </span>
          </div>
        ))}
        <div ref={endRef} />
        <div className="flex items-center gap-2 mt-2">
          <span className="text-blue-400">➜</span>
          <span className="animate-pulse w-2 h-4 bg-white/60 block"></span>
        </div>
      </div>
    </div>
  );
};

export default Console;