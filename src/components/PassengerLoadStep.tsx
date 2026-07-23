import React, { useEffect, useRef } from 'react';
import { FlightInputs } from '../types/trim';
import { AIRCRAFT_DB } from '../data/aircraftData';
import { autoDistributePassengers } from '../utils/trimCalculator';
import { Users, ArrowRight, ArrowLeft, Wand2, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface PassengerLoadStepProps {
  inputs: FlightInputs;
  onChangeInputs: (updated: Partial<FlightInputs>) => void;
  onNext: () => void;
  onPrev: () => void;
  playChime?: () => void;
}

export const PassengerLoadStep: React.FC<PassengerLoadStepProps> = ({
  inputs,
  onChangeInputs,
  onNext,
  onPrev,
  playChime,
}) => {
  const acData = AIRCRAFT_DB[inputs.aircraftReg];
  const firstInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus the first input box when step opens
    if (firstInputRef.current) {
      firstInputRef.current.focus();
      if (typeof firstInputRef.current.select === 'function') {
        firstInputRef.current.select();
      }
    }
  }, []);

  const totalSeatedPax = inputs.paxAdults + inputs.paxChildren;
  const totalDistributedPax = inputs.paxZoneA + inputs.paxZoneB + inputs.paxZoneC;
  const isDistMatching = totalSeatedPax === totalDistributedPax;

  const handleAutoDistribute = () => {
    const dist = autoDistributePassengers(totalSeatedPax, inputs.aircraftReg);
    onChangeInputs({
      paxZoneA: dist.zoneA,
      paxZoneB: dist.zoneB,
      paxZoneC: dist.zoneC,
    });
    if (playChime) playChime();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, nextId?: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (nextId) {
        const el = document.getElementById(nextId);
        if (el) {
          el.focus();
          if ('select' in el && typeof el.select === 'function') {
            (el as HTMLInputElement).select();
          }
        }
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Passenger Totals Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-cyan-400" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              PASSENGER HEADCOUNT
            </h2>
          </div>
          <span className="text-[10px] font-mono text-cyan-400">STD PAX WEIGHTS</span>
        </div>

        <div className="grid grid-cols-3 gap-2">
          {/* Adults */}
          <div>
            <label className="block text-[10px] font-mono font-semibold text-slate-400 mb-1">
              ADULTS (75kg)
            </label>
            <input
              ref={firstInputRef}
              id="pax-adults"
              type="number"
              enterKeyHint="next"
              value={inputs.paxAdults || ''}
              onChange={(e) => onChangeInputs({ paxAdults: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'pax-children')}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center text-base font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="0"
            />
          </div>

          {/* Children */}
          <div>
            <label className="block text-[10px] font-mono font-semibold text-slate-400 mb-1">
              CHILDREN (35kg)
            </label>
            <input
              id="pax-children"
              type="number"
              enterKeyHint="next"
              value={inputs.paxChildren || ''}
              onChange={(e) => onChangeInputs({ paxChildren: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'pax-infants')}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center text-base font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="0"
            />
          </div>

          {/* Infants */}
          <div>
            <label className="block text-[10px] font-mono font-semibold text-slate-400 mb-1">
              INFANTS (10kg)
            </label>
            <input
              id="pax-infants"
              type="number"
              enterKeyHint="next"
              value={inputs.paxInfants || ''}
              onChange={(e) => onChangeInputs({ paxInfants: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'pax-zone-a')}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-center text-base font-mono font-bold text-slate-100 focus:outline-none focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40"
              placeholder="0"
            />
          </div>
        </div>

        <div className="mt-3 p-2.5 bg-slate-950 rounded-xl border border-slate-800 flex items-center justify-between text-xs font-mono">
          <span className="text-slate-400">SEATED PAX (ADULT + CHILD):</span>
          <span className="text-cyan-300 font-bold text-sm">{totalSeatedPax} PAX</span>
        </div>
      </div>

      {/* Zone Distribution Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              CABIN SEAT ZONE DISTRIBUTION
            </h2>
          </div>

          <button
            type="button"
            onClick={handleAutoDistribute}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 text-[11px] font-mono font-bold transition"
            title="Auto Distribute Seated Passengers evenly across Zones A, B, C"
          >
            <Wand2 className="w-3 h-3 text-cyan-400" />
            <span>AUTO DISTRIBUTE</span>
          </button>
        </div>

        {/* Live Distribution Match Chip */}
        <div className={`mb-3 p-2.5 rounded-xl border flex items-center justify-between text-xs font-mono ${
          isDistMatching
            ? 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            : 'bg-rose-950/60 border-rose-800 text-rose-300'
        }`}>
          <div className="flex items-center gap-1.5">
            {isDistMatching ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertTriangle className="w-4 h-4 text-rose-400" />}
            <span>DISTRIBUTION STATUS:</span>
          </div>
          <span className="font-bold">
            DISTRIBUTED {totalDistributedPax} / {totalSeatedPax} SEATED
          </span>
        </div>

        {/* Zones Inputs */}
        <div className="space-y-3">
          {/* Zone A */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-semibold text-slate-300">ZONE A (FWD CABIN)</label>
              <span className="text-[10px] font-mono text-slate-400">Max {acData.paxZones.oa} Seats</span>
            </div>
            <input
              id="pax-zone-a"
              type="number"
              enterKeyHint="next"
              value={inputs.paxZoneA || ''}
              onChange={(e) => onChangeInputs({ paxZoneA: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'pax-zone-b')}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.paxZoneA > acData.paxZones.oa ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40'
              }`}
              placeholder="0"
            />
          </div>

          {/* Zone B */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-semibold text-slate-300">ZONE B (MID CABIN)</label>
              <span className="text-[10px] font-mono text-slate-400">Max {acData.paxZones.ob} Seats</span>
            </div>
            <input
              id="pax-zone-b"
              type="number"
              enterKeyHint="next"
              value={inputs.paxZoneB || ''}
              onChange={(e) => onChangeInputs({ paxZoneB: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'pax-zone-c')}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.paxZoneB > acData.paxZones.ob ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40'
              }`}
              placeholder="0"
            />
          </div>

          {/* Zone C */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-xs font-mono font-semibold text-slate-300">ZONE C (AFT CABIN)</label>
              <span className="text-[10px] font-mono text-slate-400">Max {acData.paxZones.oc} Seats</span>
            </div>
            <input
              id="pax-zone-c"
              type="number"
              enterKeyHint="done"
              value={inputs.paxZoneC || ''}
              onChange={(e) => onChangeInputs({ paxZoneC: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, undefined)}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.paxZoneC > acData.paxZones.oc ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-cyan-400 focus:ring-2 focus:ring-cyan-500/40'
              }`}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center gap-2 pt-2">
        <button
          type="button"
          onClick={onPrev}
          className="flex-1 flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-slate-800 text-slate-200 font-mono font-bold text-xs uppercase tracking-wider hover:bg-slate-700 transition"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>BACK</span>
        </button>

        <button
          type="button"
          onClick={() => {
            if (playChime) playChime();
            onNext();
          }}
          className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-mono font-bold text-xs tracking-wider uppercase shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
        >
          <span>PROCEED TO CARGO & FUEL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
