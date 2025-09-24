-- Fix search path for all remaining functions to resolve security warnings
ALTER FUNCTION public.check_rate_limit(text, text, integer, integer) SET search_path = public;
ALTER FUNCTION public.leads_rate_limit_trigger() SET search_path = public;
ALTER FUNCTION public.log_data_access(text, text, uuid, inet, text, jsonb) SET search_path = public;