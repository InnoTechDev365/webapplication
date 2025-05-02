
import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Database, LogIn } from 'lucide-react';
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function SupabaseConnector() {
  const { isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const openAuthDialog = () => {
    if (!isSupabaseConnected) {
      setShowAuthDialog(true);
    } else {
      disconnectFromSupabase();
    }
  };

  const handleSignIn = () => {
    if (email && password) {
      connectToSupabase();
      setShowAuthDialog(false);
      setEmail('');
      setPassword('');
    }
  };

  return (
    <>
      <div className="rounded-lg bg-white/10 p-4 text-white text-center">
        <p className="text-sm mb-2">
          {isSupabaseConnected ? 'User Authenticated' : 'Sign in with Supabase'}
        </p>
        <Button
          variant="outline"
          size="sm"
          className="w-full text-white border-white hover:bg-white hover:text-sidebar-background"
          onClick={openAuthDialog}
        >
          {isSupabaseConnected ? (
            <>
              <Database className="mr-2 h-4 w-4" />
              Sign Out
            </>
          ) : (
            <>
              <LogIn className="mr-2 h-4 w-4" />
              Sign In
            </>
          )}
        </Button>
      </div>

      <Dialog open={showAuthDialog} onOpenChange={setShowAuthDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Sign in with Supabase</DialogTitle>
            <DialogDescription>
              Connect your Supabase account to enable database storage and authentication.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAuthDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSignIn}>Connect</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
