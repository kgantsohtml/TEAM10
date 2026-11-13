import Link from "next/link";
import { redirect } from "next/navigation";
import { NewChatButton } from "@/components/new-chat-button";
import { SetupNotice } from "@/components/setup-notice";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { supabaseEnv } from "@/lib/env";
import { listConversations } from "@/lib/chat-store";
import { createClient } from "@/lib/supabase/server";

export default async function ChatIndexPage() {
  if (!supabaseEnv()) {
    return <SetupNotice />;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (!data.user) {
    redirect("/login");
  }

  const conversations = await listConversations(data.user.id);
  const latest = conversations[0];

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Chats</h1>
          <p className="text-sm text-muted-foreground">
            The business task is still open. See the brief on the home page.
          </p>
        </div>
        <NewChatButton />
      </div>
      {latest ? (
        <Link href={`/chat/${latest.id}`} className={cn(buttonVariants({ variant: "outline" }))}>
          Open latest chat
        </Link>
      ) : (
        <p className="text-sm text-muted-foreground">No chats yet.</p>
      )}
    </main>
  );
}
