import { useState, useEffect } from 'react';
import { CloudOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';
import { syncPendingScans, getPendingScansCount } from '../../services/syncService';

export default function SyncStatus() {
  const isOnline = useOnlineStatus();
  const [pendingCount, setPendingCount] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSyncStatus, setLastSyncStatus] = useState(null); // 'success' | 'error' | null

  const checkPending = async () => {
    try {
      const count = await getPendingScansCount();
      setPendingCount(count);
    } catch (err) {
      console.error("Failed to check pending scans:", err);
    }
  };

  useEffect(() => {
    checkPending();
    // Poll every 10 seconds just in case
    const interval = setInterval(checkPending, 10000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOnline && pendingCount > 0 && !isSyncing) {
      handleSync();
    }
  }, [isOnline, pendingCount]);

  const handleSync = async () => {
    setIsSyncing(true);
    setLastSyncStatus(null);
    try {
      await syncPendingScans();
      setLastSyncStatus('success');
      setTimeout(() => setLastSyncStatus(null), 3000); // clear success msg after 3s
    } catch (error) {
      setLastSyncStatus('error');
    } finally {
      setIsSyncing(false);
      checkPending();
    }
  };

  if (pendingCount === 0 && lastSyncStatus !== 'success') return null;

  return (
    <div className="bg-surface-page border border-border-default rounded-xl p-3 flex items-center justify-between shadow-sm animate-in fade-in zoom-in-95">
      <div className="flex items-center gap-3">
        {lastSyncStatus === 'success' ? (
          <div className="w-8 h-8 rounded-full bg-success-bg flex items-center justify-center text-brand">
            <CheckCircle2 size={16} />
          </div>
        ) : isSyncing ? (
          <div className="w-8 h-8 rounded-full bg-brand/10 flex items-center justify-center text-brand">
            <RefreshCw size={16} className="animate-spin" />
          </div>
        ) : (
          <div className="w-8 h-8 rounded-full bg-surface-card flex items-center justify-center text-text-muted">
            <CloudOff size={16} />
          </div>
        )}

        <div className="flex flex-col">
          <span className="text-sm font-semibold text-text-primary">
            {lastSyncStatus === 'success' 
              ? 'Sync Complete' 
              : isSyncing 
                ? 'Syncing offline scans...' 
                : `${pendingCount} offline scan${pendingCount !== 1 ? 's' : ''}`}
          </span>
          <span className="text-xs text-text-muted">
            {lastSyncStatus === 'success'
              ? 'All data is up to date'
              : isOnline
                ? 'Uploading now'
                : 'Waiting for connection'}
          </span>
        </div>
      </div>
    </div>
  );
}
