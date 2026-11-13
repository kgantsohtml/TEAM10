"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";

export function NewChatButton() {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function createChat() {
    setPending(true);
    setError(null);
    const supabase = createClient();
    const { data: auth } = await supabase.auth.getUser();

    if (!auth.user) {
      router.push("/login");
      return;
    }

    const { data, error: insertError } = await supabase
      .from("conversations")
      .insert({ user_id: auth.user.id, title: "New chat" })
      .select("id")
      .single();

    setPending(false);

    if (insertError || !data) {
      setError(insertError?.message ?? "Could not start a chat.");
      return;
    }

    router.push(`/chat/${data.id}`);
    router.refresh();
  }

  return (
    <div className="flex flex-col items-end gap-2">
      <Button type="button" onClick={createChat} disabled={pending}>
        {pending ? "Starting" : "New chat"}
      </Button>
      {error ? <p className="text-xs text-destructive">{error}</p> : null}
    </div>
  );
}
