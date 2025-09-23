
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";
import { IncomeForm } from "@/components/Income/IncomeForm";
import { IncomeTable } from "@/components/Income/IncomeTable";
import { EditIncomeDialog } from "@/components/Income/EditIncomeDialog";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";
import { toast } from "sonner";

const Income = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);
  const [editingIncome, setEditingIncome] = useState<Transaction | null>(null);
  const [deletingIncomeId, setDeletingIncomeId] = useState<string | null>(null);

  const refresh = () => {
    const allTransactions = dataService.getTransactions();
    const incomeTransactions = allTransactions.filter(transaction => transaction.type === 'income');
    setIncomes(incomeTransactions);
  };

  useEffect(() => {
    refresh();
  }, []);

  const handleAddIncome = (newIncome: Transaction) => {
    dataService.addTransaction(newIncome);
    setIncomes([newIncome, ...incomes]);
  };


  const handleEdit = (tx: Transaction) => {
    setEditingIncome(tx);
  };

  const handleSaveEdit = (updated: Transaction) => {
    try {
      dataService.updateTransaction(updated);
      refresh();
      toast.success('Income updated');
      setEditingIncome(null);
    } catch (error) {
      toast.error('Failed to update income');
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeletingIncomeId(id);
  };

  const handleConfirmDelete = () => {
    if (deletingIncomeId) {
      try {
        dataService.deleteTransaction(deletingIncomeId);
        refresh();
        toast.success('Income deleted');
      } catch (error) {
        toast.error('Failed to delete income');
      }
      setDeletingIncomeId(null);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Income</h1>
          <p className="text-muted-foreground">Manage and track your income</p>
        </div>
        
        <IncomeForm onAddIncome={handleAddIncome} />
      </div>

      <IncomeTable 
        incomes={incomes} 
        getCategoryById={dataService.getCategoryById.bind(dataService)} 
        onDelete={handleDeleteClick}
        onEdit={handleEdit}
      />

      {editingIncome && (
        <EditIncomeDialog
          income={editingIncome}
          open={!!editingIncome}
          onOpenChange={(open) => !open && setEditingIncome(null)}
          onSave={handleSaveEdit}
        />
      )}

      <ConfirmDialog
        open={!!deletingIncomeId}
        onOpenChange={(open) => !open && setDeletingIncomeId(null)}
        title="Delete Income"
        description="Are you sure you want to delete this income entry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};

export default Income;
