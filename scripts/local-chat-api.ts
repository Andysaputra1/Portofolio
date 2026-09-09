import type { Plugin } from 'vite';
import type { VercelRequest, VercelResponse } from '@vercel/node';

/** Run the same server-only handler locally that Vercel deploys in production. */
export function localChatApi(): Plugin {
  return {
    name: 'local-chat-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        if (req.url?.split('?')[0] !== '/api/chat') return next();
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        const response = Object.assign(res, {
          status(code: number) { res.statusCode = code; return response; },
          json(body: unknown) { res.end(JSON.stringify(body)); return response; },
        });
        try {
          let raw = '';
          for await (const chunk of req) {
            raw += chunk.toString();
            if (Buffer.byteLength(raw) > 8192) {
              response.status(413).json({ error: 'Pertanyaan terlalu besar.' });
              return;
            }
          }
          let body: unknown;
          try { body = raw ? JSON.parse(raw) : {}; }
          catch { response.status(400).json({ error: 'Format permintaan tidak valid.' }); return; }
          const { default: handler } = await server.ssrLoadModule('/api/chat.ts');
          await handler(Object.assign(req, { body }) as VercelRequest, response as VercelResponse);
        } catch {
          if (!res.writableEnded) response.status(500).json({ error: 'Layanan AI gagal dijalankan.' });
        }
      });
    },
  };
}
