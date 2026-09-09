# Andy Saputra portfolio

React + TypeScript + Vite, with an OpenAI career chatbot deployed as a Vercel function.

## Development

Use Node.js 24 or newer. Run `npm install`, copy `.env.example` to `.env`, and set `OPENAI_API_KEY` on the server. Never prefix this key with `VITE_` or put it in frontend code.

Run `npm run dev`. Vite runs `/api/chat` through the same server-only handler used by Vercel. Restart the dev server after changing environment variables. `npm run preview` serves only the static build; it does not run the AI API.

`OPENAI_CHAT_MODEL` is optional and defaults to `gpt-5.6-sol`. The embedding cache uses `text-embedding-3-large`; changing the embedding model requires rebuilding the cache. The chatbot combines retrieved profile excerpts with the current projects, skills, and experience JSON so new portfolio entries are available without regenerating embeddings.

## Manage

`/manage` is a browser-session editor. Its existing browser-side access gate is a convenience, not server authentication. It does not write to the deployed site or repository.

- Edit projects, skills, and experiences; upload JPG/PNG/WebP photos up to 20 MB.
- Photos are decoded, resized to at most 1600 pixels, and embedded in exported JSON.
- Experience photos support captions and original or landscape proportions.
- Preview portfolio applies the session data without leaving the editor.
- Download JSON before refreshing. Import that file to restore the session, or replace the corresponding file under `src/data` and rebuild to publish it. Built-in photo references remain portable across builds.
- CV replacement is also session-only; save the PDF separately before updating its repository asset.

## Validation and deployment

Run `npm run lint`, `npm test`, and `npm run build`. The automated chat test mocks OpenAI; it makes no network calls and requires no real API key.

On Vercel, configure `OPENAI_API_KEY` and optionally `OPENAI_CHAT_MODEL` for the appropriate deployment environment, then redeploy. Vercel runs `api/chat.ts`; static hosting alone cannot run the chatbot.

The chatbot validates input length, uses bounded upstream timeouts, avoids logging raw questions or provider errors, and returns generic failures. Its in-memory rate limit is per function instance, not a distributed quota; use deployment-level limits for global abuse protection.
