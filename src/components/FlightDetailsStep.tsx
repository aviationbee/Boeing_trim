import React, { useEffect, useRef } from 'react';
import { FlightInputs, AircraftReg, CrewConfig } from '../types/trim';
import { AIRCRAFT_DB } from '../data/aircraftData';
import { lookupRouteByFlightNo } from '../data/routes';
import { Plane, ArrowRight, Info } from 'lucide-react';

interface FlightDetailsStepProps {
  inputs: FlightInputs;
  onChangeInputs: (updated: Partial<FlightInputs>) => void;
  onNext: () => void;
  playChime?: () => void;
}

export const FlightDetailsStep: React.FC<FlightDetailsStepProps> = ({
  inputs,
  onChangeInputs,
  onNext,
  playChime,
}) => {
  const acData = AIRCRAFT_DB[inputs.aircraftReg];
  const dowData = acData.dows[inputs.crewConfig];
  const flightInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Focus the first input box on step load
    if (flightInputRef.current) {
      flightInputRef.current.focus();
    }
  }, []);

  // Extract purely numeric flight number
  const flightNumDigits = inputs.flightNo.replace(/^BS-?/i, '');

  const handleFlightNumChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawVal = e.target.value.replace(/[^0-9]/g, '');
    const fullFlightNo = rawVal ? `BS-${rawVal}` : 'BS-';
    const autoRoute = lookupRouteByFlightNo(rawVal);

    onChangeInputs({
      flightNo: fullFlightNo,
      route: autoRoute,
    });
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Flight & Aircraft Card */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-lg text-slate-100">
        <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-3">
          <Plane className="w-4 h-4 text-cyan-400" />
          <h2 className="text-sm font-mono font-bold uppercase tracking-wider text-slate-200">
            AIRCRAFT & FLIGHT MANIFEST
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-3">
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
              FLIGHT NUMBER
            </label>
            <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-950 focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-500/40">
              <span className="bg-slate-900 text-cyan-400 font-mono font-extrabold px-2.5 py-2 text-sm flex items-center border-r border-slate-800 select-none">
                BS-
              </span>
              <input
                ref={flightInputRef}
                id="flight-num-input"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                value={flightNumDigits}
                onChange={handleFlightNumChange}
                className="w-full bg-transparent px-2 py-2 text-sm font-mono font-bold text-cyan-300 focus:outline-none uppercase"
                placeholder="101"
              />
            </div>
          </div>
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
              ROUTE (AUTO SELECTED)
            </label>
            <input
              type="text"
              value={inputs.route}
              onChange={(e) => onChangeInputs({ route: e.target.value })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-cyan-500 uppercase"
              placeholder="DAC - CGP"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 xs:grid-cols-2 gap-3">
          {/* Aircraft Select */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
              AIRCRAFT REGISTRATION
            </label>
            <select
              value={inputs.aircraftReg}
              onChange={(e) => onChangeInputs({ aircraftReg: e.target.value as AircraftReg })}
              className="w-full bg-slate-950 border border-cyan-500/50 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-emerald-400 focus:outline-none focus:border-cyan-400"
            >
              {(Object.keys(AIRCRAFT_DB) as AircraftReg[]).map((reg) => (
                <option key={reg} value={reg}>
                  {reg} (B737-800)
                </option>
              ))}
            </select>
          </div>

          {/* Crew Config */}
          <div>
            <label className="block text-[11px] font-mono font-semibold text-slate-400 mb-1">
              CREW (COCKPIT / CABIN)
            </label>
            <select
              value={inputs.crewConfig}
              onChange={(e) => onChangeInputs({ crewConfig: e.target.value as CrewConfig })}
              className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3 py-2.5 text-sm font-mono font-bold text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="2/4">2 / 4 Crew</option>
              <option value="2/5">2 / 5 Crew (Std)</option>
              <option value="2/6">2 / 6 Crew</option>
              <option value="3/4">3 / 4 Crew</option>
              <option value="3/5">3 / 5 Crew</option>
              <option value="3/6">3 / 6 Crew</option>
            </select>
          </div>
        </div>

        {/* Live DOW / DOI Banner */}
        <div className="mt-4 bg-slate-950 border border-slate-800 rounded-xl p-3 flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <div>
              <span className="text-slate-400 text-[10px] block">DRY OPERATING WEIGHT (DOW)</span>
              <span className="text-sm font-bold text-slate-100">{dowData.w.toLocaleString()} kg</span>
            </div>
          </div>
          <div className="text-right">
            <span className="text-slate-400 text-[10px] block">DRY OPERATING INDEX (DOI)</span>
            <span className="text-sm font-bold text-cyan-400">{dowData.i.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Next Step Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={() => {
            if (playChime) playChime();
            onNext();
          }}
          className="w-full flex items-center justify-center gap-2 py-3.5 px-6 rounded-2xl bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-mono font-bold text-sm tracking-wider uppercase shadow-lg shadow-cyan-500/20 active:scale-[0.98] transition-all"
        >
          <span>PROCEED TO PASSENGER LOAD</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
