import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { localChatApi } from './scripts/local-chat-api'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'GEMINI_');
  for (const name of ['GEMINI_API_KEY', 'GEMINI_MODEL']) {
    if (!process.env[name] && env[name]) process.env[name] = env[name];
  }
  return { plugins: [react(), localChatApi()] };
})
