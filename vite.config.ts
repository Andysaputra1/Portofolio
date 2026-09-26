import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { localChatApi } from './scripts/local-chat-api'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'AMAZON_');
  for (const name of ['AMAZON_API_KEY', 'AMAZON_MODEL', 'AMAZON_REGION']) {
    if (!process.env[name] && env[name]) process.env[name] = env[name];
  }
  return { plugins: [react(), localChatApi()] };
})
