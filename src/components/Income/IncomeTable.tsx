
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
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

interface IncomeTableProps {
  incomes: Transaction[];
  getCategoryById: (id: string) => any;
  onEdit?: (tx: Transaction) => void;
  onDelete?: (id: string) => void;
}

export const IncomeTable = ({ incomes, getCategoryById, onEdit, onDelete }: IncomeTableProps) => {
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
              <TableHead className="w-[110px] text-right">Actions</TableHead>
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
                  <TableCell className="text-right space-x-2">
                    <Button size="sm" variant="outline" onClick={() => onEdit?.(income)}>
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <Button size="sm" variant="outline" onClick={() => onDelete?.(income.id)}>
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
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
