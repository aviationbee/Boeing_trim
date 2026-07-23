import React from 'react';
import { LoadsheetHistoryItem } from '../types/trim';
import { X, Trash2, ArrowUpRight, History, Calendar, Plane } from 'lucide-react';

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  historyItems: LoadsheetHistoryItem[];
  onRestore: (item: LoadsheetHistoryItem) => void;
  onClear: () => void;
  onDeleteOne: (id: string) => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  historyItems,
  onRestore,
  onClear,
  onDeleteOne,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-sm bg-slate-900 border-l border-slate-800 text-slate-100 h-full flex flex-col shadow-2xl">
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-4 h-4 text-cyan-400" />
            <h2 className="font-mono font-bold text-sm tracking-wider uppercase text-slate-100">
              OFFLINE LOAD LOG HISTORY
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3 font-mono">
          {historyItems.length === 0 ? (
            <div className="text-center py-12 text-slate-500 text-xs">
              <History className="w-8 h-8 mx-auto mb-2 opacity-40 text-cyan-500" />
              <p>No saved calculation history yet.</p>
              <p className="mt-1 text-[10px]">Calculations saved offline will appear here.</p>
            </div>
          ) : (
            historyItems.map((item) => (
              <div
                key={item.id}
                className="bg-slate-950 border border-slate-800 hover:border-slate-700 rounded-xl p-3 text-xs space-y-1.5 relative group transition"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <div className="flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-cyan-400" />
                    <span className="font-bold text-cyan-300">{item.inputs.flightNo}</span>
                    <span className="text-[10px] text-slate-400">({item.inputs.aircraftReg})</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => onRestore(item)}
                      className="p-1 rounded bg-cyan-950 border border-cyan-800 text-cyan-300 hover:bg-cyan-900 transition text-[10px] flex items-center gap-0.5"
                      title="Load this calculation"
                    >
                      <span>LOAD</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => onDeleteOne(item.id)}
                      className="p-1 rounded bg-rose-950/60 border border-rose-800/60 text-rose-400 hover:bg-rose-900 transition text-[10px]"
                      title="Delete log entry"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-1 text-[11px] text-slate-300">
                  <div>
                    <span className="text-slate-500 text-[10px] block">TOW & %MAC:</span>
                    <span className="font-bold">{item.results.tow.toLocaleString()} kg</span> ({item.results.towMac.toFixed(1)}%)
                  </div>
                  <div>
                    <span className="text-slate-500 text-[10px] block">STAB TRIM:</span>
                    <span className="font-bold text-amber-400">{item.results.stabTrimUnits.toFixed(2)} UNITS</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 text-[9px] text-slate-500 pt-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(item.timestamp).toLocaleString()}</span>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {historyItems.length > 0 && (
          <div className="p-4 border-t border-slate-800">
            <button
              onClick={onClear}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 font-mono font-bold text-xs hover:bg-rose-900 transition"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>CLEAR ALL LOGS</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
