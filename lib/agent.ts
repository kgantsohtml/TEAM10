import { readFile } from "node:fs/promises";
import path from "node:path";
import { xai } from "@ai-sdk/xai";
import { tool, type ToolSet } from "ai";
import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function readProjectBrief() {
  return readFile(path.join(process.cwd(), "AGENTS.md"), "utf8");
}

export function createAgentTools(supabase: SupabaseClient, userId: string) {
  return {
    web_search: xai.tools.webSearch(),
    x_search: xai.tools.xSearch(),
    code_execution: xai.tools.codeExecution(),
    recall_memories: tool({
      description: "Read notes this user previously asked the agent to remember.",
      inputSchema: z.object({}),
      execute: async () => {
        const { data, error } = await supabase
          .from("memories")
          .select("content, created_at")
          .eq("user_id", userId)
          .order("created_at", { ascending: false })
          .limit(20);

        if (error) {
          return { error: error.message };
        }

        return { memories: data ?? [] };
      },
    }),
    save_memory: tool({
      description: "Store a short fact the user wants remembered for later chats.",
      inputSchema: z.object({
        content: z.string().min(1).max(500).describe("The fact to remember"),
      }),
      execute: async ({ content }) => {
        const { error } = await supabase.from("memories").insert({
          user_id: userId,
          content,
        });

        if (error) {
          return { saved: false, error: error.message };
        }

        return { saved: true, content };
      },
    }),
  } satisfies ToolSet;
}

export function agentModel() {
  return xai.responses(process.env.XAI_MODEL ?? "grok-4.7");
}

export function agentInstructions(brief: string) {
  return `You are the TEAM10 Grok agent. Follow the project brief below.

The Solution section is open until the team fills it in. Do not pretend a business task has been chosen. Help the team think, and use tools when they help: web search, X search, code execution, and the user's saved memories.

${brief}`;
}
