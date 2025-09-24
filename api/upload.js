import { handleUpload } from '@vercel/blob/client';
import { loadCatalog, saveCatalog } from './_lib/catalog.js';
import { isAdmin } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const response = await handleUpload(req, {
    onBeforeGenerateToken: async () => {
      if (!isAdmin(req)) {
        return { error: { message: 'Unauthorized' }, status: 401 };
      }
      return {
        maximumSizeInBytes: Number(process.env.MAX_FILE_MB || 1024) * 1024 * 1024,
        allowedContentTypes: ['video/*'],
      };
    },
    onUploadCompleted: async ({ blob, tokenPayload }) => {
      const payload = (() => {
        try { return JSON.parse(tokenPayload || '{}'); } catch { return {}; }
      })();

      const items = await loadCatalog();
      const id = (Date.now().toString(36) + Math.random().toString(36).slice(2,8));
      const createdAt = new Date().toISOString();
      items.unshift({
        id,
        title: payload.title || blob.pathname,
        description: payload.description || '',
        telegram_link: payload.telegram_link || '',
        file_url: blob.url,
        file_size: payload.size || blob.size || 0,
        created_at: createdAt,
        thumbnail: '🎬',
        blob_pathname: blob.pathname
      });
      await saveCatalog(items);
    }
  });

  res.status(response.status || 200);
  response.headers.forEach((v, k) => res.setHeader(k, v));
  const bodyText = await response.text();
  res.send(bodyText);
}
