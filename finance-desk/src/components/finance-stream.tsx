"use client";

import { useMemo } from "react";
import { SAMPLE_INVOICES } from "@/features/invoices/sample";
import { runFinanceAgent, StreamRow, Tone } from "@/features/finance/agent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const STEPS = [
  "Fetch bank transactions",
  "Categorise transactions",
  "Match payments to invoices",
  "Detect duplicate transactions",
  "Identify subscriptions",
  "Overdue invoice reminders",
  "Reconcile bank statements",
];

const TONE_CLASS: Record<Tone, string> = {
  paid: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300",
  sent: "border-sky-500/40 bg-sky-500/15 text-sky-300",
  open: "border-zinc-500/40 bg-zinc-500/15 text-zinc-200",
  overdue: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  review: "border-amber-500/40 bg-amber-500/15 text-amber-300",
  duplicate: "border-rose-500/40 bg-rose-500/15 text-rose-300",
};

const TONE_LABEL: Record<Tone, string> = {
  paid: "Paid",
  sent: "Sent",
  open: "Filed",
  overdue: "Overdue",
  review: "Review",
  duplicate: "Duplicate",
};

export function FinanceStream() {
  const pass = useMemo(function () {
    return runFinanceAgent(SAMPLE_INVOICES);
  }, []);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted-foreground">
        The agent already fetched, categorised, matched, and followed on. A matched payment is marked paid. What is still overdue gets a reminder. Nothing here waits for a button.
      </p>
      {STEPS.map(function (step) {
        const rows = pass.rows.filter(function (row) {
          return row.step === step;
        });
        return (
          <section key={step} className="flex flex-col gap-2">
            <h3 className="text-sm font-medium">{step}</h3>
            <Card className="overflow-hidden">
              <CardContent className="px-0">
                <ul className="divide-y divide-border">
                  {rows.map(function (row) {
                    return <StreamLine key={row.id} row={row} />;
                  })}
                </ul>
              </CardContent>
            </Card>
          </section>
        );
      })}
    </div>
  );
}

function StreamLine(props: { row: StreamRow }) {
  const tone = props.row.tone;
  return (
    <li className="flex flex-col gap-2 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <p className="font-medium">{props.row.title}</p>
        <p className="mt-1 text-sm text-muted-foreground">{props.row.detail}</p>
      </div>
      <Badge variant="outline" className={TONE_CLASS[tone]}>
        {TONE_LABEL[tone]}
      </Badge>
    </li>
  );
}
