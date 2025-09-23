
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";
import { ExpenseForm } from "@/components/Expenses/ExpenseForm";
import { ExpensesTable } from "@/components/Expenses/ExpensesTable";
import { EditExpenseDialog } from "@/components/Expenses/EditExpenseDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);
  const [editingExpense, setEditingExpense] = useState<Transaction | null>(null);
  const [deletingExpenseId, setDeletingExpenseId] = useState<string | null>(null);

  const refresh = () => {
    const allTransactions = dataService.getTransactions();
    const expenseTransactions = allTransactions.filter(transaction => transaction.type === 'expense');
    setExpenses(expenseTransactions);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAddExpense = (newExpense: Transaction) => {
    dataService.addTransaction(newExpense);
    setExpenses([newExpense, ...expenses]);
  };


  const handleEdit = (tx: Transaction) => {
    setEditingExpense(tx);
  };

  const handleSaveEdit = (updated: Transaction) => {
    try {
      dataService.updateTransaction(updated);
      refresh();
      toast.success('Expense updated');
      setEditingExpense(null);
    } catch (error) {
      toast.error('Failed to update expense');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingExpenseId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingExpenseId) {
      try {
        dataService.deleteTransaction(deletingExpenseId);
        refresh();
        toast.success('Expense deleted');
      } catch (error) {
        toast.error('Failed to delete expense');
      }
      setDeletingExpenseId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Expenses</h1>
          <p className="text-muted-foreground">Manage and track your expenses</p>
        </div>
        
        <ExpenseForm onAddExpense={handleAddExpense} />
      </div>

      <ExpensesTable 
        expenses={expenses} 
        getCategoryById={dataService.getCategoryById.bind(dataService)} 
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />

      {editingExpense && (
        <EditExpenseDialog
          expense={editingExpense}
          open={!!editingExpense}
          onOpenChange={(open) => !open && setEditingExpense(null)}
          onSave={handleSaveEdit}
        />
      )}

      <ConfirmDialog
        open={!!deletingExpenseId}
        onOpenChange={(open) => !open && setDeletingExpenseId(null)}
        title="Delete Expense"
        description="Are you sure you want to delete this expense entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Expenses;
