import "dotenv/config";
import fs from "fs";
import path from "path";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error("❌ OPENAI_API_KEY tidak ditemukan di file .env!");
  process.exit(1);
}

const openai = new OpenAI({ apiKey });
const MODEL_EMB = "text-embedding-3-large";

const DATA_PATH = path.resolve(process.cwd(), "data", "profile.json");
const CACHE_PATH = path.resolve(process.cwd(), "data", "store.cache.json");

function chunkText(text: string, size = 800, overlap = 120) {
  const words = text.split(/\s+/);
  const out: string[] = [];
  for (let i = 0; i < words.length; i += (size - overlap)) {
    out.push(words.slice(i, i + size).join(" "));
    if (i + size >= words.length) break;
  }
  return out.filter(Boolean);
}

async function embedOne(text: string): Promise<number[] | null> {
  try {
    const e = await openai.embeddings.create({ model: MODEL_EMB, input: text });
    return e.data[0].embedding as number[];
  } catch (err: any) {
    console.error(`[embedOne Error] ${err.message}`);
    return null; 
  }
}

async function buildStore() {
  console.log(`[1] Membaca data dari: ${DATA_PATH}`);
  if (!fs.existsSync(DATA_PATH)) {
    console.error("❌ File profile.json tidak ditemukan di folder data/.");
    process.exit(1);
  }

  const raw = fs.readFileSync(DATA_PATH, "utf8");
  const data = JSON.parse(raw);
  
  // Normalisasi Data
  if (data.profile?.["Soft_Skills:"]) data.profile.soft_skills = data.profile["Soft_Skills:"];
  if (data.profile?.Hard_Skills) data.profile.hard_skills = data.profile.Hard_Skills;
  if (data.profile?.Language) data.profile.languages = data.profile.Language;
  if (data.profile?.Achievement) data.profile.achievement = data.profile.Achievement;
  const education = data.education ?? data.Education ?? [];
  
  const entries: { source: string; text: string }[] = [];

  // PROFILE
  if (data.profile?.summary) entries.push({ source: "profile:summary", text: String(data.profile.summary) });
  if (data.profile?.full_name || data.profile?.headline) {
    entries.push({ source: "profile:headline", text: `${data.profile.full_name ?? ""}\n${data.profile.headline ?? ""}`.trim() });
  }
  if (data.profile?.achievement) entries.push({ source: "profile:achievement", text: `Achievement: ${data.profile.achievement}`});
  if (data.profile?.hard_skills || data.profile?.soft_skills || data.profile?.languages) {
    entries.push({
      source: "profile:skills",
      text: [
        data.profile.hard_skills ? `Hard skills: ${data.profile.hard_skills}` : "",
        data.profile.soft_skills ? `Soft skills: ${data.profile.soft_skills}` : "",
        data.profile.languages   ? `Languages: ${data.profile.languages}`   : "",
      ].filter(Boolean).join("\n")
    });
  }
  
  // PROJECTS
  for (const prj of (data.projects || [])) {
    entries.push({
      source: `project:${prj.name}`,
      text: [prj.name, prj.description, prj.impact ? `Impact: ${prj.impact}` : "", (prj.tech_stack && prj.tech_stack.length) ? `Stack: ${prj.tech_stack.join(", ")}` : "", prj.repo_url ?? ""].filter(Boolean).join("\n")
    });
  }
  
  // EXPERIENCES
  for (const exp of (data.experiences || [])) {
    const org = exp.organization || "Unknown";
    const bullets = exp.highlights || exp.responsibilities || [];
    const period = `${exp.start_date ?? ""}–${(exp.end_date ?? "Present")}`;
    entries.push({ source: `exp:${org}`, text: [`${exp.role} @ ${org} (${period})`, bullets.join("; ")].filter(Boolean).join("\n") });
  }
  
  // EDUCATION
  for (const ed of (education || [])) {
    const period = `${ed.start_date ?? ""}–${(ed.end_date_expected ?? ed.end_date ?? "")}`;
    entries.push({ source: `edu:${ed.institution}`, text: [`${ed.institution}`, ed.degree ?? "", period, ed.gpa ? `GPA: ${ed.gpa}` : ""].filter(Boolean).join("\n") });
  }
  
  // FAQs
  for (const f of (data.faqs || [])) {
    entries.push({ source: `faq:${f.q}`, text: `${f.q}\n${f.a}` });
  }

  // CHUNKING
  const chunks: { source: string; text: string }[] = [];
  for (const e of entries) {
    for (const c of chunkText(e.text)) chunks.push({ source: e.source, text: c });
  }

  console.log(`[2] Memulai proses embedding untuk ${chunks.length} chunks. Tunggu sebentar...`);
  const embeddingPromises = chunks.map(c => embedOne(c.text));
  const embeddings = await Promise.all(embeddingPromises);

  const batched = [];
  for (let i = 0; i < chunks.length; i++) {
    const embedding = embeddings[i];
    if (embedding && embedding.length > 0) {
      batched.push({ source: chunks[i].source, text: chunks[i].text, embedding: embedding });
    }
  }

  // SIMPAN
  fs.writeFileSync(CACHE_PATH, JSON.stringify(batched));
  console.log(`✅ [3] SUKSES! File cache tersimpan di: ${CACHE_PATH}`);
}

buildStore().catch(console.error);