import { redirect } from "next/navigation";
import { AuthForm } from "@/components/auth-form";
import { SetupNotice } from "@/components/setup-notice";
import { supabaseEnv } from "@/lib/env";
import { createClient } from "@/lib/supabase/server";

export default async function LoginPage() {
  if (!supabaseEnv()) {
    return <SetupNotice />;
  }

  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();

  if (data.user) {
    redirect("/chat");
  }

  return (
    <main className="mx-auto flex min-h-[70vh] w-full max-w-md items-center px-6 py-10">
      <AuthForm mode="login" />
    </main>
  );
}
