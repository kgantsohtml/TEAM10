import { readProjectBrief } from "@/lib/agent";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function HomePage() {
  const brief = await readProjectBrief();
  const sections = brief
    .split(/\n## /)
    .slice(1)
    .map((section) => {
      const [title, ...rest] = section.split("\n");
      return { title: title.trim(), body: rest.join("\n").trim() };
    });

  return (
    <main className="mx-auto flex w-full max-w-3xl flex-col gap-6 px-6 py-10">
      <div className="flex flex-col gap-3">
        <Badge variant="secondary">Grok agent</Badge>
        <h1 className="text-3xl font-semibold tracking-tight">TEAM10</h1>
        <p className="text-muted-foreground">
          The brief below is the same file the team and the coding agent use. The solution stays
          blank until you choose the repeating task.
        </p>
      </div>
      {sections.map((section) => (
        <Card key={section.title}>
          <CardHeader>
            <CardTitle>{section.title}</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap font-sans text-sm leading-6">{section.body}</pre>
          </CardContent>
        </Card>
      ))}
    </main>
  );
}
