import { getPendingScans, removePendingScan, incrementScanAttempt } from './offlineDb';
import { classifyWasteImage } from './scanService';

export const getPendingScansCount = async () => {
  try {
    const scans = await getPendingScans();
    return scans.length;
  } catch (error) {
    console.error("Failed to read pending scans:", error);
    return 0;
  }
};

export const syncPendingScans = async () => {
  if (!navigator.onLine) return;

  const pendingScans = await getPendingScans();
  
  if (pendingScans.length === 0) return;

  console.log(`Starting sync for ${pendingScans.length} offline scans...`);

  for (const scan of pendingScans) {
    try {
      // Avoid infinite retries
      if (scan.attempts > 3) {
        console.warn(`Scan ${scan.id} failed too many times. Skipping.`);
        // Note: We leave it in DB so user can manually delete or try later,
        // or we could remove it. For now we skip.
        continue;
      }

      await incrementScanAttempt(scan);

      // We use the same classifyWasteImage service
      // We stored a File/Blob in IndexedDB
      const data = await classifyWasteImage(scan.image);

      if (data.success) {
        console.log(`Successfully synced offline scan: ${scan.id}`);
        await removePendingScan(scan.id);
      } else {
        throw new Error(data.message || 'Sync failed');
      }

    } catch (error) {
      console.error(`Failed to sync scan ${scan.id}:`, error);
      
      // If error is authentication/401, we should stop syncing entirely and wait for login
      if (error.response?.status === 401 || error.response?.status === 403) {
        console.error("Auth error during sync. Stopping sync process.");
        throw new Error("Authentication required to sync.");
      }
    }
  }
};
