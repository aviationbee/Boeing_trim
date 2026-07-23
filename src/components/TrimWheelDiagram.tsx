import React from 'react';

interface TrimWheelDiagramProps {
  units: number;
}

export const TrimWheelDiagram: React.FC<TrimWheelDiagramProps> = ({ units }) => {
  // Clamp units between 0 and 15
  const clampedUnits = Math.max(0, Math.min(15, units));
  
  // Calculate percentage along scale (0 to 15)
  // 0 = top (ANU 15), 15 = bottom (AND 0) or standard cockpit trim tape
  const minVal = 0;
  const maxVal = 15;
  const pct = (clampedUnits - minVal) / (maxVal - minVal);
  
  // SVG Dimensions
  const height = 220;
  const width = 280;
  
  // Scale Y position mapping: Unit 15 at Y=30, Unit 0 at Y=190
  const topY = 35;
  const bottomY = 185;
  const pointerY = bottomY - pct * (bottomY - topY);

  // Green band range (typically 4.0 to 7.0 units for takeoff)
  const greenBandTopY = bottomY - (7.0 / 15) * (bottomY - topY);
  const greenBandBottomY = bottomY - (4.0 / 15) * (bottomY - topY);

  const isInTakeoffGreenBand = clampedUnits >= 4.0 && clampedUnits <= 8.5;

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-100 flex flex-col items-center relative overflow-hidden shadow-xl">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
            STABILIZER TRIM INDICATOR
          </span>
        </div>
        <div className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
          isInTakeoffGreenBand ? 'bg-emerald-950 border border-emerald-700 text-emerald-400' : 'bg-amber-950 border border-amber-700 text-amber-400'
        }`}>
          {isInTakeoffGreenBand ? 'GREEN BAND OK' : 'CHECK FLAP/TRIM'}
        </div>
      </div>

      <div className="relative flex items-center justify-center w-full my-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[320px] h-auto font-mono">
          {/* Outer Cockpit Panel Border */}
          <rect x="10" y="10" width={width - 20} height={height - 20} rx="12" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          
          {/* Main Trim Scale Track */}
          <rect x="110" y={topY} width="24" height={bottomY - topY} fill="#1e293b" rx="4" stroke="#475569" strokeWidth="1" />
          
          {/* Takeoff Green Band (4.0 - 7.0 / 8.5 units) */}
          <rect
            x="111"
            y={greenBandTopY}
            width="22"
            height={greenBandBottomY - greenBandTopY}
            fill="#10b981"
            opacity="0.85"
            rx="2"
          />
          <text x="140" y={(greenBandTopY + greenBandBottomY) / 2 + 3} fill="#10b981" fontSize="9" fontWeight="bold">
            TAKEOFF BAND
          </text>

          {/* Scale Markings & Numbers */}
          {[0, 2, 4, 6, 8, 10, 12, 14, 15].map((u) => {
            const y = bottomY - (u / 15) * (bottomY - topY);
            const isMajor = u % 2 === 0 || u === 15;
            return (
              <g key={u}>
                <line x1="102" y1={y} x2="110" y2={y} stroke={isMajor ? '#94a3b8' : '#64748b'} strokeWidth={isMajor ? 2 : 1} />
                <line x1="134" y1={y} x2="142" y2={y} stroke={isMajor ? '#94a3b8' : '#64748b'} strokeWidth={isMajor ? 2 : 1} />
                <text x="94" y={y + 3} textAnchor="end" fill="#cbd5e1" fontSize="10" fontWeight={isMajor ? 'bold' : 'normal'}>
                  {u}
                </text>
              </g>
            );
          })}

          {/* ANU / AND Direction Indicators */}
          <text x="122" y={topY - 8} textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
            ▲ ANU
          </text>
          <text x="122" y={bottomY + 16} textAnchor="middle" fill="#38bdf8" fontSize="10" fontWeight="bold">
            ▼ AND
          </text>

          {/* Pointer Arrow & Indicator */}
          <g transform={`translate(0, ${pointerY})`}>
            {/* Pointer Arrow Left Side */}
            <polygon points="70,-6 100,0 70,6" fill="#f59e0b" stroke="#fbbf24" strokeWidth="1.5" />
            {/* Horizontal Pointer Bar Across Scale */}
            <line x1="102" y1="0" x2="142" y2="0" stroke="#fbbf24" strokeWidth="3" strokeDasharray="none" />
            {/* Pointer Box Right Side */}
            <rect x="146" y="-12" width="70" height="24" rx="4" fill="#1e1b4b" stroke="#f59e0b" strokeWidth="1.5" />
            <text x="181" y="4" textAnchor="middle" fill="#fef08a" fontSize="12" fontWeight="bold">
              {clampedUnits.toFixed(2)}
            </text>
          </g>

          {/* Decorative Trim Wheel Graphic on the Left */}
          <circle cx="45" cy={height / 2} r="24" fill="#1e293b" stroke="#475569" strokeWidth="3" />
          <circle cx="45" cy={height / 2} r="18" fill="#0f172a" stroke="#64748b" strokeWidth="1" />
          <circle cx="45" cy={height / 2} r="6" fill="#0284c7" />
          <line x1="45" y1={height / 2 - 24} x2="45" y2={height / 2 + 24} stroke="#475569" strokeWidth="2" />
          <line x1="21" y1={height / 2} x2="69" y2={height / 2} stroke="#475569" strokeWidth="2" />
          <text x="45" y={height / 2 + 38} textAnchor="middle" fill="#94a3b8" fontSize="8">
            WHEEL
          </text>
        </svg>
      </div>

      <div className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 mt-2 flex items-center justify-between text-xs font-mono">
        <div>
          <span className="text-slate-400 block text-[10px]">PITCH TRIM VALUE</span>
          <span className="text-xl font-bold text-amber-400">{units.toFixed(2)} UNITS</span>
        </div>
        <div className="text-right">
          <span className="text-slate-400 block text-[10px]">AIRCRAFT DIRECTION</span>
          <span className="text-sm font-semibold text-cyan-300">ANU (NOSE UP)</span>
        </div>
      </div>
    </div>
  );
};
