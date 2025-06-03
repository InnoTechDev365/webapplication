
import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Database, LogIn } from 'lucide-react';
import { SupabaseConnectionDialog } from './Settings/SupabaseConnectionDialog';

export function SupabaseConnector() {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const handleConnect = () => {
    connectToSupabase();
  };

  const handleDisconnect = () => {
    disconnectFromSupabase();
  };

  return (
    <div className="rounded-lg bg-sidebar-accent p-4 shadow-md">
      <p className="text-sm mb-2 font-medium text-white">
        {isSupabaseConnected ? 'Connected to Supabase' : 'Connect to Supabase'}
      </p>
      
      {isSupabaseConnected ? (
        <div className="space-y-2">
          <div className="text-xs text-white/80 mb-2">
            ExpenseCoin App • Personal
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full bg-white text-sidebar-background border-white hover:bg-sidebar-accent hover:text-white hover:border-white transition-colors"
            onClick={handleDisconnect}
          >
            <Database className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          className="w-full bg-white text-sidebar-background border-white hover:bg-sidebar-accent hover:text-white hover:border-white transition-colors"
          onClick={() => setShowConnectionDialog(true)}
        >
          <LogIn className="mr-2 h-4 w-4" />
          Connect
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
