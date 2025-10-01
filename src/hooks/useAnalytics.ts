import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from "@/integrations/supabase/client";

// Generate a simple session ID
const getSessionId = () => {
  let sessionId = sessionStorage.getItem('analytics_session');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('analytics_session', sessionId);
  }
  return sessionId;
};

export const useAnalytics = () => {
  const location = useLocation();

  // Track page view on route change
  useEffect(() => {
    trackEvent('page_view', {
      path: location.pathname + location.search
    });
  }, [location]);

  const trackEvent = async (event: string, meta?: Record<string, any>) => {
    try {
      await supabase.functions.invoke('track', {
        method: 'POST',
        body: {
          event,
          uid: getSessionId(),
          path: location.pathname,
          meta,
          referrer: document.referrer,
          ua: navigator.userAgent
        }
      });
    } catch (error) {
      console.error('Analytics tracking error:', error);
    }
  };

  return { trackEvent };
};
