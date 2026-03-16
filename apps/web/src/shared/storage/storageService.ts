import type { StorageKey } from './storageKeys';

export function getAllFromStorage<T>(key: StorageKey): T[] {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as T[];
  } catch {
    return [];
  }
}

export function saveAllToStorage<T>(key: StorageKey, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`[storageService] Falha ao salvar chave "${key}":`, error);
  }
}

export function clearFromStorage(key: StorageKey): void {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`[storageService] Falha ao limpar chave "${key}":`, error);
  }
}
