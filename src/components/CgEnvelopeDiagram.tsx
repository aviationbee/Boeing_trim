import React from 'react';
import { CalcResults } from '../types/trim';
import { AIRCRAFT_DB } from '../data/aircraftData';
import { AircraftReg } from '../types/trim';

interface CgEnvelopeDiagramProps {
  results: CalcResults;
  aircraftReg: AircraftReg;
}

export const CgEnvelopeDiagram: React.FC<CgEnvelopeDiagramProps> = ({ results, aircraftReg }) => {
  const acData = AIRCRAFT_DB[aircraftReg];

  // Graph Limits & Scaling
  const minMac = 4.0;
  const maxMac = 38.0;
  const minWeight = 40000;
  const maxWeight = 82000;

  const width = 340;
  const height = 240;
  const paddingLeft = 45;
  const paddingRight = 15;
  const paddingTop = 25;
  const paddingBottom = 35;

  const plotWidth = width - paddingLeft - paddingRight;
  const plotHeight = height - paddingTop - paddingBottom;

  const mapMacToX = (mac: number) => {
    const clamped = Math.max(minMac, Math.min(maxMac, mac));
    return paddingLeft + ((clamped - minMac) / (maxMac - minMac)) * plotWidth;
  };

  const mapWeightToY = (weight: number) => {
    const clamped = Math.max(minWeight, Math.min(maxWeight, weight));
    return height - paddingBottom - ((clamped - minWeight) / (maxWeight - minWeight)) * plotHeight;
  };

  // Certified Boeing 737 Envelope Polygon Points
  // Forward limit 8.0 %MAC, Aft limit 35.0 %MAC
  // Max weights: MZFW (e.g., 62,731kg), MLW (66,360kg), MTOW (79,015kg)
  const fwdMac = 8.0;
  const aftMac = 35.0;

  const envTopY = mapWeightToY(acData.mtow);
  const envMlwY = mapWeightToY(acData.mlw);
  const envMzfwY = mapWeightToY(acData.mzfw);
  const envBottomY = mapWeightToY(41000);

  const envFwdX = mapMacToX(fwdMac);
  const envAftX = mapMacToX(aftMac);

  // Envelope Polygon string
  const polygonPoints = `
    ${envFwdX},${envBottomY}
    ${envFwdX},${envTopY}
    ${envAftX},${envTopY}
    ${envAftX},${envBottomY}
  `;

  // Plot Points
  const zfwX = mapMacToX(results.zfwMac);
  const zfwY = mapWeightToY(results.zfw);

  const towX = mapMacToX(results.towMac);
  const towY = mapWeightToY(results.tow);

  const lwX = mapMacToX(results.lwMac);
  const lwY = mapWeightToY(results.lw);

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-xl flex flex-col items-center">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
            %MAC CENTER OF GRAVITY ENVELOPE
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400 bg-slate-900 border border-slate-700 px-2 py-0.5 rounded">
          {aircraftReg} CERTIFIED
        </span>
      </div>

      <div className="w-full relative flex items-center justify-center my-1">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full max-w-[360px] h-auto font-mono text-[10px]">
          {/* Background Grid */}
          <rect x={paddingLeft} y={paddingTop} width={plotWidth} height={plotHeight} fill="#0f172a" stroke="#1e293b" />

          {/* Vertical MAC % Grid Lines */}
          {[10, 15, 20, 25, 30, 35].map((m) => {
            const x = mapMacToX(m);
            return (
              <g key={m}>
                <line x1={x} y1={paddingTop} x2={x} y2={height - paddingBottom} stroke="#1e293b" strokeDasharray="3 3" />
                <text x={x} y={height - paddingBottom + 12} textAnchor="middle" fill="#64748b" fontSize="8">
                  {m}%
                </text>
              </g>
            );
          })}

          {/* Horizontal Weight Grid Lines */}
          {[45000, 55000, 65000, 75000].map((w) => {
            const y = mapWeightToY(w);
            return (
              <g key={w}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke="#1e293b" strokeDasharray="3 3" />
                <text x={paddingLeft - 4} y={y + 3} textAnchor="end" fill="#64748b" fontSize="8">
                  {w / 1000}t
                </text>
              </g>
            );
          })}

          {/* Certified Envelope Polygon (Safe Zone) */}
          <polygon points={polygonPoints} fill="#0284c7" opacity="0.12" stroke="#0ea5e9" strokeWidth="1.5" />

          {/* Weight Limit Lines */}
          {/* MTOW Line */}
          <line x1={envFwdX} y1={envTopY} x2={envAftX} y2={envTopY} stroke="#f43f5e" strokeWidth="1.5" strokeDasharray="4 2" />
          <text x={envAftX - 4} y={envTopY - 4} textAnchor="end" fill="#f43f5e" fontSize="7" fontWeight="bold">
            MTOW ({acData.mtow.toLocaleString()} kg)
          </text>

          {/* MLW Line */}
          <line x1={envFwdX} y1={envMlwY} x2={envAftX} y2={envMlwY} stroke="#f59e0b" strokeWidth="1" strokeDasharray="3 2" />
          <text x={envAftX - 4} y={envMlwY - 3} textAnchor="end" fill="#f59e0b" fontSize="7">
            MLW ({acData.mlw.toLocaleString()} kg)
          </text>

          {/* MZFW Line */}
          <line x1={envFwdX} y1={envMzfwY} x2={envAftX} y2={envMzfwY} stroke="#a855f7" strokeWidth="1" strokeDasharray="3 2" />
          <text x={envAftX - 4} y={envMzfwY - 3} textAnchor="end" fill="#a855f7" fontSize="7">
            MZFW ({acData.mzfw.toLocaleString()} kg)
          </text>

          {/* Forward / Aft Limits Labels */}
          <line x1={envFwdX} y1={paddingTop} x2={envFwdX} y2={height - paddingBottom} stroke="#0ea5e9" strokeWidth="1.5" />
          <text x={envFwdX + 2} y={paddingTop + 10} fill="#38bdf8" fontSize="7" fontWeight="bold">
            FWD 8.0%
          </text>

          <line x1={envAftX} y1={paddingTop} x2={envAftX} y2={height - paddingBottom} stroke="#0ea5e9" strokeWidth="1.5" />
          <text x={envAftX - 2} y={paddingTop + 10} textAnchor="end" fill="#38bdf8" fontSize="7" fontWeight="bold">
            AFT 35.0%
          </text>

          {/* Connecting Line: ZFW -> TOW -> LW */}
          <polyline points={`${zfwX},${zfwY} ${towX},${towY} ${lwX},${lwY}`} fill="none" stroke="#e2e8f0" strokeWidth="1.5" strokeDasharray="2 2" />

          {/* Plotted Dot 1: ZFW */}
          <circle cx={zfwX} cy={zfwY} r="5" fill="#a855f7" stroke="#ffffff" strokeWidth="1.5" />
          <text x={zfwX + 7} y={zfwY + 3} fill="#c084fc" fontSize="8" fontWeight="bold">
            ZFW ({results.zfwMac.toFixed(1)}%)
          </text>

          {/* Plotted Dot 2: TOW */}
          <circle cx={towX} cy={towY} r="6" fill="#10b981" stroke="#ffffff" strokeWidth="1.5" />
          <text x={towX + 8} y={towY + 3} fill="#34d399" fontSize="8" fontWeight="bold">
            TOW ({results.towMac.toFixed(1)}%)
          </text>

          {/* Plotted Dot 3: LW */}
          <circle cx={lwX} cy={lwY} r="5" fill="#38bdf8" stroke="#ffffff" strokeWidth="1.5" />
          <text x={lwX + 7} y={lwY + 3} fill="#7dd3fc" fontSize="8" fontWeight="bold">
            LW ({results.lwMac.toFixed(1)}%)
          </text>

          {/* Axis Labels */}
          <text x={width / 2 + 15} y={height - 6} textAnchor="middle" fill="#94a3b8" fontSize="9" fontWeight="bold">
            CENTER OF GRAVITY (% MAC)
          </text>
          <text
            x={12}
            y={height / 2}
            textAnchor="middle"
            fill="#94a3b8"
            fontSize="9"
            fontWeight="bold"
            transform={`rotate(-90, 12, ${height / 2})`}
          >
            WEIGHT (KG)
          </text>
        </svg>
      </div>

      {/* Envelope Status Legend */}
      <div className="w-full grid grid-cols-3 gap-2 mt-2 text-center text-[10px] font-mono">
        <div className="bg-slate-900 border border-purple-950/60 p-2 rounded-lg">
          <span className="text-purple-400 block font-bold">ZFW</span>
          <span className="text-slate-200">{results.zfw.toLocaleString()} kg</span>
          <span className="text-purple-300 block font-bold">{results.zfwMac.toFixed(1)}% MAC</span>
        </div>
        <div className="bg-slate-900 border border-emerald-950/60 p-2 rounded-lg">
          <span className="text-emerald-400 block font-bold">TOW</span>
          <span className="text-slate-200">{results.tow.toLocaleString()} kg</span>
          <span className="text-emerald-300 block font-bold">{results.towMac.toFixed(1)}% MAC</span>
        </div>
        <div className="bg-slate-900 border border-sky-950/60 p-2 rounded-lg">
          <span className="text-sky-400 block font-bold">LW</span>
          <span className="text-slate-200">{results.lw.toLocaleString()} kg</span>
          <span className="text-sky-300 block font-bold">{results.lwMac.toFixed(1)}% MAC</span>
        </div>
      </div>
    </div>
  );
};
