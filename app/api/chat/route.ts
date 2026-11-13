import { convertToModelMessages, stepCountIs, streamText, type UIMessage } from "ai";
import { agentInstructions, agentModel, createAgentTools, readProjectBrief } from "@/lib/agent";
import { hasGrokKey } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export const maxDuration = 60;

export async function POST(request: Request) {
  if (!hasGrokKey()) {
    return Response.json({ error: "Add XAI_API_KEY to .env.local." }, { status: 500 });
  }

  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();

  if (!auth.user) {
    return Response.json({ error: "Sign in required." }, { status: 401 });
  }

  const body = (await request.json()) as {
    messages?: UIMessage[];
    conversationId?: string;
  };

  if (!body.conversationId || !body.messages?.length) {
    return Response.json({ error: "Missing conversation." }, { status: 400 });
  }

  const { data: conversation } = await supabase
    .from("conversations")
    .select("id")
    .eq("id", body.conversationId)
    .eq("user_id", auth.user.id)
    .maybeSingle();

  if (!conversation) {
    return Response.json({ error: "Conversation not found." }, { status: 404 });
  }

  const brief = await readProjectBrief();
  const result = streamText({
    model: agentModel(),
    instructions: agentInstructions(brief),
    messages: await convertToModelMessages(body.messages),
    tools: createAgentTools(supabase, auth.user.id),
    stopWhen: stepCountIs(6),
    onFinish: async ({ text }) => {
      const content = text.trim();

      if (!content) {
        return;
      }

      await supabase.from("messages").insert({
        conversation_id: body.conversationId,
        user_id: auth.user!.id,
        role: "assistant",
        content,
      });

      await supabase
        .from("conversations")
        .update({ updated_at: new Date().toISOString() })
        .eq("id", body.conversationId);
    },
  });

  return result.toUIMessageStreamResponse();
}
