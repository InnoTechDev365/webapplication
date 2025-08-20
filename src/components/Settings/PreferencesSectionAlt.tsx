import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppContextAlt } from "@/lib/AppContextAlt";
import { CurrencySelector } from "@/components/Settings/CurrencySelector";
import { SupabaseConnectorAlt } from "@/components/Settings/SupabaseConnectorAlt";
import { SupabaseSetupHelp } from "@/components/Settings/SupabaseSetupHelp";
import { DataResetSection } from "@/components/Settings/DataResetSection";

export const PreferencesSectionAlt = () => {
  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Preferences (Alternative)</CardTitle>
        <CardDescription>
          Manage application preferences with enhanced cloud storage options
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="currency">Currency</Label>
          <CurrencySelector />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Enhanced Data Storage</Label>
          <div className="pt-2">
            <SupabaseConnectorAlt />
          </div>
        </div>
        <Separator />
        <SupabaseSetupHelp />
        <Separator />
        <DataResetSection />
      </CardContent>
      <CardFooter>
        <Button onClick={handleSavePreferences}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};