import React, { useState, useEffect } from 'react';
import { Play, Pause } from 'lucide-react';

interface TopBarProps {
  jobId: string;
  isPaused: boolean;
  onTogglePause: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ jobId, isPaused, onTogglePause }) => {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    let interval: any;
    if (!isPaused) {
      interval = setInterval(() => {
        setElapsed((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;

    // Format as HH:MM:SS
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
  };

  return (
    <div className="absolute top-0 left-0 right-0 p-6 flex flex-col lg:flex-row items-start lg:items-end justify-end z-20 pointer-events-none gap-6">

      {/* STATS ROW */}
      <div className="flex flex-wrap gap-4 pointer-events-auto">
        {/* Time Elapsed */}
        <div className="glass-panel h-[64px] rounded-[20px] flex items-center pl-5 pr-[9px] gap-4">
          <span className="font-mono text-xl text-white/80 drop-shadow-md whitespace-nowrap">{formatTime(elapsed)}</span>

          {/* Divider */}
          <div className="h-8 w-px shrink-0"
            style={{ background: 'linear-gradient(180deg, hsla(0, 0%, 100%, 1) 0%, hsla(0, 0%, 59%, 0.59) 20%, hsla(0, 0%, 30%, 0.8) 45%, hsla(0, 0%, 57%, 0.57) 60%, hsla(0, 0%, 100%, 1) 85%, hsla(0, 0%, 0%, 0) 100%)', opacity: 0.8 }}>
          </div>

          {/* Play/Pause Toggle */}
          <button
            onClick={onTogglePause}
            className="glass-panel w-[50px] h-[50px] rounded-[12px] flex items-center justify-center text-white/90 hover:bg-white/5 transition-colors active:scale-95 duration-100 group shrink-0"
          >
            {isPaused ?
              <Play className="w-5 h-5 fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.3)] ml-1" /> :
              <Pause className="w-5 h-5 fill-current drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]" />
            }
          </button>
        </div>

        {/* Job ID */}
        <div className="glass-panel h-[64px] rounded-[20px] flex items-center px-6 min-w-[240px]">
          <span className="font-mono text-lg text-white/50 tracking-wider">JOB ID : <span className="text-white/90 font-medium ml-2">{jobId}</span></span>
        </div>
      </div>
    </div>
  );
};

export default TopBar;