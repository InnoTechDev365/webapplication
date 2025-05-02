
import { Transaction, Category } from "@/lib/types";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useAppContext } from "@/lib/AppContext";

interface RecentTransactionsProps {
  transactions: Transaction[];
  getCategoryById: (id: string) => Category | undefined;
}

export function RecentTransactions({ transactions, getCategoryById }: RecentTransactionsProps) {
  const { formatCurrency } = useAppContext();
  
  // Get the 5 most recent transactions
  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentTransactions.map((transaction) => {
              const category = getCategoryById(transaction.category);
              return (
                <TableRow key={transaction.id}>
                  <TableCell className="font-medium">{formatDate(transaction.date)}</TableCell>
                  <TableCell>{transaction.description}</TableCell>
                  <TableCell>{category?.name || 'Uncategorized'}</TableCell>
                  <TableCell 
                    className={cn(
                      "text-right font-medium",
                      transaction.type === 'income' ? "text-income" : "text-expense"
                    )}
                  >
                    {transaction.type === 'income' ? '+' : '-'}
                    {formatCurrency(transaction.amount).replace('-', '')}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
