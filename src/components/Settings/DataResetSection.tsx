import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { toast } from "sonner";
import { Trash2, AlertTriangle } from "lucide-react";
import { dataService } from "@/lib/dataService";

export const DataResetSection = () => {
  const [isResetting, setIsResetting] = useState(false);

  const handleResetData = async () => {
    setIsResetting(true);
    try {
      dataService.clearAllData();
      toast.success("All financial data has been reset successfully");
      // Reload the page to reflect the reset state
      setTimeout(() => {
        if (typeof window !== 'undefined') {
          window.location.reload();
        }
      }, 1000);
    } catch (error) {
      toast.error("Failed to reset data. Please try again.");
      console.error("Reset failed:", error);
    } finally {
      setIsResetting(false);
    }
  };

  return (
    <Card className="border-destructive/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-destructive">
          <AlertTriangle className="h-5 w-5" />
          Reset All Data
        </CardTitle>
        <CardDescription>
          Permanently delete all your financial data including transactions, budgets, and settings. This action cannot be undone.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" disabled={isResetting}>
              <Trash2 className="mr-2 h-4 w-4" />
              {isResetting ? "Resetting..." : "Reset All Data"}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription className="space-y-2">
                <p>This will permanently delete:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>All income and expense transactions</li>
                  <li>All budget data</li>
                  <li>Your preferences and settings</li>
                  <li>Data from both local storage and Supabase (if connected)</li>
                </ul>
                <p className="font-semibold text-destructive">This action cannot be undone.</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleResetData} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                Yes, Reset Everything
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </CardContent>
    </Card>
  );
};