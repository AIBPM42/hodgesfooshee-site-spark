'use client';

import { useState, useRef, useEffect } from 'react';
import { Upload, Wand2, Download, ExternalLink, X, Loader2, FileImage, Settings2, Eye } from 'lucide-react';
import { toast } from 'sonner';
import { logRunClient, logDownloadClient } from '@/lib/usage';
import { useAuth } from '@/components/AuthProvider';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

type ImageItem = {
  id: string;
  file: File | null;
  originalUrl: string;
  editedUrl: string | null;
  status: 'idle' | 'uploading' | 'processing' | 'done' | 'error';
  error?: string;
  progress: number;
};

type LogEntry = {
  timestamp: string;
  level: 'info' | 'success' | 'error';
  message: string;
};

export default function ImageEditorV2() {
  const { user } = useAuth(); // Get authenticated user from context
  const supabase = createClientComponentClient();
  const [items, setItems] = useState<ImageItem[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const runIdRef = useRef<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showBefore, setShowBefore] = useState(false);
  const [inputMode, setInputMode] = useState<'upload' | 'url'>('upload');
  const [imageUrl, setImageUrl] = useState('');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Settings
  const [strength, setStrength] = useState(0.95);
  const [guidance, setGuidance] = useState(3.0);
  const [seed, setSeed] = useState<number | null>(null);
  const [preserveBg, setPreserveBg] = useState(true);
  const [outputFmt, setOutputFmt] = useState<'png' | 'jpeg' | 'webp'>('jpeg');
  const [aspect, setAspect] = useState<'1:1' | '16:9' | '9:16' | '4:3' | '3:4'>('1:1');
  const [syncMode, setSyncMode] = useState(true);
  const [composeMode, setComposeMode] = useState(false); // Compose all images into one

  const activeItem = items.find((i) => i.id === activeId) || null;

  // Auto-scroll logs
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  function addLog(level: LogEntry['level'], message: string) {
    const timestamp = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp, level, message }]);
  }

  function handleFileSelect(files: FileList | null) {
    if (!files) return;
    const newItems: ImageItem[] = [];

    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast.error(`Skipped non-image: ${file.name}`);
        return;
      }
      if (file.size > 10 * 1024 * 1024) {
        toast.error(`Max size is 10MB: ${file.name}`);
        return;
      }

      const id = crypto.randomUUID();
      const url = URL.createObjectURL(file);
      newItems.push({
        id,
        file,
        originalUrl: url,
        editedUrl: null,
        status: 'idle',
        progress: 0,
      });
    });

    setItems((prev) => [...prev, ...newItems]);
    if (newItems.length > 0 && !activeId) {
      setActiveId(newItems[0].id);
    }
    addLog('success', `Added ${newItems.length} image(s)`);
  }

  function removeItem(id: string) {
    setItems((prev) => {
      const filtered = prev.filter((i) => i.id !== id);
      if (activeId === id && filtered.length > 0) {
        setActiveId(filtered[0].id);
      } else if (filtered.length === 0) {
        setActiveId(null);
      }
      return filtered;
    });
  }

  async function handleRun() {
    if (!prompt.trim()) {
      toast.error('Please enter a prompt');
      return;
    }
    if (items.length === 0) {
      toast.error('Please upload at least one image');
      return;
    }

    setIsRunning(true);

    // COMPOSE MODE: Send all images together as one request
    if (composeMode && items.length > 1) {
      addLog('info', `Composing ${items.length} images into one result...`);

      try {
        if (!user) {
          toast.error('You must be logged in to edit images');
          throw new Error('Not authenticated');
        }

        // Get session for access token
        const { data: { session } } = await supabase.auth.getSession();

        // Upload all images first
        const imageUrls: string[] = [];

        for (const item of items) {
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: 'uploading' } : p))
          );

          let imageUrl: string;

          if (item.file) {
            const formData = new FormData();
            formData.append('file', item.file);

            const headers: HeadersInit = {};
            if (session?.access_token) {
              headers['Authorization'] = `Bearer ${session.access_token}`;
            }

            const uploadRes = await fetch('/api/image-editor/upload', {
              method: 'POST',
              headers,
              body: formData,
            });

            const uploadData = await uploadRes.json();
            if (!uploadData.ok) throw new Error(uploadData.error || 'Upload failed');

            imageUrl = uploadData.url;
            addLog('info', `Uploaded: ${item.file.name}`);
          } else {
            imageUrl = item.originalUrl;
            addLog('info', `Using URL: ${imageUrl}`);
          }

          imageUrls.push(imageUrl);
        }

        // Process ALL images together with FAL
        addLog('info', 'Compositing images with AI...');

        setItems((prev) =>
          prev.map((p) => ({ ...p, status: 'processing', progress: 50 }))
        );

        const processHeaders: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (session?.access_token) {
          processHeaders['Authorization'] = `Bearer ${session.access_token}`;
        }

        const processRes = await fetch('/api/image-editor/process', {
          method: 'POST',
          headers: processHeaders,
          body: JSON.stringify({
            imageUrls, // Send all images
            prompt,
            strength,
            guidance,
            seed: seed === null ? undefined : seed,
            preserveBg,
          }),
        });

        const processData = await processRes.json();
        if (!processData.ok) throw new Error(processData.error || 'Processing failed');

        const editedUrl = processData.editedUrl;
        if (!editedUrl) throw new Error('No output image returned');

        // Mark the first item as done with the result, others as completed
        setItems((prev) =>
          prev.map((p, idx) =>
            idx === 0
              ? { ...p, editedUrl, status: 'done', progress: 100 }
              : { ...p, status: 'done', progress: 100 }
          )
        );

        addLog('success', '✓ Composition completed');
      } catch (error: any) {
        console.error('Compose error:', error);
        setItems((prev) =>
          prev.map((p) => ({ ...p, status: 'error', error: error.message, progress: 0 }))
        );
        addLog('error', `✗ Composition failed: ${error.message}`);
      }

      const runId = await logRunClient({
        prompt,
        options: { strength, guidance, seed, preserveBg, outputFmt, aspect, syncMode, composeMode },
        images_in: items.length,
        images_out: 1,
        storage_bytes: 0,
      });

      if (runId) {
        runIdRef.current = runId;
        addLog('info', `Run logged: ${runId}`);
      }

      setIsRunning(false);
      addLog('success', 'Compose complete!');
      toast.success('Composition complete!');
      return;
    }

    // BATCH MODE: Process each image separately (original behavior)
    addLog('info', `Starting batch edit with ${items.length} image(s)...`);

    if (!user) {
      toast.error('You must be logged in to edit images');
      setIsRunning(false);
      return;
    }

    // Get session for access token
    const { data: { session } } = await supabase.auth.getSession();

    // Process all items (even if already done - allows re-running)
    for (const item of items) {
      setItems((prev) =>
        prev.map((p) => (p.id === item.id ? { ...p, status: 'processing', progress: 10 } : p))
      );

      try {
        addLog('info', `Processing: ${item.file?.name || item.id}`);

        let imageUrl: string;

        // If item has a file, upload it. Otherwise, use the URL directly
        if (item.file) {
          // Step 1: Upload to server
          setItems((prev) =>
            prev.map((p) => (p.id === item.id ? { ...p, status: 'uploading' } : p))
          );

          const formData = new FormData();
          formData.append('file', item.file);

          const headers: HeadersInit = {};
          if (session?.access_token) {
            headers['Authorization'] = `Bearer ${session.access_token}`;
          }

          const uploadRes = await fetch('/api/image-editor/upload', {
            method: 'POST',
            headers,
            body: formData,
          });

          const uploadData = await uploadRes.json();
          if (!uploadData.ok) throw new Error(uploadData.error || 'Upload failed');

          imageUrl = uploadData.url;
          addLog('info', `Uploaded: ${item.file.name}`);
        } else {
          // Use the original URL directly (already a valid URL)
          imageUrl = item.originalUrl;
          addLog('info', `Using URL: ${imageUrl}`);
        }

        // Step 2: Process with FAL
        setItems((prev) =>
          prev.map((p) => (p.id === item.id ? { ...p, status: 'processing', progress: 50 } : p))
        );

        const processHeaders: HeadersInit = {
          'Content-Type': 'application/json',
        };
        if (session?.access_token) {
          processHeaders['Authorization'] = `Bearer ${session.access_token}`;
        }

        const processRes = await fetch('/api/image-editor/process', {
          method: 'POST',
          headers: processHeaders,
          body: JSON.stringify({
            imageUrl,
            prompt,
            strength,
            guidance,
            seed: seed === null ? undefined : seed,
            preserveBg,
          }),
        });

        const processData = await processRes.json();
        if (!processData.ok) throw new Error(processData.error || 'Processing failed');

        const editedUrl = processData.editedUrl;
        if (!editedUrl) throw new Error('No output image returned');

        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id ? { ...p, editedUrl, status: 'done', progress: 100 } : p
          )
        );

        addLog('success', `✓ ${item.file?.name || item.id} completed`);
      } catch (error: any) {
        console.error('Edit error:', error);
        setItems((prev) =>
          prev.map((p) =>
            p.id === item.id
              ? { ...p, status: 'error', error: error.message, progress: 0 }
              : p
          )
        );
        addLog('error', `✗ ${item.file?.name || item.id}: ${error.message}`);
      }
    }

    // Log the run
    const imagesOut = items.filter((i) => i.editedUrl).length;
    const runId = await logRunClient({
      prompt,
      options: { strength, guidance, seed, preserveBg, outputFmt, aspect, syncMode },
      images_in: items.length,
      images_out: imagesOut,
      storage_bytes: 0,
    });

    if (runId) {
      runIdRef.current = runId;
      addLog('info', `Run logged: ${runId}`);
    }

    setIsRunning(false);
    addLog('success', 'Batch complete!');
    toast.success('Editing complete!');
  }

  async function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  async function downloadSingleImage(item: ImageItem) {
    if (!item.editedUrl) return;

    try {
      // Log download
      if (runIdRef.current) {
        await logDownloadClient({
          run_id: runIdRef.current,
          file_url: item.editedUrl,
        });
        addLog('info', `Download logged: ${item.file?.name || item.id}`);
      }

      // Fetch the image as a blob to prevent navigation
      const response = await fetch(item.editedUrl);
      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      // Create download link
      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = (item.file?.name || 'edited').replace(/\.\w+$/, '') + '_edited.jpg';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);

      // Clean up blob URL
      setTimeout(() => window.URL.revokeObjectURL(blobUrl), 100);

      toast.success('Download started');
    } catch (error) {
      console.error('Download error:', error);
      toast.error('Download failed');
    }
  }

  async function downloadAllImages() {
    const completed = items.filter((i) => i.editedUrl);
    if (completed.length === 0) return;

    for (const item of completed) {
      await downloadSingleImage(item);
      await new Promise((r) => setTimeout(r, 300)); // Delay between downloads
    }

    toast.success(`Downloaded ${completed.length} image(s)`);
  }

  return (
    <div className="flex h-screen bg-token-surface-0">
      {/* Left Panel - Input & Controls */}
      <div className="w-[700px] border-r flex flex-col bg-token-surface-1" style={{ borderColor: 'var(--border)' }}>
        {/* Header */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <h1 className="text-xl font-semibold text-token-text-hi flex items-center gap-2">
            <Wand2 className="h-5 w-5" />
            Hodges Image Studio
          </h1>
          <p className="text-xs text-token-text-mute mt-1">Professional AI image editing & compositing</p>
        </div>

        {/* Upload Area - Compact */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          {/* Toggle between Upload and URL */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setInputMode('upload')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition ${
                inputMode === 'upload' ? 'bg-token-surface-2 text-token-text-hi' : 'text-token-text-mute hover:text-token-text-hi'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setInputMode('url')}
              className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition ${
                inputMode === 'url' ? 'bg-token-surface-2 text-token-text-hi' : 'text-token-text-mute hover:text-token-text-hi'
              }`}
            >
              URL
            </button>
          </div>

          {inputMode === 'upload' ? (
            <label className="block">
              <button
                type="button"
                onClick={() => document.getElementById('file-input-v2')?.click()}
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed px-4 py-3 text-sm font-medium transition hover:bg-token-surface-2"
                style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
              >
                <Upload className="h-4 w-4" />
                Add Image
              </button>
              <input
                id="file-input-v2"
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files)}
              />
            </label>
          ) : (
            <div className="space-y-2">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border bg-token-surface-0 px-3 py-2 text-sm text-token-text-hi placeholder:text-token-text-mute outline-none focus:ring-2"
                style={{ borderColor: 'var(--border)', '--tw-ring-color': '#E76A3C' } as any}
              />
              <button
                onClick={() => {
                  if (!imageUrl.trim()) {
                    toast.error('Please enter an image URL');
                    return;
                  }
                  // Add image from URL
                  const newItem: ImageItem = {
                    id: Date.now().toString(),
                    file: null,
                    originalUrl: imageUrl,
                    editedUrl: null,
                    status: 'idle',
                    progress: 0,
                  };
                  setItems((prev) => [...prev, newItem]);
                  setImageUrl('');
                  addLog('info', `Added image from URL`);
                  toast.success('Image added from URL');
                }}
                className="w-full flex items-center justify-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                style={{ backgroundColor: '#E76A3C' }}
              >
                <Upload className="h-4 w-4" />
                Add from URL
              </button>
            </div>
          )}

          {/* Uploaded Images List */}
          {items.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="text-xs font-medium text-token-text-mute">Images ({items.length})</div>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer transition ${
                    selectedImageIndex === idx ? 'bg-token-surface-2' : 'hover:bg-token-surface-2'
                  }`}
                  style={selectedImageIndex === idx ? { borderColor: '#E76A3C' } : { borderColor: 'var(--border)' }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.originalUrl}
                    alt={item.file?.name || `Image ${idx + 1}`}
                    className="h-12 w-12 rounded object-cover flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-token-text-hi truncate">
                      {item.file?.name || `Image ${idx + 1}`}
                    </p>
                    <p className="text-[10px] text-token-text-mute">
                      {item.status === 'idle' && 'Ready'}
                      {item.status === 'uploading' && 'Uploading...'}
                      {item.status === 'processing' && 'Processing...'}
                      {item.status === 'done' && '✓ Complete'}
                      {item.status === 'error' && '✗ Error'}
                    </p>
                  </div>

                  {/* Remove button */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item.id);
                    }}
                    className="p-1 rounded hover:bg-token-surface-0 text-token-text-mute hover:text-token-text-hi"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compose Mode Toggle - Compact */}
        {items.length > 1 && (
          <div className="px-4 py-2 border-b" style={{ borderColor: 'var(--border)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg border" style={{ borderColor: '#E76A3C', backgroundColor: 'rgba(231, 106, 60, 0.05)' }}>
              <input
                type="checkbox"
                checked={composeMode}
                onChange={(e) => setComposeMode(e.target.checked)}
                className="rounded"
                id="compose-toggle"
              />
              <label htmlFor="compose-toggle" className="text-xs font-medium text-token-text-hi cursor-pointer">
                🎨 Compose into 1 image
              </label>
            </div>
          </div>
        )}

        {/* Prompt */}
        <div className="p-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <label className="block">
            <div className="text-sm font-medium text-token-text-hi mb-2">Prompt</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your edit..."
              rows={2}
              className="w-full rounded-lg border bg-token-surface-0 px-3 py-2 text-sm text-token-text-hi placeholder:text-token-text-mute outline-none focus:ring-2"
              style={{ borderColor: 'var(--border)', '--tw-ring-color': '#E76A3C' } as any}
            />
          </label>
        </div>

        {/* Settings */}
        <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3">
          <div className="flex items-center gap-2 text-sm font-medium text-token-text-hi">
            <Settings2 className="h-4 w-4" />
            Settings
          </div>

          {/* Strength */}
          <div>
            <label className="block text-xs text-token-text-mute mb-2">
              Strength: {strength.toFixed(2)}
            </label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Guidance */}
          <div>
            <label className="block text-xs text-token-text-mute mb-2">
              Guidance Scale: {guidance.toFixed(1)}
            </label>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={guidance}
              onChange={(e) => setGuidance(parseFloat(e.target.value))}
              className="w-full"
            />
          </div>

          {/* Seed */}
          <div>
            <label className="block text-xs text-token-text-mute mb-2">Seed (optional)</label>
            <input
              type="number"
              value={seed ?? ''}
              onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Random"
              className="w-full rounded-lg border bg-token-surface-0 px-3 py-2 text-sm text-token-text-hi"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>

          {/* Preserve BG */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={preserveBg}
              onChange={(e) => setPreserveBg(e.target.checked)}
              className="rounded"
            />
            <label className="text-xs text-token-text-lo">Preserve background</label>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-xs text-token-text-mute mb-2">Output Format</label>
            <select
              value={outputFmt}
              onChange={(e) => setOutputFmt(e.target.value as any)}
              className="w-full rounded-lg border bg-token-surface-0 px-3 py-2 text-sm text-token-text-hi"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-xs text-token-text-mute mb-2">Aspect Ratio</label>
            <select
              value={aspect}
              onChange={(e) => setAspect(e.target.value as any)}
              className="w-full rounded-lg border bg-token-surface-0 px-3 py-2 text-sm text-token-text-hi"
              style={{ borderColor: 'var(--border)' }}
            >
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="4:3">4:3</option>
              <option value="3:4">3:4</option>
            </select>
          </div>

        </div>

        {/* Run Button */}
        <div className="p-4 border-t" style={{ borderColor: 'var(--border)' }}>
          <button
            onClick={handleRun}
            disabled={isRunning || items.length === 0 || !prompt.trim()}
            className="w-full rounded-lg px-4 py-3 text-sm font-medium text-white transition hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ backgroundColor: '#E76A3C' }}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                {composeMode && items.length > 1
                  ? `Compose ${items.length} Images`
                  : `Run Edit (${items.length})`}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Large Image Preview & Logs */}
      <div className="flex-1 flex flex-col">
        {/* Large Image Preview */}
        <div className="flex-1 overflow-hidden bg-token-surface-0 p-6 flex flex-col">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-token-text-mute">
              <div>
                <Upload className="mx-auto h-12 w-12 mb-3" />
                <p>Upload images to get started</p>
              </div>
            </div>
          ) : (
            (() => {
              const selectedItem = items[selectedImageIndex];
              return (
                <div className="flex-1 flex flex-col gap-4 min-h-0">
                  {/* Image Display Area */}
                  <div className="flex-1 flex items-center justify-center rounded-xl border bg-token-surface-1 p-8 relative overflow-hidden min-h-0" style={{ borderColor: 'var(--border)' }}>
                    {selectedItem.editedUrl ? (
                      // Show edited or original image (large, full size)
                      <img
                        src={showBefore ? selectedItem.originalUrl : selectedItem.editedUrl}
                        alt={showBefore ? "Original" : "Edited result"}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : selectedItem.status === 'idle' ? (
                      // Show empty state when idle (before running)
                      <div className="flex items-center justify-center h-full text-center text-token-text-mute">
                        <div>
                          <Wand2 className="mx-auto h-12 w-12 mb-3" />
                          <p>Ready to edit</p>
                          <p className="text-xs mt-1">Click "Run Edit" to process</p>
                        </div>
                      </div>
                    ) : (
                      // Show original with status overlay (only when actively processing)
                      <div className="relative max-w-full max-h-full">
                        <img
                          src={selectedItem.originalUrl}
                          alt="Original"
                          className="max-w-full max-h-full object-contain rounded-lg opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="bg-token-surface-0/90 backdrop-blur rounded-xl px-6 py-4 border" style={{ borderColor: 'var(--border)' }}>
                            {selectedItem.status === 'uploading' && (
                              <div className="flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                <p className="text-sm text-token-text-hi">Uploading...</p>
                              </div>
                            )}
                            {selectedItem.status === 'processing' && (
                              <div className="flex flex-col items-center gap-2">
                                <Loader2 className="h-6 w-6 animate-spin" style={{ color: '#E76A3C' }} />
                                <p className="text-sm text-token-text-hi font-medium">Processing with AI...</p>
                                <div className="w-48 h-2 bg-token-surface-2 rounded-full overflow-hidden mt-2">
                                  <div
                                    className="h-full transition-all duration-300 rounded-full"
                                    style={{ backgroundColor: '#E76A3C', width: `${selectedItem.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {selectedItem.status === 'error' && (
                              <div className="text-center">
                                <p className="text-sm text-red-500 font-medium mb-2">Error</p>
                                <p className="text-xs text-token-text-mute max-w-xs">{selectedItem.error}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    {/* Before/After toggle if edited */}
                    {selectedItem.editedUrl && (
                      <div className="flex items-center gap-2 flex-1">
                        <div className="text-xs text-token-text-mute">Edited</div>
                        <div className="flex-1 h-px bg-token-border" />
                      </div>
                    )}

                    {/* Download button */}
                    {selectedItem.editedUrl && (
                      <button
                        onClick={() => downloadSingleImage(selectedItem)}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium text-white transition hover:brightness-110"
                        style={{ backgroundColor: '#E76A3C' }}
                      >
                        <Download className="h-4 w-4" />
                        Download
                      </button>
                    )}

                    {/* Download All button */}
                    {items.some(i => i.editedUrl) && items.length > 1 && (
                      <button
                        onClick={downloadAllImages}
                        className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium border transition hover:bg-token-surface-2"
                        style={{ borderColor: 'var(--border)', color: 'var(--text-primary)' }}
                      >
                        <Download className="h-4 w-4" />
                        Download All ({items.filter(i => i.editedUrl).length})
                      </button>
                    )}
                  </div>
                </div>
              );
            })()
          )}
        </div>

        {/* Logs */}
        <div className="h-48 border-t bg-token-surface-1" style={{ borderColor: 'var(--border)' }}>
          <div className="px-4 py-2 border-b text-xs font-medium text-token-text-mute" style={{ borderColor: 'var(--border)' }}>
            Logs
          </div>
          <div className="h-[calc(100%-2.5rem)] overflow-y-auto p-4 font-mono text-xs space-y-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${
                  log.level === 'error'
                    ? 'text-rose-500'
                    : log.level === 'success'
                    ? 'text-emerald-500'
                    : 'text-token-text-mute'
                }`}
              >
                <span className="opacity-60">[{log.timestamp}]</span> {log.message}
              </div>
            ))}
            <div ref={logsEndRef} />
          </div>
        </div>
      </div>
    </div>
  );
}
