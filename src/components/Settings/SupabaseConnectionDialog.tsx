import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Database, Loader2, CheckCircle, AlertCircle, ExternalLink, Copy } from 'lucide-react';
import { toast } from 'sonner';
import { reloadPage, writeToClipboard } from '@/lib/browserUtils';
import { SETUP_SQL } from '@/lib/remoteSync';

interface SupabaseConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: (url: string, anonKey: string) => Promise<void> | void;
}

export const SupabaseConnectionDialog = ({ open, onOpenChange, onConnect }: SupabaseConnectionDialogProps) => {
  const [url, setUrl] = useState('');
  const [anonKey, setAnonKey] = useState('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [showSetupHelp, setShowSetupHelp] = useState(false);

  const validateInputs = () => {
    if (!url.trim()) {
      setConnectionError('Supabase URL is required');
      return false;
    }
    if (!anonKey.trim()) {
      setConnectionError('Anon key is required');
      return false;
    }
    
    // More flexible URL validation
    const cleanUrl = url.trim().toLowerCase();
    if (!cleanUrl.includes('supabase.co') && !cleanUrl.includes('localhost') && !cleanUrl.includes('supabase.')) {
      setConnectionError('Please enter a valid Supabase URL (e.g., https://your-project.supabase.co)');
      return false;
    }
    
    if (anonKey.trim().length < 50) {
      setConnectionError('The anon key appears to be incomplete. It should be a long string starting with "eyJ"');
      return false;
    }
    
    setConnectionError(null);
    return true;
  };

  const handleConnect = async () => {
    if (!validateInputs()) return;

    setIsConnecting(true);
    setConnectionError(null);
    
    try {
      await onConnect(url.trim(), anonKey.trim());
      setIsConnected(true);

      setTimeout(() => {
        onOpenChange(false);
        resetDialog();
        // Refresh page to ensure clean state
        setTimeout(() => reloadPage(), 100);
      }, 1500);
    } catch (error: any) {
      const errorMsg = error.message || 'Connection failed';
      setConnectionError(errorMsg);
      setIsConnecting(false);
      
      // Show setup help if tables are missing
      if (errorMsg.includes('Missing database tables')) {
        setShowSetupHelp(true);
      }
    }
  };

  const handleCopySetupSQL = async () => {
    const success = await writeToClipboard(SETUP_SQL);
    if (success) {
      toast.success('Setup SQL copied to clipboard!');
    } else {
      toast.error('Failed to copy. Check console for SQL.');
      console.info('[Supabase Setup SQL]\n', SETUP_SQL);
    }
  };

  const resetDialog = () => {
    setUrl('');
    setAnonKey('');
    setIsConnecting(false);
    setIsConnected(false);
    setConnectionError(null);
    setShowSetupHelp(false);
  };

  const handleClose = () => {
    if (!isConnecting) {
      onOpenChange(false);
      resetDialog();
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connect Your Supabase
          </DialogTitle>
          <DialogDescription>
            Connect to your own Supabase project to sync data across devices.
          </DialogDescription>
        </DialogHeader>
        
        {isConnected ? (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500" />
            <div className="text-center">
              <h3 className="font-semibold text-lg">Connected Successfully!</h3>
              <p className="text-sm text-muted-foreground">Your data is now synced with Supabase</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            {showSetupHelp && (
              <div className="rounded-md bg-amber-50 border border-amber-200 p-3 space-y-2">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-4 w-4 text-amber-600" />
                  <span className="text-sm text-amber-800 font-medium">Database Setup Required</span>
                </div>
                <p className="text-xs text-amber-700">
                  Your Supabase project needs the required tables. Copy the setup SQL and run it in your Supabase SQL Editor first.
                </p>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleCopySetupSQL}
                  className="w-full"
                >
                  <Copy className="mr-2 h-3 w-3" />
                  Copy Setup SQL
                </Button>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="url">Supabase URL</Label>
              <Input
                id="url"
                type="url"
                placeholder="https://your-project.supabase.co"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                disabled={isConnecting}
                className="font-mono text-sm"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="anon">Anon (Public) Key</Label>
              <Input
                id="anon"
                type="password"
                placeholder="eyJhbGciOiJIUzI1..."
                value={anonKey}
                onChange={(e) => setAnonKey(e.target.value)}
                disabled={isConnecting}
                className="font-mono text-sm"
              />
            </div>
            
            {connectionError && (
              <div className="rounded-md bg-red-50 border border-red-200 p-3">
                <div className="flex items-start gap-2">
                  <AlertCircle className="h-4 w-4 text-red-600 mt-0.5 shrink-0" />
                  <span className="text-sm text-red-800">
                    {connectionError}
                  </span>
                </div>
              </div>
            )}

            <div className="rounded-md bg-blue-50 border border-blue-200 p-3">
              <div className="text-sm text-blue-800 space-y-2">
                <div className="font-medium flex items-center gap-1">
                  <Database className="h-3 w-3" />
                  How to get your credentials:
                </div>
                <ol className="list-decimal list-inside space-y-1 text-xs">
                  <li>Go to your Supabase project dashboard</li>
                  <li>Navigate to <strong>Settings → API</strong></li>
                  <li>Copy the <strong>Project URL</strong></li>
                  <li>Copy the <strong>anon public</strong> key (under "Project API keys")</li>
                </ol>
                <div className="pt-1">
                  <a 
                    href="https://supabase.com/dashboard" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 underline text-xs"
                  >
                    Open Supabase Dashboard <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            </div>

            <div className="rounded-md bg-green-50 border border-green-200 p-3">
              <div className="text-sm text-green-800 space-y-1">
                <div className="font-medium">What happens when you connect:</div>
                <ul className="list-disc list-inside text-xs space-y-0.5">
                  <li>Your local data is uploaded to your Supabase</li>
                  <li>Future changes sync automatically</li>
                  <li>Access your data from any device</li>
                  <li>Disconnect anytime to stay local-only</li>
                </ul>
              </div>
            </div>
            
            <Button 
              onClick={handleConnect} 
              className="w-full"
              disabled={!url || !anonKey || isConnecting}
            >
              {isConnecting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connecting...
                </>
              ) : (
                <>
                  <Database className="mr-2 h-4 w-4" />
                  Connect to Supabase
                </>
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
