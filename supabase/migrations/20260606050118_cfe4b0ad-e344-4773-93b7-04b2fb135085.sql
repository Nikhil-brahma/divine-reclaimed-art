UPDATE auth.users
SET encrypted_password = crypt('123', gen_salt('bf')),
    email_confirmed_at = COALESCE(email_confirmed_at, now()),
    updated_at = now()
WHERE id = '133052f7-7aca-408f-8bc5-09d7f07d1397';

INSERT INTO public.user_roles (user_id, role)
VALUES ('133052f7-7aca-408f-8bc5-09d7f07d1397', 'admin')
ON CONFLICT (user_id, role) DO NOTHING;