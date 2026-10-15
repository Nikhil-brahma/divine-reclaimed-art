CREATE OR REPLACE FUNCTION public.validate_custom_order_request()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN
  IF NEW.needed_by IS NOT NULL AND NEW.needed_by < CURRENT_DATE THEN
    RAISE EXCEPTION 'Needed-by date cannot be in the past';
  END IF;
  IF NEW.email !~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' THEN
    RAISE EXCEPTION 'Invalid email address';
  END IF;
  RETURN NEW;
END $$;
CREATE TRIGGER validate_custom_order_request BEFORE INSERT OR UPDATE ON public.custom_order_requests
FOR EACH ROW EXECUTE FUNCTION public.validate_custom_order_request();