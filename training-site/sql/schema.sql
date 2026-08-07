-- ============================================================================
-- SoftSync Lab — Intern Training Module Database Schema
-- Project: training.softsyncsolutions.in
--
-- HOW TO RUN:
--   1. Open Supabase Dashboard > SQL Editor > New query
--   2. Paste this entire file, click Run.
--   3. (Optional) Seed sample content with training-site/sql/seed_demo.sql
--
-- DESIGN NOTES
--   * Interns do NOT get Supabase Auth accounts. They log in with a 4-6 digit
--     PIN issued by you. PINs are stored hashed (pgcrypto crypt / bcrypt).
--   * Login creates a session token (uuid) in intern_sessions. The intern app
--     keeps the token and passes it to every data function. All intern-facing
--     data access goes through SECURITY DEFINER functions below, so interns
--     can never see each other's data or the correct quiz answers.
--   * You (admin) use Supabase Auth email/password (same as the existing
--     admin.softsyncsolutions.in) and get full table access via RLS
--     `authenticated` policies. Everything is blocked for the anon role.
--   * Quiz scoring happens server-side: interns submit answers, the function
--     grades them, records the attempt, updates module progress, and returns
--     the score. The correct_index is never exposed to interns.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- EXTENSIONS
-- ---------------------------------------------------------------------------
create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

-- Interns (PIN-based logins)
create table if not exists public.interns (
    id           uuid primary key default gen_random_uuid(),
    name         text not null,
    email        text not null,
    program      text not null default 'Internship',
    pin_hash     text not null,                          -- crypt(pin, gen_salt('bf'))
    active       boolean not null default true,
    created_at   timestamptz not null default now(),
    updated_at   timestamptz not null default now()
);

-- Active login sessions. The id IS the bearer token handed to the intern app.
create table if not exists public.intern_sessions (
    id           uuid primary key default gen_random_uuid(),
    intern_id    uuid not null references public.interns(id) on delete cascade,
    created_at   timestamptz not null default now(),
    expires_at   timestamptz not null default now() + interval '30 days',
    active       boolean not null default true
);

-- Training modules
create table if not exists public.modules (
    id            uuid primary key default gen_random_uuid(),
    title         text not null,
    description   text not null default '',
    order_index   int not null default 0,
    active        boolean not null default true,
    created_at    timestamptz not null default now()
);

-- Lessons inside a module (Markdown content)
create table if not exists public.lessons (
    id            uuid primary key default gen_random_uuid(),
    module_id     uuid not null references public.modules(id) on delete cascade,
    title         text not null,
    content_md    text not null default '',
    order_index   int not null default 0,
    created_at    timestamptz not null default now()
);

-- Quizzes (one per module, pass threshold in %)
create table if not exists public.quizzes (
    id            uuid primary key default gen_random_uuid(),
    module_id     uuid not null references public.modules(id) on delete cascade,
    title         text not null,
    pass_percent  int not null default 70 check (pass_percent between 0 and 100),
    created_at    timestamptz not null default now()
);

-- Quiz questions. options is a jsonb array of strings: ["A","B","C","D"].
-- correct_index is the 0-based index of the right answer.
create table if not exists public.quiz_questions (
    id            uuid primary key default gen_random_uuid(),
    quiz_id       uuid not null references public.quizzes(id) on delete cascade,
    question      text not null,
    options       jsonb not null default '["","","",""]',
    correct_index int not null default 0,
    order_index   int not null default 0
);

-- Intern quiz attempts (one row per submission, re-takes allowed)
create table if not exists public.quiz_attempts (
    id            uuid primary key default gen_random_uuid(),
    intern_id     uuid not null references public.interns(id) on delete cascade,
    quiz_id       uuid not null references public.quizzes(id) on delete cascade,
    answers       jsonb not null default '{}',           -- {"<question_id>": <chosen_index>}
    score         int not null,                          -- percent 0-100
    passed        boolean not null,
    created_at    timestamptz not null default now()
);

-- Weekly reports (mandatory; one per intern per week)
create table if not exists public.weekly_reports (
    id            uuid primary key default gen_random_uuid(),
    intern_id     uuid not null references public.interns(id) on delete cascade,
    week_start    date not null,                         -- Monday of that week
    what_done     text not null,
    blockers      text not null default '',
    next_plan     text not null default '',
    submitted_at  timestamptz not null default now(),
    unique (intern_id, week_start)
);

-- Intern progress per module (auto-updated when they pass the quiz)
create table if not exists public.module_progress (
    id            uuid primary key default gen_random_uuid(),
    intern_id     uuid not null references public.interns(id) on delete cascade,
    module_id     uuid not null references public.modules(id) on delete cascade,
    status        text not null default 'not_started'
                  check (status in ('not_started','in_progress','completed')),
    best_score    int,                                   -- best % on the module quiz
    passed_at     timestamptz,
    unique (intern_id, module_id)
);

-- ---------------------------------------------------------------------------
-- INDEXES
-- ---------------------------------------------------------------------------
create index if not exists idx_interns_active      on public.interns(active);
create index if not exists idx_sessions_token      on public.intern_sessions(id, active);
create index if not exists idx_sessions_intern     on public.intern_sessions(intern_id);
create index if not exists idx_lessons_module      on public.lessons(module_id, order_index);
create index if not exists idx_questions_quiz      on public.quiz_questions(quiz_id, order_index);
create index if not exists idx_attempts_intern     on public.quiz_attempts(intern_id, created_at desc);
create index if not exists idx_reports_intern      on public.weekly_reports(intern_id, week_start desc);
create index if not exists idx_progress_intern     on public.module_progress(intern_id);

-- ---------------------------------------------------------------------------
-- ROW LEVEL SECURITY
-- ---------------------------------------------------------------------------
-- anon  → denied everywhere (interns only reach data through the functions)
-- authenticated → full CRUD (you, the admin, via the training admin panel)
alter table public.interns          enable row level security;
alter table public.intern_sessions  enable row level security;
alter table public.modules          enable row level security;
alter table public.lessons          enable row level security;
alter table public.quizzes          enable row level security;
alter table public.quiz_questions   enable row level security;
alter table public.quiz_attempts    enable row level security;
alter table public.weekly_reports   enable row level security;
alter table public.module_progress  enable row level security;

-- Admin policies (authenticated role = you)
drop policy if exists "admin_all_interns" on public.interns;
create policy "admin_all_interns"
    on public.interns for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_sessions" on public.intern_sessions;
create policy "admin_all_sessions"
    on public.intern_sessions for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_modules" on public.modules;
create policy "admin_all_modules"
    on public.modules for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_lessons" on public.lessons;
create policy "admin_all_lessons"
    on public.lessons for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_quizzes" on public.quizzes;
create policy "admin_all_quizzes"
    on public.quizzes for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_questions" on public.quiz_questions;
create policy "admin_all_questions"
    on public.quiz_questions for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_attempts" on public.quiz_attempts;
create policy "admin_all_attempts"
    on public.quiz_attempts for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_reports" on public.weekly_reports;
create policy "admin_all_reports"
    on public.weekly_reports for all to authenticated using (true) with check (true);

drop policy if exists "admin_all_progress" on public.module_progress;
create policy "admin_all_progress"
    on public.module_progress for all to authenticated using (true) with check (true);

-- ---------------------------------------------------------------------------
-- INTERN SESSION FUNCTIONS
-- ---------------------------------------------------------------------------

-- Validate a session token; return the intern id or null if invalid/expired.
create or replace function public.current_intern_id(p_token uuid)
returns uuid
language sql
security definer
set search_path = public
stable
as $$
    select intern_id
    from public.intern_sessions
    where id = p_token
      and active = true
      and expires_at > now()
    limit 1;
$$;

-- Log in with a PIN. Returns { ok, token, intern{id,name,program} } or
-- { ok:false, error }.
create or replace function public.intern_login(p_pin text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_intern public.interns%rowtype;
    v_token uuid;
begin
    select * into v_intern
    from public.interns
    where active = true
      and pin_hash = crypt(p_pin, pin_hash)
    limit 1;

    if v_intern.id is null then
        return jsonb_build_object('ok', false, 'error', 'Invalid PIN');
    end if;

    insert into public.intern_sessions (intern_id)
    values (v_intern.id)
    returning id into v_token;

    return jsonb_build_object(
        'ok', true,
        'token', v_token,
        'intern', jsonb_build_object(
            'id',   v_intern.id,
            'name', v_intern.name,
            'program', v_intern.program
        )
    );
end;
$$;

-- Log out / invalidate a token.
create or replace function public.intern_logout(p_token uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    update public.intern_sessions
       set active = false
     where id = p_token
     returning true;
$$;

-- ---------------------------------------------------------------------------
-- INTERN DATA FUNCTIONS (all require a valid token)
-- ---------------------------------------------------------------------------

-- List modules with the intern's progress and quiz status.
create or replace function public.intern_modules(p_token uuid)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
    select coalesce(
        jsonb_agg(jsonb_build_object(
            'id', m.id,
            'title', m.title,
            'description', m.description,
            'order_index', m.order_index,
            'status', coalesce(mp.status, 'not_started'),
            'best_score', mp.best_score,
            'quiz_id', q.id,
            'quiz_title', q.title,
            'pass_percent', q.pass_percent,
            'lesson_count', (select count(*) from public.lessons l where l.module_id = m.id)
        ) order by m.order_index),
        '[]'::jsonb)
    from public.modules m
    left join public.module_progress mp
           on mp.module_id = m.id and mp.intern_id = public.current_intern_id(p_token)
    left join public.quizzes q on q.module_id = m.id
    where m.active = true
      and public.current_intern_id(p_token) is not null;
$$;

-- List lessons for a module (content included).
create or replace function public.intern_lessons(p_token uuid, p_module_id uuid)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
    select coalesce(
        jsonb_agg(jsonb_build_object(
            'id', l.id,
            'title', l.title,
            'content_md', l.content_md,
            'order_index', l.order_index
        ) order by l.order_index),
        '[]'::jsonb)
    from public.lessons l
    where l.module_id = p_module_id
      and public.current_intern_id(p_token) is not null;
$$;

-- Get a quiz WITHOUT exposing correct_index. Returns questions + options only.
create or replace function public.intern_quiz(p_token uuid, p_quiz_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_intern uuid := public.current_intern_id(p_token);
    v_result jsonb;
begin
    if v_intern is null then
        return jsonb_build_object('ok', false, 'error', 'Invalid session');
    end if;

    select jsonb_build_object(
        'ok', true,
        'quiz', (select jsonb_build_object(
            'id', q.id, 'title', q.title, 'pass_percent', q.pass_percent
        ) from public.quizzes q where q.id = p_quiz_id),
        'questions', coalesce((
            select jsonb_agg(jsonb_build_object(
                'id', qq.id,
                'question', qq.question,
                'options', qq.options,
                'order_index', qq.order_index
            ) order by qq.order_index)
            from public.quiz_questions qq
            where qq.quiz_id = p_quiz_id
        ), '[]'::jsonb)
    ) into v_result;

    return v_result;
end;
$$;

-- Submit quiz answers and grade server-side.
-- p_answers: {"<question_id>": <0-based index>, ...}
-- Returns { ok, score, passed, correct, total, best_score }
create or replace function public.intern_submit_quiz(p_token uuid, p_quiz_id uuid, p_answers jsonb)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_intern uuid := public.current_intern_id(p_token);
    v_pass_percent int;
    v_module_id uuid;
    v_q record;
    v_total int := 0;
    v_correct int := 0;
    v_score int := 0;
    v_passed boolean := false;
    v_best int;
begin
    if v_intern is null then
        return jsonb_build_object('ok', false, 'error', 'Invalid session');
    end if;

    select pass_percent, module_id into v_pass_percent, v_module_id
    from public.quizzes where id = p_quiz_id;

    if v_module_id is null then
        return jsonb_build_object('ok', false, 'error', 'Quiz not found');
    end if;

    for v_q in
        select id, correct_index
        from public.quiz_questions
        where quiz_id = p_quiz_id
    loop
        v_total := v_total + 1;
        if coalesce((p_answers ->> v_q.id::text)::int, -1) = v_q.correct_index then
            v_correct := v_correct + 1;
        end if;
    end loop;

    if v_total > 0 then
        v_score := round(100.0 * v_correct / v_total)::int;
    end if;
    v_passed := v_score >= v_pass_percent;

    insert into public.quiz_attempts (intern_id, quiz_id, answers, score, passed)
    values (v_intern, p_quiz_id, p_answers, v_score, v_passed);

    -- Update module progress
    select best_score into v_best
    from public.module_progress
    where intern_id = v_intern and module_id = v_module_id;

    insert into public.module_progress (intern_id, module_id, status, best_score, passed_at)
    values (
        v_intern, v_module_id,
        case when v_passed then 'completed' else 'in_progress' end,
        v_score,
        case when v_passed then now() else null end
    )
    on conflict (intern_id, module_id) do update
        set status = case
                when public.module_progress.status = 'completed' then 'completed'
                when excluded.status = 'completed' then 'completed'
                else 'in_progress' end,
            best_score = greatest(coalesce(public.module_progress.best_score, 0), excluded.best_score),
            passed_at  = coalesce(public.module_progress.passed_at, excluded.passed_at);

    return jsonb_build_object(
        'ok', true,
        'score', v_score,
        'passed', v_passed,
        'correct', v_correct,
        'total', v_total,
        'pass_percent', v_pass_percent
    );
end;
$$;

-- Submit a weekly report. Returns { ok } or { ok:false, error } if duplicate.
create or replace function public.intern_submit_report(
    p_token uuid,
    p_week_start date,
    p_what_done text,
    p_blockers text,
    p_next_plan text
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    v_intern uuid := public.current_intern_id(p_token);
begin
    if v_intern is null then
        return jsonb_build_object('ok', false, 'error', 'Invalid session');
    end if;

    begin
        insert into public.weekly_reports (intern_id, week_start, what_done, blockers, next_plan)
        values (v_intern, p_week_start, p_what_done, p_blockers, p_next_plan);
    exception when unique_violation then
        return jsonb_build_object('ok', false, 'error', 'Report already submitted for this week');
    end;

    return jsonb_build_object('ok', true);
end;
$$;

-- List the intern's own submitted reports.
create or replace function public.intern_my_reports(p_token uuid)
returns jsonb
language sql
security definer
set search_path = public
stable
as $$
    select coalesce(
        jsonb_agg(jsonb_build_object(
            'week_start', r.week_start,
            'what_done', r.what_done,
            'blockers', r.blockers,
            'next_plan', r.next_plan,
            'submitted_at', r.submitted_at
        ) order by r.week_start desc),
        '[]'::jsonb)
    from public.weekly_reports r
    where r.intern_id = public.current_intern_id(p_token);
$$;

-- ---------------------------------------------------------------------------
-- ADMIN HELPERS
-- ---------------------------------------------------------------------------

-- Create an intern with a hashed PIN. Callable by authenticated (admin) only.
-- Example: select * from public.admin_create_intern('Sanjay SG', 'sanjay@x.com', '1234', 'Internship');
create or replace function public.admin_create_intern(
    p_name text,
    p_email text,
    p_pin text,
    p_program text default 'Internship'
)
returns public.interns
language plpgsql
security definer
set search_path = public
as $$
declare
    v_intern public.interns;
begin
    if auth.role() <> 'authenticated' then
        raise exception 'Not authorized';
    end if;

    insert into public.interns (name, email, program, pin_hash)
    values (p_name, p_email, p_program, crypt(p_pin, gen_salt('bf', 10)))
    returning * into v_intern;

    return v_intern;
end;
$$;

-- Reset an intern's PIN. Callable by authenticated (admin) only.
create or replace function public.admin_reset_intern_pin(p_intern_id uuid, p_pin text)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    if auth.role() <> 'authenticated' then
        raise exception 'Not authorized';
    end if;

    update public.interns
       set pin_hash = crypt(p_pin, gen_salt('bf', 10)), updated_at = now()
     where id = p_intern_id;
    return true;
end;
$$;

-- Toggle intern active/inactive. Callable by authenticated (admin) only.
create or replace function public.admin_toggle_intern(p_intern_id uuid, p_active boolean)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
begin
    if auth.role() <> 'authenticated' then
        raise exception 'Not authorized';
    end if;

    update public.interns
       set active = p_active, updated_at = now()
     where id = p_intern_id;
    return true;
end;
$$;

-- Revoke execute from everyone, then grant narrowly.
-- Interns: anon role can call the intern functions (token-gated internally).
-- Admin: authenticated role can call the admin helpers.
revoke all on function public.current_intern_id(uuid) from public;
revoke all on function public.intern_login(text) from public;
revoke all on function public.intern_logout(uuid) from public;
revoke all on function public.intern_modules(uuid) from public;
revoke all on function public.intern_lessons(uuid, uuid) from public;
revoke all on function public.intern_quiz(uuid, uuid) from public;
revoke all on function public.intern_submit_quiz(uuid, uuid, jsonb) from public;
revoke all on function public.intern_submit_report(uuid, date, text, text, text) from public;
revoke all on function public.intern_my_reports(uuid) from public;
revoke all on function public.admin_create_intern(text, text, text, text) from public;
revoke all on function public.admin_reset_intern_pin(uuid, text) from public;
revoke all on function public.admin_toggle_intern(uuid, boolean) from public;

grant execute on function public.intern_login(text) to anon;
grant execute on function public.intern_logout(uuid) to anon;
grant execute on function public.intern_modules(uuid) to anon;
grant execute on function public.intern_lessons(uuid, uuid) to anon;
grant execute on function public.intern_quiz(uuid, uuid) to anon;
grant execute on function public.intern_submit_quiz(uuid, uuid, jsonb) to anon;
grant execute on function public.intern_submit_report(uuid, date, text, text, text) to anon;
grant execute on function public.intern_my_reports(uuid) to anon;

grant execute on function public.admin_create_intern(text, text, text, text) to authenticated;
grant execute on function public.admin_reset_intern_pin(uuid, text) to authenticated;
grant execute on function public.admin_toggle_intern(uuid, boolean) to authenticated;

-- Allow the authenticated role to call intern read functions too (useful for
-- admin previews of an intern's view). The token argument keeps it safe.
grant execute on function public.intern_modules(uuid) to authenticated;
grant execute on function public.intern_lessons(uuid, uuid) to authenticated;
grant execute on function public.intern_quiz(uuid, uuid) to authenticated;
grant execute on function public.intern_submit_quiz(uuid, uuid, jsonb) to authenticated;
grant execute on function public.intern_submit_report(uuid, date, text, text, text) to authenticated;
grant execute on function public.intern_my_reports(uuid) to authenticated;
