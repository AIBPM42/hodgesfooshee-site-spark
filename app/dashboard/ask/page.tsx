'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import KBUploadCard from '@/components/rag/KBUploadCard';

type Citation = { title: string; chunk: string; snippet?: string };
type AgentResponse = {
  ok?: boolean;
  answer?: string;
  citations?: Citation[];
  confidence?: 'High' | 'Medium' | 'Low';
  output?: string; // fallback if your n8n returns plain text
};

const WEBHOOK_URL = process.env.NEXT_PUBLIC_HODGES_WEBHOOK_URL ?? '';

function makeSessionId() {
  const t = Date.now().toString(36);
  const r = Math.random().toString(36).slice(2, 8);
  return `sess_${t}_${r}`;
}

const EXAMPLES = [
  'What financial documents are needed for a short-sale packet?',
  'How does a short sale affect my credit compared to foreclosure?',
  'What are the steps and timeline for a short sale?',
  'Who has to approve a short sale and how long does it take?',
];

type ChatTurn = {
  id: string;
  role: 'user' | 'assistant';
  text: string;
  citations?: Citation[];
  confidence?: string;
};

export default function RealtyIntelligencePage() {
  const [sessionId, setSessionId] = useState<string>('');
  const [input, setInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  // one session per tab
  useEffect(() => {
    let stored = sessionStorage.getItem('hodges_sess');
    if (!stored) {
      stored = makeSessionId();
      sessionStorage.setItem('hodges_sess', stored);
    }
    setSessionId(stored);
  }, []);

  // autoscroll convo
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: 999999, behavior: 'smooth' });
  }, [turns.length]);

  const inputLength = input.length;
  const canSubmit = useMemo(
    () => input.trim().length >= 10 && inputLength <= 1000 && !submitting,
    [input, inputLength, submitting]
  );

  async function ask(q: string) {
    setError(null);
    setSubmitting(true);
    setTurns((t) => [
      ...t,
      { id: crypto.randomUUID(), role: 'user', text: q },
    ]);

    try {
      const res = await fetch('/api/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          action: 'sendMessage',
          chatInput: q,
        }),
      });

      const data: AgentResponse = await res.json().catch(() => ({} as any));

      // Prefer structured schema, fall back to raw "output" or text
      let answer = data?.answer ?? data?.output ?? '';
      let confidence = data?.confidence ?? '';
      let citations = data?.citations ?? [];

      // If the agent returned a single big string, try to parse lightweight markers
      if (!answer && typeof data === 'object') {
        const raw = JSON.stringify(data);
        answer = raw;
      }

      if (!answer) {
        answer =
          "I couldn't find this information in your current knowledge base.";
      }

      setTurns((t) => [
        ...t,
        {
          id: crypto.randomUUID(),
          role: 'assistant',
          text: answer,
          citations,
          confidence,
        },
      ]);
    } catch (e: any) {
      setError(e?.message ?? 'Request failed');
    } finally {
      setSubmitting(false);
      setInput('');
    }
  }

  function onSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (!canSubmit) return;
    ask(input.trim());
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if ((e.metaKey || e.ctrlKey) && e.key === 'Enter') {
      e.preventDefault();
      onSubmit();
    }
  }

  const tooLong = inputLength > 1000;
  const nearLimit = inputLength > 900 && inputLength <= 1000;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      {/* Coming Soon Banner */}
      <div className="mb-6 rounded-xl border-2 p-6 text-center" style={{ borderColor: '#E76A3C', backgroundColor: 'rgba(231, 106, 60, 0.05)' }}>
        <h2 className="text-xl font-semibold text-token-text-hi mb-2">🚀 AI Assistant Upgrading</h2>
        <p className="text-token-text-mute">
          Our Realty Intelligence AI is being migrated to production infrastructure for improved performance and reliability. Check back soon!
        </p>
      </div>

      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight text-token-text-hi">
          Hodges &amp; Fooshee — <span className="opacity-80">Realty Intelligence</span>
        </h1>

        <div className="text-xs text-token-text-mute">
          Session <span className="font-mono">{sessionId || '...'}</span>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Ask panel */}
        <div className="rounded-2xl border bg-token-surface-1 p-4 backdrop-blur shadow-matte-1" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-3 text-xl font-semibold text-token-text-hi">Ask</div>

          {/* Example chips */}
          <div className="mb-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                onClick={() => setInput(ex)}
                className="rounded-full border px-3 py-1 text-sm transition-colors hover:bg-token-surface-2 text-token-text-mute"
                style={{ borderColor: 'var(--border)' }}
              >
                {ex}
              </button>
            ))}
          </div>

          <form onSubmit={onSubmit}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask your question… (min 10 characters)"
              rows={5}
              maxLength={1200}
              disabled={submitting}
              className="w-full resize-none rounded-xl border bg-token-surface-0 p-3 text-base outline-none transition-all focus:ring-2 text-token-text-hi"
              style={{
                borderColor: 'var(--border)',
                '--tw-ring-color': '#E76A3C'
              } as React.CSSProperties}
            />
            <div className="mt-2 flex items-center justify-between">
              <div className="text-xs text-token-text-mute">
                <span className={tooLong ? 'text-rose-600' : nearLimit ? 'text-amber-600' : ''}>
                  {inputLength}/1000
                </span>
                <span className="ml-2">• Press Cmd/Ctrl+Enter to submit</span>
              </div>
              <button
                type="submit"
                disabled={!canSubmit}
                className="rounded-xl px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                style={{ backgroundColor: '#E76A3C' }}
              >
                {submitting ? 'Asking…' : 'Ask'}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-3 rounded-lg border border-rose-300 bg-rose-50 p-2 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-200">
              {error}
            </div>
          )}
        </div>

        {/* Conversation panel */}
        <div className="rounded-2xl border bg-token-surface-1 p-4 backdrop-blur shadow-matte-1" style={{ borderColor: 'var(--border)' }}>
          <div className="mb-3 text-xl font-semibold text-token-text-hi">Conversation</div>
          <div
            ref={scrollRef}
            className="max-h-[70vh] space-y-4 overflow-auto pr-1"
          >
            {turns.length === 0 && (
              <div className="rounded-xl border border-dashed p-6 text-sm text-token-text-mute" style={{ borderColor: 'var(--border)' }}>
                Ask something to get started. Your answers will be grounded only
                in documents you've uploaded.
              </div>
            )}

            {turns.map((t) =>
              t.role === 'user' ? (
                <div
                  key={t.id}
                  className="rounded-xl border p-3 text-[15px] bg-token-surface-2"
                  style={{
                    borderColor: '#E76A3C',
                    backgroundColor: 'color-mix(in oklab, #E76A3C 8%, var(--surface-1))'
                  }}
                >
                  <div className="mb-1 text-xs uppercase tracking-wide opacity-70 text-token-text-mute">
                    User
                  </div>
                  <div className="text-token-text-hi">{t.text}</div>
                </div>
              ) : (
                <div
                  key={t.id}
                  className="rounded-xl border p-3 text-[15px] leading-relaxed bg-token-surface-0"
                  style={{ borderColor: 'var(--border)' }}
                >
                  <div className="mb-1 text-xs uppercase tracking-wide text-token-text-mute">
                    Assistant
                  </div>

                  {/* answer (markdown-lite) */}
                  <RichText text={t.text} />

                  {/* meta */}
                  <div className="mt-3 flex flex-wrap items-center gap-2">
                    {t.confidence && (
                      <span className="rounded-md border px-2 py-1 text-xs text-token-text-mute" style={{ borderColor: 'var(--border)' }}>
                        Confidence: {t.confidence}
                      </span>
                    )}

                    {t.citations && t.citations.length > 0 && (
                      <details className="w-full rounded-md border p-2 text-sm" style={{ borderColor: 'var(--border)' }}>
                        <summary className="cursor-pointer select-none text-xs text-token-text-mute">
                          Sources ({t.citations.length})
                        </summary>
                        <ul className="mt-2 space-y-2">
                          {t.citations.map((c, i) => (
                            <li
                              key={`${i}-${c.title}-${c.snippet?.slice(0, 12)}`}
                              className="rounded-md p-2 text-sm bg-token-surface-2"
                            >
                              <div className="font-medium text-token-text-hi">{c.title}</div>
                              {c.snippet && (
                                <div className="text-sm text-token-text-mute">
                                  {c.snippet}
                                </div>
                              )}
                            </li>
                          ))}
                        </ul>
                      </details>
                    )}
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </div>

      {/* Knowledge Base Upload */}
      <div className="mt-6">
        <KBUploadCard userId={undefined} />
      </div>
    </div>
  );
}

/** very small markdown-ish renderer without deps */
function RichText({ text }: { text: string }) {
  // bold **text**
  const withBold = text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  // bullet lines starting with "-" to <li>
  const html = withBold
    .split('\n')
    .map((line) => {
      if (/^\s*-\s+/.test(line)) {
        return `<li>${line.replace(/^\s*-\s+/, '')}</li>`;
      }
      return `<p>${line}</p>`;
    })
    .join('');
  // wrap list blocks
  const wrapped = html.replace(/(<li>[\s\S]*?<\/li>)/g, '<ul class="list-disc pl-5">$1</ul>');
  return (
    <div
      className="[&_ul]:my-2 [&_p]:my-2 text-token-text-lo"
      dangerouslySetInnerHTML={{ __html: wrapped }}
    />
  );
}
