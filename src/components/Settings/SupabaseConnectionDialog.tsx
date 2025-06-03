
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
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Database, Building2, Folder } from 'lucide-react';

interface SupabaseConnectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConnect: () => void;
}

interface Organization {
  id: string;
  name: string;
  slug: string;
}

interface Project {
  id: string;
  name: string;
  ref: string;
}

export const SupabaseConnectionDialog = ({ open, onOpenChange, onConnect }: SupabaseConnectionDialogProps) => {
  const [step, setStep] = useState<'login' | 'organization' | 'project'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedOrg, setSelectedOrg] = useState<string>('');
  const [selectedProject, setSelectedProject] = useState<string>('');

  // Mock data - in real implementation, these would come from Supabase API
  const mockOrganizations: Organization[] = [
    { id: '1', name: 'Personal', slug: 'personal' },
    { id: '2', name: 'Company Inc.', slug: 'company-inc' },
    { id: '3', name: 'Startup LLC', slug: 'startup-llc' },
  ];

  const mockProjects: Project[] = [
    { id: '1', name: 'ExpenseCoin App', ref: 'expense-coin-app' },
    { id: '2', name: 'Analytics Dashboard', ref: 'analytics-dashboard' },
    { id: '3', name: 'User Management', ref: 'user-management' },
  ];

  const handleLogin = () => {
    if (email && password) {
      setStep('organization');
    }
  };

  const handleOrganizationSelect = () => {
    if (selectedOrg) {
      setStep('project');
    }
  };

  const handleProjectSelect = () => {
    if (selectedProject) {
      onConnect();
      onOpenChange(false);
      // Reset dialog state
      setStep('login');
      setEmail('');
      setPassword('');
      setSelectedOrg('');
      setSelectedProject('');
    }
  };

  const renderLoginStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Sign in to Supabase
        </DialogTitle>
        <DialogDescription>
          Enter your Supabase credentials to connect your account
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <Button 
          onClick={handleLogin} 
          className="w-full"
          disabled={!email || !password}
        >
          Sign In
        </Button>
      </div>
    </>
  );

  const renderOrganizationStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Select Organization
        </DialogTitle>
        <DialogDescription>
          Choose the organization you want to connect to
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Organization</Label>
          <Select value={selectedOrg} onValueChange={setSelectedOrg}>
            <SelectTrigger>
              <SelectValue placeholder="Select an organization" />
            </SelectTrigger>
            <SelectContent>
              {mockOrganizations.map((org) => (
                <SelectItem key={org.id} value={org.id}>
                  <div className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    {org.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setStep('login')}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleOrganizationSelect}
            disabled={!selectedOrg}
            className="flex-1"
          >
            Continue
          </Button>
        </div>
      </div>
    </>
  );

  const renderProjectStep = () => (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Folder className="h-5 w-5" />
          Select Project
        </DialogTitle>
        <DialogDescription>
          Choose the Supabase project to connect to ExpenseCoin
        </DialogDescription>
      </DialogHeader>
      <div className="space-y-4 py-4">
        <div className="space-y-2">
          <Label>Project</Label>
          <Select value={selectedProject} onValueChange={setSelectedProject}>
            <SelectTrigger>
              <SelectValue placeholder="Select a project" />
            </SelectTrigger>
            <SelectContent>
              {mockProjects.map((project) => (
                <SelectItem key={project.id} value={project.id}>
                  <div className="flex items-center gap-2">
                    <Database className="h-4 w-4" />
                    <div>
                      <div className="font-medium">{project.name}</div>
                      <div className="text-xs text-muted-foreground">{project.ref}</div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="rounded-md bg-muted p-3">
          <div className="text-sm font-medium mb-1">Connection Details</div>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>• Data will be synced between local storage and Supabase</div>
            <div>• Existing local data will be uploaded to Supabase</div>
            <div>• You can disconnect at any time</div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setStep('organization')}
            className="flex-1"
          >
            Back
          </Button>
          <Button 
            onClick={handleProjectSelect}
            disabled={!selectedProject}
            className="flex-1"
          >
            Connect Project
          </Button>
        </div>
      </div>
    </>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === 'login' && renderLoginStep()}
        {step === 'organization' && renderOrganizationStep()}
        {step === 'project' && renderProjectStep()}
      </DialogContent>
    </Dialog>
  );
};
