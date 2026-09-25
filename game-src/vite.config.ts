import { defineConfig, type Plugin } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const siteRootDir = path.resolve(here, '..');

// dev サーバーでも本番と同じように /js /data /images /audio をリポジトリルートから配信する。
// （本番では Vercel が静的配信しているパス。これが無いと dev だけ /js/chars.js が 404 になる）
function siteRoot(): Plugin {
  const types: Record<string, string> = {
    '.js': 'text/javascript', '.json': 'application/json',
    '.mp3': 'audio/mpeg',
    '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml',
  };
  return {
    name: 'anrino-site-root',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        const m = /^\/(js|data|images|audio)\/[^?#]+/.exec(req.url ?? '');
        if (!m) return next();
        const file = path.join(siteRootDir, m[0]);
        // ディレクトリ外への脱出を防ぐ
        if (!file.startsWith(siteRootDir + path.sep) || !fs.existsSync(file)) return next();
        res.setHeader('Content-Type', types[path.extname(file).toLowerCase()] ?? 'application/octet-stream');
        fs.createReadStream(file).pipe(res);
      });
    },
  };
}

export default defineConfig({
  base: '/game/',
  plugins: [react(), siteRoot()],
  server: { port: 5174 },
  build: {
    outDir: '../game',
    emptyOutDir: true,   // Vite ルート外なので明示が必要
  },
});
