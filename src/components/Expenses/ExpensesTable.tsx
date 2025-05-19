
import { Transaction } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Table, 
  TableHeader, 
  TableRow, 
  TableHead, 
  TableBody, 
  TableCell 
} from "@/components/ui/table";

interface ExpensesTableProps {
  expenses: Transaction[];
  getCategoryById: (id: string) => any;
}

export const ExpensesTable = ({ expenses, getCategoryById }: ExpensesTableProps) => {
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date);
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle>All Expenses</CardTitle>
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
            {expenses.map((expense) => {
              const category = getCategoryById(expense.category);
              return (
                <TableRow key={expense.id}>
                  <TableCell className="font-medium">{formatDate(expense.date)}</TableCell>
                  <TableCell>{expense.description}</TableCell>
                  <TableCell>{category?.name || 'Uncategorized'}</TableCell>
                  <TableCell className="text-right font-medium text-expense">
                    -${expense.amount.toFixed(2)}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
