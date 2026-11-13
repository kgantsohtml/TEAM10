import Link from "next/link";
import { signOut } from "@/lib/auth-actions";
import { supabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export async function SiteHeader() {
  const configured = Boolean(supabaseEnv());
  let email: string | null = null;

  if (configured) {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    email = data.user?.email ?? null;
  }

  return (
    <header className="border-b">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-6 py-3">
        <Link href="/" className="font-semibold tracking-tight">
          TEAM10
        </Link>
        <nav className="flex items-center gap-2">
          {email ? (
            <>
              <Link href="/chat" className={cn(buttonVariants({ variant: "ghost" }))}>
                Chats
              </Link>
              <span className="hidden text-sm text-muted-foreground sm:inline">{email}</span>
              <form action={signOut}>
                <Button type="submit" variant="outline">
                  Sign out
                </Button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className={cn(buttonVariants({ variant: "ghost" }))}>
                Sign in
              </Link>
              <Link href="/signup" className={cn(buttonVariants())}>
                Create account
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
