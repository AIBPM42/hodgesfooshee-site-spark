"use client";

import { useState, useEffect, useCallback } from "react";

// ========================================
// Types (re-exported from API route)
// ========================================
export type Citation = {
  title: string;
  chunk: string;
};

export type AskResponse = {
  ok: boolean;
  answer?: string;
  citations?: Citation[];
  confidence?: "High" | "Medium" | "Low";
  error?: string;
};

export type AskPayload = {
  sessionId: string;
  action: "sendMessage";
  chatInput: string;
};

export type HistoryItem = {
  id: string;
  role: "user" | "assistant";
  content: string;
  ts: number;
  citations?: Citation[];
  confidence?: "High" | "Medium" | "Low";
};

// ========================================
// Constants
// ========================================
const SESSION_KEY = "hodges_iq_session";
const HISTORY_KEY = "hodges_iq_history";
const MAX_HISTORY = 20;

// ========================================
// UUID Generator (simple client-side)
// ========================================
function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ========================================
// localStorage Utilities
// ========================================
export function getSessionId(): string {
  if (typeof window === "undefined") return generateUUID();

  let sessionId = localStorage.getItem(SESSION_KEY);
  if (!sessionId) {
    sessionId = generateUUID();
    localStorage.setItem(SESSION_KEY, sessionId);
  }
  return sessionId;
}

export function getHistory(): HistoryItem[] {
  if (typeof window === "undefined") return [];

  const stored = localStorage.getItem(HISTORY_KEY);
  if (!stored) return [];

  try {
    return JSON.parse(stored);
  } catch {
    return [];
  }
}

export function saveHistory(history: HistoryItem[]): void {
  if (typeof window === "undefined") return;

  // Keep only the most recent 20 items
  const trimmed = history.slice(0, MAX_HISTORY);
  localStorage.setItem(HISTORY_KEY, JSON.stringify(trimmed));
}

export function clearHistory(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(HISTORY_KEY);
}

// ========================================
// API Client Function
// ========================================
export async function askHodges(sessionId: string, chatInput: string): Promise<AskResponse> {
  const payload: AskPayload = {
    sessionId,
    action: "sendMessage",
    chatInput,
  };

  try {
    const response = await fetch("/api/ask", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    // If response is not 2xx, return error
    if (!response.ok) {
      return {
        ok: false,
        error: data.error || `API error: ${response.status} ${response.statusText}`,
      };
    }

    return data as AskResponse;
  } catch (error: any) {
    return {
      ok: false,
      error: error.message || "Network error",
    };
  }
}

// ========================================
// React Hook for UI
// ========================================
export function useHodgesIQ() {
  const [sessionId, setSessionId] = useState<string>("");
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Initialize session and history on mount
  useEffect(() => {
    setSessionId(getSessionId());
    setHistory(getHistory());
  }, []);

  // Ask function
  const ask = useCallback(
    async (chatInput: string): Promise<AskResponse> => {
      if (!sessionId) {
        return { ok: false, error: "Session not initialized" };
      }

      setLoading(true);
      setError(null);

      const response = await askHodges(sessionId, chatInput);

      if (response.ok && response.answer) {
        // Add both user question and assistant answer to history (most recent first)
        const ts = Date.now();
        const userMessage: HistoryItem = {
          id: generateUUID(),
          role: "user",
          content: chatInput,
          ts,
        };
        const assistantMessage: HistoryItem = {
          id: generateUUID(),
          role: "assistant",
          content: response.answer,
          ts: ts + 1,
          citations: response.citations,
          confidence: response.confidence,
        };

        const newHistory = [assistantMessage, userMessage, ...history];
        setHistory(newHistory);
        saveHistory(newHistory);
      } else if (response.error) {
        setError(response.error);
      }

      setLoading(false);
      return response;
    },
    [sessionId, history]
  );

  // Clear history function
  const clear = useCallback(() => {
    setHistory([]);
    clearHistory();
  }, []);

  return {
    sessionId,
    history,
    loading,
    error,
    ask,
    clearHistory: clear,
  };
}
