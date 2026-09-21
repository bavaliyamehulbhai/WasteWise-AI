import { WifiOff } from 'lucide-react';
import { useOnlineStatus } from '../../hooks/useOnlineStatus';

export default function OfflineBanner() {
  const isOnline = useOnlineStatus();

  if (isOnline) return null;

  return (
    <div className="bg-error-bg text-error-text px-4 py-2 flex items-center justify-center text-sm font-medium z-50 sticky top-0 border-b border-error-text/10 shadow-sm animate-in fade-in slide-in-from-top-2">
      <WifiOff size={16} className="mr-2" />
      <span>You're offline. Some features may be unavailable.</span>
    </div>
  );
}
