import { head, put, del } from '@vercel/blob';

const CATALOG_PATH = 'videos/catalog.json';

export async function loadCatalog() {
  try {
    const meta = await head(CATALOG_PATH);
    const res = await fetch(meta.url);
    if (!res.ok) return [];
    const json = await res.json();
    return Array.isArray(json) ? json : [];
  } catch {
    return [];
  }
}

export async function saveCatalog(items) {
  await put(CATALOG_PATH, JSON.stringify(items, null, 2), {
    access: 'public',
    contentType: 'application/json',
    addRandomSuffix: false
  });
}

export async function removeBlobByUrl(url) {
  try { await del(url); } catch { /* ignore */ }
}
