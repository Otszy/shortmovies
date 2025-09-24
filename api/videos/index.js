import { loadCatalog } from '../_lib/catalog.js';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    const items = await loadCatalog();
    return res.status(200).json(items);
  }
  res.setHeader('Allow', 'GET');
  res.status(405).json({ error: 'Method not allowed' });
}
