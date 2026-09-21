import { openDB } from 'idb';

const DB_NAME = 'wastewise-db';
const DB_VERSION = 1;
const STORE_NAME = 'pendingScans';

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    },
  });
};

export const savePendingScan = async (imageFile, previewUrl) => {
  const db = await initDB();
  const id = crypto.randomUUID();
  
  await db.put(STORE_NAME, {
    id,
    image: imageFile,
    previewUrl, // Useful for showing it in the UI before sync
    createdAt: new Date().toISOString(),
    attempts: 0,
    status: 'pending'
  });
  
  return id;
};

export const getPendingScans = async () => {
  const db = await initDB();
  return db.getAll(STORE_NAME);
};

export const removePendingScan = async (id) => {
  const db = await initDB();
  return db.delete(STORE_NAME, id);
};

export const incrementScanAttempt = async (scan) => {
  const db = await initDB();
  scan.attempts = (scan.attempts || 0) + 1;
  return db.put(STORE_NAME, scan);
};

export const clearAllOfflineData = async () => {
  const db = await initDB();
  await db.clear(STORE_NAME);
};
