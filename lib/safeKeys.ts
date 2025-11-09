import { config } from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Load .env.local file for scripts
config({ path: '.env.local' });

// Service role client for API key management (admin only)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export type ServiceName = 'manus' | 'perplexity' | 'openai';

/**
 * Retrieves API key for a service with environment variable fallback
 * @param service - The service name (manus, perplexity, openai)
 * @returns The API key or null if not found
 */
export async function getApiKey(service: ServiceName): Promise<string | null> {
  try {
    // First, try database
    const { data, error } = await supabaseAdmin
      .from('api_keys')
      .select('key_value, is_active')
      .eq('service', service)
      .eq('is_active', true)
      .single();

    if (data?.key_value) {
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
    // Check if key exists
    const { data: existing } = await supabaseAdmin
      .from('api_keys')
      .select('id')
      .eq('service', service)
      .single();

    if (existing) {
      // Update existing key
      const { error } = await supabaseAdmin
        .from('api_keys')
        .update({ key_value: keyValue, is_active: true, updated_at: new Date().toISOString() })
        .eq('service', service);

      if (error) throw error;
    } else {
      // Insert new key
      const { error } = await supabaseAdmin
        .from('api_keys')
        .insert({ service, key_value: keyValue, is_active: true });

      if (error) throw error;
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
