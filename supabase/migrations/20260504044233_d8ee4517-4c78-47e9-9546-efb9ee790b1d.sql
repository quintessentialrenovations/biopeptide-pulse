
-- Invitation codes table
CREATE TABLE public.invitation_codes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  max_uses INTEGER NOT NULL DEFAULT 1,
  times_used INTEGER NOT NULL DEFAULT 0,
  used_by UUID[] DEFAULT '{}',
  created_by UUID,
  expires_at TIMESTAMP WITH TIME ZONE,
  active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.invitation_codes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read codes (needed for signup validation before auth)
CREATE POLICY "Anyone can validate codes" ON public.invitation_codes
  FOR SELECT USING (true);

-- Authenticated users can create codes (admin)
CREATE POLICY "Authenticated users can create codes" ON public.invitation_codes
  FOR INSERT TO authenticated WITH CHECK (true);

-- Authenticated users can update codes (mark as used)
CREATE POLICY "Authenticated users can update codes" ON public.invitation_codes
  FOR UPDATE TO authenticated USING (true);

-- Function to validate and consume an invitation code (called during signup)
CREATE OR REPLACE FUNCTION public.use_invitation_code(p_code TEXT, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_record invitation_codes%ROWTYPE;
BEGIN
  SELECT * INTO v_record FROM invitation_codes
    WHERE LOWER(code) = LOWER(p_code)
      AND active = true
      AND (expires_at IS NULL OR expires_at > now())
      AND times_used < max_uses;

  IF NOT FOUND THEN
    RETURN false;
  END IF;

  UPDATE invitation_codes
    SET times_used = times_used + 1,
        used_by = array_append(used_by, p_user_id)
    WHERE id = v_record.id;

  RETURN true;
END;
$$;
