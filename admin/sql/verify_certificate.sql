-- verify_certificate RPC for public certificate QR verification
-- Run this in the Supabase SQL Editor (Dashboard > SQL Editor > New query), then Run.
-- Security: SECURITY DEFINER exposes ONLY the matching certificate row to anonymous callers.
-- It does NOT grant anon SELECT on the moas table, so all other rows stay protected by RLS.
--
-- NOTE: moas.purpose is mixed — MOA rows store plain text, while certificate /
-- internship_offer / freelancer rows store JSON text. We narrow to JSON rows with a
-- LIKE filter BEFORE casting, so non-JSON rows never reach the ::jsonb cast.

create or replace function public.verify_certificate(p_cert text)
returns table (
    client_name text,
    purpose     jsonb,
    created_at  timestamptz
)
language sql
security definer
set search_path = public
stable
as $$
    select m.client_name, m.purpose::jsonb as purpose, m.created_at
    from (
        select client_name, purpose, created_at
        from moas
        where purpose like '%"type":"certificate"%'
    ) m
    where m.purpose::jsonb->>'num' = p_cert
    limit 1;
$$;

-- Allow anonymous callers to invoke the function (no direct table access).
revoke all on function public.verify_certificate(text) from public;
grant execute on function public.verify_certificate(text) to anon;
