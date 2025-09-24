import crypto from 'crypto';

const ADMIN_COOKIE = 'adm';

function parseCookies(cookieHeader = '') {
  const out = {};
  cookieHeader.split(';').forEach(p => {
    const i = p.indexOf('=');
    if (i > -1) out[p.slice(0,i).trim()] = decodeURIComponent(p.slice(i+1));
  });
  return out;
}

export function adminHash() {
  const SESSION_SECRET = process.env.SESSION_SECRET || 'change-session-secret';
  const ADMIN_KEY = process.env.ADMIN_KEY || '';
  return crypto.createHmac('sha256', SESSION_SECRET).update(ADMIN_KEY).digest('hex');
}

export function isAdmin(req) {
  try {
    const cookies = parseCookies(req.headers?.cookie || '');
    return cookies[ADMIN_COOKIE] === adminHash();
  } catch {
    return false;
  }
}

export function setAdminCookie(res) {
  const value = adminHash();
  const secure = process.env.SECURE_COOKIES ? '; Secure' : '';
  res.setHeader('Set-Cookie', `adm=${value}; Path=/; HttpOnly; SameSite=Lax${secure}; Max-Age=604800`);
}

export function clearAdminCookie(res) {
  res.setHeader('Set-Cookie', `adm=; Path=/; Max-Age=0; SameSite=Lax`);
}
