const PREFIX = 'saladbox_';

function localGet(key) {
  const value = localStorage.getItem(PREFIX + key);
  return value != null ? { value } : null;
}

function localSet(key, value) {
  localStorage.setItem(PREFIX + key, value);
  return true;
}

async function apiGet(key) {
  const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Storage read failed (${res.status})`);
  return res.json();
}

async function apiSet(key, value) {
  const res = await fetch(`/api/storage?key=${encodeURIComponent(key)}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ value }),
  });
  if (!res.ok) throw new Error(`Storage write failed (${res.status})`);
  return true;
}

function createStorage(useApi) {
  return {
    async get(key) {
      if (useApi) {
        try {
          return await apiGet(key);
        } catch {
          return localGet(key);
        }
      }
      return localGet(key);
    },
    async set(key, value) {
      if (useApi) {
        try {
          return await apiSet(key, value);
        } catch {
          return localSet(key, value);
        }
      }
      return localSet(key, value);
    },
  };
}

export function initStorage() {
  const useApi = import.meta.env.PROD;
  window.storage = createStorage(useApi);
}
