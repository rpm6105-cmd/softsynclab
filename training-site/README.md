# SoftSync Lab — Intern Training Module (`training.softsyncsolutions.in`)

Training modules, project-based assessments and mandatory weekly reports for
interns. Separate Vercel project, same Supabase project as the main site.

## Current status

- **Phase 0 & 1 done:** repo scaffold + database schema.
- **Phase 2 done:** intern app (PIN login, modules, lessons, quiz, weekly report).
- **Phase 3 done:** admin app (interns, content authoring, reports, scores, CSV).
- **Phase 4–5 pending:** weekly reminders, production content.

## Files

```
training-site/
├── index.html        intern app SPA (login, modules, lessons, quiz, reports)
├── admin/
│   ├── index.html    admin app SPA (training.softsyncsolutions.in/admin)
│   └── app.js        admin logic (Supabase Auth + CRUD + CSV export)
├── js/
│   ├── app.js        intern app logic (Supabase RPC calls, marked.js rendering)
│   └── config.js     Supabase URL + anon key
├── sql/
│   ├── schema.sql    full schema: tables, RLS, session + data functions
│   └── seed_demo.sql demo intern/module/lesson/quiz (PIN 1234)
```

## Setup

### 1. Run the database schema

1. Open Supabase Dashboard → SQL Editor → New query.
2. Paste and run `sql/schema.sql` in full.
3. Paste and run `sql/seed_demo.sql` (optional demo data).

Verify: run the query `select public.intern_login('1234');` — you should get a
`{"ok": true, "token": "…"}` response.

### 2. Create your admin login

Use the same Supabase Auth email/password you use for
`admin.softsyncsolutions.in` — the `authenticated` role already has full
table access via the RLS policies in the schema.

### 3. Create a real intern

```sql
select * from public.admin_create_intern(
    'Student Name', 'student@example.com', '2468', 'Internship'
);
```

### 4. Deploy to Vercel

- New Vercel project → Root Directory: `training-site` → Deploy.
- Add domain `training.softsyncsolutions.in` in the project's Domains tab.

## How the security model works

| Who | How they get in | Access |
|---|---|---|
| Intern | 4–6 digit PIN via `intern_login(pin)` | Session token only; every data call is a `SECURITY DEFINER` function that validates the token. Can never see other interns, correct answers, or edit their own reports after submission. |
| You (admin) | Supabase Auth email/password | `authenticated` role → full CRUD via RLS policies on all tables. |
| Anonymous | — | Denied by RLS; no grants except the token-gated login functions. |

Quiz scoring is server-side: interns submit answer indices, the function grades
them, records the attempt, updates module progress, and returns the score.
`correct_index` is never exposed to the intern app.

## Available functions

Intern (call with the token from `intern_login`):
- `intern_login(p_pin)` → `{ ok, token, intern }`
- `intern_logout(p_token)`
- `intern_modules(p_token)` → modules + progress + quiz info
- `intern_lessons(p_token, module_id)`
- `intern_quiz(p_token, quiz_id)` → questions **without** answers
- `intern_submit_quiz(p_token, quiz_id, answers_jsonb)` → grade + progress
- `intern_submit_report(p_token, week_start, what_done, blockers, next_plan)`
- `intern_my_reports(p_token)`

Admin (callable by `authenticated` only):
- `admin_create_intern(name, email, pin, program)`
- `admin_reset_intern_pin(intern_id, pin)`
- `admin_toggle_intern(intern_id, active)`

## Admin app

`training.softsyncsolutions.in/admin` — signs in with your existing Supabase
Auth email/password (same credentials as `admin.softsyncsolutions.in`). Tabs:

- **Interns** — create interns (name, email, program, PIN), reset PINs,
  activate/deactivate.
- **Modules** — author modules, lessons (Markdown), and quizzes (questions,
  options, correct answer, pass mark).
- **Reports** — view all weekly reports + CSV export.
- **Scores** — quiz attempts and module progress + CSV export.

## Next steps (Phase 4+)

- Weekly reminders (Supabase scheduled function / Vercel cron).
- Production content and real intern PINs.
