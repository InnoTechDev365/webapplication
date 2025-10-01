import { useAppContext } from "@/lib/AppContext";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export interface SummaryRow {
  date: string;
  description: string;
  category: string;
  income: number;
  expense: number;
}

interface AnalyticsSummaryTableProps {
  data: SummaryRow[];
  totalIncome: number;
  totalExpense: number;
}

export function AnalyticsSummaryTable({
  data,
  totalIncome,
  totalExpense,
}: AnalyticsSummaryTableProps) {
  const { formatCurrency } = useAppContext();
  const balance = totalIncome - totalExpense;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Income & Expenses Summary</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Date</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Income</TableHead>
                <TableHead className="text-right">Expense</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-muted-foreground">
                    No transactions found for this period
                  </TableCell>
                </TableRow>
              ) : (
                data.map((row, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">{row.date}</TableCell>
                    <TableCell>{row.description}</TableCell>
                    <TableCell>{row.category}</TableCell>
                    <TableCell className="text-right text-green-600 dark:text-green-500">
                      {row.income > 0 ? formatCurrency(row.income) : "-"}
                    </TableCell>
                    <TableCell className="text-right text-red-600 dark:text-red-500">
                      {row.expense > 0 ? formatCurrency(row.expense) : "-"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3} className="font-bold">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold text-green-600 dark:text-green-500">
                  {formatCurrency(totalIncome)}
                </TableCell>
                <TableCell className="text-right font-bold text-red-600 dark:text-red-500">
                  {formatCurrency(totalExpense)}
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell colSpan={3} className="font-bold">
                  Balance
                </TableCell>
                <TableCell
                  colSpan={2}
                  className={cn(
                    "text-right font-bold",
                    balance >= 0
                      ? "text-green-600 dark:text-green-500"
                      : "text-red-600 dark:text-red-500"
                  )}
                >
                  {formatCurrency(balance)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

function cn(...inputs: (string | undefined)[]) {
  return inputs.filter(Boolean).join(" ");
}