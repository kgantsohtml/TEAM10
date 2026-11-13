import { BANK_LINES, BankLine } from "./bank";
import { Invoice } from "@/features/invoices/types";

export type Tone = "paid" | "open" | "overdue" | "review" | "sent" | "duplicate";

export type StreamRow = {
  id: string;
  step: string;
  title: string;
  detail: string;
  tone: Tone;
};

export type FinancePass = {
  invoices: Invoice[];
  rows: StreamRow[];
};

const TODAY = "2026-11-13";

export function runFinanceAgent(source: Invoice[]): FinancePass {
  const invoices = source.map(function (invoice) {
    return { ...invoice, followups: invoice.followups.slice() };
  });
  const paidIds: Record<string, string> = {};
  const rows: StreamRow[] = [];

  BANK_LINES.forEach(function (line) {
    rows.push({
      id: "fetch-" + line.id,
      step: "Fetch bank transactions",
      title: line.description,
      detail: line.booked_on + " · " + signed(line.amount),
      tone: "open",
    });
  });

  const seen: Record<string, string> = {};
  BANK_LINES.forEach(function (line) {
    const key = line.description + "|" + line.amount;
    const category = categorise(line);
    const duplicateOf = seen[key];
    if (!duplicateOf) seen[key] = line.id;

    rows.push({
      id: "cat-" + line.id,
      step: "Categorise transactions",
      title: line.description,
      detail: category,
      tone: category === "Uncategorised" ? "review" : "open",
    });

    if (duplicateOf) {
      rows.push({
        id: "dup-" + line.id,
        step: "Detect duplicate transactions",
        title: line.description,
        detail: "Same amount and narration as " + duplicateOf + ". Left unmatched.",
        tone: "duplicate",
      });
      return;
    }

    const invoice = matchInvoice(line, invoices, paidIds);
    if (invoice) {
      paidIds[invoice.id] = line.id;
      rows.push({
        id: "match-" + line.id,
        step: "Match payments to invoices",
        title: invoice.invoice_number + " · " + invoice.party_name,
        detail: "Matched " + signed(line.amount) + " and marked paid.",
        tone: "paid",
      });
    }

    if (isSubscription(line)) {
      const unnecessary = line.description.indexOf("ADOBE") !== -1;
      rows.push({
        id: "sub-" + line.id,
        step: "Identify subscriptions",
        title: line.description,
        detail: unnecessary
          ? "Recurring charge with no invoice. Flagged as unnecessary."
          : "Recurring supplier charge.",
        tone: unnecessary ? "review" : "open",
      });
    }

    const reconciled = category !== "Uncategorised";
    rows.push({
      id: "recon-" + line.id,
      step: "Reconcile bank statements",
      title: line.description,
      detail: reconciled ? "Cleared on the statement." : "Still open. No category or invoice.",
      tone: reconciled ? "paid" : "review",
    });
  });

  invoices.forEach(function (invoice) {
    if (paidIds[invoice.id]) {
      invoice.status = "paid";
      invoice.paid_at = invoice.paid_at || TODAY + "T08:00:00.000Z";
      return;
    }
    if (invoice.direction === "sent" && invoice.status === "open" && invoice.due_date < TODAY) {
      if (invoice.followups.length === 0) {
        invoice.followups.push({ stage: 1, sent_at: TODAY + "T08:05:00.000Z" });
      }
      rows.push({
        id: "rem-" + invoice.id,
        step: "Overdue invoice reminders",
        title: invoice.invoice_number + " · " + invoice.party_name,
        detail: "No matching receipt. Reminder stage " + invoice.followups.length + " recorded.",
        tone: "sent",
      });
    }
  });

  return { invoices: invoices, rows: rows };
}

function categorise(line: BankLine): string {
  const text = line.description.toUpperCase();
  if (text.indexOf("UNKNOWN") !== -1) return "Uncategorised";
  if (text.indexOf("MONTHLY") !== -1 || text.indexOf("ADOBE") !== -1) return "Subscription";
  if (line.amount > 0) return "Customer receipt";
  return "Supplier payment";
}

function isSubscription(line: BankLine): boolean {
  const text = line.description.toUpperCase();
  return text.indexOf("MONTHLY") !== -1 || text.indexOf("ADOBE") !== -1;
}

function matchInvoice(line: BankLine, invoices: Invoice[], paidIds: Record<string, string>): Invoice | undefined {
  return invoices.find(function (invoice) {
    if (paidIds[invoice.id] || invoice.status === "paid") return false;
    if (!invoice.invoice_number) return false;
    if (line.description.toUpperCase().indexOf(invoice.invoice_number.toUpperCase()) === -1) return false;
    if (invoice.total == null) return false;
    const incoming = line.amount > 0;
    if (incoming && invoice.direction !== "sent") return false;
    if (!incoming && invoice.direction !== "received") return false;
    return Math.abs(Math.abs(line.amount) - invoice.total) < 0.05;
  });
}

function signed(amount: number): string {
  const formatted = new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: "ZAR",
  }).format(Math.abs(amount));
  return amount < 0 ? "-" + formatted : formatted;
}
