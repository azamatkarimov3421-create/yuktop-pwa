import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Get config from localStorage or environment
const STORAGE_KEY_URL = 'yuktop_supabase_url';
const STORAGE_KEY_ANON = 'yuktop_supabase_anon';

export function getStoredSupabaseConfig(): { url: string; anonKey: string } {
  const url = localStorage.getItem(STORAGE_KEY_URL) || (import.meta as any).env?.VITE_SUPABASE_URL || '';
  const anonKey = localStorage.getItem(STORAGE_KEY_ANON) || (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';
  return { url, anonKey };
}

export function saveSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_KEY_URL, url.trim());
  localStorage.setItem(STORAGE_KEY_ANON, anonKey.trim());
}

let supabaseInstance: SupabaseClient | null = null;

export function getSupabase(): SupabaseClient | null {
  const { url, anonKey } = getStoredSupabaseConfig();
  if (!url || !anonKey || url.trim() === '' || anonKey.trim() === '') {
    return null;
  }
  
  if (!supabaseInstance) {
    try {
      supabaseInstance = createClient(url, anonKey);
    } catch (e) {
      console.warn('Supabase initialization error:', e);
      return null;
    }
  }
  return supabaseInstance;
}

export function isSupabaseConnected(): boolean {
  return getSupabase() !== null;
}
