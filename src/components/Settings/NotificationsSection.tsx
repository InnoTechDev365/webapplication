
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export const NotificationsSection = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [weeklyReports, setWeeklyReports] = useState(true);

  const handleSaveNotifications = () => {
    toast.success("Notification preferences saved");
  };

  return (
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
  );
};
