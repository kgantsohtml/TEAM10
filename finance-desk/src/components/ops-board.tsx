"use client";

import { FormEvent, useEffect, useState } from "react";
import { FolderOpen, Landmark, Scale, type LucideIcon } from "lucide-react";
import { AREAS, AreaId, TASKS, Task } from "@/data/tasks";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentIntake } from "@/components/document-intake";
import { FinanceStream } from "@/components/finance-stream";
import { EagleEyeLogo } from "@/components/eagle-eye-logo";

type Person = {
  id: string;
  name: string;
};

type Owners = {
  [taskId: string]: string;
};

const PEOPLE_KEY = "ops-desk-people";
const OWNERS_KEY = "ops-desk-owners";
const UNASSIGNED = "unassigned";

const AREA_ICONS: Record<AreaId, LucideIcon> = {
  finance: Landmark,
  sars: Scale,
  admin: FolderOpen,
};

export function OpsBoard() {
  const [people, setPeople] = useState<Person[]>([]);
  const [owners, setOwners] = useState<Owners>({});
  const [name, setName] = useState("");
  const [ready, setReady] = useState(false);
  const [section, setSection] = useState("ops");

  useEffect(function () {
    const savedPeople = window.localStorage.getItem(PEOPLE_KEY);
    const savedOwners = window.localStorage.getItem(OWNERS_KEY);
    if (savedPeople) setPeople(JSON.parse(savedPeople) as Person[]);
    if (savedOwners) setOwners(JSON.parse(savedOwners) as Owners);
    setReady(true);
  }, []);

  useEffect(function () {
    if (!ready) return;
    window.localStorage.setItem(PEOPLE_KEY, JSON.stringify(people));
    window.localStorage.setItem(OWNERS_KEY, JSON.stringify(owners));
  }, [people, owners, ready]);

  function addPerson() {
    const trimmed = name.trim();
    if (!trimmed) return;
    const person: Person = { id: "p-" + Date.now(), name: trimmed };
    setPeople(people.concat([person]));
    setName("");
  }

  function removePerson(personId: string) {
    const nextOwners: Owners = {};
    Object.keys(owners).forEach(function (taskId) {
      if (owners[taskId] !== personId) nextOwners[taskId] = owners[taskId];
    });
    setOwners(nextOwners);
    setPeople(
      people.filter(function (person) {
        return person.id !== personId;
      })
    );
  }

  function assign(taskId: string, personId: string) {
    const next: Owners = {};
    Object.keys(owners).forEach(function (id) {
      if (owners[id] !== personId) next[id] = owners[id];
    });
    if (personId) next[taskId] = personId;
    setOwners(next);
  }

  const assignedCount = Object.keys(owners).length;
  const openCountTotal = TASKS.length - assignedCount;
  const ownedShare = Math.round((assignedCount / TASKS.length) * 100);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border px-5 py-3">
        <div className="flex items-center gap-3">
          <EagleEyeLogo className="size-9 shrink-0 text-foreground" />
          <p className="text-sm font-semibold tracking-tight">Eagle Eye</p>
        </div>
        <Tabs
          value={section}
          onValueChange={function (value) {
            setSection(String(value));
          }}
        >
          <TabsList>
            <TabsTrigger value="ops">Operations</TabsTrigger>
            <TabsTrigger value="intake">Document intake (Admin)</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      {section === "intake" ? (
        <DocumentIntake />
      ) : (
    <div className="lg:grid lg:grid-cols-[300px_minmax(0,1fr)]">
      <aside className="flex flex-col gap-6 border-b border-border bg-background px-5 py-6 lg:sticky lg:top-0 lg:h-screen lg:border-r lg:border-b-0">
        <div className="flex min-h-0 flex-1 flex-col gap-4">
          <div className="flex items-start justify-between gap-3">
            <h2 className="text-sm font-medium">People</h2>
            <Badge variant="outline">
              {people.length === 1 ? "1 person" : people.length + " people"}
            </Badge>
          </div>
          <div>
            <p className="mt-1 text-sm text-muted-foreground">
              One person, one point. Assigning them again moves that ownership.
            </p>
          </div>

          <form
            className="flex gap-2"
            onSubmit={function (event: FormEvent) {
              event.preventDefault();
              addPerson();
            }}
          >
            <Input
              value={name}
              placeholder="Add a name"
              aria-label="Person name"
              onChange={function (event) {
                setName(event.target.value);
              }}
            />
            <Button type="submit">Add</Button>
          </form>

          {people.length === 0 ? (
            <div className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
              No one on the desk yet.
            </div>
          ) : (
            <ul className="flex flex-col gap-2 overflow-auto">
              {people.map(function (person) {
                const task = taskForPerson(person.id, owners);
                return (
                  <li key={person.id} className="rounded-xl border border-border bg-card px-3 py-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="truncate font-medium">{person.name}</p>
                        <p className="mt-1 text-sm text-muted-foreground">
                          {task ? task.title.replace(/\.$/, "") : "Open — no point yet"}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={function () {
                          removePerson(person.id);
                        }}
                      >
                        Remove
                      </Button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </aside>

      <main className="flex flex-col gap-8 px-5 py-6 sm:px-8 sm:py-8">
        <header className="flex flex-col gap-5">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="max-w-xl">
              <p className="text-[11px] tracking-[0.22em] text-muted-foreground uppercase">
                High priority
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Operations desk
              </h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Finance, tax, and administration. Each point has a single owner.
              </p>
            </div>
            <div className="min-w-44">
              <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
                <span>Coverage</span>
                <span className="text-foreground">{ownedShare}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full bg-foreground" style={{ width: ownedShare + "%" }} />
              </div>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-3">
            <Stat label="Points" value={String(TASKS.length)} hint="Across three desks" />
            <Stat label="Owned" value={String(assignedCount)} hint="One owner each" />
            <Stat label="Open" value={String(openCountTotal)} hint="Still unassigned" />
          </div>
        </header>

        <Tabs defaultValue="finance" className="gap-5">
          <TabsList className="grid !h-auto w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
            {AREAS.map(function (area) {
              const Icon = AREA_ICONS[area.id];
              const open = countOpen(area.id, owners);
              return (
                <TabsTrigger
                  key={area.id}
                  value={area.id}
                  className="!h-auto flex-col items-start gap-3 rounded-xl border border-border bg-card px-4 py-4 text-left whitespace-normal after:hidden data-active:border-foreground data-active:bg-foreground data-active:text-background"
                >
                  <span className="flex w-full items-center justify-between gap-3">
                    <Icon />
                    <Badge
                      variant="outline"
                      className="border-current bg-transparent text-current"
                    >
                      {open} open
                    </Badge>
                  </span>
                  <span className="text-sm font-medium">{area.label}</span>
                </TabsTrigger>
              );
            })}
          </TabsList>

          {AREAS.map(function (area) {
            const rows = TASKS.filter(function (task) {
              return task.area === area.id;
            });
            return (
              <TabsContent key={area.id} value={area.id} className="flex flex-col gap-4">
                {area.id === "finance" ? (
                  <FinanceStream />
                ) : (
                <div className="flex flex-col gap-4">
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="secondary">{area.priority}</Badge>
                  <span className="text-sm text-muted-foreground">{area.rhythm}</span>
                </div>

                <Card className="overflow-hidden">
                  <CardContent className="px-0">
                    <ul className="divide-y divide-border">
                      {rows.map(function (task, index) {
                        const ownerId = owners[task.id] || "";
                        const owner = people.find(function (person) {
                          return person.id === ownerId;
                        });
                        const owned = Boolean(owner);
                        return (
                          <li
                            key={task.id}
                            className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between"
                          >
                            <div className="flex min-w-0 items-start gap-3">
                              <span className="mt-0.5 w-6 shrink-0 text-xs text-muted-foreground">
                                {String(index + 1).padStart(2, "0")}
                              </span>
                              <div className="min-w-0">
                                <p className="font-medium">{task.title.replace(/\.$/, "")}</p>
                                <p className="mt-1 text-xs tracking-wide text-muted-foreground uppercase">
                                  {owned ? "Owned" : "Open"}
                                </p>
                              </div>
                            </div>
                            <Select
                              value={ownerId || UNASSIGNED}
                              onValueChange={function (value) {
                                assign(task.id, !value || value === UNASSIGNED ? "" : value);
                              }}
                            >
                              <SelectTrigger className="w-full bg-background sm:w-56" aria-label={"Owner for " + task.title}>
                                <SelectValue placeholder="Unassigned">
                                  {owner ? owner.name : "Unassigned"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value={UNASSIGNED}>Unassigned</SelectItem>
                                {people.map(function (person) {
                                  const held = taskForPerson(person.id, owners);
                                  const taken = Boolean(held && held.id !== task.id);
                                  return (
                                    <SelectItem key={person.id} value={person.id} disabled={taken}>
                                      {taken ? person.name + " (has a point)" : person.name}
                                    </SelectItem>
                                  );
                                })}
                              </SelectContent>
                            </Select>
                          </li>
                        );
                      })}
                    </ul>
                  </CardContent>
                </Card>
                </div>
                )}
              </TabsContent>
            );
          })}
        </Tabs>
      </main>
    </div>
      )}
    </div>
  );
}

function Stat(props: { label: string; value: string; hint: string }) {
  return (
    <Card size="sm">
      <CardHeader>
        <CardDescription>{props.label}</CardDescription>
        <CardTitle className="text-3xl tracking-tight">{props.value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">{props.hint}</CardContent>
    </Card>
  );
}

function taskForPerson(personId: string, owners: Owners): Task | undefined {
  const taskId = Object.keys(owners).find(function (id) {
    return owners[id] === personId;
  });
  if (!taskId) return undefined;
  return TASKS.find(function (task) {
    return task.id === taskId;
  });
}

function countOpen(area: AreaId, owners: Owners): number {
  return TASKS.filter(function (task) {
    return task.area === area && !owners[task.id];
  }).length;
}
