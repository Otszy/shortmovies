import { setAdminCookie } from './_lib/auth.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  let body = '';
  req.on('data', chunk => body += chunk);
  req.on('end', () => {
    try {
      const data = JSON.parse(body || '{}');
      if (!data.key) return res.status(400).json({ error: 'Key required' });
      if (data.key !== (process.env.ADMIN_KEY || '')) return res.status(401).json({ error: 'Invalid key' });
      setAdminCookie(res);
      res.status(200).json({ ok: true });
    } catch {
      res.status(400).json({ error: 'Invalid JSON' });
    }
  });
}
