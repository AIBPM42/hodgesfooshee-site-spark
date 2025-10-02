export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
}

export function createErrorResponse(
  where: string,
  code: string,
  msg: string,
  status: number = 500,
  extra?: Record<string, any>
) {
  return new Response(
    JSON.stringify({
      ok: false,
      where,
      code,
      msg,
      status,
      ...extra
    }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}

export function createSuccessResponse(data: any, status: number = 200) {
  return new Response(
    JSON.stringify({ ok: true, ...data }),
    {
      status,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    }
  );
}
