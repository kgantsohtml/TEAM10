import { createClient } from "@/lib/supabase/server";

export type ConversationRow = {
  id: string;
  title: string;
  updated_at: string;
};

export type MessageRow = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

export async function listConversations(userId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("user_id", userId)
    .order("updated_at", { ascending: false });

  return (data ?? []) as ConversationRow[];
}

export async function getConversation(userId: string, conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("conversations")
    .select("id, title, updated_at")
    .eq("id", conversationId)
    .eq("user_id", userId)
    .maybeSingle();

  return data as ConversationRow | null;
}

export async function listMessages(userId: string, conversationId: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("messages")
    .select("id, role, content")
    .eq("conversation_id", conversationId)
    .eq("user_id", userId)
    .order("created_at", { ascending: true });

  return (data ?? []) as MessageRow[];
}
