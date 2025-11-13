import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.local file for scripts
config({ path: '.env.local' });

// Lazy initialization of Supabase client to avoid build-time errors
let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (!supabaseAdmin) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase credentials are required');
    }

    supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });
  }
  return supabaseAdmin;
}

export type ServiceName = 'manus' | 'perplexity' | 'openai';

type ApiKeyRow = {
  id?: string;
  service: string;
  key_value: string;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
};

/**
 * Retrieves API key for a service with environment variable fallback
 * @param service - The service name (manus, perplexity, openai)
 * @returns The API key or null if not found
 */
export async function getApiKey(service: ServiceName): Promise<string | null> {
  try {
    // First, try database
    const { data } = await getSupabaseAdmin()
      .from('api_keys')
      .select('key_value, is_active')
      .eq('service', service)
      .eq('is_active', true)
      .single() as { data: ApiKeyRow | null; error: any };

    if (data && data.key_value) {
      return data.key_value;
    }

    // Fallback to environment variables
    const envMap: Record<ServiceName, string | undefined> = {
      manus: process.env.MANUS_API_KEY,
      perplexity: process.env.PERPLEXITY_API_KEY,
      openai: process.env.OPENAI_API_KEY,
    };

    return envMap[service] || null;
  } catch (err) {
    console.error(`[safeKeys] Error fetching ${service} key:`, err);

    // Final fallback to env vars
    const envMap: Record<ServiceName, string | undefined> = {
      manus: process.env.MANUS_API_KEY,
      perplexity: process.env.PERPLEXITY_API_KEY,
      openai: process.env.OPENAI_API_KEY,
    };

    return envMap[service] || null;
  }
}

/**
 * Updates or inserts an API key for a service
 * @param service - The service name
 * @param keyValue - The API key value
 * @returns Success status
 */
export async function updateApiKey(
  service: ServiceName,
  keyValue: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const admin = getSupabaseAdmin();

    // Check if key exists
    const { data: existing } = await admin
      .from('api_keys')
      .select('id')
      .eq('service', service)
      .single() as { data: { id: string } | null; error: any };

    if (existing) {
      // Update existing key
      const updateResult: any = await (admin.from('api_keys') as any)
        .update({ key_value: keyValue, is_active: true, updated_at: new Date().toISOString() })
        .eq('service', service);

      if (updateResult.error) throw updateResult.error;
    } else {
      // Insert new key
      const insertResult: any = await (admin.from('api_keys') as any)
        .insert({ service, key_value: keyValue, is_active: true });

      if (insertResult.error) throw insertResult.error;
    }

    return { success: true };
  } catch (err: any) {
    console.error(`[safeKeys] Error updating ${service} key:`, err);
    return { success: false, error: err.message };
  }
}

/**
 * Gets a masked version of the API key for display
 * @param service - The service name
 * @returns Masked key (last 4 chars) or null
 */
export async function getMaskedKey(service: ServiceName): Promise<string | null> {
  const key = await getApiKey(service);
  if (!key) return null;

  if (key.length <= 4) return '****';
  return `${'*'.repeat(key.length - 4)}${key.slice(-4)}`;
}

/**
 * Tests if an API key is valid by making a test request
 * @param service - The service name
 * @param keyToTest - Optional key to test (if not provided, fetches from DB/env)
 * @returns Test result with success status
 */
export async function testApiKey(
  service: ServiceName,
  keyToTest?: string
): Promise<{ success: boolean; message: string }> {
  const key = keyToTest || await getApiKey(service);

  if (!key) {
    return { success: false, message: 'No API key found' };
  }

  try {
    let response: Response;

    switch (service) {
      case 'manus':
        // Test Manus API with a simple ping or minimal request
        response = await fetch('https://api.manus.com/v1/ping', {
          headers: { 'Authorization': `Bearer ${key}` },
        });
        break;

      case 'perplexity':
        // Test Perplexity API with a minimal completion request
        response = await fetch('https://api.perplexity.ai/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'sonar',
            messages: [{ role: 'user', content: 'test' }],
            max_tokens: 1,
          }),
        });
        break;

      case 'openai':
        // Test OpenAI API with a minimal request
        response = await fetch('https://api.openai.com/v1/models', {
          headers: { 'Authorization': `Bearer ${key}` },
        });
        break;

      default:
        return { success: false, message: 'Unknown service' };
    }

    if (response.ok || response.status === 200) {
      return { success: true, message: 'API key is valid' };
    } else {
      const errorText = await response.text();
      return {
        success: false,
        message: `API returned ${response.status}: ${errorText.slice(0, 100)}`
      };
    }
  } catch (err: any) {
    return { success: false, message: `Test failed: ${err.message}` };
  }
}
