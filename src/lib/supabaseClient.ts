import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL_KEY = 'sb_url';
export const SUPABASE_ANON_KEY = 'sb_anon';

let cachedClient: SupabaseClient | null = null;
let cachedUrl = '';
let cachedAnon = '';

export function setSupabaseCredentials(url: string, anonKey: string) {
  localStorage.setItem(SUPABASE_URL_KEY, url);
  localStorage.setItem(SUPABASE_ANON_KEY, anonKey);
  // reset cache so a new client is created next time
  cachedClient = null;
  cachedUrl = url;
  cachedAnon = anonKey;
}

export function clearSupabaseCredentials() {
  localStorage.removeItem(SUPABASE_URL_KEY);
  localStorage.removeItem(SUPABASE_ANON_KEY);
  cachedClient = null;
  cachedUrl = '';
  cachedAnon = '';
}

export function hasSupabaseCredentials() {
  const url = localStorage.getItem(SUPABASE_URL_KEY);
  const anon = localStorage.getItem(SUPABASE_ANON_KEY);
  return Boolean(url && anon);
}

export function getSupabaseClient(): SupabaseClient | null {
  const url = localStorage.getItem(SUPABASE_URL_KEY) || '';
  const anon = localStorage.getItem(SUPABASE_ANON_KEY) || '';

  if (!url || !anon) return null;

  if (cachedClient && url === cachedUrl && anon === cachedAnon) {
    return cachedClient;
  }

  cachedUrl = url;
  cachedAnon = anon;
  cachedClient = createClient(url, anon);
  return cachedClient;
}
