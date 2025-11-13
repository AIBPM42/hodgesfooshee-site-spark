'use client';

import * as React from 'react';
import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { Upload, FileText, CheckCircle2, CircleAlert, X, Loader2 } from 'lucide-react';
import { useAuth } from '@/components/AuthProvider';

type QItem = {
  id: string;
  file: File;
  name: string;
  size: number;
  status: 'queued'|'uploading'|'uploaded'|'ingesting'|'done'|'error';
  progress: number; // 0-100
  url?: string;
  error?: string;
};

const ACCEPT = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // docx
  'text/plain'
];

const MAX_MB = 10;
const BUCKET = 'kb-uploads';

export default function KBUploadCard({ userId }: { userId?: string | null }) {
  const { user } = useAuth(); // Get authenticated user from context
  const [queue, setQueue] = React.useState<QItem[]>([]);
  const [dragOver, setDragOver] = React.useState(false);
  const [busy, setBusy] = React.useState(false);

  function addFiles(files: FileList | null) {
    if (!files) return;
    const next: QItem[] = [];
    Array.from(files).forEach(f => {
      const okType = ACCEPT.includes(f.type) || f.name.endsWith('.pdf') || f.name.endsWith('.docx') || f.name.endsWith('.txt');
      const okSize = f.size <= MAX_MB * 1024 * 1024;
      if (!okType) {
        toast.error(`Unsupported type: ${f.name}`);
        return;
      }
      if (!okSize) {
        toast.error(`Max size is ${MAX_MB}MB: ${f.name}`);
        return;
      }
      next.push({
        id: uuidv4(),
        file: f,
        name: f.name,
        size: f.size,
        status: 'queued',
        progress: 0
      });
    });
    setQueue(prev => [...prev, ...next]);
  }

  async function handleUpload() {
    console.log('handleUpload called', { busy, queueLength: queue.length });
    if (busy) return;
    const items = queue.filter(q => q.status === 'queued' || q.status === 'error');
    if (items.length === 0) {
      toast.message('Nothing to upload');
      return;
    }

    // Require authentication
    if (!user) {
      toast.error('You must be logged in to upload documents');
      return;
    }

    const uploadUserId = user.id;

    setBusy(true);
    try {
      // 1) Upload to Supabase (serial keeps UI simple / reduce rate limits)
      const uploaded: QItem[] = [];
      for (const it of items) {
        setQueue(prev => prev.map(p => p.id === it.id ? { ...p, status: 'uploading', progress: 10 } : p));
        const key = `${uploadUserId}/${uuidv4()}/${it.name}`;
        const { data, error } = await supabase.storage.from(BUCKET).upload(key, it.file, {
          upsert: false
        });
        if (error) {
          setQueue(prev => prev.map(p => p.id === it.id ? { ...p, status: 'error', error: error.message, progress: 0 } : p));
          continue;
        }
        // public URL
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(data.path);
        setQueue(prev => prev.map(p => p.id === it.id ? { ...p, status: 'uploaded', progress: 100, url: pub.publicUrl } : p));
        uploaded.push({ ...it, url: pub.publicUrl });
      }

      if (uploaded.length === 0) {
        toast.error('No files uploaded.');
        setBusy(false);
        return;
      }

      // 2) Call API → n8n ingest
      setQueue(prev => prev.map(p => p.status === 'uploaded' ? { ...p, status: 'ingesting' } : p));
      const r = await fetch('/api/kb/ingest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          files: uploaded
            .filter(u => u.url)
            .map(u => ({ name: u.name, url: u.url!, size: u.size, mime: u.file.type || 'application/octet-stream', userId: uploadUserId }))
        })
      });
      const resp = await r.json();

      if (!r.ok || !resp?.ok) {
        toast.error(resp?.error || 'Ingest failed');
        setQueue(prev => prev.map(p => p.status === 'ingesting' ? { ...p, status: 'error', error: 'Ingest failed' } : p));
        setBusy(false);
        return;
      }

      setQueue(prev => prev.map(p => p.status === 'ingesting' ? { ...p, status: 'done' } : p));
      toast.success('Uploaded & queued for embedding. Answers will reflect new docs shortly.');
    } catch (e:any) {
      toast.error(e?.message || 'Unexpected error');
    } finally {
      setBusy(false);
    }
  }

  function removeItem(id: string) {
    setQueue(prev => prev.filter(p => p.id !== id));
  }

  function humanSize(n: number) {
    const mb = n / (1024 * 1024);
    return `${mb.toFixed(2)} MB`;
  }

  return (
    <div className="rounded-2xl border bg-token-surface-1 backdrop-blur p-5 shadow-matte-1" style={{ borderColor: 'var(--border)' }}>
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-token-text-hi">Upload to Knowledge Base</h3>
        <p className="text-sm text-token-text-mute">PDF, DOCX or TXT • Max {MAX_MB}MB each • Drag & drop multiple files</p>
      </div>

      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        className={`grid place-items-center rounded-xl border-2 border-dashed transition-all p-10
          ${dragOver ? 'bg-token-surface-2' : 'bg-token-surface-0'}`}
        style={{ borderColor: dragOver ? '#E76A3C' : 'var(--border)' }}
      >
        <div className="flex flex-col items-center gap-2">
          <Upload className="h-8 w-8 text-token-text-mute" />
          <p className="text-token-text-lo">Drag files here or</p>
          <label className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white cursor-pointer transition hover:brightness-110" style={{ backgroundColor: '#E76A3C' }}>
            Browse files
            <input type="file" className="hidden" multiple onChange={(e) => addFiles(e.target.files)} accept=".pdf,.docx,.txt,application/pdf,text/plain" />
          </label>
        </div>
      </div>

      {/* Queue */}
      {queue.length > 0 && (
        <div className="mt-5 space-y-2">
          {queue.map(item => (
            <div key={item.id} className="flex items-center gap-3 rounded-lg border bg-token-surface-0 px-3 py-2" style={{ borderColor: 'var(--border)' }}>
              <FileText className="h-5 w-5 text-token-text-mute" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="truncate text-token-text-hi text-sm">{item.name}</p>
                  <span className="text-xs text-token-text-mute">{humanSize(item.size)}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded" style={{ backgroundColor: 'var(--border)' }}>
                  <div
                    className={`h-full transition-all ${item.status === 'error' ? 'bg-rose-500' : ''}`}
                    style={{
                      width: `${item.progress}%`,
                      backgroundColor: item.status === 'error' ? undefined : '#E76A3C'
                    }}
                  />
                </div>
                <p className="mt-1 text-xs text-token-text-mute">
                  {item.status === 'queued' && 'Queued'}
                  {item.status === 'uploading' && 'Uploading…'}
                  {item.status === 'uploaded' && 'Uploaded • Waiting to ingest…'}
                  {item.status === 'ingesting' && 'Sending to AI embedder…'}
                  {item.status === 'done' && 'Done'}
                  {item.status === 'error' && `Error: ${item.error || 'Failed'}`}
                </p>
              </div>
              {item.status === 'done' ? (
                <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              ) : item.status === 'error' ? (
                <CircleAlert className="h-5 w-5 text-rose-500" />
              ) : (
                <button onClick={() => removeItem(item.id)} className="rounded p-1 text-token-text-mute hover:text-token-text-hi transition">
                  <X className="h-5 w-5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-5 flex items-center justify-between">
        <p className="text-xs text-token-text-mute">Tip: New uploads expand what the assistant can answer.</p>
        <button
          onClick={handleUpload}
          disabled={busy || queue.length === 0}
          className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ backgroundColor: '#E76A3C' }}
        >
          {busy && <Loader2 className="h-4 w-4 animate-spin" />}
          Upload & Ingest
        </button>
      </div>
    </div>
  );
}
