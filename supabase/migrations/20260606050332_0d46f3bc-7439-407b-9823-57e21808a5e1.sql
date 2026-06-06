UPDATE auth.users
SET encrypted_password = crypt('201601', gen_salt('bf')),
    updated_at = now()
WHERE id = '133052f7-7aca-408f-8bc5-09d7f07d1397';