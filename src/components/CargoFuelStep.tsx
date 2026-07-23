import React, { useEffect, useRef } from 'react';
import { FlightInputs } from '../types/trim';
import { AIRCRAFT_DB } from '../data/aircraftData';
import { Package, Fuel, ArrowLeft, Calculator, AlertCircle } from 'lucide-react';

interface CargoFuelStepProps {
  inputs: FlightInputs;
  onChangeInputs: (updated: Partial<FlightInputs>) => void;
  onCalculate: () => void;
  onPrev: () => void;
  playChime?: () => void;
}

export const CargoFuelStep: React.FC<CargoFuelStepProps> = ({
  inputs,
  onChangeInputs,
  onCalculate,
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

  const totalCargo = inputs.hold1 + inputs.hold2 + inputs.hold3 + inputs.hold4;

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
      } else {
        onCalculate();
      }
    }
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Cargo & Baggage Holds Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-100">
        <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-amber-400" />
            <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
              LOWER DECK CARGO HOLDS (KG)
            </h2>
          </div>
          <span className="text-xs font-mono font-bold text-amber-300">
            TOTAL: {totalCargo.toLocaleString()} KG
          </span>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {/* Hold 1 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono font-semibold text-slate-400">FWD HOLD 1</label>
              <span className="text-[10px] font-mono text-slate-500">Max {acData.holds.h1}kg</span>
            </div>
            <input
              ref={firstInputRef}
              id="hold-1"
              type="number"
              enterKeyHint="next"
              value={inputs.hold1 || ''}
              onChange={(e) => onChangeInputs({ hold1: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'hold-2')}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.hold1 > acData.holds.h1 ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
              }`}
              placeholder="0"
            />
          </div>

          {/* Hold 2 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono font-semibold text-slate-400">FWD HOLD 2</label>
              <span className="text-[10px] font-mono text-slate-500">Max {acData.holds.h2}kg</span>
            </div>
            <input
              id="hold-2"
              type="number"
              enterKeyHint="next"
              value={inputs.hold2 || ''}
              onChange={(e) => onChangeInputs({ hold2: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'hold-3')}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.hold2 > acData.holds.h2 ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
              }`}
              placeholder="0"
            />
          </div>

          {/* Hold 3 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono font-semibold text-slate-400">AFT HOLD 3</label>
              <span className="text-[10px] font-mono text-slate-500">Max {acData.holds.h3}kg</span>
            </div>
            <input
              id="hold-3"
              type="number"
              enterKeyHint="next"
              value={inputs.hold3 || ''}
              onChange={(e) => onChangeInputs({ hold3: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'hold-4')}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.hold3 > acData.holds.h3 ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
              }`}
              placeholder="0"
            />
          </div>

          {/* Hold 4 */}
          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="text-[11px] font-mono font-semibold text-slate-400">AFT HOLD 4</label>
              <span className="text-[10px] font-mono text-slate-500">Max {acData.holds.h4}kg</span>
            </div>
            <input
              id="hold-4"
              type="number"
              enterKeyHint="next"
              value={inputs.hold4 || ''}
              onChange={(e) => onChangeInputs({ hold4: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'block-fuel')}
              className={`w-full bg-slate-950 border rounded-xl p-2.5 text-base font-mono font-bold text-slate-100 focus:outline-none ${
                inputs.hold4 > acData.holds.h4 ? 'border-rose-500 text-rose-300' : 'border-slate-700 focus:border-amber-400 focus:ring-2 focus:ring-amber-500/40'
              }`}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Fuel Load Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-100">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Fuel className="w-4 h-4 text-emerald-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
            FUEL MANIFEST (KG)
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          {/* Block Fuel */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
              BLOCK FUEL (RAMP)
            </label>
            <input
              id="block-fuel"
              type="number"
              enterKeyHint="next"
              value={inputs.blockFuel || ''}
              onChange={(e) => onChangeInputs({ blockFuel: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, 'trip-fuel')}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              placeholder="0"
            />
          </div>

          {/* Trip Fuel */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
              TRIP FUEL (ENROUTE)
            </label>
            <input
              id="trip-fuel"
              type="number"
              enterKeyHint="done"
              value={inputs.tripFuel || ''}
              onChange={(e) => onChangeInputs({ tripFuel: Math.max(0, parseInt(e.target.value) || 0) })}
              onKeyDown={(e) => handleKeyDown(e, undefined)}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl p-2.5 text-base font-mono font-bold text-emerald-400 focus:outline-none focus:border-emerald-400 focus:ring-2 focus:ring-emerald-500/40"
              placeholder="0"
            />
          </div>
        </div>

        {/* Taxi Fuel info note */}
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-2.5 flex items-center justify-between text-xs font-mono">
          <div className="flex items-center gap-2 text-slate-400">
            <AlertCircle className="w-4 h-4 text-cyan-400" />
            <span>TAXI FUEL DEDUCTION:</span>
          </div>
          <span className="font-bold text-slate-200">{inputs.taxiFuel || 200} KG</span>
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
            onCalculate();
          }}
          className="flex-[2] flex items-center justify-center gap-2 py-3.5 px-4 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase shadow-xl shadow-emerald-500/20 active:scale-[0.98] transition-all"
        >
          <Calculator className="w-5 h-5" />
          <span>CALCULATE TRIM</span>
        </button>
      </div>
    </div>
  );
};
