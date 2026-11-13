export type Desk = "finance" | "sars" | "admin";
export type Tone = "review" | "duplicate" | "overdue";

export type ExceptionItem = {
  id: string;
  desk: Desk;
  title: string;
  detail: string;
  tone: Tone;
};

export const DESKS: { id: Desk | "all"; label: string }[] = [
  { id: "all", label: "All" },
  { id: "finance", label: "Finance" },
  { id: "sars", label: "SARS" },
  { id: "admin", label: "Admin" },
];

export const EXCEPTIONS: ExceptionItem[] = [
  {
    id: "tx-unknown",
    desk: "finance",
    title: "Unknown card charge",
    detail: "R 1 200,00 on 3 Nov. No category and no invoice.",
    tone: "review",
  },
  {
    id: "tx-1008-dup",
    desk: "finance",
    title: "Duplicate Northwind receipt",
    detail: "A second R 9 660,00 line for INV-1008. The first one already marked it paid.",
    tone: "duplicate",
  },
  {
    id: "tx-adobe",
    desk: "finance",
    title: "Adobe Creative Cloud",
    detail: "R 249,00 every month. No invoice on file.",
    tone: "review",
  },
  {
    id: "inv-1020",
    desk: "finance",
    title: "Glassroom is overdue",
    detail: "INV-1020 has no matching receipt. A reminder is waiting.",
    tone: "overdue",
  },
  {
    id: "sars-vat",
    desk: "sars",
    title: "October VAT does not balance",
    detail: "Input and output are R 1 240,00 apart.",
    tone: "review",
  },
  {
    id: "sars-vat201",
    desk: "sars",
    title: "VAT201 is missing a document",
    detail: "Metro Fibre’s tax invoice is not in the pack.",
    tone: "overdue",
  },
  {
    id: "sars-payroll",
    desk: "sars",
    title: "Payroll tax does not match",
    detail: "October’s payroll tax figure does not match the payslips.",
    tone: "review",
  },
  {
    id: "admin-folder",
    desk: "admin",
    title: "Invoice has no folder",
    detail: "Paper Press PP-188 was read and still has nowhere to go.",
    tone: "review",
  },
  {
    id: "admin-missing",
    desk: "admin",
    title: "Supplier invoice never arrived",
    detail: "Harbour Studio has not sent the November retainer invoice.",
    tone: "overdue",
  },
  {
    id: "admin-unpaid",
    desk: "admin",
    title: "Paid mark looks wrong",
    detail: "Kite & Co is marked paid, but the receipt belongs to the Northwind duplicate.",
    tone: "duplicate",
  },
];
