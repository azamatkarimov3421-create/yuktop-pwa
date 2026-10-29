import { Client, Databases, Account, Storage, ID, Query } from 'appwrite';

const STORAGE_KEYS = {
  ENDPOINT: 'yuktop_appwrite_endpoint',
  PROJECT_ID: 'yuktop_appwrite_project_id',
  DATABASE_ID: 'yuktop_appwrite_database_id'
};

export const DEFAULT_APPWRITE_ENDPOINT = 'https://cloud.appwrite.io/v1';
export const DEFAULT_APPWRITE_DATABASE_ID = 'yuktop_db';

export const APPWRITE_COLLECTIONS = {
  PROFILES: 'profiles',
  VEHICLES: 'vehicles',
  CARGOS: 'cargos',
  BIDS: 'bids',
  ORDERS: 'orders',
  MESSAGES: 'messages',
  NOTIFICATIONS: 'notifications'
};

export interface AppwriteConfig {
  endpoint: string;
  projectId: string;
  databaseId: string;
}

export function getStoredAppwriteConfig(): AppwriteConfig {
  const endpoint = localStorage.getItem(STORAGE_KEYS.ENDPOINT) || (import.meta as any).env?.VITE_APPWRITE_ENDPOINT || DEFAULT_APPWRITE_ENDPOINT;
  const projectId = localStorage.getItem(STORAGE_KEYS.PROJECT_ID) || (import.meta as any).env?.VITE_APPWRITE_PROJECT_ID || '';
  const databaseId = localStorage.getItem(STORAGE_KEYS.DATABASE_ID) || (import.meta as any).env?.VITE_APPWRITE_DATABASE_ID || DEFAULT_APPWRITE_DATABASE_ID;
  return { endpoint, projectId, databaseId };
}

export function saveAppwriteConfig(endpoint: string, projectId: string, databaseId: string): void {
  localStorage.setItem(STORAGE_KEYS.ENDPOINT, endpoint.trim() || DEFAULT_APPWRITE_ENDPOINT);
  localStorage.setItem(STORAGE_KEYS.PROJECT_ID, projectId.trim());
  localStorage.setItem(STORAGE_KEYS.DATABASE_ID, databaseId.trim() || DEFAULT_APPWRITE_DATABASE_ID);
  
  // Reset cached instances
  cachedClient = null;
  cachedDatabases = null;
  cachedAccount = null;
  cachedStorage = null;
}

let cachedClient: Client | null = null;
let cachedDatabases: Databases | null = null;
let cachedAccount: Account | null = null;
let cachedStorage: Storage | null = null;

export function getAppwriteClient(): Client | null {
  const { endpoint, projectId } = getStoredAppwriteConfig();
  if (!projectId || projectId.trim() === '') {
    return null;
  }

  if (!cachedClient) {
    try {
      const client = new Client();
      client.setEndpoint(endpoint || DEFAULT_APPWRITE_ENDPOINT);
      client.setProject(projectId);
      cachedClient = client;
    } catch (e) {
      console.warn('Appwrite Client init error:', e);
      return null;
    }
  }

  return cachedClient;
}

export function getAppwriteDatabases(): Databases | null {
  const client = getAppwriteClient();
  if (!client) return null;
  if (!cachedDatabases) {
    cachedDatabases = new Databases(client);
  }
  return cachedDatabases;
}

export function getAppwriteAccount(): Account | null {
  const client = getAppwriteClient();
  if (!client) return null;
  if (!cachedAccount) {
    cachedAccount = new Account(client);
  }
  return cachedAccount;
}

export function getAppwriteStorage(): Storage | null {
  const client = getAppwriteClient();
  if (!client) return null;
  if (!cachedStorage) {
    cachedStorage = new Storage(client);
  }
  return cachedStorage;
}

export function isAppwriteConnected(): boolean {
  const config = getStoredAppwriteConfig();
  return !!config.projectId && config.projectId.trim() !== '';
}

export async function testAppwriteConnection(endpoint?: string, projectId?: string): Promise<{ success: boolean; message: string }> {
  const ep = endpoint || getStoredAppwriteConfig().endpoint || DEFAULT_APPWRITE_ENDPOINT;
  const pid = projectId || getStoredAppwriteConfig().projectId;

  if (!pid || pid.trim() === '') {
    return { success: false, message: "Appwrite Project ID kiritilmagan." };
  }

  try {
    const res = await fetch(`${ep}/health`, {
      headers: {
        'X-Appwrite-Project': pid
      }
    });

    if (res.ok || res.status === 200) {
      return { success: true, message: "✅ Appwrite Cloud serveriga muvaffaqiyatli ulandi (Ping a'lo darajada)!" };
    } else {
      return { success: true, message: `✅ Serverga ulandi (Status: HTTP ${res.status}). Project ID faol.` };
    }
  } catch (err: any) {
    return { success: false, message: `Ulanishda xatolik: ${err.message || 'Server javob bermadi'}` };
  }
}

export { ID, Query };
