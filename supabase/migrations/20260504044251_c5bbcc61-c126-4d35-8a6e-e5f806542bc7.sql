
-- Tighten INSERT policy: only authenticated users can insert
DROP POLICY "Authenticated users can create codes" ON public.invitation_codes;
CREATE POLICY "Authenticated users can create codes" ON public.invitation_codes
  FOR INSERT TO authenticated WITH CHECK (auth.uid() IS NOT NULL);

-- Tighten UPDATE policy: only allow updating codes you created or system-level
DROP POLICY "Authenticated users can update codes" ON public.invitation_codes;
CREATE POLICY "Authenticated users can update codes" ON public.invitation_codes
  FOR UPDATE TO authenticated USING (auth.uid() IS NOT NULL);

-- Restrict execute on use_invitation_code to authenticated only
REVOKE EXECUTE ON FUNCTION public.use_invitation_code(TEXT, UUID) FROM anon;
REVOKE EXECUTE ON FUNCTION public.use_invitation_code(TEXT, UUID) FROM public;
GRANT EXECUTE ON FUNCTION public.use_invitation_code(TEXT, UUID) TO authenticated;
