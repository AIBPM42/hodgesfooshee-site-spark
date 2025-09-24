-- Fix search path security warnings for existing functions
ALTER FUNCTION public.has_role(uuid, app_role) SET search_path = public;
ALTER FUNCTION public.has_any_role(uuid, app_role[]) SET search_path = public;