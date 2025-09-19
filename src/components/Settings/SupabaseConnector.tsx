
import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Cloud, CloudOff, Wifi, WifiOff } from 'lucide-react';
import { SupabaseConnectionDialog } from './SupabaseConnectionDialog';

export const SupabaseConnector = () => {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();
  const [showConnectionDialog, setShowConnectionDialog] = useState(false);

  const handleConnect = async (url: string, anonKey: string) => {
    await connectToSupabase(url, anonKey);
  };

  const handleDisconnect = async () => {
    await disconnectFromSupabase();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <p className="font-medium">Cloud Sync</p>
        <div className="flex items-center gap-1">
          {isSupabaseConnected ? (
            <Wifi className="h-4 w-4 text-green-600" />
          ) : (
            <WifiOff className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">
        {isSupabaseConnected 
          ? "Your data is synced across all devices via Supabase" 
          : "Connect to Supabase to sync your data across devices"}
      </p>
      
      {isSupabaseConnected ? (
        <div className="space-y-3">
          <div className="rounded-lg bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-green-100 rounded-full p-2">
                <Cloud className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-green-800">Connected to Supabase</div>
                <div className="text-sm text-green-600">
                  Data is automatically synced
                </div>
              </div>
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <Button 
            variant="outline" 
            onClick={handleDisconnect}
            className="w-full hover:bg-red-50 hover:border-red-200 hover:text-red-700"
          >
            <CloudOff className="mr-2 h-4 w-4" />
            Disconnect from Supabase
          </Button>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="rounded-lg bg-gradient-to-r from-gray-50 to-blue-50 border border-gray-200 p-4">
            <div className="flex items-center gap-3">
              <div className="bg-gray-100 rounded-full p-2">
                <CloudOff className="h-5 w-5 text-gray-500" />
              </div>
              <div className="flex-1">
                <div className="font-medium text-gray-700">Local Storage Only</div>
                <div className="text-sm text-gray-500">
                  Data is stored in your browser
                </div>
              </div>
            </div>
          </div>
          
          <Button 
            onClick={() => setShowConnectionDialog(true)}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white border-0"
          >
            <Cloud className="mr-2 h-4 w-4" />
            Enable Cloud Sync
          </Button>
        </div>
      )}

      <SupabaseConnectionDialog
        open={showConnectionDialog}
        onOpenChange={setShowConnectionDialog}
        onConnect={handleConnect}
      />
    </div>
  );
};
