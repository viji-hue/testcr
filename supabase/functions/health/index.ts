import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

serve(async (request) => {
  if (request.method !== "GET") return new Response("Method not allowed", { status: 405 });
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const anonKey = Deno.env.get("SUPABASE_ANON_KEY");
  if (!supabaseUrl || !anonKey) {
    return Response.json({ status: "not_ready" }, { status: 503 });
  }
  try {
    const response = await fetch(`${supabaseUrl}/rest/v1/`, { headers: { apikey: anonKey }, signal: AbortSignal.timeout(2000) });
    return Response.json({ status: response.ok ? "ready" : "not_ready" }, { status: response.ok ? 200 : 503 });
  } catch {
    return Response.json({ status: "not_ready" }, { status: 503 });
  }
});
