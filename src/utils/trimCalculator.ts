import { AIRCRAFT_DB, CONSTANTS } from '../data/aircraftData';
import { CalcResults, FlightInputs } from '../types/trim';

export function getFuelIndex(fuelWeight: number): number {
  if (fuelWeight <= 0) return 0;
  const table = CONSTANTS.FUEL_TABLE;
  for (let i = 0; i < table.length - 1; i++) {
    const [w1, i1] = table[i];
    const [w2, i2] = table[i + 1];
    if (fuelWeight >= w1 && fuelWeight <= w2) {
      return i1 + ((fuelWeight - w1) / (w2 - w1)) * (i2 - i1);
    }
  }
  return table[table.length - 1][1];
}

export function calculateCgMac(
  weight: number,
  index: number,
  aircraftReg: keyof typeof AIRCRAFT_DB
): number {
  if (weight <= 0) return 0;
  const acData = AIRCRAFT_DB[aircraftReg];
  const { A, B, C } = acData.idxConst;
  const { len, lemac } = acData.mac;
  return (((B * (index - C)) / weight + A - lemac) / len) * 100;
}

export function getStabTrim(weight: number, mac: number): number {
  const { macs, weights, trims } = CONSTANTS.STAB_TRIM_TABLE;
  
  let x1_idx = macs.findIndex((m) => m >= mac) - 1;
  if (x1_idx < 0) x1_idx = 0;
  let x2_idx = x1_idx + 1;
  if (x2_idx >= macs.length) {
    x1_idx = macs.length - 2;
    x2_idx = macs.length - 1;
  }
  
  let y1_idx = weights.findIndex((w) => w >= weight) - 1;
  if (y1_idx < 0) y1_idx = 0;
  let y2_idx = y1_idx + 1;
  if (y2_idx >= weights.length) {
    y1_idx = weights.length - 2;
    y2_idx = weights.length - 1;
  }
  
  const x1 = macs[x1_idx],
    x2 = macs[x2_idx],
    y1 = weights[y1_idx],
    y2 = weights[y2_idx];
    
  const q11 = trims[y1_idx][x1_idx],
    q21 = trims[y1_idx][x2_idx],
    q12 = trims[y2_idx][x1_idx],
    q22 = trims[y2_idx][x2_idx];
    
  const x_frac = (mac - x1) / (x2 - x1);
  const y_frac = (weight - y1) / (y2 - y1);
  
  const val =
    q11 +
    x_frac * (q21 - q11) +
    y_frac * (q12 + x_frac * (q22 - q12) - (q11 + x_frac * (q21 - q11)));
    
  return Math.max(0, Math.min(15, val));
}

export function calculateFlightLoad(inputs: FlightInputs): CalcResults {
  const acData = AIRCRAFT_DB[inputs.aircraftReg];
  const dowData = acData.dows[inputs.crewConfig];
  
  const totalPaxWeight =
    inputs.paxAdults * CONSTANTS.PAX_WEIGHTS.adult +
    inputs.paxChildren * CONSTANTS.PAX_WEIGHTS.child +
    inputs.paxInfants * CONSTANTS.PAX_WEIGHTS.infant;
    
  const seatedPaxCount = inputs.paxAdults + inputs.paxChildren;
  const avgPaxW = seatedPaxCount > 0 ? totalPaxWeight / seatedPaxCount : 0;
  
  const totalCargoWeight = inputs.hold1 + inputs.hold2 + inputs.hold3 + inputs.hold4;
  
  const taxiFuel = inputs.taxiFuel > 0 ? inputs.taxiFuel : CONSTANTS.TAXI_FUEL_DEFAULT;
  const takeoffFuel = Math.max(0, inputs.blockFuel - taxiFuel);
  const landingFuel = Math.max(0, takeoffFuel - inputs.tripFuel);
  
  // ZFW & Index
  const zfw = dowData.w + totalPaxWeight + totalCargoWeight;
  const zfwIndex =
    dowData.i +
    inputs.paxZoneA * avgPaxW * acData.idxInf.paxOA +
    inputs.paxZoneB * avgPaxW * acData.idxInf.paxOB +
    inputs.paxZoneC * avgPaxW * acData.idxInf.paxOC +
    inputs.hold1 * acData.idxInf.hold1 +
    inputs.hold2 * acData.idxInf.hold2 +
    inputs.hold3 * acData.idxInf.hold3 +
    inputs.hold4 * acData.idxInf.hold4;
    
  // TOW & LW
  const tow = zfw + takeoffFuel;
  const towIndex = zfwIndex + getFuelIndex(takeoffFuel);
  
  const lw = zfw + landingFuel;
  const lwIndex = zfwIndex + getFuelIndex(landingFuel);
  
  // MAC %
  const zfwMac = calculateCgMac(zfw, zfwIndex, inputs.aircraftReg);
  const towMac = calculateCgMac(tow, towIndex, inputs.aircraftReg);
  const lwMac = calculateCgMac(lw, lwIndex, inputs.aircraftReg);
  
  // Stab Trim Units for Takeoff
  const stabTrimUnits = getStabTrim(tow, towMac);
  
  // Warnings and Status checks
  const warnings: string[] = [];
  
  const distributedPax = inputs.paxZoneA + inputs.paxZoneB + inputs.paxZoneC;
  if (seatedPaxCount !== distributedPax) {
    warnings.push(
      `Passenger distribution mismatch! Total passengers (${seatedPaxCount}) ≠ Sum of Zones A, B, C (${distributedPax}).`
    );
  }
  
  if (inputs.paxZoneA > acData.paxZones.oa) {
    warnings.push(`Zone A exceeds maximum limit (${acData.paxZones.oa} seats).`);
  }
  if (inputs.paxZoneB > acData.paxZones.ob) {
    warnings.push(`Zone B exceeds maximum limit (${acData.paxZones.ob} seats).`);
  }
  if (inputs.paxZoneC > acData.paxZones.oc) {
    warnings.push(`Zone C exceeds maximum limit (${acData.paxZones.oc} seats).`);
  }
  
  if (inputs.hold1 > acData.holds.h1) {
    warnings.push(`Hold 1 exceeds weight capacity (${acData.holds.h1} kg).`);
  }
  if (inputs.hold2 > acData.holds.h2) {
    warnings.push(`Hold 2 exceeds weight capacity (${acData.holds.h2} kg).`);
  }
  if (inputs.hold3 > acData.holds.h3) {
    warnings.push(`Hold 3 exceeds weight capacity (${acData.holds.h3} kg).`);
  }
  if (inputs.hold4 > acData.holds.h4) {
    warnings.push(`Hold 4 exceeds weight capacity (${acData.holds.h4} kg).`);
  }
  
  const isZfwWtOk = zfw <= acData.mzfw;
  const isZfwCgOk = zfwMac >= CONSTANTS.CG_LIMITS.fwd && zfwMac <= CONSTANTS.CG_LIMITS.aft;
  const zfwStatus = isZfwWtOk ? (isZfwCgOk ? 'OK' : 'CG_OUT') : 'OVERWEIGHT';
  if (!isZfwWtOk) warnings.push(`Zero Fuel Weight (${zfw.toLocaleString()} kg) exceeds MZFW (${acData.mzfw.toLocaleString()} kg)!`);
  if (!isZfwCgOk) warnings.push(`ZFW %MAC (${zfwMac.toFixed(1)}%) is outside envelope limits [8.0% - 35.0%]!`);
  
  const isTowWtOk = tow <= acData.mtow;
  const isTowCgOk = towMac >= CONSTANTS.CG_LIMITS.fwd && towMac <= CONSTANTS.CG_LIMITS.aft;
  const towStatus = isTowWtOk ? (isTowCgOk ? 'OK' : 'CG_OUT') : 'OVERWEIGHT';
  if (!isTowWtOk) warnings.push(`Takeoff Weight (${tow.toLocaleString()} kg) exceeds MTOW (${acData.mtow.toLocaleString()} kg)!`);
  if (!isTowCgOk) warnings.push(`TOW %MAC (${towMac.toFixed(1)}%) is outside envelope limits [8.0% - 35.0%]!`);
  
  const isLwWtOk = lw <= acData.mlw;
  const isLwCgOk = lwMac >= CONSTANTS.CG_LIMITS.fwd && lwMac <= CONSTANTS.CG_LIMITS.aft;
  const lwStatus = isLwWtOk ? (isLwCgOk ? 'OK' : 'CG_OUT') : 'OVERWEIGHT';
  if (!isLwWtOk) warnings.push(`Landing Weight (${lw.toLocaleString()} kg) exceeds MLW (${acData.mlw.toLocaleString()} kg)!`);
  if (!isLwCgOk) warnings.push(`LW %MAC (${lwMac.toFixed(1)}%) is outside envelope limits [8.0% - 35.0%]!`);

  const isAllOk = warnings.length === 0 && zfwStatus === 'OK' && towStatus === 'OK' && lwStatus === 'OK';
  
  return {
    dow: dowData.w,
    doi: dowData.i,
    totalPaxWeight,
    totalPaxCount: seatedPaxCount + inputs.paxInfants,
    totalCargoWeight,
    takeoffFuel,
    landingFuel,
    zfw,
    zfwIndex,
    zfwMac,
    zfwStatus,
    tow,
    towIndex,
    towMac,
    towStatus,
    lw,
    lwIndex,
    lwMac,
    lwStatus,
    stabTrimUnits,
    isAllOk,
    warnings,
  };
}

export function autoDistributePassengers(
  totalSeatedPax: number,
  aircraftReg: keyof typeof AIRCRAFT_DB
): { zoneA: number; zoneB: number; zoneC: number } {
  const acData = AIRCRAFT_DB[aircraftReg];
  const maxA = acData.paxZones.oa;
  const maxB = acData.paxZones.ob;
  const maxC = acData.paxZones.oc;
  const totalCap = maxA + maxB + maxC;
  
  if (totalSeatedPax <= 0) return { zoneA: 0, zoneB: 0, zoneC: 0 };
  
  // Proportional distribution rounded to integers
  let a = Math.min(maxA, Math.round((maxA / totalCap) * totalSeatedPax));
  let b = Math.min(maxB, Math.round((maxB / totalCap) * totalSeatedPax));
  let c = Math.min(maxC, Math.round((maxC / totalCap) * totalSeatedPax));
  
  let currentSum = a + b + c;
  let diff = totalSeatedPax - currentSum;
  
  // Adjust remaining diff
  while (diff !== 0) {
    if (diff > 0) {
      if (b < maxB) { b++; diff--; }
      else if (a < maxA) { a++; diff--; }
      else if (c < maxC) { c++; diff--; }
      else break;
    } else {
      if (c > 0) { c--; diff++; }
      else if (b > 0) { b--; diff++; }
      else if (a > 0) { a--; diff++; }
      else break;
    }
  }
  
  return { zoneA: a, zoneB: b, zoneC: c };
}

export function playAudioChime(type: 'click' | 'calc' | 'error') {
  try {
    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    if (type === 'click') {
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } else if (type === 'calc') {
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
      osc.frequency.setValueAtTime(659.25, ctx.currentTime + 0.08); // E5
      osc.frequency.setValueAtTime(783.99, ctx.currentTime + 0.16); // G5
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } else if (type === 'error') {
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(220, ctx.currentTime);
      osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.1, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
      osc.start();
      osc.stop(ctx.currentTime + 0.25);
    }
  } catch {
    // ignore audio block in non-interactive state
  }
}
