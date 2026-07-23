import React from 'react';
import { FlightInputs } from '../types/trim';
import { AIRCRAFT_DB } from '../data/aircraftData';

interface FuselageDiagramProps {
  inputs: FlightInputs;
}

export const FuselageDiagram: React.FC<FuselageDiagramProps> = ({ inputs }) => {
  const acData = AIRCRAFT_DB[inputs.aircraftReg];

  const maxA = acData.paxZones.oa;
  const maxB = acData.paxZones.ob;
  const maxC = acData.paxZones.oc;

  const pctA = Math.min(100, Math.round((inputs.paxZoneA / maxA) * 100));
  const pctB = Math.min(100, Math.round((inputs.paxZoneB / maxB) * 100));
  const pctC = Math.min(100, Math.round((inputs.paxZoneC / maxC) * 100));

  const pctH1 = Math.min(100, Math.round((inputs.hold1 / acData.holds.h1) * 100));
  const pctH2 = Math.min(100, Math.round((inputs.hold2 / acData.holds.h2) * 100));
  const pctH3 = Math.min(100, Math.round((inputs.hold3 / acData.holds.h3) * 100));
  const pctH4 = Math.min(100, Math.round((inputs.hold4 / acData.holds.h4) * 100));

  const getFillColor = (pct: number) => {
    if (pct > 100) return '#ef4444'; // Red over limit
    if (pct > 80) return '#0284c7'; // Blue high
    if (pct > 40) return '#10b981'; // Green medium
    return '#64748b'; // Gray low
  };

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 text-slate-100 shadow-xl flex flex-col items-center">
      <div className="w-full flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-mono font-bold text-slate-300 uppercase tracking-widest">
            BOEING 737 FUSELAGE LOAD DISTRIBUTION
          </span>
        </div>
        <span className="text-[10px] font-mono text-cyan-400">CABIN & LOWER DECK</span>
      </div>

      <div className="w-full relative flex flex-col items-center my-1">
        <svg viewBox="0 0 340 130" className="w-full max-w-[360px] h-auto font-mono text-[9px]">
          {/* Fuselage Nose Contour */}
          <path
            d="M 20,65 C 20,40 50,20 100,20 L 290,20 C 315,20 325,40 325,65 C 325,90 315,110 290,110 L 100,110 C 50,110 20,90 20,65 Z"
            fill="#0f172a"
            stroke="#334155"
            strokeWidth="2"
          />

          {/* Cockpit Window */}
          <path d="M 28,52 C 32,42 42,38 52,38 L 52,58 Z" fill="#38bdf8" opacity="0.8" />

          {/* Wings Center Outline */}
          <path d="M 150,15 L 180,2 L 205,20 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />
          <path d="M 150,115 L 180,128 L 205,110 Z" fill="#1e293b" stroke="#475569" strokeWidth="1" />

          {/* Horizontal Floor Divider (Passenger vs Lower Deck Cargo) */}
          <line x1="55" y1="65" x2="295" y2="65" stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />

          {/* --- PASSENGER CABIN ZONES (TOP HALF) --- */}
          {/* Zone A (FWD Cabin) */}
          <rect x="60" y="26" width="65" height="34" rx="4" fill={getFillColor(pctA)} opacity="0.85" stroke="#38bdf8" strokeWidth="1" />
          <text x="92" y="40" textAnchor="middle" fill="#ffffff" fontWeight="bold">
            ZONE A
          </text>
          <text x="92" y="53" textAnchor="middle" fill="#e0f2fe" fontSize="8">
            {inputs.paxZoneA}/{maxA} pax
          </text>

          {/* Zone B (MID Cabin over wing) */}
          <rect x="130" y="26" width="75" height="34" rx="4" fill={getFillColor(pctB)} opacity="0.85" stroke="#38bdf8" strokeWidth="1" />
          <text x="167" y="40" textAnchor="middle" fill="#ffffff" fontWeight="bold">
            ZONE B
          </text>
          <text x="167" y="53" textAnchor="middle" fill="#e0f2fe" fontSize="8">
            {inputs.paxZoneB}/{maxB} pax
          </text>

          {/* Zone C (AFT Cabin) */}
          <rect x="210" y="26" width="75" height="34" rx="4" fill={getFillColor(pctC)} opacity="0.85" stroke="#38bdf8" strokeWidth="1" />
          <text x="247" y="40" textAnchor="middle" fill="#ffffff" fontWeight="bold">
            ZONE C
          </text>
          <text x="247" y="53" textAnchor="middle" fill="#e0f2fe" fontSize="8">
            {inputs.paxZoneC}/{maxC} pax
          </text>

          {/* --- LOWER DECK CARGO HOLDS (BOTTOM HALF) --- */}
          {/* Hold 1 (FWD 1) */}
          <rect x="60" y="70" width="30" height="32" rx="3" fill={getFillColor(pctH1)} opacity="0.85" stroke="#f59e0b" strokeWidth="1" />
          <text x="75" y="84" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="8">
            H1
          </text>
          <text x="75" y="96" textAnchor="middle" fill="#fef3c7" fontSize="7">
            {inputs.hold1}kg
          </text>

          {/* Hold 2 (FWD 2) */}
          <rect x="94" y="70" width="48" height="32" rx="3" fill={getFillColor(pctH2)} opacity="0.85" stroke="#f59e0b" strokeWidth="1" />
          <text x="118" y="84" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="8">
            H2 (FWD)
          </text>
          <text x="118" y="96" textAnchor="middle" fill="#fef3c7" fontSize="7">
            {inputs.hold2}kg
          </text>

          {/* Hold 3 (AFT 3) */}
          <rect x="185" y="70" width="60" height="32" rx="3" fill={getFillColor(pctH3)} opacity="0.85" stroke="#f59e0b" strokeWidth="1" />
          <text x="215" y="84" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="8">
            H3 (AFT)
          </text>
          <text x="215" y="96" textAnchor="middle" fill="#fef3c7" fontSize="7">
            {inputs.hold3}kg
          </text>

          {/* Hold 4 (AFT 4) */}
          <rect x="249" y="70" width="36" height="32" rx="3" fill={getFillColor(pctH4)} opacity="0.85" stroke="#f59e0b" strokeWidth="1" />
          <text x="267" y="84" textAnchor="middle" fill="#ffffff" fontWeight="bold" fontSize="8">
            H4
          </text>
          <text x="267" y="96" textAnchor="middle" fill="#fef3c7" fontSize="7">
            {inputs.hold4}kg
          </text>
        </svg>
      </div>

      <div className="w-full grid grid-cols-2 gap-2 mt-2 font-mono text-[11px]">
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center justify-between">
          <span className="text-slate-400">TOTAL PAX SEATED:</span>
          <span className="text-cyan-300 font-bold">{inputs.paxZoneA + inputs.paxZoneB + inputs.paxZoneC} PAX</span>
        </div>
        <div className="bg-slate-900 border border-slate-800 p-2 rounded-lg flex items-center justify-between">
          <span className="text-slate-400">TOTAL CARGO LOAD:</span>
          <span className="text-amber-300 font-bold">{(inputs.hold1 + inputs.hold2 + inputs.hold3 + inputs.hold4).toLocaleString()} KG</span>
        </div>
      </div>
    </div>
  );
};
