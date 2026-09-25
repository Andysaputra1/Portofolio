import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { localChatApi } from './scripts/local-chat-api'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'OPEN_ROUTER');
  for (const name of ['OPEN_ROUTER', 'OPEN_ROUTER_MODEL']) {
    if (!process.env[name] && env[name]) process.env[name] = env[name];
  }
  return { plugins: [react(), localChatApi()] };
})
