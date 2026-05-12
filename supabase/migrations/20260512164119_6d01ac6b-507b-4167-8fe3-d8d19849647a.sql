DO $$
DECLARE
  user_uuid UUID;
BEGIN
  SELECT id INTO user_uuid FROM auth.users WHERE email = 'nikhilrawat508@gmail.com';
  
  IF user_uuid IS NOT NULL THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (user_uuid, 'admin'::app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
END $$;