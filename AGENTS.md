# TEAM10

Shared brief for the team and for coding agents. Read this before changing the product.

## Version

V0 is this template: the Next.js app, Supabase auth and database, the Grok agent shell, and Shadcn. Leave V0 as the baseline. New product work is V1 and starts on a `feature/<short-name>` branch from this point.

## Mission

Build an AI agent or AI assistant using Grok for South African small businesses. It should save them money, time, and effort on a real task they repeat.

The project has four parts:

1. Choose one real, repeating task.
2. Explain the problem.
3. Build a solution.
4. Test it with made-up data and demonstrate how it works.

## Chosen task

Not chosen yet.

Do not invent a business, a task, or a solution. Leave the section below empty until the team writes it.

## Solution

Status: open

Problem:

Who it helps:

Repeating task:

What the agent does:

Made-up test data:

How to demonstrate it:

## Stack

- TypeScript and Next.js, hosted on Vercel
- Supabase for authentication and the database
- Grok through the xAI API, with tools, so the bot is an agent
- Shadcn UI for interface components (`components/ui`)

Do not add a second UI library. Do not host a .NET server. Vercel does not run .NET.

## GitHub

`main` is production. Vercel production deploys from `main` only. Other branches are for work in progress and may have preview deployments.

- Do not commit or push directly to `main`.
- Start from an up-to-date `main`, then work on `feature/<short-name>`.
- Open a pull request into `main`. Someone else on the team reviews it before merge.
- Do not force-push `main`.

```bash
git checkout main
git pull
git checkout -b feature/short-name
```

After the GitHub remote exists, turn on branch protection for `main`: require a pull request, and do not allow bypassing it. A markdown file cannot block a push by itself. In Vercel, set the production branch to `main`.

## Local setup

1. Copy `.env.example` to `.env.local` and fill in the Supabase URL, the anon key, and `XAI_API_KEY`.
2. Run `supabase/schema.sql` in the Supabase SQL editor.
3. `npm install`
4. `npm run dev`

## Agent notes

- The solution section is open. Do not fill it in unless the team has chosen the task in this file.
- Keep the Grok API key on the server. Never expose it in client code.
- New interface work uses Shadcn components.
