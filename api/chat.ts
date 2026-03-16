import type { VercelRequest, VercelResponse } from '@vercel/node';
import OpenAI from "openai";

// Import data cache yang baru saja kamu buat
import storeCache from '../data/store.cache.json';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MODEL_EMB = "text-embedding-3-large";
const MODEL_CHAT = "gpt-4o";
const TOP_K = 6;

const SYSTEM_PROMPT = `
You are the candidate’s public career chatbot. Audience: HR and general public.
Tone: professional, concise, friendly. Mirror Indonesian/English automatically.

## Core Rules:
1.  **Strictly Adhere to Context:** Answer ONLY from the provided context sections.
2.  **No External Knowledge:** Do NOT make up information or use any knowledge outside the context.
3.  **Handle Missing Info:** If the answer is not in the context, state that you don't have that specific information.
4.  **Refuse Sensitive PII:** Refuse sensitive PII (NIK/NPWP/SSN, full home address, family, religion, marital status).
5.  **Cite Sources:** ALWAYS include short tags derived from the context's SOURCE label.
`;

function cosine(a: number[], b: number[]) {
  let dot = 0, na = 0, nb = 0;
  for (let i = 0; i < a.length; i++) { 
    dot += a[i]*b[i]; na += a[i]*a[i]; nb += b[i]*b[i]; 
  }
  return dot / (Math.sqrt(na) * Math.sqrt(nb) + 1e-8);
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const question: string = req.body?.question ?? "";
    if (!question) return res.status(400).json({ error: "question required" });

    // Gunakan cache
    const STORE = storeCache as any[];
    if (STORE.length === 0) {
      return res.status(503).json({ error: "Vector store is empty." });
    }

    const e = await openai.embeddings.create({ model: MODEL_EMB, input: question });
    const qEmb = e.data[0].embedding as number[];
    if (!qEmb) return res.status(500).json({ error: "Failed to embed question." });

    const ranked = STORE
      .map((c) => ({ ...c, score: cosine(qEmb, c.embedding) }))
      .sort((a, b) => (b.score - a.score))
      .slice(0, TOP_K);

    const context = ranked.map(r => `SOURCE: ${r.source}\n${r.text}`).join("\n\n---\n\n");

    const cmp = await openai.chat.completions.create({
      model: MODEL_CHAT,
      temperature: 0.1,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `Context:\n${context}\n\nQuestion:\n${question}\n\nAnswer based *only* on the context provided, citing with tags.` }
      ]
    });

    return res.status(200).json({ answer: cmp.choices?.[0]?.message?.content ?? "No answer." });
  } catch (e: any) {
    console.error(e);
    return res.status(500).json({ error: e?.message || "server error" });
  }
}