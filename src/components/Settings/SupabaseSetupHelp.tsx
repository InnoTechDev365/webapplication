import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { Copy, Database } from "lucide-react";
import { SETUP_SQL } from "@/lib/remoteSync";

export const SupabaseSetupHelp = () => {
  const [copied, setCopied] = useState(false);

  const copySql = async () => {
    try {
      await navigator.clipboard.writeText(SETUP_SQL);
      setCopied(true);
      toast.success("SQL copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch (e) {
      toast.error("Failed to copy SQL");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Database className="h-5 w-5" />
          Supabase one-time setup
        </CardTitle>
        <CardDescription>
          Run this SQL in your Supabase project's SQL Editor once. Then use "Enable Cloud Sync" above.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="flex items-center gap-2">
          <Button size="sm" variant="secondary" onClick={copySql} aria-label="Copy setup SQL">
            <Copy className="mr-2 h-4 w-4" /> {copied ? "Copied" : "Copy SQL"}
          </Button>
        </div>
        <Separator />
        <pre className="max-h-64 overflow-auto rounded-md border p-3 text-xs whitespace-pre-wrap">
{SETUP_SQL}
        </pre>
      </CardContent>
    </Card>
  );
};
