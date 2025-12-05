import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PreferencesSection } from "@/components/Settings/PreferencesSection";
import { PreferencesSectionAlt } from "@/components/Settings/PreferencesSectionAlt";
import { AppearanceSection } from "@/components/Settings/AppearanceSection";

const Settings = () => {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">Manage your account settings and preferences</p>
      </div>

      <Tabs defaultValue="preferences" className="space-y-4">
        <TabsList className="w-full sm:w-auto flex flex-wrap">
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
          <TabsTrigger value="preferences-alt">Preferences Alt</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
        </TabsList>
        
        <TabsContent value="preferences">
          <PreferencesSection />
        </TabsContent>
        
        <TabsContent value="preferences-alt">
          <PreferencesSectionAlt />
        </TabsContent>
        
        <TabsContent value="appearance">
          <AppearanceSection />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
