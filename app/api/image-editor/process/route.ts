import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseServer';

// Force dynamic rendering - don't pre-render at build time
export const dynamic = 'force-dynamic';


type ProcessRequest = {
  imageUrl?: string;
  imageUrls?: string[]; // Support multiple images for compositing
  prompt: string;
  strength?: number;
  guidance?: number;
  seed?: number;
  preserveBg?: boolean;
};

export async function POST(req: NextRequest) {
  try {
    const devMode = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

    // Skip auth check in dev mode
    if (!devMode) {
      const auth = req.headers.get('authorization') || '';
      const token = auth.startsWith('Bearer ') ? auth.slice(7) : '';
      if (!token) return NextResponse.json({ ok: false, error: 'No auth token' }, { status: 401 });

      const { data: { user }, error: userErr } = await supabaseAdmin.auth.getUser(token);
      if (userErr || !user) return NextResponse.json({ ok: false, error: 'Invalid user' }, { status: 401 });
    }

    const body = await req.json() as ProcessRequest;
    const { imageUrl, imageUrls, prompt, strength = 0.85, guidance = 7.5, seed, preserveBg = false } = body;

    // Support either single imageUrl or multiple imageUrls
    const urls = imageUrls || (imageUrl ? [imageUrl] : []);

    if (urls.length === 0 || !prompt) {
      return NextResponse.json({ ok: false, error: 'Missing image URL(s) or prompt' }, { status: 400 });
    }

    // Call FAL API server-side
    const falApiKey = process.env.FAL_API_KEY;
    if (!falApiKey) {
      return NextResponse.json({ ok: false, error: 'FAL_API_KEY not configured on server' }, { status: 500 });
    }

    console.log(`[FAL] Submitting image edit request. Images: ${urls.length}, PreserveBg: ${preserveBg}, Prompt: "${prompt}"`);

    // Always use nano-banana/edit endpoint
    const submitResponse = await fetch('https://fal.run/fal-ai/nano-banana/edit', {
      method: 'POST',
      headers: {
        'Authorization': `Key ${falApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image_urls: urls, // Send all images for compositing
        prompt,
        image_prompt_strength: strength,
        guidance_scale: guidance,
        num_inference_steps: 28,
        seed: seed || undefined,
      }),
    });

    if (!submitResponse.ok) {
      const errorText = await submitResponse.text();
      console.error(`[FAL] Submit failed: ${submitResponse.status} - ${errorText}`);
      return NextResponse.json(
        { ok: false, error: `FAL submit error: ${submitResponse.status} - ${errorText}` },
        { status: 502 }
      );
    }

    // Synchronous endpoint - returns result directly
    const resultData = await submitResponse.json();

    console.log(`[FAL] Response received:`, JSON.stringify(resultData).substring(0, 200));

    // Extract the edited image URL from the response
    const editedUrl = resultData?.images?.[0]?.url || resultData?.image?.url || '';

    if (!editedUrl) {
      return NextResponse.json({
        ok: false,
        error: 'No output image from FAL',
        response: resultData
      }, { status: 502 });
    }

    console.log(`[FAL] Success! Edited URL: ${editedUrl}`);
    return NextResponse.json({ ok: true, editedUrl });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message || 'Server error' }, { status: 500 });
  }
}
