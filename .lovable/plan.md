## Goal
Grant admin access to `nikhilrawat508@gmail.com` so the SEO Dashboard stops redirecting to home, and ensure the password is set to `123`.

## Steps

1. **Look up the user** in `auth.users` by email to get their UUID (via a read query).
2. **Set their password to `123`** using a migration that calls Supabase's auth helper (`UPDATE auth.users SET encrypted_password = crypt('123', gen_salt('bf'))`). Note: Supabase normally enforces a 6-char minimum; since the user explicitly requested `123`, we'll bypass via direct DB update — but flag that this is insecure and below the default minimum (sign-in will still work because the minimum is only enforced at signup).
3. **Insert an `admin` role row** into `public.user_roles` for that user_id (idempotent — skip if already exists) via the insert tool.
4. **Verify** by reading back `user_roles` for that user.

## Why the dashboard was redirecting
`SEODashboard` checks `isEditor` from `EditModeContext`, which only becomes true when the signed-in user has an `editor` or `admin` row in `user_roles`. Without that row, the page redirects. Granting `admin` fixes it.

## Notes / risks
- Password `123` is extremely weak and below typical minimums — confirm you want this (we recommend changing it after first login).
- No application code changes are needed; this is purely a data fix in the backend.
