import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createRequire } from "node:module";
import OpenAI from "openai";

const MODEL_EMB = "text-embedding-3-large";
const MODEL_CHAT = "gpt-5.6-sol";
const TOP_K = 6;
const MAX_QUESTION_LENGTH = 800;
const RATE_LIMIT = 12;
const RATE_WINDOW_MS = 60_000;
const recentRequests = new Map<string, number[]>();

type StoreChunk = { embedding: number[]; source: string; text: string };
const require = createRequire(import.meta.url);
const storeCache = require("../data/store.cache.json") as StoreChunk[];

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
    const question = typeof req.body?.question === "string" ? req.body.question.trim() : "";
    if (!question) return res.status(400).json({ error: "Pertanyaan wajib diisi." });
    if (question.length > MAX_QUESTION_LENGTH) return res.status(400).json({ error: "Pertanyaan maksimal 800 karakter." });
    if (!process.env.OPENAI_API_KEY) return res.status(503).json({ error: "Layanan AI belum dikonfigurasi." });

    const address = (req.headers["x-forwarded-for"] ?? req.socket?.remoteAddress ?? "unknown").toString().split(",")[0].trim();
    const now = Date.now();
    const requests = (recentRequests.get(address) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
    if (requests.length >= RATE_LIMIT) return res.status(429).json({ error: "Terlalu banyak pertanyaan. Coba lagi dalam satu menit." });
    requests.push(now);
    recentRequests.set(address, requests);

    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const STORE = storeCache;
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

    const response = await openai.responses.create({
      model: MODEL_CHAT,
      instructions: SYSTEM_PROMPT,
      input: `Context:\n${context}\n\nQuestion:\n${question}\n\nAnswer based only on the context provided, citing with tags.`,
      reasoning: { effort: "medium" },
      max_output_tokens: 450,
      store: false,
    });

    return res.status(200).json({ answer: response.output_text || "Maaf, belum ada jawaban." });
  } catch (e: unknown) {
    console.error(e);
    return res.status(500).json({ error: "Terjadi gangguan pada layanan AI. Coba lagi nanti." });
  }
}
