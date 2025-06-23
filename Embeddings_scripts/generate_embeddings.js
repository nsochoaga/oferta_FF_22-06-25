require('dotenv').config();

const EMBEDDING_MODEL = "text-embedding-3-small";

async function getEmbedding(text) {
  const res = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  const data = await res.json();
  return data.data[0].embedding;
}

async function run() {
  const productsRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/products`, {
    headers: {
      apikey: process.env.SUPABASE_SERVICE_KEY,
      Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
    },
  });

  const products = await productsRes.json();

  for (const product of products) {
    const embedding = await getEmbedding(product.description);

    const insertRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/product_embeddings`, {
      method: "POST",
      headers: {
        apikey: process.env.SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=minimal",
      },
      body: JSON.stringify({
        product_id: product.id,
        content: product.description,
        embedding,
      }),
    });

    console.log(`Insertado: ${product.name}`);
  }
}

run();
