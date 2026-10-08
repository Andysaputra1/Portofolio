import type { ReactNode } from "react";

// Editorial highlights for portfolio copy. Keep stored content plain text so it
// stays usable by the manager and assistant; edited copy falls back gracefully.
const phrases = [
  "build and maintain four of them",
  "AI features",
  "6+ internal apps",
  "every Polytron employee",
  "every Polytron service center",
  "benchmark for adopting AI",
  "full progressive web app",
  "LLM assistant",
  "Android WebView app",
  "CV analysis with SVM and LLMs",
  "first read on each candidate",
  "Next.js, React and Express",
  "Redesigned the entire website",
  "multiple pages across the product",
  "compare plans",
  "Guided first-year students",
  "lead technical advisor",
  "digitalization and design",
  "technical mentorship",
  "cross-functional teams",
  "hybrid conversational AI",
  "digital wedding-invitation website",
  "studio preview",
  "ferry ticket booking platform",
  "travel discovery platform",
  "VGG16-based deep learning",
  "mushroom image classification",
  "diabetes-risk prediction",
  "exercise-quality assessment",
  "OpenAI-powered chatbot",
  "NOX bot dialogue",
  "X-ray classification result",
  "Predicted mushroom class",
  "Diabetes-risk predictions",
  "Exercise-quality scores",
];

export default function EmphasizedText({ text }: { text: string }) {
  const matches = phrases
    .map((phrase) => ({ phrase, index: text.indexOf(phrase) }))
    .filter(({ index }) => index !== -1)
    .sort((a, b) => a.index - b.index);
  const parts: ReactNode[] = [];
  let cursor = 0;
  let count = 0;

  for (const { phrase, index } of matches) {
    if (index < cursor || count === 2) continue;
    parts.push(text.slice(cursor, index));
    parts.push(<strong className="text-emphasis" key={index}>{phrase}</strong>);
    cursor = index + phrase.length;
    count += 1;
  }
  parts.push(text.slice(cursor));
  return <>{parts}</>;
}
