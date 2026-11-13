export type Direction = "sent" | "received";
export type InvoiceStatus = "open" | "paid";

export type FollowUp = {
  stage: number;
  sent_at: string;
};

export type Invoice = {
  id: string;
  direction: Direction;
  party_name: string;
  party_email: string;
  invoice_number: string;
  invoice_date: string;
  due_date: string;
  subtotal: number | null;
  vat: number | null;
  total: number | null;
  currency: string;
  status: InvoiceStatus;
  paid_at: string | null;
  needs_check: boolean;
  check_notes: string;
  email_subject: string;
  followups: FollowUp[];
};

export type Extracted = {
  invoice_number: string | null;
  invoice_date: string | null;
  due_date: string | null;
  subtotal: number | null;
  vat: number | null;
  total: number | null;
};
