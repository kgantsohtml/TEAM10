import { STAGE_LABELS } from "./config";
import { Invoice } from "./types";

export function money(amount: number | null, currency: string): string {
  if (amount == null) return "—";
  return new Intl.NumberFormat("en-ZA", {
    style: "currency",
    currency: currency || "ZAR",
  }).format(amount);
}

export function followUpBody(stage: number, invoice: Invoice): string {
  const total = money(invoice.total, invoice.currency);
  const name = invoice.party_name || "there";
  const number = invoice.invoice_number || "this invoice";
  const tone = STAGE_LABELS[stage - 1] || "Reminder";

  if (stage === 1) {
    return (
      "Hi " + name + ",\n\n" +
      "A friendly reminder that invoice " + number + " for " + total +
      " was due on " + invoice.due_date + ".\n\n" +
      "Please let us know if it has already been paid."
    );
  }
  if (stage === 2) {
    return (
      "Hi " + name + ",\n\n" +
      "Invoice " + number + " for " + total + " is still open and was due on " +
      invoice.due_date + ".\n\n" +
      "Please arrange payment, or reply with a date we can expect it."
    );
  }
  return (
    tone + "\n\n" +
    "Hi " + name + ",\n\n" +
    "This is the final notice for invoice " + number + " (" + total + "), due " +
    invoice.due_date + ".\n\n" +
    "Please pay or contact us today so we can close it."
  );
}
