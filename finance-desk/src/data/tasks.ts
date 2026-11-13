export type AreaId = "finance" | "sars" | "admin";

export type Area = {
  id: AreaId;
  label: string;
  priority: string;
  rhythm: string;
};

export type Task = {
  id: string;
  area: AreaId;
  title: string;
};

export const AREAS: Area[] = [
  {
    id: "finance",
    label: "Finance operations",
    priority: "High priority",
    rhythm: "Runs daily and weekly",
  },
  {
    id: "sars",
    label: "SARS and tax operations",
    priority: "High priority",
    rhythm: "Runs monthly, quarterly and annually as applicable",
  },
  {
    id: "admin",
    label: "Administration",
    priority: "High priority",
    rhythm: "Runs continuously",
  },
];

export const TASKS: Task[] = [
  { id: "finance-bank", area: "finance", title: "Fetch bank transactions." },
  { id: "finance-categorise", area: "finance", title: "Categorise transactions in accounting software." },
  { id: "finance-match", area: "finance", title: "Match payments to invoices." },
  { id: "finance-duplicates", area: "finance", title: "Detect duplicate transactions." },
  { id: "finance-subscriptions", area: "finance", title: "Identify subscriptions and unnecessary charges." },
  { id: "finance-reminders", area: "finance", title: "Generate overdue invoice reminders and send them." },
  { id: "finance-reconcile", area: "finance", title: "Reconcile bank statements." },
  { id: "sars-vat", area: "sars", title: "Calculate VAT input and output." },
  { id: "sars-vat201", area: "sars", title: "Prepare VAT201 information." },
  { id: "sars-payroll", area: "sars", title: "Prepare payroll tax calculations." },
  { id: "sars-deadlines", area: "sars", title: "Monitor filing and payment deadlines." },
  { id: "sars-provisional", area: "sars", title: "Prepare provisional tax estimates." },
  { id: "sars-docs", area: "sars", title: "Compile supporting documents for tax returns." },
  { id: "sars-flags", area: "sars", title: "Flag missing or incorrect information." },
  { id: "admin-read", area: "admin", title: "Read incoming supplier invoices." },
  { id: "admin-extract", area: "admin", title: "Extract invoice details." },
  { id: "admin-save", area: "admin", title: "Save documents into the correct folders." },
  { id: "admin-request", area: "admin", title: "Request missing invoices from suppliers." },
  { id: "admin-generate", area: "admin", title: "Generate quotations and invoices." },
  { id: "admin-followup", area: "admin", title: "Follow up on unpaid invoices." },
  { id: "admin-reports", area: "admin", title: "Prepare monthly management reports." },
];
