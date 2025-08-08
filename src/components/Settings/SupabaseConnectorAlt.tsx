import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Cloud, CloudOff, Loader2, RefreshCw, Clock } from "lucide-react";
import { useSupabaseAlt } from "@/lib/hooks/useSupabaseAlt";
import { SupabaseConnectionDialog } from "./SupabaseConnectionDialog";

export const SupabaseConnectorAlt = () => {
  const [showDialog, setShowDialog] = useState(false);
  const { 
    isSupabaseConnected, 
    isLoading, 
    lastSyncTime, 
    connectToSupabase, 
    disconnectFromSupabase,
    syncData 
  } = useSupabaseAlt();

  const handleConnect = async (url: string, anonKey: string) => {
    await connectToSupabase(url, anonKey);
  };

  const handleDisconnect = async () => {
    await disconnectFromSupabase();
  };

  const handleSync = async () => {
    await syncData();
  };

  const formatSyncTime = (timeString: string | null) => {
    if (!timeString) return 'Never';
    
    const date = new Date(timeString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return date.toLocaleDateString();
  };

  return (
    <>
      <Card className="w-full">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {isSupabaseConnected ? (
                <Cloud className="h-5 w-5 text-green-600" />
              ) : (
                <CloudOff className="h-5 w-5 text-muted-foreground" />
              )}
              <CardTitle className="text-lg">Cloud Storage</CardTitle>
            </div>
            <Badge variant={isSupabaseConnected ? "default" : "secondary"}>
              {isSupabaseConnected ? "Connected" : "Offline"}
            </Badge>
          </div>
          <CardDescription>
            {isSupabaseConnected 
              ? "Your data is synchronized with Supabase cloud storage"
              : "Data is stored locally on this device only"
            }
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {isSupabaseConnected && (
            <>
              <div className="flex items-center justify-between text-sm">
                <div className="flex items-center space-x-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Last sync: {formatSyncTime(lastSyncTime)}</span>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleSync}
                  disabled={isLoading}
                  className="h-8 px-2"
                >
                  <RefreshCw className={`h-3 w-3 ${isLoading ? 'animate-spin' : ''}`} />
                </Button>
              </div>
              <Separator />
            </>
          )}
          
          <div className="flex flex-col space-y-2">
            {isSupabaseConnected ? (
              <Button
                variant="outline"
                onClick={handleDisconnect}
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Disconnecting...
                  </>
                ) : (
                  <>
                    <CloudOff className="mr-2 h-4 w-4" />
                    Switch to Local Storage
                  </>
                )}
              </Button>
            ) : (
              <>
                <Button
                  onClick={() => setShowDialog(true)}
                  disabled={isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Connecting...
                    </>
                  ) : (
                    <>
                      <Cloud className="mr-2 h-4 w-4" />
                      Enable Cloud Sync
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => setShowDialog(true)}
                  className="w-full text-sm"
                >
                  Configure Connection Settings
                </Button>
              </>
            )}
          </div>
          
          {!isSupabaseConnected && (
            <div className="rounded-lg bg-muted/50 p-3">
              <p className="text-xs text-muted-foreground">
                <strong>Local Storage:</strong> Your data is saved on this device only. 
                Enable cloud sync to access your data from any device and keep it backed up.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <SupabaseConnectionDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        onConnect={handleConnect}
      />
    </>
  );
};