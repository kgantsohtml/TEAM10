import { notFound, redirect } from "next/navigation";
import { ChatView } from "@/components/chat-view";
import { SetupNotice } from "@/components/setup-notice";
import { getConversation, listConversations, listMessages } from "@/lib/chat-store";
import { supabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function ConversationPage({ params }: { params: Promise<{ id: string }> }) {
  if (!supabaseEnv()) {
    return <SetupNotice />;
  }

  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const conversation = await getConversation(data.user.id, id);

  if (!conversation) {
    notFound();
  }

  const [messages, conversations] = await Promise.all([
    listMessages(data.user.id, id),
    listConversations(data.user.id),
  ]);

  return <ChatView conversationId={id} title={conversation.title} messages={messages} conversations={conversations} />;
}
