import { VAT_RATE } from "./config";
import { Extracted } from "./types";

export function checkInvoice(inv: Extracted): string[] {
  const problems: string[] = [];
  if (!inv.invoice_number) problems.push("Missing invoice number");
  if (!inv.total) problems.push("Missing total");
  if (inv.subtotal != null && inv.vat != null && inv.total != null) {
    if (Math.abs(inv.subtotal + inv.vat - inv.total) > 0.05) {
      problems.push("Subtotal + VAT does not equal total");
    }
    const expectedVat = inv.subtotal * VAT_RATE;
    if (inv.vat !== 0 && Math.abs(inv.vat - expectedVat) > 0.05) {
      problems.push("VAT is not 15% of subtotal");
    }
  }
  if (inv.due_date && inv.invoice_date && inv.due_date < inv.invoice_date) {
    problems.push("Due date is before invoice date");
  }
  return problems;
}
