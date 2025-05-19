
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { useAppContext } from "@/lib/AppContext";
import { CurrencySelector } from "@/components/Settings/CurrencySelector";
import { SupabaseConnector } from "@/components/Settings/SupabaseConnector";

export const PreferencesSection = () => {
  const handleSavePreferences = () => {
    toast.success("Preferences saved successfully");
  };

  return (
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
          <CurrencySelector />
        </div>
        <Separator />
        <div className="space-y-2">
          <Label>Data Storage</Label>
          <div className="pt-2">
            <SupabaseConnector />
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSavePreferences}>Save Changes</Button>
      </CardFooter>
    </Card>
  );
};
