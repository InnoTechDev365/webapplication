
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { useAppContext } from "@/lib/AppContext";
import { Database } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

const Settings = () => {
  const [name, setName] = useState("John Doe");
  const [email, setEmail] = useState("john.doe@example.com");
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);
  
  const { currency, setCurrency, availableCurrencies, isSupabaseConnected, connectToSupabase, disconnectFromSupabase } = useAppContext();

  const handleSaveProfile = () => {
    toast.success("Profile saved successfully");
  };

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };
  
  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
              <CardDescription>
                Update your account profile information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input 
                  id="name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveProfile}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>
                Manage how you receive notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive notifications about your account activity
                  </p>
                </div>
                <Switch 
                  id="email-notifications" 
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="weekly-reports">Weekly Reports</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summary of your financial activity
                  </p>
                </div>
                <Switch 
                  id="weekly-reports" 
                  checked={weeklyReports}
                  onCheckedChange={setWeeklyReports}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveNotifications}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Preferences</CardTitle>
              <CardDescription>
                Manage application preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select Currency" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableCurrencies.map((curr) => (
                      <SelectItem key={curr} value={curr}>
                        {curr}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <Separator />
              <div className="space-y-2">
                <Label>Data Storage</Label>
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <p className="font-medium">Supabase Connection</p>
                    <p className="text-sm text-muted-foreground">
                      {isSupabaseConnected 
                        ? "Your data is currently stored in Supabase and locally" 
                        : "Your data is currently stored only in your browser"}
                    </p>
                  </div>
                  {isSupabaseConnected ? (
                    <Button 
                      variant="outline" 
                      onClick={disconnectFromSupabase}
                    >
                      <Database className="mr-2 h-4 w-4" />
                      Disconnect
                    </Button>
                  ) : (
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline">
                          <Database className="mr-2 h-4 w-4" />
                          Connect
                        </Button>
                      </SheetTrigger>
                      <SheetContent className="w-[400px] sm:max-w-md">
                        <SheetHeader>
                          <SheetTitle>Connect to Supabase</SheetTitle>
                          <SheetDescription>
                            Connect to Supabase to enable cloud storage and synchronization across devices.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-6 space-y-4">
                          <div className="rounded-md bg-muted p-4">
                            <div className="flex items-center space-x-4">
                              <div className="rounded-full bg-primary/20 p-2">
                                <Database className="h-6 w-6 text-primary" />
                              </div>
                              <div>
                                <h4 className="text-sm font-medium">ExpenseCoin & Supabase</h4>
                                <p className="text-sm text-muted-foreground">
                                  Your data will be synchronized between your browser and Supabase.
                                </p>
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <p className="text-sm text-muted-foreground">
                              When connected, your data will be:
                            </p>
                            <ul className="list-disc pl-5 text-sm space-y-1 text-muted-foreground">
                              <li>Stored both locally and in Supabase</li>
                              <li>Available across multiple devices</li>
                              <li>Securely backed up in the cloud</li>
                            </ul>
                          </div>
                          <div className="flex justify-end pt-4">
                            <Button onClick={connectToSupabase}>Connect to Supabase</Button>
                          </div>
                        </div>
                      </SheetContent>
                    </Sheet>
                  )}
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSavePreferences}>Save Changes</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="appearance">
          <Card>
            <CardHeader>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>
                Customize the appearance of your dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">Appearance settings will be available soon.</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
