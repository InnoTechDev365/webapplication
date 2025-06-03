
import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Database, LogIn } from 'lucide-react';
import { SupabaseConnectionDialog } from './SupabaseConnectionDialog';

export const SupabaseConnector = () => {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const handleConnect = () => {
    connectToSupabase();
  };

  const handleDisconnect = () => {
    disconnectFromSupabase();
  };

  return (
    <div>
      <p className="font-medium mb-2">
        {isSupabaseConnected ? 'Connected to Supabase' : 'Connect to Supabase'}
      </p>
      <p className="text-sm text-muted-foreground mb-4">
        {isSupabaseConnected 
          ? "Your data is currently stored in Supabase and locally" 
          : "Your data is currently stored only in your browser"}
      </p>
      
      {isSupabaseConnected ? (
        <div className="space-y-3">
          <div className="rounded-md bg-green-50 border border-green-200 p-3">
            <div className="flex items-center gap-2 text-green-700">
              <Database className="h-4 w-4" />
              <span className="text-sm font-medium">Connected to ExpenseCoin App</span>
            </div>
            <div className="text-xs text-green-600 mt-1">
              Organization: Personal • Project: expense-coin-app
            </div>
          </div>
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="w-full"
          >
            <Database className="mr-2 h-4 w-4" />
            Disconnect
          </Button>
        </div>
      ) : (
        <Button 
          variant="outline" 
          onClick={() => setShowConnectionDialog(true)}
          className="w-full"
        >
          <LogIn className="mr-2 h-4 w-4" />
          Connect to Supabase
        </Button>
      )}

      <SupabaseConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        onConnect={handleConnect}
      />
    </div>
  );
};
