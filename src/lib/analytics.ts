// Analytics event tracking utilities
import { getRole } from './role';

type EventType = 'page' | 'search' | 'listing_view';

interface EventPayload {
  session_id?: string;
  [key: string]: any;
}

function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return '';
  
  const SESSION_KEY = 'hf_session_id';
  let sessionId = sessionStorage.getItem(SESSION_KEY);
  
  if (!sessionId) {
    sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem(SESSION_KEY, sessionId);
  }
  
  return sessionId;
}

export async function logEvent(
  type: EventType,
  payload: EventPayload
): Promise<void> {
  if (typeof window === 'undefined') return;
  
  const session = getOrCreateSessionId();
  const role = getRole();
  
  try {
    const response = await fetch(
      'https://xhqwmtzawqfffepcqxwf.supabase.co/functions/v1/log-event',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhocXdtdHphd3FmZmZlcGNxeHdmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ2MDQwODEsImV4cCI6MjA3MDE4MDA4MX0.gihIkhLS_pwr9Mz6uG6vm7BXPzfa2TcpvIrRECRfxfg'
        },
        body: JSON.stringify({
          type,
          role,
          payload: {
            ...payload,
            session_id: session
          }
        })
      }
    );
    
    if (!response.ok) {
      console.warn('[Analytics] Event log failed:', response.status);
    }
  } catch (error) {
    // Silent fail - analytics should never block user actions
    console.warn('[Analytics] Event log error:', error);
  }
}

// Convenience functions
export function logPageView(page: string, referrer?: string) {
  return logEvent('page', { 
    page, 
    referrer: referrer || document.referrer,
    ua: navigator.userAgent
  });
}

export function logSearch(query: any, resultsCount?: number, durationMs?: number) {
  return logEvent('search', {
    query,
    results_count: resultsCount,
    duration_ms: durationMs
  });
}

export function logListingView(listingKey: string, city?: string, price?: number) {
  return logEvent('listing_view', {
    listing_key: listingKey,
    city,
    price
  });
}
