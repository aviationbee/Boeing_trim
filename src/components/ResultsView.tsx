import React, { useState } from 'react';
import { CalcResults, FlightInputs } from '../types/trim';
import { AIRCRAFT_DB } from '../data/aircraftData';
import { TrimWheelDiagram } from './TrimWheelDiagram';
import { CgEnvelopeDiagram } from './CgEnvelopeDiagram';
import { FuselageDiagram } from './FuselageDiagram';
import {
  CheckCircle2,
  AlertOctagon,
  Printer,
  RotateCcw,
  Edit3,
  Copy,
  Share2,
  BookmarkPlus,
  Compass,
  LineChart,
  Plane,
  FileText,
} from 'lucide-react';

interface ResultsViewProps {
  inputs: FlightInputs;
  results: CalcResults;
  onEdit: () => void;
  onRestart: () => void;
  onSaveHistory: () => void;
  playChime?: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
  inputs,
  results,
  onEdit,
  onRestart,
  onSaveHistory,
  playChime,
}) => {
  const [activeTab, setActiveTab] = useState<'trim' | 'envelope' | 'fuselage' | 'loadsheet'>('trim');
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const acData = AIRCRAFT_DB[inputs.aircraftReg];

  // Official Loadsheet text generator
  const loadsheetText = `
==================================================
        US-BANGLA AIRLINES - LOAD & TRIM SHEET
        BOEING 737-800 FLIGHT DISPATCH LOG
==================================================
FLIGHT: ${inputs.flightNo}       DATE: ${new Date().toISOString().slice(0, 10)}
ROUTE: ${inputs.route}        AIRCRAFT: ${inputs.aircraftReg}
CREW: ${inputs.crewConfig}             DOW: ${results.dow} kg / DOI: ${results.doi.toFixed(2)}
--------------------------------------------------
PASSENGER MANIFEST:
  ADULTS: ${inputs.paxAdults} | CHILDREN: ${inputs.paxChildren} | INFANTS: ${inputs.paxInfants}
  TOTAL SEATED PAX: ${results.totalPaxCount} PAX
  TOTAL PAX WEIGHT: ${results.totalPaxWeight.toLocaleString()} KG
  DISTRIBUTION: ZONE A: ${inputs.paxZoneA} | ZONE B: ${inputs.paxZoneB} | ZONE C: ${inputs.paxZoneC}

LOWER DECK CARGO MANIFEST:
  HOLD 1 (FWD): ${inputs.hold1} KG
  HOLD 2 (FWD): ${inputs.hold2} KG
  HOLD 3 (AFT): ${inputs.hold3} KG
  HOLD 4 (AFT): ${inputs.hold4} KG
  TOTAL CARGO WEIGHT: ${results.totalCargoWeight.toLocaleString()} KG

FUEL MANIFEST:
  BLOCK FUEL: ${inputs.blockFuel} KG
  TAXI FUEL: ${inputs.taxiFuel || 200} KG
  TAKEOFF FUEL: ${results.takeoffFuel} KG
  TRIP FUEL: ${inputs.tripFuel} KG
  LANDING FUEL: ${results.landingFuel} KG
--------------------------------------------------
WEIGHT & BALANCE COMPUTATIONS:
  DRY OPERATING WEIGHT (DOW): ${results.dow.toLocaleString()} KG
  ZERO FUEL WEIGHT (ZFW):    ${results.zfw.toLocaleString()} KG (MAX ${acData.mzfw.toLocaleString()} KG)
    ZFW INDEX: ${results.zfwIndex.toFixed(2)} | ZFW %MAC: ${results.zfwMac.toFixed(1)}% [${results.zfwStatus}]

  TAKEOFF WEIGHT (TOW):      ${results.tow.toLocaleString()} KG (MAX ${acData.mtow.toLocaleString()} KG)
    TOW INDEX: ${results.towIndex.toFixed(2)} | TOW %MAC: ${results.towMac.toFixed(1)}% [${results.towStatus}]

  LANDING WEIGHT (LW):        ${results.lw.toLocaleString()} KG (MAX ${acData.mlw.toLocaleString()} KG)
    LW INDEX: ${results.lwIndex.toFixed(2)} | LW %MAC: ${results.lwMac.toFixed(1)}% [${results.lwStatus}]
--------------------------------------------------
STABILIZER TRIM SETTING:
  TAKEOFF TRIM: ${results.stabTrimUnits.toFixed(2)} UNITS ANU (AIRCRAFT NOSE UP)
--------------------------------------------------
STATUS: ${results.isAllOk ? 'APPROVED - ALL WEIGHTS & CG WITHIN CERTIFIED LIMITS' : 'ALERT - LIMITS EXCEEDED'}
LOAD CONTROLLER SIGNATURE: RADOAN RASEL
==================================================
`.trim();

  const handleCopy = () => {
    navigator.clipboard.writeText(loadsheetText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveHistory();
    setSaved(true);
    if (playChime) playChime();
    setTimeout(() => setSaved(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Main STABILIZER TRIM Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-cyan-950 to-slate-900 border-2 border-cyan-500/80 rounded-2xl p-4 shadow-2xl text-center relative overflow-hidden">
        <div className="text-[10px] font-mono tracking-widest text-cyan-400 uppercase mb-1">
          RECOMMENDED TAKEOFF STABILIZER TRIM
        </div>
        <div className="text-4xl sm:text-5xl font-mono font-black text-amber-400 tracking-tight my-1 drop-shadow-md">
          {results.stabTrimUnits.toFixed(2)} <span className="text-xl sm:text-2xl text-amber-300 font-bold">UNITS</span>
        </div>
        <div className="text-xs font-mono text-cyan-300 font-semibold tracking-wide">
          ANU (AIRCRAFT NOSE UP)
        </div>

        {/* Status Badge */}
        <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-mono font-bold">
          {results.isAllOk ? (
            <span className="bg-emerald-950/90 border-emerald-700 text-emerald-400 px-3 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>WEIGHT & CG OK</span>
            </span>
          ) : (
            <span className="bg-rose-950/90 border-rose-700 text-rose-300 px-3 py-1 rounded-full flex items-center gap-1">
              <AlertOctagon className="w-3.5 h-3.5" />
              <span>LIMIT EXCEEDED</span>
            </span>
          )}
        </div>
      </div>

      {/* Warnings List if any */}
      {results.warnings.length > 0 && (
        <div className="bg-rose-950/80 border border-rose-800 rounded-2xl p-3.5 text-xs font-mono text-rose-200 space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-rose-300 mb-1">
            <AlertOctagon className="w-4 h-4 text-rose-400" />
            <span>LOAD CONTROL WARNING ALERTS:</span>
          </div>
          {results.warnings.map((w, i) => (
            <div key={i} className="pl-5 relative before:content-['•'] before:absolute before:left-2 text-[11px]">
              {w}
            </div>
          ))}
        </div>
      )}

      {/* Weight & CG Summary Cards */}
      <div className="grid grid-cols-1 xs:grid-cols-3 gap-2">
        {/* ZFW */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">ZERO FUEL WEIGHT</span>
          <span className="text-lg font-mono font-bold text-purple-300 my-0.5 block">
            {results.zfw.toLocaleString()} <span className="text-xs text-slate-400">kg</span>
          </span>
          <span className="text-xs font-mono font-semibold text-purple-400 block">{results.zfwMac.toFixed(1)}% MAC</span>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded inline-block mt-1 ${
            results.zfwStatus === 'OK' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
          }`}>
            {results.zfwStatus}
          </span>
        </div>

        {/* TOW */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">TAKEOFF WEIGHT</span>
          <span className="text-lg font-mono font-bold text-emerald-300 my-0.5 block">
            {results.tow.toLocaleString()} <span className="text-xs text-slate-400">kg</span>
          </span>
          <span className="text-xs font-mono font-semibold text-emerald-400 block">{results.towMac.toFixed(1)}% MAC</span>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded inline-block mt-1 ${
            results.towStatus === 'OK' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
          }`}>
            {results.towStatus}
          </span>
        </div>

        {/* LW */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 text-center">
          <span className="text-[10px] font-mono font-bold text-slate-400 block uppercase">LANDING WEIGHT</span>
          <span className="text-lg font-mono font-bold text-sky-300 my-0.5 block">
            {results.lw.toLocaleString()} <span className="text-xs text-slate-400">kg</span>
          </span>
          <span className="text-xs font-mono font-semibold text-sky-400 block">{results.lwMac.toFixed(1)}% MAC</span>
          <span className={`text-[10px] font-mono font-bold px-1.5 py-0.5 rounded inline-block mt-1 ${
            results.lwStatus === 'OK' ? 'bg-emerald-950 text-emerald-400' : 'bg-rose-950 text-rose-400'
          }`}>
            {results.lwStatus}
          </span>
        </div>
      </div>

      {/* Interactive Diagram / View Switcher */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-2 shadow-lg">
        <div className="grid grid-cols-4 gap-1 mb-3 p-1 bg-slate-950 rounded-xl border border-slate-800/80 text-[10px] font-mono">
          <button
            onClick={() => setActiveTab('trim')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeTab === 'trim' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5 mb-0.5" />
            <span>TRIM GAUGE</span>
          </button>

          <button
            onClick={() => setActiveTab('envelope')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeTab === 'envelope' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <LineChart className="w-3.5 h-3.5 mb-0.5" />
            <span>MAC GRAPH</span>
          </button>

          <button
            onClick={() => setActiveTab('fuselage')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeTab === 'fuselage' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Plane className="w-3.5 h-3.5 mb-0.5" />
            <span>FUSELAGE</span>
          </button>

          <button
            onClick={() => setActiveTab('loadsheet')}
            className={`py-2 px-1 rounded-lg flex flex-col items-center justify-center transition ${
              activeTab === 'loadsheet' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <FileText className="w-3.5 h-3.5 mb-0.5" />
            <span>LOADSHEET</span>
          </button>
        </div>

        {/* Tab Content Display */}
        <div>
          {activeTab === 'trim' && <TrimWheelDiagram units={results.stabTrimUnits} />}
          {activeTab === 'envelope' && <CgEnvelopeDiagram results={results} aircraftReg={inputs.aircraftReg} />}
          {activeTab === 'fuselage' && <FuselageDiagram inputs={inputs} />}
          {activeTab === 'loadsheet' && (
            <div className="bg-slate-950 border border-slate-800 rounded-xl p-3 text-slate-200 font-mono text-[11px]">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-2">
                <span className="font-bold text-cyan-400">OFFICIAL FLIGHT LOADSHEET</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={handleCopy}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[10px]"
                    title="Copy Text Loadsheet"
                  >
                    <Copy className="w-3 h-3 text-cyan-400" />
                    <span>{copied ? 'COPIED!' : 'COPY'}</span>
                  </button>
                  <button
                    onClick={handlePrint}
                    className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition flex items-center gap-1 text-[10px]"
                    title="Print Loadsheet"
                  >
                    <Printer className="w-3 h-3 text-emerald-400" />
                    <span>PRINT</span>
                  </button>
                </div>
              </div>
              <pre className="whitespace-pre-wrap overflow-x-auto text-[10px] text-slate-300 leading-tight">
                {loadsheetText}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* Action Toolbar */}
      <div className="grid grid-cols-2 xs:grid-cols-3 gap-2 pt-1">
        <button
          type="button"
          onClick={onEdit}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 text-slate-200 font-mono font-bold text-xs hover:bg-slate-700 transition"
        >
          <Edit3 className="w-4 h-4 text-cyan-400" />
          <span>EDIT MANIFEST</span>
        </button>

        <button
          type="button"
          onClick={handleSave}
          className="flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 text-cyan-300 font-mono font-bold text-xs hover:bg-slate-700 transition"
        >
          <BookmarkPlus className="w-4 h-4 text-cyan-400" />
          <span>{saved ? 'SAVED TO LOG!' : 'SAVE HISTORY'}</span>
        </button>

        <button
          type="button"
          onClick={onRestart}
          className="col-span-2 xs:col-span-1 flex items-center justify-center gap-1.5 py-3 px-3 rounded-xl bg-slate-800 text-rose-300 font-mono font-bold text-xs hover:bg-slate-700 transition"
        >
          <RotateCcw className="w-4 h-4 text-rose-400" />
          <span>START OVER</span>
        </button>
      </div>
    </div>
  );
};
