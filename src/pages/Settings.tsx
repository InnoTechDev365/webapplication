
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileSection } from "@/components/Settings/ProfileSection";
import { NotificationsSection } from "@/components/Settings/NotificationsSection";
import { PreferencesSection } from "@/components/Settings/PreferencesSection";
import { AppearanceSection } from "@/components/Settings/AppearanceSection";

const Settings = () => {
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
          <ProfileSection />
        </TabsContent>
        
        <TabsContent value="notifications">
          <NotificationsSection />
        </TabsContent>
        
        <TabsContent value="preferences">
          <PreferencesSection />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
