-- Enhanced Security Audit Logging
-- Create audit table to track sensitive data access and modifications

-- Create audit_logs table for comprehensive tracking
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    table_name TEXT NOT NULL,
    operation TEXT NOT NULL, -- SELECT, INSERT, UPDATE, DELETE
    record_id UUID,
    ip_address INET,
    user_agent TEXT,
    session_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    metadata JSONB
);

-- Enable RLS on audit_logs table
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Only admins can view audit logs
CREATE POLICY "admins_can_view_audit_logs" ON public.audit_logs
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Create function to log data access
CREATE OR REPLACE FUNCTION public.log_data_access(
    p_table_name TEXT,
    p_operation TEXT,
    p_record_id UUID DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL,
    p_metadata JSONB DEFAULT NULL
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.audit_logs (
        user_id,
        table_name,
        operation,
        record_id,
        ip_address,
        user_agent,
        metadata
    ) VALUES (
        auth.uid(),
        p_table_name,
        p_operation,
        p_record_id,
        p_ip_address,
        p_user_agent,
        p_metadata
    );
END;
$$;

-- Create rate limiting table for form submissions
CREATE TABLE public.rate_limits (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    identifier TEXT NOT NULL, -- IP address or user_id
    action TEXT NOT NULL, -- 'lead_submission', 'contact_form', etc.
    count INTEGER DEFAULT 1,
    window_start TIMESTAMP WITH TIME ZONE DEFAULT now(),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS on rate_limits table (only system can access)
ALTER TABLE public.rate_limits ENABLE ROW LEVEL SECURITY;

-- Create function to check and enforce rate limits
CREATE OR REPLACE FUNCTION public.check_rate_limit(
    p_identifier TEXT,
    p_action TEXT,
    p_max_requests INTEGER DEFAULT 5,
    p_window_minutes INTEGER DEFAULT 60
)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    current_count INTEGER;
    window_start TIMESTAMP WITH TIME ZONE;
BEGIN
    -- Clean up old entries
    DELETE FROM public.rate_limits 
    WHERE created_at < now() - INTERVAL '1 day';
    
    -- Check current window
    SELECT count, window_start INTO current_count, window_start
    FROM public.rate_limits
    WHERE identifier = p_identifier 
      AND action = p_action
      AND window_start > now() - (p_window_minutes || ' minutes')::INTERVAL
    ORDER BY window_start DESC
    LIMIT 1;
    
    -- If no recent entry found, create new window
    IF current_count IS NULL THEN
        INSERT INTO public.rate_limits (identifier, action, count, window_start)
        VALUES (p_identifier, p_action, 1, now());
        RETURN true;
    END IF;
    
    -- If within rate limit, increment counter
    IF current_count < p_max_requests THEN
        UPDATE public.rate_limits 
        SET count = count + 1,
            created_at = now()
        WHERE identifier = p_identifier 
          AND action = p_action
          AND window_start = window_start;
        RETURN true;
    END IF;
    
    -- Rate limit exceeded
    RETURN false;
END;
$$;

-- Add rate limiting trigger to leads table
CREATE OR REPLACE FUNCTION public.leads_rate_limit_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    -- For anonymous submissions, use a placeholder IP
    -- In production, this would be set by the application
    IF NOT public.check_rate_limit(
        COALESCE(NEW.email, 'anonymous'), 
        'lead_submission', 
        3, -- max 3 submissions
        60 -- per hour
    ) THEN
        RAISE EXCEPTION 'Rate limit exceeded. Please wait before submitting again.';
    END IF;
    
    RETURN NEW;
END;
$$;

-- Create trigger for rate limiting on leads
CREATE TRIGGER leads_rate_limit_check
    BEFORE INSERT ON public.leads
    FOR EACH ROW
    EXECUTE FUNCTION public.leads_rate_limit_trigger();