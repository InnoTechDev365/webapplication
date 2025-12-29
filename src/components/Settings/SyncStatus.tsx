import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Cloud, 
  CloudOff, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Wifi, 
  WifiOff,
  Settings,
  Loader2
} from 'lucide-react';
import { syncManager, SyncState } from '@/lib/syncManager';
import { toast } from 'sonner';
import { SetupWizard } from './SetupWizard';
import { SupabaseConnectionDialog } from './SupabaseConnectionDialog';

export const SyncStatus = () => {
  const [syncState, setSyncState] = useState<SyncState>(syncManager.getSyncState());
  const [isConnected, setIsConnected] = useState(syncManager.isConnected());
  const [isSyncing, setIsSyncing] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
  const [showConnectDialog, setShowConnectDialog] = useState(false);

  useEffect(() => {
    const unsubscribe = syncManager.subscribe(setSyncState);
    return unsubscribe;
  }, []);

  const handleSync = async () => {
    setIsSyncing(true);
    const result = await syncManager.fullSync();
    setIsSyncing(false);
    
    if (result.success) {
      toast.success('Data synced successfully!');
    } else {
      toast.error(result.error || 'Sync failed');
    }
  };

  const handleDisconnect = () => {
    syncManager.disconnect();
    setIsConnected(false);
    toast.success('Disconnected from cloud. Data remains stored locally.');
  };

  const handleConnect = async (url: string, anonKey: string) => {
    const result = await syncManager.connect(url, anonKey);
    if (result.success) {
      setIsConnected(true);
      setShowConnectDialog(false);
      toast.success('Connected to Supabase!');
      setTimeout(() => window.location.reload(), 500);
    } else {
      throw new Error(result.error || 'Connection failed');
    }
  };

  const formatLastSync = (timestamp: string | null): string => {
    if (!timestamp) return 'Never';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
    return date.toLocaleDateString();
  };

  const getStatusIcon = () => {
    if (!syncState.isOnline) {
      return <WifiOff className="h-5 w-5 text-muted-foreground" />;
    }
    if (!isConnected) {
      return <CloudOff className="h-5 w-5 text-muted-foreground" />;
    }
    switch (syncState.status) {
      case 'syncing':
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Cloud className="h-5 w-5 text-green-500" />;
    }
  };

  const getStatusBadge = () => {
    if (!syncState.isOnline) {
      return <Badge variant="secondary">Offline</Badge>;
    }
    if (!isConnected) {
      return <Badge variant="outline">Local Only</Badge>;
    }
    switch (syncState.status) {
      case 'syncing':
        return <Badge className="bg-blue-500">Syncing</Badge>;
      case 'success':
        return <Badge className="bg-green-500">Synced</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return <Badge className="bg-green-500">Connected</Badge>;
    }
  };

  return (
    <>
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getStatusIcon()}
              <div>
                <CardTitle className="text-base">Cloud Sync</CardTitle>
                <CardDescription className="text-xs">
                  {isConnected ? 'Connected to Supabase' : 'Using local storage'}
                </CardDescription>
              </div>
            </div>
            {getStatusBadge()}
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {/* Status Info */}
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Connection</span>
            <span className="flex items-center gap-2">
              {syncState.isOnline ? (
                <>
                  <Wifi className="h-3 w-3 text-green-500" />
                  Online
                </>
              ) : (
                <>
                  <WifiOff className="h-3 w-3 text-muted-foreground" />
                  Offline
                </>
              )}
            </span>
          </div>

          {isConnected && (
            <>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Last synced</span>
                <span>{formatLastSync(syncState.lastSync)}</span>
              </div>
              
              {syncState.pendingChanges > 0 && (
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Pending changes</span>
                  <Badge variant="secondary">{syncState.pendingChanges}</Badge>
                </div>
              )}

              {syncState.error && (
                <div className="rounded-md bg-red-50 border border-red-200 p-2">
                  <p className="text-xs text-red-800">{syncState.error}</p>
                </div>
              )}
            </>
          )}

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            {isConnected ? (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleSync}
                  disabled={isSyncing || !syncState.isOnline}
                  className="flex-1"
                >
                  {isSyncing ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <RefreshCw className="mr-2 h-4 w-4" />
                  )}
                  Sync Now
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleDisconnect}
                  className="flex-1"
                >
                  <CloudOff className="mr-2 h-4 w-4" />
                  Disconnect
                </Button>
              </>
            ) : (
              <Button 
                size="sm" 
                onClick={() => setShowConnectDialog(true)}
                className="flex-1"
              >
                <Cloud className="mr-2 h-4 w-4" />
                Enable Cloud Sync
              </Button>
            )}
          </div>

          {!isConnected && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setShowWizard(true)}
              className="w-full"
            >
              <Settings className="mr-2 h-4 w-4" />
              Setup Wizard
            </Button>
          )}
        </CardContent>
      </Card>

      <SetupWizard 
        open={showWizard} 
        onOpenChange={setShowWizard}
        onComplete={() => setIsConnected(syncManager.isConnected())}
      />

      <SupabaseConnectionDialog
        open={showConnectDialog}
        onOpenChange={setShowConnectDialog}
        onConnect={handleConnect}
      />
    </>
  );
};
