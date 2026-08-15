import React from "react";

interface ChatEmptyStateArtProps {
  className?: string;
  width?: number | string;
  animated?: boolean;
}

/**
 * ChatEmptyStateArt
 * Cute, lightweight pixel-art illustration for a Chat page hero / empty state.
 * Pure SVG (no images/fonts), original character inspired by a cozy pixel-creature
 * aesthetic. Fully self-contained — drop it anywhere.
 */
const ChatEmptyStateArt: React.FC<ChatEmptyStateArtProps> = ({
  className,
  width = 260,
  animated = true,
}) => {
  return (
    <div className={className} style={{ display: "inline-block" }}>
      {animated && (
        <style>{`
          @keyframes cea-float {
            0%, 100% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
          }
          @keyframes cea-blink-dot {
            0%, 60%, 100% { opacity: 0.35; }
            30% { opacity: 1; }
          }
          .cea-float-group { animation: cea-float 3s ease-in-out infinite; }
          .cea-dot1 { animation: cea-blink-dot 1.4s infinite; animation-delay: 0s; }
          .cea-dot2 { animation: cea-blink-dot 1.4s infinite; animation-delay: 0.2s; }
          .cea-dot3 { animation: cea-blink-dot 1.4s infinite; animation-delay: 0.4s; }
        `}</style>
      )}
      <svg
        viewBox="0 0 240 216"
        width={width}
        style={{ imageRendering: "pixelated", shapeRendering: "crispEdges" }}
        xmlns="http://www.w3.org/2000/svg"
        role="img"
        aria-label="Cute pixel-art sprout character with a chat bubble"
      >
        {/* ground shadow */}
        <ellipse cx="92" cy="208" rx="58" ry="7" fill="#000000" opacity="0.12" />

        <g className={animated ? "cea-float-group" : undefined}>
          {/* ---- leaves ---- */}
          <rect x="60" y="8" width="24" height="16" fill="#8fca55" />
          <rect x="60" y="16" width="16" height="8" fill="#4f7a2f" />
          <rect x="68" y="0" width="8" height="8" fill="#8fca55" />

          <rect x="100" y="8" width="24" height="16" fill="#8fca55" />
          <rect x="108" y="16" width="16" height="8" fill="#4f7a2f" />
          <rect x="116" y="0" width="8" height="8" fill="#8fca55" />

          {/* ---- stem ---- */}
          <rect x="84" y="24" width="16" height="40" fill="#5c8f3f" />

          {/* ---- body outline (stepped rounded pixel rect) ---- */}
          <rect x="56" y="64" width="72" height="8" fill="#b98d4b" />
          <rect x="40" y="72" width="104" height="8" fill="#b98d4b" />
          <rect x="24" y="80" width="136" height="112" fill="#b98d4b" />
          <rect x="40" y="192" width="104" height="8" fill="#b98d4b" />
          <rect x="56" y="200" width="72" height="8" fill="#b98d4b" />

          {/* ---- body fill ---- */}
          <rect x="48" y="72" width="88" height="8" fill="#f7e3ba" />
          <rect x="32" y="80" width="120" height="112" fill="#f7e3ba" />
          <rect x="48" y="192" width="88" height="8" fill="#f7e3ba" />

          {/* ---- face ---- */}
          <rect x="48" y="112" width="8" height="8" fill="#f6b6b6" />
          <rect x="120" y="112" width="8" height="8" fill="#f6b6b6" />
          <rect x="64" y="104" width="16" height="16" fill="#2a2a2a" />
          <rect x="104" y="104" width="16" height="16" fill="#2a2a2a" />
          <rect x="84" y="128" width="16" height="8" fill="#b98d4b" />
        </g>

        {/* ---- chat bubble accent ---- */}
        <g>
          <rect x="176" y="16" width="56" height="36" fill="#3a5f96" />
          <rect x="180" y="20" width="48" height="28" fill="#8fb8ea" />
          <rect x="184" y="48" width="10" height="8" fill="#3a5f96" />
          <rect x="186" y="48" width="6" height="4" fill="#8fb8ea" />

          <rect className="cea-dot1" x="190" y="30" width="6" height="6" fill="#ffffff" />
          <rect className="cea-dot2" x="202" y="30" width="6" height="6" fill="#ffffff" />
          <rect className="cea-dot3" x="214" y="30" width="6" height="6" fill="#ffffff" />
        </g>
      </svg>
    </div>
  );
};

export default ChatEmptyStateArt;
