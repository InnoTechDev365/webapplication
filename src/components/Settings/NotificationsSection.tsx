import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, Mail } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

export const NotificationsSection = () => {
  const [browserNotifications, setBrowserNotifications] = useState(false);
  const [weeklyReports, setWeeklyReports] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>("default");

  useEffect(() => {
    if ("Notification" in window) {
      setNotificationPermission(Notification.permission);
    }
    // Load saved preferences
    const savedBrowser = localStorage.getItem("notifications_browser") === "true";
    const savedWeekly = localStorage.getItem("notifications_weekly") === "true";
    setBrowserNotifications(savedBrowser);
    setWeeklyReports(savedWeekly);
  }, []);

  const handleBrowserNotificationsChange = async (checked: boolean) => {
    if (checked && "Notification" in window) {
      if (Notification.permission === "default") {
        const permission = await Notification.requestPermission();
        setNotificationPermission(permission);
        if (permission !== "granted") {
          toast.error("Please allow notifications in your browser settings");
          return;
        }
      } else if (Notification.permission === "denied") {
        toast.error("Notifications are blocked. Please enable them in your browser settings.");
        return;
      }
    }
    setBrowserNotifications(checked);
    localStorage.setItem("notifications_browser", String(checked));
    toast.success(checked ? "Browser notifications enabled" : "Browser notifications disabled");
  };

  const handleWeeklyReportsChange = (checked: boolean) => {
    setWeeklyReports(checked);
    localStorage.setItem("notifications_weekly", String(checked));
    toast.success(checked ? "Weekly reports enabled" : "Weekly reports disabled");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Notifications
        </CardTitle>
        <CardDescription>
          Manage browser-based notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="browser-notifications" className="text-base font-medium">
              Browser Notifications
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive push notifications in your browser
            </p>
          </div>
          <Switch
            id="browser-notifications"
            checked={browserNotifications}
            onCheckedChange={handleBrowserNotificationsChange}
          />
        </div>
        
        <Separator />
        
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="weekly-reports" className="text-base font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Weekly Reports
            </Label>
            <p className="text-sm text-muted-foreground">
              Receive a weekly summary of your financial activity
            </p>
          </div>
          <Switch
            id="weekly-reports"
            checked={weeklyReports}
            onCheckedChange={handleWeeklyReportsChange}
          />
        </div>
      </CardContent>
    </Card>
  );
};
