import { serve } from "https://deno.land/std@0.177.0/http/server.ts";

const OPENAI_KEY = Deno.env.get("OPENAI_API_KEY")?.trim();
const GEMINI_KEY = Deno.env.get("GEMINI_API_KEY")?.trim();
const SUPABASE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL");

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", {
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  const { prompt } = await req.json();
  

  // 1. Obtener embedding del prompt
  const embeddingRes = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${OPENAI_KEY}`,
    },
    body: JSON.stringify({
      model: "text-embedding-3-small",
      input: prompt,
    }),
  });
  console.log("Embedding key obtained:", OPENAI_KEY, "test");
  const embeddingData = await embeddingRes.json();
  const queryEmbedding = embeddingData.data?.[0]?.embedding;

  console.log("Embedding result:", embeddingData);
console.log("queryEmbedding:", queryEmbedding);

if (!Array.isArray(queryEmbedding)) {
  return new Response( `❌ queryEmbedding no es un array ${queryEmbedding} `, { status: 500 });
}
  // 2. Buscar vector más similar en Supabase
  const matchRes = await fetch(`${SUPABASE_URL}/rest/v1/rpc/match_product_embedding`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      query_embedding: queryEmbedding,
      match_threshold: 0.78,
      match_count: 1,
    }),
  });

  const [bestMatch] = await matchRes.json();

  const contexto = bestMatch?.content || "No se encontró contexto relevante";
  const mensaje = `Contexto del producto más similar: ${contexto}\n\nPregunta del usuario: ${prompt}`;

  // 3. Preguntar a Gemini usando contexto + pregunta
  const geminiRes = await fetch(
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=" + GEMINI_KEY,
    {
      method: "POST",
      headers: { "Content-Type": "application/json"  },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                //  text: `Contexto del producto más similar: ${contexto}\n\nPregunta del usuario: ${prompt}`,
                text: mensaje,
              },
            ],
          },
        ],
      }),
    }
  );

  const geminiData = await geminiRes.json();
  const text = geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || `⚠️ Gemini no respondió.\n\nPrompt usado:\n${mensaje}`;



  return new Response(JSON.stringify({ text }), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "*",
    },
  });
});
