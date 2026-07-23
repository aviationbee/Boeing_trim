export const FLIGHT_ROUTE_MAP: Record<string, string> = {
  // DAC - CXB & CXB - DAC
  '141': 'DAC - CXB', '143': 'DAC - CXB', '145': 'DAC - CXB', '147': 'DAC - CXB', '149': 'DAC - CXB',
  '151': 'DAC - CXB', '153': 'DAC - CXB', '155': 'DAC - CXB', '157': 'DAC - CXB', '159': 'DAC - CXB',
  '142': 'CXB - DAC', '144': 'CXB - DAC', '146': 'CXB - DAC', '148': 'CXB - DAC', '150': 'CXB - DAC',
  '152': 'CXB - DAC', '154': 'CXB - DAC', '156': 'CXB - DAC', '158': 'CXB - DAC', '160': 'CXB - DAC',

  // DXB
  '341': 'DAC - DXB', '343': 'DAC - DXB',
  '342': 'DXB - DAC', '344': 'DXB - DAC',

  // SHJ
  '345': 'DAC - SHJ', '347': 'DAC - SHJ',
  '346': 'SHJ - DAC', '348': 'SHJ - DAC',

  // AUH
  '349': 'DAC - AUH', '351': 'DAC - AUH',
  '350': 'AUH - DAC', '352': 'AUH - DAC',

  // RUH
  '381': 'DAC - RUH', '383': 'DAC - RUH',
  '382': 'RUH - DAC', '384': 'RUH - DAC',

  // JED
  '361': 'DAC - JED', '363': 'DAC - JED',
  '362': 'JED - DAC', '364': 'JED - DAC',

  // MLE
  '337': 'DAC - MLE', '339': 'DAC - MLE',
  '338': 'MLE - DAC', '340': 'MLE - DAC',

  // BKK
  '217': 'DAC - BKK', '219': 'DAC - BKK',
  '218': 'BKK - DAC', '220': 'BKK - DAC',

  // MCT
  '321': 'DAC - MCT', '323': 'DAC - MCT',
  '322': 'MCT - DAC', '324': 'MCT - DAC',

  // DOH
  '333': 'DAC - DOH', '335': 'DAC - DOH',
  '334': 'DOH - DAC', '336': 'DOH - DAC',

  // CCU
  '201': 'DAC - CCU', '203': 'DAC - CCU',
  '202': 'CCU - DAC', '204': 'CCU - DAC',

  // MAA
  '205': 'DAC - MAA', '207': 'DAC - MAA', '209': 'DAC - MAA',
  '206': 'MAA - DAC', '208': 'MAA - DAC', '210': 'MAA - DAC',

  // CAN
  '325': 'DAC - CAN', '327': 'DAC - CAN',
  '326': 'CAN - DAC', '328': 'CAN - DAC',

  // SIN
  '307': 'DAC - SIN', '309': 'DAC - SIN',
  '308': 'SIN - DAC', '310': 'SIN - DAC',

  // KUL
  '315': 'DAC - KUL', '317': 'DAC - KUL', '319': 'DAC - KUL',
  '316': 'KUL - DAC', '318': 'KUL - DAC', '320': 'KUL - DAC',
};

export function lookupRouteByFlightNo(flightNumStr: string): string {
  const clean = flightNumStr.replace(/^BS-?/i, '').trim();
  return FLIGHT_ROUTE_MAP[clean] || 'DAC - CGP';
}
