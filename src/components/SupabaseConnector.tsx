
import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff } from 'lucide-react';
import { SupabaseConnectionDialog } from './Settings/SupabaseConnectionDialog';

export function SupabaseConnector() {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const handleConnect = async (url: string, anonKey: string) => {
    await connectToSupabase(url, anonKey);
  };

  const handleDisconnect = async () => {
    await disconnectFromSupabase();
  };

  return (
    <div className="rounded-lg bg-sidebar-accent p-4 shadow-md">
      <div className="flex items-center gap-2 mb-2">
        {isSupabaseConnected ? (
          <Cloud className="h-4 w-4 text-green-400" />
        ) : (
          <CloudOff className="h-4 w-4 text-gray-400" />
        )}
        <p className="text-sm font-medium text-white">
          {isSupabaseConnected ? 'Cloud Sync Active' : 'Connect to Cloud'}
        </p>
      </div>
      
      {isSupabaseConnected ? (
        <div className="space-y-2">
          <div className="text-xs text-white/80 mb-2">
            Synced with Supabase • All devices
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white text-sidebar-background border-white hover:bg-red-50 hover:text-red-700 hover:border-red-200 transition-colors"
            onClick={handleDisconnect}
          >
            <CloudOff className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          size="sm"
          className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white border-0"
          onClick={() => setShowConnectionDialog(true)}
        >
          <Cloud className="mr-2 h-4 w-4" />
          Enable Sync
        </Button>
      )}

      <SupabaseConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        onConnect={handleConnect}
      />
    </div>
  );
}