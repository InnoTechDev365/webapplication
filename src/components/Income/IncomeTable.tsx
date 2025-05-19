
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

interface IncomeTableProps {
  incomes: Transaction[];
  getCategoryById: (id: string) => any;
}

export const IncomeTable = ({ incomes, getCategoryById }: IncomeTableProps) => {
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
        <CardTitle>All Income</CardTitle>
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
            {incomes.map((income) => {
              const category = getCategoryById(income.category);
              return (
                <TableRow key={income.id}>
                  <TableCell className="font-medium">{formatDate(income.date)}</TableCell>
                  <TableCell>{income.description}</TableCell>
                  <TableCell>{category?.name || 'Uncategorized'}</TableCell>
                  <TableCell className="text-right font-medium text-income">
                    +${income.amount.toFixed(2)}
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
