"use client";

import { useState } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport, isToolUIPart, type UIMessage } from "ai";
import { NewChatButton } from "@/components/new-chat-button";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import type { ConversationRow, MessageRow } from "@/lib/chat-store";
import { createClient } from "@/lib/supabase/client";

const toolLabels: Record<string, string> = {
  web_search: "Searching the web",
  x_search: "Searching X",
  code_execution: "Running code",
  recall_memories: "Reading memories",
  save_memory: "Saving a memory",
};

function toUiMessages(rows: MessageRow[]): UIMessage[] {
  return rows.map((row) => ({
    id: row.id,
    role: row.role,
    parts: [{ type: "text", text: row.content }],
  }));
}

function toolName(part: { type: string; toolName?: string }) {
  if (part.type === "dynamic-tool" && part.toolName) {
    return part.toolName;
  }

  return part.type.replace(/^tool-/, "");
}

export function ChatView({
  conversationId,
  title,
  messages: storedMessages,
  conversations,
}: {
  conversationId: string;
  title: string;
  messages: MessageRow[];
  conversations: ConversationRow[];
}) {
  const [draft, setDraft] = useState("");
  const [saveError, setSaveError] = useState<string | null>(null);
  const { messages, sendMessage, status, error, stop } = useChat({
    id: conversationId,
    messages: toUiMessages(storedMessages),
    transport: new DefaultChatTransport({
      api: "/api/chat",
      body: { conversationId },
    }),
  });
  const busy = status === "submitted" || status === "streaming";

  async function onSubmit(event: React.FormEvent) {
    event.preventDefault();
    const text = draft.trim();

    if (!text || busy) {
      return;
    }

    setSaveError(null);
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      setSaveError("Sign in again.");
      return;
    }

    const { error: insertError } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      user_id: auth.user.id,
      role: "user",
      content: text,
    });

    if (insertError) {
      setSaveError(insertError.message);
      return;
    }

    if (storedMessages.length === 0 && title === "New chat") {
      await supabase
        .from("conversations")
        .update({ title: text.slice(0, 60), updated_at: new Date().toISOString() })
        .eq("id", conversationId);
    }

    setDraft("");
    await sendMessage({ text });
  }

  return (
    <div className="mx-auto grid min-h-[calc(100vh-57px)] w-full max-w-5xl grid-cols-1 md:grid-cols-[220px_1fr]">
      <aside className="border-b px-4 py-4 md:border-r md:border-b-0">
        <NewChatButton />
        <ul className="mt-4 flex flex-col gap-1">
          {conversations.map((conversation) => (
            <li key={conversation.id}>
              <Link
                href={`/chat/${conversation.id}`}
                className={cn(
                  buttonVariants({
                    variant: conversation.id === conversationId ? "secondary" : "ghost",
                  }),
                  "w-full justify-start",
                )}
              >
                {conversation.title}
              </Link>
            </li>
          ))}
        </ul>
      </aside>
      <section className="flex min-h-[70vh] flex-col">
        <div className="flex-1 space-y-4 overflow-y-auto px-4 py-6">
          {messages.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              Ask the agent something. The business task in AGENTS.md is still open, so it will not
              pretend a solution has been chosen.
            </p>
          ) : null}
          {messages.map((message) => (
            <article key={message.id} className="flex flex-col gap-2">
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                {message.role === "user" ? "You" : "Grok"}
              </p>
              {message.parts.map((part, index) => {
                if (part.type === "text") {
                  return (
                    <p key={index} className="whitespace-pre-wrap text-sm leading-6">
                      {part.text}
                    </p>
                  );
                }

                if (isToolUIPart(part)) {
                  const name = toolName(part);
                  return (
                    <p key={index} className="text-xs text-muted-foreground">
                      {toolLabels[name] ?? name}
                      {part.state === "output-error" ? " failed" : ""}
                    </p>
                  );
                }

                return null;
              })}
            </article>
          ))}
          {error ? <p className="text-sm text-destructive">{error.message}</p> : null}
          {saveError ? <p className="text-sm text-destructive">{saveError}</p> : null}
        </div>
        <form className="flex flex-col gap-2 border-t p-4" onSubmit={onSubmit}>
          <Textarea
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Message the agent"
            rows={3}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                event.currentTarget.form?.requestSubmit();
              }
            }}
          />
          <div className="flex justify-end gap-2">
            {busy ? (
              <Button type="button" variant="outline" onClick={() => stop()}>
                Stop
              </Button>
            ) : null}
            <Button type="submit" disabled={busy || draft.trim().length === 0}>
              Send
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
