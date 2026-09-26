# Andy Saputra portfolio

React + TypeScript + Vite, with an Amazon Bedrock career chatbot deployed as a Vercel function.

## Development

Use Node.js 24 or newer. Run `npm install`, copy `.env.example` to `.env`, and set `AMAZON_API_KEY` to a long-term Amazon Bedrock API key on the server. Never prefix this key with `VITE_` or put it in frontend code.

Run `npm run dev`. Vite runs `/api/chat` through the same server-only handler used by Vercel. Restart the dev server after changing environment variables. `npm run preview` serves only the static build; it does not run the AI API.

`AMAZON_MODEL` is optional and defaults to `qwen.qwen3-235b-a22b-2507`, which answered the portfolio questions fastest and most consistently in plain text among the models this account can invoke. `AMAZON_REGION` is optional and defaults to `us-east-1`; `AWS_REGION` is not used because Vercel reserves it. Bedrock bills every request per token, with no free tier. Some catalog models (including Claude and GPT-5.x) can return `not available for this account` until access is enabled for the AWS account. The chatbot sends one text-only request containing the profile, education, FAQs and current project/skill/experience JSON through Bedrock's OpenAI-compatible Chat Completions endpoint (`https://bedrock-mantle.<region>.api.aws/v1`), using the existing OpenAI SDK. It does not call the embedding API or send photos. The old embedding cache generator is unused by chat and still requires its own `OPENAI_API_KEY` if run manually. Old `GEMINI_API_KEY`, `GEMINI_MODEL`, `OPEN_ROUTER`, `OPEN_ROUTER_MODEL`, `OPENAI_API_KEY` and `OPENAI_CHAT_MODEL` settings do not configure the chatbot anymore.

## Manage

`/manage` is a browser-session editor. Its existing browser-side access gate is a convenience, not server authentication. It does not write to the deployed site or repository.

- Edit projects, skills, and experiences; upload JPG/PNG/WebP photos up to 20 MB.
- Photos are decoded, resized to at most 1600 pixels, and embedded in exported JSON.
- Experience photos support captions and original or landscape proportions.
- Preview portfolio applies the session data without leaving the editor.
- Download JSON before refreshing. Import that file to restore the session, or replace the corresponding file under `src/data` and rebuild to publish it. Built-in photo references remain portable across builds.
- CV replacement is also session-only; save the PDF separately before updating its repository asset.

## Validation and deployment

Run `npm run lint`, `npm test`, and `npm run build`. The automated chat test mocks Amazon Bedrock; it makes no network calls and requires no real API key.

On Vercel, configure `AMAZON_API_KEY` and optionally `AMAZON_MODEL` and `AMAZON_REGION` for the appropriate deployment environment, then redeploy. Your local `.env` is ignored by Git and is not uploaded by a push. Vercel runs `api/chat.ts`; static hosting alone cannot run the chatbot.

The chatbot validates input length, uses bounded upstream timeouts, avoids logging raw questions or provider errors, and returns generic failures. Its in-memory rate limit is per function instance, not a distributed quota; use deployment-level limits for global abuse protection.

Spam protection has three layers:

- Vercel BotID (Basic, free on all plans) runs an invisible challenge on `POST /api/chat`. The client initializes it in production builds, `vercel.json` proxies its challenge script, and the function rejects bots with 403 before calling Bedrock. Requests from `curl` or other scripts are blocked in production; test from the deployed page instead. BotID needs the project's OIDC token, which Vercel enables by default. Locally the check is skipped.
- A Vercel WAF rate-limit rule (Firewall → Configure → New Rule; Hobby includes one): if Request Path equals `/api/chat`, then Rate Limit with a fixed 60-second window, 10 requests, keyed by IP, returning 429. Unlike the in-memory limit, it applies across all function instances and blocks traffic before the function runs.
- An AWS Budgets alert on the Bedrock account caps the surprise if anything gets through.
