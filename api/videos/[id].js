import { loadCatalog, saveCatalog, removeBlobByUrl } from '../_lib/catalog.js';
import { isAdmin } from '../_lib/auth.js';

export default async function handler(req, res) {
  const { id } = req.query || {};
  if (req.method !== 'DELETE') {
    res.setHeader('Allow', 'DELETE');
    return res.status(405).json({ error: 'Method not allowed' });
  }
  if (!isAdmin(req)) return res.status(401).json({ error: 'Unauthorized' });

  const items = await loadCatalog();
  const idx = items.findIndex(v => String(v.id) === String(id));
  if (idx === -1) return res.status(404).json({ error: 'Not found' });

  const item = items[idx];
  await removeBlobByUrl(item.file_url);
  items.splice(idx, 1);
  await saveCatalog(items);

  res.json({ ok: true });
}
