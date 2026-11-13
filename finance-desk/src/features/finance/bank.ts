export type BankLine = {
  id: string;
  booked_on: string;
  description: string;
  amount: number;
};

export const BANK_LINES: BankLine[] = [
  { id: "tx-1008", booked_on: "2026-11-12", description: "NORTHWIND TRADERS INV-1008", amount: 9660 },
  { id: "tx-1008-dup", booked_on: "2026-11-12", description: "NORTHWIND TRADERS INV-1008", amount: 9660 },
  { id: "tx-441", booked_on: "2026-11-11", description: "METRO FIBRE MF-441", amount: -1033.85 },
  { id: "tx-metro-nov", booked_on: "2026-11-08", description: "METRO FIBRE MONTHLY", amount: -899 },
  { id: "tx-metro-oct", booked_on: "2026-10-08", description: "METRO FIBRE MONTHLY", amount: -899 },
  { id: "tx-adobe-nov", booked_on: "2026-11-06", description: "ADOBE CREATIVE CLOUD", amount: -249 },
  { id: "tx-adobe-oct", booked_on: "2026-10-06", description: "ADOBE CREATIVE CLOUD", amount: -249 },
  { id: "tx-unknown", booked_on: "2026-11-03", description: "CARD 4821 UNKNOWN", amount: -1200 },
];
