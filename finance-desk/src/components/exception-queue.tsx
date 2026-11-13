"use client";

import { FormEvent, useEffect, useState } from "react";
import { DESKS, Desk, EXCEPTIONS, ExceptionItem, Tone } from "@/features/ops/exceptions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Person = { id: string; name: string };
type MapOf = { [id: string]: string };

const PEOPLE_KEY = "ops-desk-people";
const OWNERS_KEY = "ops-desk-exception-owners";
const RESOLVED_KEY = "ops-desk-resolved";
const UNASSIGNED = "unassigned";

const TONE_LABEL: Record<Tone, string> = {
  review: "Review",
  duplicate: "Duplicate",
  overdue: "Overdue",
};

const TONE_CHIP: Record<Tone, string> = {
  review: "border-amber-400/50 bg-amber-400/15 text-amber-200",
  duplicate: "border-rose-400/50 bg-rose-400/15 text-rose-200",
  overdue: "border-orange-400/50 bg-orange-400/15 text-orange-200",
};

const TONE_BAR: Record<Tone, string> = {
  review: "bg-amber-400",
  duplicate: "bg-rose-400",
  overdue: "bg-orange-400",
};

const DESK_CHIP: Record<Desk, string> = {
  finance: "border-sky-400/50 bg-sky-400/15 text-sky-200",
  sars: "border-violet-400/50 bg-violet-400/15 text-violet-200",
  admin: "border-emerald-400/50 bg-emerald-400/15 text-emerald-200",
};

export function ExceptionQueue() {
  const [people, setPeople] = useState<Person[]>([]);
  const [owners, setOwners] = useState<MapOf>({});
  const [resolved, setResolved] = useState<MapOf>({});
  const [name, setName] = useState("");
  const [desk, setDesk] = useState<Desk | "all">("all");
  const [ready, setReady] = useState(false);

  useEffect(function () {
    const savedPeople = window.localStorage.getItem(PEOPLE_KEY);
    const savedOwners = window.localStorage.getItem(OWNERS_KEY);
    const savedResolved = window.localStorage.getItem(RESOLVED_KEY);
    if (savedPeople) setPeople(JSON.parse(savedPeople) as Person[]);
    if (savedOwners) setOwners(JSON.parse(savedOwners) as MapOf);
    if (savedResolved) setResolved(JSON.parse(savedResolved) as MapOf);
    setReady(true);
  }, []);

  useEffect(function () {
    if (!ready) return;
    window.localStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
    window.localStorage.setItem(OWNERS_KEY, JSON.stringify(owners));
    window.localStorage.setItem(RESOLVED_KEY, JSON.stringify(resolved));
  }, [people, owners, resolved, ready]);

  const open = EXCEPTIONS.filter(function (item) {
    return !resolved[item.id];
  });
  const visible = open.filter(function (item) {
    return desk === "all" || item.desk === desk;
  });

  function addPerson() {
    const trimmed = name.trim();
    if (!trimmed) return;
    setPeople(people.concat([{ id: "p-" + Date.now(), name: trimmed }]));
    setName("");
  }

  function removePerson(personId: string) {
    const next: MapOf = {};
    Object.keys(owners).forEach(function (itemId) {
      if (owners[itemId] !== personId) next[itemId] = owners[itemId];
    });
    setOwners(next);
    setPeople(people.filter(function (person) { return person.id !== personId; }));
  }

  function assign(itemId: string, personId: string) {
    const next = { ...owners };
    if (personId) next[itemId] = personId;
    else delete next[itemId];
    setOwners(next);
  }

  function resolve(itemId: string) {
    setResolved({ ...resolved, [itemId]: "1" });
  }

  return (
    <div className="lg:grid lg:grid-cols-[280px_minmax(0,1fr)]">
      <aside className="border-b border-border px-5 py-6 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium">People</h2>
          <span className="text-xs text-muted-foreground">{people.length}</span>
        </div>
        <form
          className="mt-4 flex gap-2"
          onSubmit={function (event: FormEvent) {
            event.preventDefault();
            addPerson();
          }}
        >
          <Input
            value={name}
            placeholder="Add a name"
            aria-label="Person name"
            onChange={function (event) { setName(event.target.value); }}
          />
          <Button type="submit">Add</Button>
        </form>
        {people.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No one yet.</p>
        ) : (
          <ul className="mt-4 flex flex-col gap-2">
            {people.map(function (person) {
              const count = open.filter(function (item) {
                return owners[item.id] === person.id;
              }).length;
              return (
                <li key={person.id} className="flex items-center justify-between gap-3 rounded-xl border border-border px-3 py-2">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium">{person.name}</p>
                    <p className="text-xs text-muted-foreground">{count === 1 ? "1 item" : count + " items"}</p>
                  </div>
                  <Button type="button" variant="outline" size="sm" onClick={function () { removePerson(person.id); }}>
                    Remove
                  </Button>
                </li>
              );
            })}
          </ul>
        )}
      </aside>

      <main className="flex flex-col gap-5 px-5 py-6 sm:px-8">
        <header>
          <h1 className="text-3xl font-semibold tracking-tight">Operations</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {open.length === 0
              ? "Nothing is waiting."
              : open.length === 1
                ? "1 item still needs a person."
                : open.length + " items still need a person."}
          </p>
        </header>

        <div className="flex flex-wrap gap-2">
          {DESKS.map(function (option) {
            const count = option.id === "all"
              ? open.length
              : open.filter(function (item) { return item.desk === option.id; }).length;
            const selected = desk === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={function () { setDesk(option.id); }}
                className={
                  "rounded-full border px-3 py-1 text-sm " +
                  (selected
                    ? "border-foreground bg-foreground text-background"
                    : "border-border text-muted-foreground hover:text-foreground")
                }
              >
                {option.label} {count}
              </button>
            );
          })}
        </div>

        {visible.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border px-4 py-10 text-center text-sm text-muted-foreground">
            Nothing open here.
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {visible.map(function (item) {
              return (
                <QueueRow
                  key={item.id}
                  item={item}
                  people={people}
                  ownerId={owners[item.id] || ""}
                  onAssign={function (personId) { assign(item.id, personId); }}
                  onResolve={function () { resolve(item.id); }}
                />
              );
            })}
          </ul>
        )}
      </main>
    </div>
  );
}

function QueueRow(props: {
  item: ExceptionItem;
  people: Person[];
  ownerId: string;
  onAssign: (personId: string) => void;
  onResolve: () => void;
}) {
  const item = props.item;
  const owner = props.people.find(function (person) { return person.id === props.ownerId; });
  return (
    <li className="flex flex-col gap-3 rounded-xl border border-border bg-card px-3 py-3 sm:flex-row sm:items-center">
      <span className={"h-10 w-1.5 shrink-0 rounded-full " + TONE_BAR[item.tone]} aria-hidden />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-medium">{item.title}</p>
          <Badge variant="outline" className={DESK_CHIP[item.desk]}>{item.desk}</Badge>
          <Badge variant="outline" className={TONE_CHIP[item.tone]}>{TONE_LABEL[item.tone]}</Badge>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">{item.detail}</p>
      </div>
      <div className="flex items-center gap-2">
        <Select
          value={props.ownerId || UNASSIGNED}
          onValueChange={function (value) {
            props.onAssign(!value || value === UNASSIGNED ? "" : value);
          }}
        >
          <SelectTrigger className="w-40 bg-background" aria-label={"Assign " + item.title}>
            <SelectValue placeholder="Unassigned">{owner ? owner.name : "Unassigned"}</SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
            {props.people.map(function (person) {
              return <SelectItem key={person.id} value={person.id}>{person.name}</SelectItem>;
            })}
          </SelectContent>
        </Select>
        <Button type="button" size="sm" onClick={props.onResolve}>Resolve</Button>
      </div>
    </li>
  );
}
