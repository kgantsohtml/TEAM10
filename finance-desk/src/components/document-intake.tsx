"use client";

import { useEffect, useState } from "react";
import { STAGE_LABELS } from "@/features/invoices/config";
import { runFinanceAgent } from "@/features/finance/agent";
import { SAMPLE_INVOICES } from "@/features/invoices/sample";
import { money } from "@/features/invoices/templates";
import { Direction, Invoice } from "@/features/invoices/types";
import { checkInvoice } from "@/features/invoices/validate";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const STORAGE_KEY = "ops-desk-invoices";

export function DocumentIntake() {
  const [invoices, setInvoices] = useState<Invoice[]>(SAMPLE_INVOICES);
  const [ready, setReady] = useState(false);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(function () {
    const saved = window.localStorage.getItem(STORAGE_KEY);
    if (saved) setInvoices(JSON.parse(saved) as Invoice[]);
    setReady(true);
  }, []);

  useEffect(function () {
    if (!ready) return;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(invoices));
  }, [invoices, ready]);

  const view = runFinanceAgent(invoices).invoices;
  const selected = view.find(function (invoice) {
    return invoice.id === openId;
  });

  const owed = sumOpen(view, "sent");
  const overdue = sumOverdue(view);
  const weOwe = sumOpen(view, "received");

  function update(next: Invoice) {
    const problems = checkInvoice(next);
    const saved: Invoice = {
      ...next,
      needs_check: problems.length > 0,
      check_notes: problems.join(". "),
    };
    setInvoices(
      invoices.map(function (invoice) {
        return invoice.id === saved.id ? saved : invoice;
      })
    );
  }

  return (
    <div className="flex flex-col gap-8 px-5 py-6 sm:px-8 sm:py-8">
      <header className="max-w-2xl">
        <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">Admin</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">Document intake</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sent invoices are money owed to us. Received invoices are money we owe. Overdue is worked out from the due date.
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-3">
        <Summary label="Owed to us" value={money(owed, "ZAR")} hint="Sent and still open" />
        <Summary label="Overdue" value={money(overdue, "ZAR")} hint="Open and past the due date" />
        <Summary label="We owe" value={money(weOwe, "ZAR")} hint="Received and still open" />
      </div>

      <Tabs defaultValue="sent" className="gap-4">
        <TabsList>
          <TabsTrigger value="sent">Sent</TabsTrigger>
          <TabsTrigger value="received">Received</TabsTrigger>
        </TabsList>
        <TabsContent value="sent">
          <InvoiceTable
            rows={view.filter(function (invoice) { return invoice.direction === "sent"; })}
            onOpen={setOpenId}
          />
        </TabsContent>
        <TabsContent value="received">
          <InvoiceTable
            rows={view.filter(function (invoice) { return invoice.direction === "received"; })}
            onOpen={setOpenId}
          />
        </TabsContent>
      </Tabs>

      <Dialog
        open={Boolean(selected)}
        onOpenChange={function (open) {
          if (!open) setOpenId(null);
        }}
      >
        {selected ? (
          <InvoiceDetail
            invoice={selected}
            onChange={update}
          />
        ) : null}
      </Dialog>
    </div>
  );
}

function InvoiceTable(props: { rows: Invoice[]; onOpen: (id: string) => void }) {
  return (
    <Card>
      <CardContent className="px-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-10" />
              <TableHead>Party</TableHead>
              <TableHead>Invoice</TableHead>
              <TableHead>Invoice date</TableHead>
              <TableHead>Due</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Status</TableHead>
              <TableHead />
            </TableRow>
          </TableHeader>
          <TableBody>
            {props.rows.map(function (invoice) {
              return (
                <TableRow key={invoice.id}>
                  <TableCell>
                    <StatusDot invoice={invoice} />
                  </TableCell>
                  <TableCell className="whitespace-normal font-medium">{invoice.party_name}</TableCell>
                  <TableCell>{invoice.invoice_number}</TableCell>
                  <TableCell>{invoice.invoice_date}</TableCell>
                  <TableCell>{invoice.due_date}</TableCell>
                  <TableCell>{money(invoice.total, invoice.currency)}</TableCell>
                  <TableCell>
                    <StatusBadge invoice={invoice} />
                  </TableCell>
                  <TableCell>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={function () { props.onOpen(invoice.id); }}
                    >
                      Open
                    </Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function InvoiceDetail(props: {
  invoice: Invoice;
  onChange: (invoice: Invoice) => void;
}) {
  const invoice = props.invoice;
  const overdue = isOverdue(invoice);
  const tone = statusTone(invoice);

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>{invoice.invoice_number || "Invoice"}</DialogTitle>
        <DialogDescription>
          {invoice.direction === "sent" ? "Owed to us" : "We owe"} · {invoice.email_subject}
        </DialogDescription>
      </DialogHeader>

      <p className={"rounded-lg border px-3 py-2 text-sm " + TONE_CLASS[tone]}>
        {tone === "paid"
          ? "Paid. A bank line matched this invoice, so the agent closed it."
          : overdue
            ? "Still open and overdue. The agent already recorded the next reminder."
            : "Open. No matching bank line yet."}
      </p>

      <div className="grid gap-3 sm:grid-cols-2">
        <Field label="Party" value={invoice.party_name} onChange={function (value) { props.onChange({ ...invoice, party_name: value }); }} />
        <Field label="Email" value={invoice.party_email} onChange={function (value) { props.onChange({ ...invoice, party_email: value }); }} />
        <Field label="Invoice number" value={invoice.invoice_number} onChange={function (value) { props.onChange({ ...invoice, invoice_number: value }); }} />
        <Field label="Invoice date" value={invoice.invoice_date} type="date" onChange={function (value) { props.onChange({ ...invoice, invoice_date: value }); }} />
        <Field label="Due date" value={invoice.due_date} type="date" onChange={function (value) { props.onChange({ ...invoice, due_date: value }); }} />
        <NumberField label="Subtotal" value={invoice.subtotal} onChange={function (value) { props.onChange({ ...invoice, subtotal: value }); }} />
        <NumberField label="VAT" value={invoice.vat} onChange={function (value) { props.onChange({ ...invoice, vat: value }); }} />
        <NumberField label="Total" value={invoice.total} onChange={function (value) { props.onChange({ ...invoice, total: value }); }} />
      </div>

      {invoice.needs_check ? (
        <p className="rounded-lg border border-rose-500/40 bg-rose-500/15 px-3 py-2 text-sm text-rose-200">{invoice.check_notes}</p>
      ) : null}

      <div>
        <p className="text-sm font-medium">Follow-up history</p>
        {invoice.followups.length === 0 ? (
          <p className="mt-1 text-sm text-muted-foreground">No reminders yet.</p>
        ) : (
          <ul className="mt-2 flex flex-col gap-1 text-sm text-muted-foreground">
            {invoice.followups.map(function (item) {
              return (
                <li key={item.stage}>
                  Stage {item.stage} · {STAGE_LABELS[item.stage - 1]} · {item.sent_at.slice(0, 10)}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </DialogContent>
  );
}

function Field(props: { label: string; value: string; type?: string; onChange: (value: string) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{props.label}</span>
      <Input
        type={props.type || "text"}
        value={props.value}
        onChange={function (event) { props.onChange(event.target.value); }}
      />
    </label>
  );
}

function NumberField(props: { label: string; value: number | null; onChange: (value: number | null) => void }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm">
      <span className="text-muted-foreground">{props.label}</span>
      <Input
        inputMode="decimal"
        value={props.value == null ? "" : String(props.value)}
        onChange={function (event) {
          const raw = event.target.value.trim();
          props.onChange(raw === "" ? null : Number(raw));
        }}
      />
    </label>
  );
}

function Summary(props: { label: string; value: string; hint: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{props.label}</CardDescription>
        <CardTitle className="text-2xl tracking-tight">{props.value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{props.hint}</CardContent>
    </Card>
  );
}

function StatusDot(props: { invoice: Invoice }) {
  const tone = statusTone(props.invoice);
  return (
    <span
      title={tone}
      aria-label={tone}
      className={"inline-block size-2.5 rounded-full " + DOT_CLASS[tone]}
    />
  );
}

function StatusBadge(props: { invoice: Invoice }) {
  const tone = statusTone(props.invoice);
  const label = props.invoice.status === "paid" ? "Paid" : isOverdue(props.invoice) ? "Overdue" : props.invoice.needs_check ? "Check" : "Open";
  return (
    <Badge variant="outline" className={TONE_CLASS[tone]}>
      {label}
    </Badge>
  );
}

const TONE_CLASS: Record<string, string> = {
  paid: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  overdue: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  review: "border-rose-500/40 bg-rose-500/15 text-rose-300",
  open: "border-zinc-500/40 bg-zinc-500/20 text-zinc-200",
};

const DOT_CLASS: Record<string, string> = {
  paid: "bg-emerald-400",
  overdue: "bg-amber-400",
  review: "bg-rose-400",
  open: "bg-zinc-400",
};

function statusTone(invoice: Invoice): string {
  if (invoice.status === "paid") return "paid";
  if (isOverdue(invoice)) return "overdue";
  if (invoice.needs_check) return "review";
  return "open";
}

function isOverdue(invoice: Invoice): boolean {
  const today = new Date().toISOString().slice(0, 10);
  return invoice.status === "open" && Boolean(invoice.due_date) && invoice.due_date < today;
}

function sumOpen(invoices: Invoice[], direction: Direction): number {
  return invoices.reduce(function (total, invoice) {
    if (invoice.direction !== direction || invoice.status !== "open") return total;
    return total + (invoice.total || 0);
  }, 0);
}

function sumOverdue(invoices: Invoice[]): number {
  return invoices.reduce(function (total, invoice) {
    if (invoice.direction !== "sent" || !isOverdue(invoice)) return total;
    return total + (invoice.total || 0);
  }, 0);
}
