import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SetupNotice() {
  return (
    <main className="mx-auto w-full max-w-xl px-6 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Add Supabase keys</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-6 text-muted-foreground">
          Copy <code>.env.example</code> to <code>.env.local</code> and set
          NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, and XAI_API_KEY. Then run
          supabase/schema.sql in the Supabase SQL editor.
        </CardContent>
      </Card>
    </main>
  );
}
