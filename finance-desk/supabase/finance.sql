-- Eagle Eye finance mock. Safe to run more than once.

create table if not exists public.ee_bank_transactions (
  id text primary key,
  booked_on date not null,
  description text not null,
  amount numeric(12,2) not null,
  category text not null,
  status text not null
);

create table if not exists public.ee_finance_events (
  id text primary key,
  step text not null,
  title text not null,
  detail text not null,
  status text not null
);

alter table public.ee_bank_transactions enable row level security;
alter table public.ee_finance_events enable row level security;

drop policy if exists "read bank lines" on public.ee_bank_transactions;
drop policy if exists "read finance events" on public.ee_finance_events;

create policy "read bank lines" on public.ee_bank_transactions for select using (true);
create policy "read finance events" on public.ee_finance_events for select using (true);

insert into public.ee_bank_transactions (id, booked_on, description, amount, category, status) values
  ('tx-1008', '2026-11-12', 'NORTHWIND TRADERS INV-1008', 9660, 'Customer receipt', 'paid'),
  ('tx-1008-dup', '2026-11-12', 'NORTHWIND TRADERS INV-1008', 9660, 'Customer receipt', 'duplicate'),
  ('tx-441', '2026-11-11', 'METRO FIBRE MF-441', -1033.85, 'Supplier payment', 'paid'),
  ('tx-metro-nov', '2026-11-08', 'METRO FIBRE MONTHLY', -899, 'Subscription', 'filed'),
  ('tx-metro-oct', '2026-10-08', 'METRO FIBRE MONTHLY', -899, 'Subscription', 'filed'),
  ('tx-adobe-nov', '2026-11-06', 'ADOBE CREATIVE CLOUD', -249, 'Subscription', 'review'),
  ('tx-adobe-oct', '2026-10-06', 'ADOBE CREATIVE CLOUD', -249, 'Subscription', 'review'),
  ('tx-unknown', '2026-11-03', 'CARD 4821 UNKNOWN', -1200, 'Uncategorised', 'review')
on conflict (id) do update set
  booked_on = excluded.booked_on,
  description = excluded.description,
  amount = excluded.amount,
  category = excluded.category,
  status = excluded.status;

insert into public.ee_finance_events (id, step, title, detail, status) values
  ('match-tx-1008', 'Match payments to invoices', 'INV-1008 · Northwind Traders', 'Matched R 9 660,00 and marked paid.', 'paid'),
  ('match-tx-441', 'Match payments to invoices', 'MF-441 · Metro Fibre', 'Matched R 1 033,85 and marked paid.', 'paid'),
  ('dup-tx-1008-dup', 'Detect duplicate transactions', 'NORTHWIND TRADERS INV-1008', 'Same amount and narration as tx-1008. Left unmatched.', 'duplicate'),
  ('sub-adobe-nov', 'Identify subscriptions', 'ADOBE CREATIVE CLOUD', 'Recurring charge with no invoice. Flagged as unnecessary.', 'review'),
  ('rem-inv-1020', 'Overdue invoice reminders', 'INV-1020 · Glassroom', 'No matching receipt. Reminder stage 1 recorded.', 'sent'),
  ('recon-tx-unknown', 'Reconcile bank statements', 'CARD 4821 UNKNOWN', 'Still open. No category or invoice.', 'review')
on conflict (id) do update set
  step = excluded.step,
  title = excluded.title,
  detail = excluded.detail,
  status = excluded.status;
