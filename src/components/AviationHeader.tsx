import React, { useState, useEffect } from 'react';
import { Plane, Wifi, WifiOff, History, RotateCcw, Volume2, VolumeX, Lock } from 'lucide-react';
import { AircraftReg } from '../types/trim';

interface AviationHeaderProps {
  currentStep: number;
  onSelectStep: (step: number) => void;
  aircraftReg: AircraftReg;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onOpenHistory: () => void;
  onReset: () => void;
  onLogout: () => void;
  isOnline: boolean;
}

export const AviationHeader: React.FC<AviationHeaderProps> = ({
  currentStep,
  onSelectStep,
  aircraftReg,
  soundEnabled,
  onToggleSound,
  onOpenHistory,
  onReset,
  onLogout,
  isOnline,
}) => {
  const fullSub = "invented by radoan rasel";
  const [typedText, setTypedText] = useState("");

  useEffect(() => {
    let idx = 0;
    const interval = setInterval(() => {
      if (idx < fullSub.length) {
        setTypedText(fullSub.slice(0, idx + 1));
        idx++;
      } else {
        clearInterval(interval);
      }
    }, 90);
    return () => clearInterval(interval);
  }, []);

  const steps = [
    { id: 1, label: 'FLIGHT', sub: 'Acft & Crew' },
    { id: 2, label: 'PASSENGERS', sub: 'Zones A/B/C' },
    { id: 3, label: 'CARGO & FUEL', sub: 'Holds 1-4' },
    { id: 4, label: 'TRIM RESULT', sub: 'MAC & Trim' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-md">
      {/* Typewriter Header Banner */}
      <div className="bg-slate-950/90 border-b border-cyan-900/40 py-1 px-4 text-center">
        <span className="text-[11px] font-mono font-bold text-cyan-400 tracking-wider">
          BOEING TRIM <span className="text-slate-600 font-normal mx-1">•</span> {typedText}
          <span className="inline-block w-1.5 h-3 ml-1 bg-cyan-400 align-middle animate-pulse" />
        </span>
      </div>

      {/* Top Utility Bar */}
      <div className="max-w-md mx-auto px-4 pt-2.5 pb-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <button
            onClick={onLogout}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="Lock / Return to Login Screen"
          >
            <Lock className="w-3.5 h-3.5" />
          </button>
          <div className="flex items-center gap-1.5 bg-slate-800/90 px-2.5 py-1 rounded-md border border-slate-700 font-mono font-bold text-cyan-400">
            <Plane className="w-3.5 h-3.5 text-cyan-400" />
            <span>{aircraftReg}</span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wide hidden sm:inline">
            US-BANGLA B737
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Offline indicator */}
          <div
            className={`flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
              isOnline
                ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400'
                : 'bg-amber-950/60 border-amber-800 text-amber-400'
            }`}
            title={isOnline ? 'Online - System Synchronized' : 'Offline Mode - Local Engine Active'}
          >
            {isOnline ? <Wifi className="w-3 h-3" /> : <WifiOff className="w-3 h-3" />}
            <span className="hidden xs:inline">{isOnline ? 'ONLINE' : 'OFFLINE'}</span>
          </div>

          {/* Sound Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-1.5 rounded-lg border transition ${
              soundEnabled
                ? 'bg-slate-800 border-cyan-500/50 text-cyan-400'
                : 'bg-slate-800/50 border-slate-700 text-slate-500'
            }`}
            title={soundEnabled ? 'Disable Cockpit Chimes' : 'Enable Cockpit Chimes'}
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* History Drawer */}
          <button
            onClick={onOpenHistory}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-white hover:border-slate-600 transition"
            title="Load Calculation History Log"
          >
            <History className="w-3.5 h-3.5" />
          </button>

          {/* Reset button */}
          <button
            onClick={onReset}
            className="p-1.5 rounded-lg bg-slate-800 border border-slate-700 text-slate-300 hover:text-rose-400 hover:border-rose-500/50 transition"
            title="Reset Form to Defaults"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Step Tabs Navigation */}
      <div className="max-w-md mx-auto px-2 pb-2">
        <div className="grid grid-cols-4 gap-1 p-1 bg-slate-950/60 rounded-xl border border-slate-800/80">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isCompleted = currentStep > step.id;
            return (
              <button
                key={step.id}
                onClick={() => onSelectStep(step.id)}
                className={`flex flex-col items-center justify-center py-1.5 px-1 rounded-lg text-center transition-all ${
                  isActive
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                    : isCompleted
                    ? 'bg-slate-800/80 text-cyan-300 hover:bg-slate-800'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <div className="flex items-center gap-1 text-[11px] font-mono leading-none">
                  <span className="font-semibold">{step.id}.</span>
                  <span className="truncate uppercase tracking-tight">{step.label}</span>
                </div>
                <span
                  className={`text-[9px] mt-0.5 truncate hidden xs:block ${
                    isActive ? 'text-slate-900 font-medium' : 'text-slate-500'
                  }`}
                >
                  {step.sub}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
