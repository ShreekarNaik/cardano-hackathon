import React from "react";
import { Download } from "lucide-react";
import { Icon } from "@iconify/react";
import { AgentNode } from "../types";

interface SidebarProps {
  nodes: AgentNode[];
  onAgentClick: (node: AgentNode) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ nodes, onAgentClick }) => {
  // Filter for actual agents only (not context context nodes)
  const agents = nodes.filter(
    (n) => n.type === "orchestrator" || n.type === "sub-agent"
  );

  const getIcon = (titleOrType: string) => {
    const key = titleOrType.toLowerCase();
    const mapping: Record<string, string> = {
      orchestrator: "bi:cpu",
      planner: "bi:journal-check",
      compiler: "bi:code-slash",
      validator: "bi:shield-check",
      indexer: "bi:database",
      crawler: "bi:globe2",
      summarizer: "bi:card-text",
      analyst: "bi:graph-up",
    };
    const iconName = mapping[key] || "bi:robot";
    return <Icon icon={iconName} width={20} height={20} />;
  };

  return (
    <div className="absolute left-6 top-16 bottom-24 w-16 z-30 flex flex-col items-center gap-6 pointer-events-none">
      {/* Floating Container */}
      <div className="glass-panel absolute left-6 top-1/2 -translate-y-1/2 w-16 py-4 rounded-full flex flex-col items-center gap-4 z-20 pointer-events-auto">
        {agents.map((agent) => (
          <div key={agent.id} className="relative group">
            <button
              onClick={() => onAgentClick(agent)}
              className={`
                relative w-12 h-12 flex items-center justify-center transition-all duration-300
                ${
                  agent.status === "active"
                    ? ""
                    : "rounded-full bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                }
                ${
                  agent.status === "error"
                    ? "bg-red-500/20 text-red-400 border border-red-500/50"
                    : ""
                }
              `}
            >
              {agent.status === "active" && (
                <svg
                  className="absolute -top-5 -left-5 w-[88px] h-[88px] pointer-events-none"
                  viewBox="-40 -32 155 155"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <g filter="url(#filter0_ddi_16_242_sidebar)">
                    <g clipPath="url(#clip0_16_242_sidebar)">
                      <rect
                        y="4"
                        width="75"
                        height="75"
                        rx="37.5"
                        fill="black"
                      />
                      <g opacity="0.4" filter="url(#filter1_f_16_242_sidebar)">
                        <path
                          d="M0 60L85 73.5625L0 88V60Z"
                          fill="url(#paint0_linear_16_242_sidebar)"
                        />
                      </g>
                    </g>
                    <rect
                      x="0.25"
                      y="4.25"
                      width="74.5"
                      height="74.5"
                      rx="37.25"
                      stroke="url(#paint1_linear_16_242_sidebar)"
                      strokeWidth="0.5"
                    />
                  </g>
                  <defs>
                    <filter
                      id="filter0_ddi_16_242_sidebar"
                      x="-40"
                      y="-32"
                      width="155"
                      height="155"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="6.25" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.08 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="BackgroundImageFix"
                        result="effect1_dropShadow_16_242_sidebar"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feOffset dy="4" />
                      <feGaussianBlur stdDeviation="20" />
                      <feComposite in2="hardAlpha" operator="out" />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.1 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="effect1_dropShadow_16_242_sidebar"
                        result="effect2_dropShadow_16_242_sidebar"
                      />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="effect2_dropShadow_16_242_sidebar"
                        result="shape"
                      />
                      <feColorMatrix
                        in="SourceAlpha"
                        type="matrix"
                        values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                        result="hardAlpha"
                      />
                      <feMorphology
                        radius="4"
                        operator="dilate"
                        in="SourceAlpha"
                        result="effect3_innerShadow_16_242_sidebar"
                      />
                      <feOffset dx="-1" dy="-2" />
                      <feGaussianBlur stdDeviation="10.8" />
                      <feComposite
                        in2="hardAlpha"
                        operator="arithmetic"
                        k2="-1"
                        k3="1"
                      />
                      <feColorMatrix
                        type="matrix"
                        values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.29 0"
                      />
                      <feBlend
                        mode="normal"
                        in2="shape"
                        result="effect3_innerShadow_16_242_sidebar"
                      />
                    </filter>
                    <filter
                      id="filter1_f_16_242_sidebar"
                      x="-36.5"
                      y="23.5"
                      width="158"
                      height="101"
                      filterUnits="userSpaceOnUse"
                      colorInterpolationFilters="sRGB"
                    >
                      <feFlood floodOpacity="0" result="BackgroundImageFix" />
                      <feBlend
                        mode="normal"
                        in="SourceGraphic"
                        in2="BackgroundImageFix"
                        result="shape"
                      />
                      <feGaussianBlur
                        stdDeviation="18.25"
                        result="effect1_foregroundBlur_16_242_sidebar"
                      />
                    </filter>
                    <linearGradient
                      id="paint0_linear_16_242_sidebar"
                      x1="1.54545"
                      y1="60.4375"
                      x2="10.5301"
                      y2="104.871"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="#D9D9D9" />
                      <stop offset="0.0161739" stopColor="#818181" />
                      <stop offset="0.221192" stopColor="#E5E5E5" />
                      <stop offset="1" stopColor="white" />
                    </linearGradient>
                    <linearGradient
                      id="paint1_linear_16_242_sidebar"
                      x1="-4.5"
                      y1="4"
                      x2="79.5"
                      y2="89"
                      gradientUnits="userSpaceOnUse"
                    >
                      <stop stopColor="white" />
                      <stop
                        offset="0.326923"
                        stopColor="#969696"
                        stopOpacity="0.587597"
                      />
                      <stop
                        offset="0.471154"
                        stopColor="#4D4D4D"
                        stopOpacity="0.8"
                      />
                      <stop
                        offset="0.615385"
                        stopColor="#919191"
                        stopOpacity="0.569231"
                      />
                      <stop offset="0.846154" stopColor="white" />
                      <stop offset="1" stopOpacity="0" />
                    </linearGradient>
                    <clipPath id="clip0_16_242_sidebar">
                      <rect
                        y="4"
                        width="75"
                        height="75"
                        rx="37.5"
                        fill="white"
                      />
                    </clipPath>
                  </defs>
                </svg>
              )}
              <div className="relative z-10">
                {getIcon(agent.title || agent.type)}
              </div>
            </button>

            {/* Tooltip */}
            <div className="absolute left-full ml-4 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-black/80 backdrop-blur-md border border-white/10 rounded-lg text-xs text-white whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
              {agent.title}
              <div className="text-[10px] text-white/50 uppercase tracking-wider mt-0.5">
                {agent.status}
              </div>
            </div>
          </div>
        ))}

        {/* Divider */}
        <div className="w-6 h-px bg-white/20 my-1"></div>

        {/* Global System Action → Download Report */}
        <button
          onClick={() => {
            import("../services/reportGenerator").then((m) =>
              m.downloadReportZip()
            );
          }}
          className="w-10 h-10 rounded-full flex items-center justify-center bg-transparent border border-white/20 text-zinc-400 hover:text-white hover:border-white transition-all"
        >
          <Download size={18} />
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
