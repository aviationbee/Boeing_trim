export type AircraftReg = 'S2-AJA' | 'S2-AJB' | 'S2-AJE' | 'S2-AJF' | 'S2-AJG' | 'S2-AJH';

export type CrewConfig = '2/4' | '2/5' | '2/6' | '3/4' | '3/5' | '3/6';

export interface AircraftSpec {
  mzfw: number;
  mtow: number;
  mlw: number;
  mac: {
    len: number;
    lemac: number;
  };
  idxConst: {
    A: number;
    B: number;
    C: number;
  };
  dows: Record<CrewConfig, { w: number; i: number }>;
  paxZones: {
    oa: number;
    ob: number;
    oc: number;
  };
  holds: {
    h1: number;
    h2: number;
    h3: number;
    h4: number;
  };
  idxInf: {
    paxOA: number;
    paxOB: number;
    paxOC: number;
    hold1: number;
    hold2: number;
    hold3: number;
    hold4: number;
  };
}

export interface FlightInputs {
  flightNo: string;
  route: string;
  aircraftReg: AircraftReg;
  crewConfig: CrewConfig;
  paxAdults: number;
  paxChildren: number;
  paxInfants: number;
  paxZoneA: number;
  paxZoneB: number;
  paxZoneC: number;
  hold1: number;
  hold2: number;
  hold3: number;
  hold4: number;
  blockFuel: number;
  tripFuel: number;
  taxiFuel: number;
}

export interface CalcResults {
  dow: number;
  doi: number;
  totalPaxWeight: number;
  totalPaxCount: number;
  totalCargoWeight: number;
  takeoffFuel: number;
  landingFuel: number;
  
  zfw: number;
  zfwIndex: number;
  zfwMac: number;
  zfwStatus: 'OK' | 'OVERWEIGHT' | 'CG_OUT';
  
  tow: number;
  towIndex: number;
  towMac: number;
  towStatus: 'OK' | 'OVERWEIGHT' | 'CG_OUT';
  
  lw: number;
  lwIndex: number;
  lwMac: number;
  lwStatus: 'OK' | 'OVERWEIGHT' | 'CG_OUT';
  
  stabTrimUnits: number;
  isAllOk: boolean;
  warnings: string[];
}

export interface LoadsheetHistoryItem {
  id: string;
  timestamp: string;
  inputs: FlightInputs;
  results: CalcResults;
}
