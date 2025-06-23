# 🛒 Buy n Large Voice Agent MVP

Este proyecto es un MVP para un marketplace de nueva generación con un asistente de compras con voz en tiempo real, impulsado por IA.

## 🚀 Descripción

**Buy n Large Voice Agent** permite a los usuarios:

- Navegar por productos en una interfaz sencilla y moderna.
- Hablar directamente con un asistente de IA (Gemini Live) usando voz.
- Recibir respuestas contextualizadas gracias a RAG (Retrieval-Augmented Generation) usando embeddings almacenados en Supabase.

---

## 🌐 Live Frontend

Puedes probar la versión en vivo del marketplace en el siguiente enlace:

🔗 [Abrir Marketplace en Lovable](https://lovable.app/tu-url-publica)

## 🧠 Tecnologías Utilizadas

- **Frontend/Backend**: [Lovable](https://supabase-product-cards.lovable.app) + [Supabase](https://supabase.com/)
- **Vector Search / RAG**: Supabase + OpenAI embeddings (`text-embedding-3-small`)
- **Voice Agent**: Gemini Live SDK (Google AI Studio)
- **Función personalizada**: Supabase Edge Function (`rag-assistant`) que recupera el producto más relevante por embeddings y genera la respuesta IA.

---

## 🛠️ Cómo funciona

1. **Marketplace**: Creado en Lovable, conectado a Supabase, muestra los productos con sus descripciones.
2. **Embeddings**: Generados desde un script (`generate_embeddings.js`) con OpenAI y almacenados en Supabase como vectores.
3. **Asistente de voz**: Usando Gemini Live SDK, el usuario habla y el asistente responde contextualizando con los productos.
4. **Edge Function (`rag-assistant`)**:
   - Recibe la pregunta y el ID del producto.
   - Busca en Supabase el embedding más similar.
   - Llama a la API de Gemini con el contexto del producto.
   - Devuelve una respuesta natural y personalizada.

---

## 🧪 Cómo probar

1. Clona este repositorio.
2. Crea un proyecto en Supabase y configura las tablas `products` y `product_embeddings`.
3. Ejecuta el script de embeddings (ver sección siguiente).
4. Crea una función edge (`supabase functions deploy rag-assistant`).
5. Conecta el endpoint desde Lovable como asistente de voz.
6. Habla con Gemini a través de la app y observa respuestas inteligentes en tiempo real.

---

## 📂 Estructura

📁 embeddings_scripts/  
└─ generate_embeddings.js # Script para generar embeddings y almacenarlos  
📁 supabase/  
└─ functions/  
└─ rag-assistant/ # Función que responde con contexto RAG
📁 lovable/ # Proyecto creado con Lovable (interfaz)  
📄 README.md

---

## 🔐 Variables de entorno usadas

Estas claves deben ser configuradas como **secrets** en Supabase o como `.env` local para desarrollo:

OPENAI_API_KEY=sk-...  
GEMINI_API_KEY=AIzaSy...  
SUPABASE_URL=https://<your-project>.supabase.co  
SUPABASE_KEY=...

---

## 📹 Demo Video

➡️ [Demo en YouTube](https://youtube.com/...) _(por subir)_

---

## 🤝 Autor

**Desarrollado por:** Nicholson Stive Ochoa García  
Ingeniero de software  
**Contacto:** nic8ag@yahoo.com

---

## 📄 Licencia

MIT License
