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
  const [strength, setStrength] = useState(0.50);
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
    <div className="flex h-screen bg-white">
      {/* Left Panel - Input & Controls */}
      <div className="w-[700px] border-r flex flex-col bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
        {/* Header */}
        <div className="px-6 py-5 border-b" style={{ borderColor: '#e5e7eb' }}>
          <h1 className="text-2xl font-semibold text-gray-900 flex items-center gap-3">
            <Wand2 className="h-6 w-6 text-[#E76A3C]" />
            Hodges Image Studio
          </h1>
          <p className="text-sm text-gray-600 mt-2">Professional AI image editing & compositing</p>
        </div>

        {/* Upload Area */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e7eb' }}>
          {/* Toggle between Upload and URL */}
          <div className="flex gap-2 mb-3">
            <button
              onClick={() => setInputMode('upload')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition ${
                inputMode === 'upload' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
              }`}
            >
              Upload
            </button>
            <button
              onClick={() => setInputMode('url')}
              className={`flex-1 px-4 py-2.5 text-sm font-medium rounded-lg transition ${
                inputMode === 'url' ? 'bg-white text-gray-900 shadow-sm border border-gray-200' : 'text-gray-600 hover:text-gray-900 hover:bg-white/50'
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
                className="w-full flex items-center justify-center gap-2 rounded-lg border-2 border-dashed px-6 py-4 text-sm font-medium transition hover:bg-white hover:border-gray-400 text-gray-700"
                style={{ borderColor: '#d1d5db' }}
              >
                <Upload className="h-5 w-5" />
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
            <div className="space-y-3">
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full rounded-lg border bg-white px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#E76A3C] focus:border-[#E76A3C] transition"
                style={{ borderColor: '#d1d5db' }}
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
                className="w-full flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium text-white transition hover:opacity-90 shadow-sm"
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
              <div className="text-sm font-medium text-gray-700">Images ({items.length})</div>
              {items.map((item, idx) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImageIndex(idx)}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition ${
                    selectedImageIndex === idx ? 'bg-white shadow-sm' : 'hover:bg-white'
                  }`}
                  style={selectedImageIndex === idx ? { borderColor: '#E76A3C' } : { borderColor: '#e5e7eb' }}
                >
                  {/* Thumbnail */}
                  <img
                    src={item.originalUrl}
                    alt={item.file?.name || `Image ${idx + 1}`}
                    className="h-12 w-12 rounded-md object-cover flex-shrink-0"
                  />

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      {item.file?.name || `Image ${idx + 1}`}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
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
                    className="p-1.5 rounded hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Compose Mode Toggle */}
        {items.length > 1 && (
          <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e7eb' }}>
            <div className="flex items-center gap-3 px-4 py-3 rounded-lg border" style={{ borderColor: '#E76A3C', backgroundColor: 'rgba(231, 106, 60, 0.05)' }}>
              <input
                type="checkbox"
                checked={composeMode}
                onChange={(e) => setComposeMode(e.target.checked)}
                className="rounded w-4 h-4 text-[#E76A3C] focus:ring-[#E76A3C]"
                id="compose-toggle"
              />
              <label htmlFor="compose-toggle" className="text-sm font-medium text-gray-900 cursor-pointer">
                🎨 Compose into 1 image
              </label>
            </div>
          </div>
        )}

        {/* Prompt */}
        <div className="px-6 py-4 border-b" style={{ borderColor: '#e5e7eb' }}>
          <label className="block">
            <div className="text-sm font-semibold text-gray-900 mb-2">Prompt</div>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe your edit..."
              rows={2}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 placeholder:text-gray-400 outline-none focus:ring-2 focus:ring-[#E76A3C] focus:border-[#E76A3C] transition resize-none"
              style={{ borderColor: '#d1d5db' }}
            />
          </label>
        </div>

        {/* Settings */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          <div className="flex items-center gap-2 text-base font-semibold text-gray-900 sticky top-0 bg-gray-50 pb-2 -mt-1 pt-1 z-10">
            <Settings2 className="h-5 w-5 text-[#E76A3C]" />
            Settings
          </div>

          {/* Strength */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Strength: <span className="text-gray-900">{strength.toFixed(2)}</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">How much the AI changes the image. Lower = subtle, higher = dramatic.</p>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={strength}
              onChange={(e) => setStrength(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E76A3C]"
            />
          </div>

          {/* Guidance */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">
              Guidance Scale: <span className="text-gray-900">{guidance.toFixed(1)}</span>
            </label>
            <p className="text-xs text-gray-500 mb-2">How closely AI follows your prompt. 1-3 = natural, 7-10 = literal.</p>
            <input
              type="range"
              min="1"
              max="10"
              step="0.5"
              value={guidance}
              onChange={(e) => setGuidance(parseFloat(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#E76A3C]"
            />
          </div>

          {/* Seed */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Seed (optional)</label>
            <p className="text-xs text-gray-500 mb-2">Set a number for reproducible results. Leave empty for random.</p>
            <input
              type="number"
              value={seed ?? ''}
              onChange={(e) => setSeed(e.target.value ? parseInt(e.target.value) : null)}
              placeholder="Random"
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#E76A3C] focus:border-[#E76A3C] transition"
              style={{ borderColor: '#d1d5db' }}
            />
          </div>

          {/* Preserve BG */}
          <div>
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={preserveBg}
                onChange={(e) => setPreserveBg(e.target.checked)}
                className="rounded w-4 h-4 text-[#E76A3C] focus:ring-[#E76A3C]"
                id="preserve-bg"
              />
              <label htmlFor="preserve-bg" className="text-sm text-gray-700 font-medium cursor-pointer">Preserve background</label>
            </div>
            <p className="text-xs text-gray-500 mt-1 ml-7">Keep the original background unchanged when editing.</p>
          </div>

          {/* Output Format */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Output Format</label>
            <p className="text-xs text-gray-500 mb-2">JPEG for smaller files, PNG for transparency, WebP for best compression.</p>
            <select
              value={outputFmt}
              onChange={(e) => setOutputFmt(e.target.value as any)}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#E76A3C] focus:border-[#E76A3C] transition"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="jpeg">JPEG</option>
              <option value="png">PNG</option>
              <option value="webp">WebP</option>
            </select>
          </div>

          {/* Aspect Ratio */}
          <div>
            <label className="block text-sm text-gray-700 font-medium mb-1">Aspect Ratio</label>
            <p className="text-xs text-gray-500 mb-2">Output dimensions. Original aspect may be adjusted to fit.</p>
            <select
              value={aspect}
              onChange={(e) => setAspect(e.target.value as any)}
              className="w-full rounded-lg border bg-white px-4 py-2.5 text-sm text-gray-900 focus:ring-2 focus:ring-[#E76A3C] focus:border-[#E76A3C] transition"
              style={{ borderColor: '#d1d5db' }}
            >
              <option value="1:1">1:1 (Square)</option>
              <option value="16:9">16:9 (Landscape)</option>
              <option value="9:16">9:16 (Portrait)</option>
              <option value="4:3">4:3</option>
              <option value="3:4">3:4</option>
            </select>
          </div>

          {/* Add bottom padding for better scrolling */}
          <div className="h-4"></div>

        </div>

        {/* Run Button */}
        <div className="px-6 py-4 border-t" style={{ borderColor: '#e5e7eb' }}>
          <button
            onClick={handleRun}
            disabled={isRunning || items.length === 0 || !prompt.trim()}
            className="w-full rounded-lg px-6 py-3 text-base font-semibold text-white transition hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-sm"
            style={{ backgroundColor: '#E76A3C' }}
          >
            {isRunning ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Wand2 className="h-5 w-5" />
                {composeMode && items.length > 1
                  ? `Compose ${items.length} Images`
                  : `Run Edit (${items.length})`}
              </>
            )}
          </button>
        </div>
      </div>

      {/* Right Panel - Large Image Preview & Logs */}
      <div className="flex-1 flex flex-col bg-white">
        {/* Large Image Preview */}
        <div className="flex-1 overflow-hidden bg-gray-50 p-8 flex flex-col">
          {items.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-gray-400">
              <div>
                <Upload className="mx-auto h-16 w-16 mb-4" />
                <p className="text-lg font-medium">Upload images to get started</p>
              </div>
            </div>
          ) : (
            (() => {
              const selectedItem = items[selectedImageIndex];
              return (
                <div className="flex-1 flex flex-col gap-6 min-h-0">
                  {/* Image Display Area */}
                  <div className="flex-1 flex items-center justify-center rounded-xl border bg-white p-8 relative overflow-hidden min-h-0 shadow-sm" style={{ borderColor: '#e5e7eb' }}>
                    {selectedItem.editedUrl ? (
                      // Show edited or original image (large, full size)
                      <img
                        src={showBefore ? selectedItem.originalUrl : selectedItem.editedUrl}
                        alt={showBefore ? "Original" : "Edited result"}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    ) : selectedItem.status === 'idle' ? (
                      // Show empty state when idle (before running)
                      <div className="flex items-center justify-center h-full text-center text-gray-400">
                        <div>
                          <Wand2 className="mx-auto h-16 w-16 mb-4 text-gray-300" />
                          <p className="text-lg font-medium text-gray-600">Ready to edit</p>
                          <p className="text-sm mt-2">Click "Run Edit" to process</p>
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
                          <div className="bg-white/95 backdrop-blur-sm rounded-xl px-8 py-6 border shadow-lg" style={{ borderColor: '#e5e7eb' }}>
                            {selectedItem.status === 'uploading' && (
                              <div className="flex items-center gap-3">
                                <Loader2 className="h-5 w-5 animate-spin text-[#E76A3C]" />
                                <p className="text-base text-gray-900 font-medium">Uploading...</p>
                              </div>
                            )}
                            {selectedItem.status === 'processing' && (
                              <div className="flex flex-col items-center gap-3">
                                <Loader2 className="h-8 w-8 animate-spin" style={{ color: '#E76A3C' }} />
                                <p className="text-base text-gray-900 font-semibold">Processing with AI...</p>
                                <div className="w-56 h-2 bg-gray-200 rounded-full overflow-hidden mt-2">
                                  <div
                                    className="h-full transition-all duration-300 rounded-full"
                                    style={{ backgroundColor: '#E76A3C', width: `${selectedItem.progress}%` }}
                                  />
                                </div>
                              </div>
                            )}
                            {selectedItem.status === 'error' && (
                              <div className="text-center">
                                <p className="text-base text-red-500 font-semibold mb-2">Error</p>
                                <p className="text-sm text-gray-600 max-w-xs">{selectedItem.error}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-4">
                    {/* Before/After toggle if edited */}
                    {selectedItem.editedUrl && (
                      <div className="flex items-center gap-3 flex-1">
                        <div className="text-sm text-gray-600 font-medium">Edited Result</div>
                        <div className="flex-1 h-px bg-gray-200" />
                      </div>
                    )}

                    {/* Download button */}
                    {selectedItem.editedUrl && (
                      <button
                        onClick={() => downloadSingleImage(selectedItem)}
                        className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 shadow-sm"
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
                        className="flex items-center gap-2 rounded-lg px-6 py-3 text-sm font-medium border transition hover:bg-gray-50 text-gray-700"
                        style={{ borderColor: '#d1d5db' }}
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
        <div className="h-48 border-t bg-gray-50" style={{ borderColor: '#e5e7eb' }}>
          <div className="px-6 py-3 border-b text-sm font-semibold text-gray-700" style={{ borderColor: '#e5e7eb' }}>
            Logs
          </div>
          <div className="h-[calc(100%-3rem)] overflow-y-auto px-6 py-4 font-mono text-xs space-y-1">
            {logs.map((log, i) => (
              <div
                key={i}
                className={`${
                  log.level === 'error'
                    ? 'text-rose-600'
                    : log.level === 'success'
                    ? 'text-emerald-600'
                    : 'text-gray-500'
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
