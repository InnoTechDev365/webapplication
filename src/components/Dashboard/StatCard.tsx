
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  className?: string;
}

export function StatCard({ 
  title, 
  value, 
  icon, 
  change, 
  changeType = 'neutral',
  className 
}: StatCardProps) {
  return (
    <Card className={cn("overflow-hidden", className)}>
      <CardContent className="card-content-responsive">
        <div className="flex items-center justify-between gap-3">
          <div className="flex-1 min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground truncate">{title}</p>
            <h3 className="stat-value mt-1 truncate">{value}</h3>
            {change && (
              <p 
                className={cn(
                  "text-xs mt-1 flex items-center",
                  changeType === 'positive' && "text-green-500",
                  changeType === 'negative' && "text-red-500"
                )}
              >
                {change}
              </p>
            )}
          </div>
          <div className="p-2 sm:p-3 rounded-full bg-primary/10 shrink-0">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
