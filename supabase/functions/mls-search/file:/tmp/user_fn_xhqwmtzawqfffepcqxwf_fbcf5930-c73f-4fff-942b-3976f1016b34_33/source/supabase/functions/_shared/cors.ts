export const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-api-key',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
};
export function createErrorResponse(where, code, msg, status = 500, extra) {
  return new Response(JSON.stringify({
    ok: false,
    where,
    code,
    msg,
    status,
    ...extra
  }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
export function createSuccessResponse(data, status = 200) {
  return new Response(JSON.stringify({
    ok: true,
    ...data
  }), {
    status,
    headers: {
      ...corsHeaders,
      'Content-Type': 'application/json'
    }
  });
}
