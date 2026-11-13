"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DocumentIntake } from "@/components/document-intake";
import { EagleEyeLogo } from "@/components/eagle-eye-logo";
import { ExceptionQueue } from "@/components/exception-queue";

export function OpsBoard() {
  const [section, setSection] = useState("ops");

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
      {section === "intake" ? <DocumentIntake /> : <ExceptionQueue />}
    </div>
  );
}
