/**
 * Client-side helpers for logging image editing analytics
 */

export async function logRunClient(p: {
  prompt: string;
  options: any;
  images_in: number;
  images_out: number;
  storage_bytes: number;
}): Promise<string | null> {
  try {
    const res = await fetch('/api/image-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'run', payload: p }),
    });

    if (!res.ok) {
      console.error('Failed to log run:', await res.text());
      return null;
    }

    const json = await res.json();
    return json.run_id as string;
  } catch (error) {
    console.error('Error logging run:', error);
    return null;
  }
}

export async function logDownloadClient(p: {
  run_id: string;
  file_url: string;
  bytes?: number;
}): Promise<void> {
  try {
    const res = await fetch('/api/image-logs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'download', payload: p }),
    });

    if (!res.ok) {
      console.error('Failed to log download:', await res.text());
    }
  } catch (error) {
    console.error('Error logging download:', error);
  }
}
