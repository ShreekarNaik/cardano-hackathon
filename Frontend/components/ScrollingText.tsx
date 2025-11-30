import React, { useEffect, useRef, useState } from "react";

interface ScrollingTextProps {
  logs: string[];
  height?: number;
}

interface Line {
  id: string;
  text: string;
  bottom: number;
  blur: number;
  opacity: number;
  isTyping: boolean;
  typedText: string;
}

const ScrollingText: React.FC<ScrollingTextProps> = ({ logs, height = 60 }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const lastLogIndexRef = useRef(0);
  const lineHeight = 20;
  const initialBottom = (height - lineHeight) / 2; // Center vertically

  // Initialize with the last log if available
  useEffect(() => {
    if (lines.length === 0 && logs.length > 0) {
      // Start with the latest log
      lastLogIndexRef.current = logs.length - 1;
      spawnLine(logs[logs.length - 1]);
    }
  }, []);

  // Watch for new logs
  useEffect(() => {
    if (logs.length > 0) {
      const latestLogIndex = logs.length - 1;
      if (latestLogIndex > lastLogIndexRef.current) {
        // New logs arrived
        // Spawn lines for all new logs (or just the latest one to avoid spam)
        // For simplicity, just spawn the latest one
        lastLogIndexRef.current = latestLogIndex;
        spawnLine(logs[latestLogIndex]);
      } else if (lines.length === 0) {
        // Initial load or empty state
        lastLogIndexRef.current = latestLogIndex;
        spawnLine(logs[latestLogIndex]);
      }
    }
  }, [logs]);

  // Animation Loop (single pass through logs, then stop)
  useEffect(() => {
    if (logs.length === 0) return;

    const interval = setInterval(() => {
      // Stop once we've shown the last log
      if (lastLogIndexRef.current >= logs.length - 1) {
        clearInterval(interval);
        return;
      }

      const nextIndex = lastLogIndexRef.current + 1;
      lastLogIndexRef.current = nextIndex;
      spawnLine(logs[nextIndex]);
    }, 2500);

    return () => clearInterval(interval);
  }, [logs, height]);

  const spawnLine = (text: string) => {
    const newLine: Line = {
      id: Math.random().toString(36).substr(2, 9),
      text: text,
      bottom: initialBottom,
      blur: 0,
      opacity: 1,
      isTyping: true,
      typedText: "",
    };

    setLines((prev) => {
      // 1. Move existing lines UP
      const updatedLines = prev
        .map((line) => {
          const newBottom = line.bottom + lineHeight;

          // Calculate effects
          let blur = 0;
          let opacity = 1;

          if (newBottom > initialBottom) {
            const distance = newBottom - initialBottom;
            blur = Math.min(distance * 0.15, 6);
            opacity = Math.max(1 - distance / 35, 0);
          }

          return {
            ...line,
            bottom: newBottom,
            blur,
            opacity,
            isTyping: false, // Stop typing when moving up (should be done by then)
            typedText: line.text, // Ensure full text is shown
          };
        })
        .filter((line) => line.bottom < height + 20); // Allow slightly out of view before removing

      return [...updatedLines, newLine];
    });
  };

  // Typewriter Effect
  useEffect(() => {
    const typingLines = lines.filter((l) => l.isTyping);
    if (typingLines.length === 0) return;

    const interval = setInterval(() => {
      setLines((prev) =>
        prev.map((line) => {
          if (!line.isTyping) return line;

          if (line.typedText.length < line.text.length) {
            return {
              ...line,
              typedText: line.text.substring(0, line.typedText.length + 1),
            };
          } else {
            return {
              ...line,
              isTyping: false,
            };
          }
        })
      );
    }, 30);

    return () => clearInterval(interval);
  }, [lines]);

  return (
    <div
      className="relative w-full h-full overflow-hidden"
      style={{
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 20%, black 100%)",
      }}
    >
      {lines.map((line) => (
        <div
          key={line.id}
          className="scroll-line font-semibold text-sm leading-5 text-white/80 absolute whitespace-nowrap"
          style={{
            bottom: `${line.bottom}px`,
            filter: `blur(${line.blur}px)`,
            opacity: line.opacity,
            transition:
              "bottom 0.8s cubic-bezier(0.2, 0.8, 0.2, 1), filter 0.8s ease, opacity 0.8s ease",
            willChange: "transform, filter, opacity",
            left: "30px",
            right: "56px",
          }}
        >
          {line.isTyping ? line.typedText : line.text}
        </div>
      ))}
    </div>
  );
};

export default ScrollingText;
