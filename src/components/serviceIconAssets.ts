export type ServiceIconName = 'plumbing' | 'ac' | 'gas' | 'heater';

export const serviceIconPaths: Record<ServiceIconName, string[]> = {
  plumbing: [
    'M7 18h10',
    'M9 18V9a5 5 0 0 1 5-5h3',
    'M17 4v5',
    'M15 9h4',
    'M5 13h6',
    'M5 13a2 2 0 1 0 0 4',
  ],
  ac: [
    'M4 7h16v7H4z',
    'M8 17h8',
    'M9 21l1-4',
    'M15 21l-1-4',
    'M7 10h.01',
    'M11 10h6',
  ],
  gas: [
    'M12 21a6 6 0 0 0 6-6c0-4-3-6-4-10-3 2-7 5-7 10a5 5 0 0 0 5 6z',
    'M12 21a3 3 0 0 0 3-3c0-2-1.5-3.2-2.5-5-1.8 1.2-3.5 2.7-3.5 5a3 3 0 0 0 3 3z',
  ],
  heater: [
    'M7 4h10a2 2 0 0 1 2 2v12H5V6a2 2 0 0 1 2-2z',
    'M8 9h8',
    'M8 13h8',
    'M8 18v2',
    'M16 18v2',
  ],
};
