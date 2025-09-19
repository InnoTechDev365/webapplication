
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";
import { IncomeForm } from "@/components/Income/IncomeForm";
import { IncomeTable } from "@/components/Income/IncomeTable";
import { toast } from "sonner";

const Income = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);

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

  const handleDelete = (id: string) => {
    dataService.deleteTransaction(id);
    refresh();
    toast.success('Income deleted');
  };

  const handleEdit = (tx: Transaction) => {
    const desc = window.prompt('Edit description', tx.description) ?? tx.description;
    const amountStr = window.prompt('Edit amount', String(tx.amount)) ?? String(tx.amount);
    const amount = parseFloat(amountStr);
    if (!isNaN(amount)) {
      dataService.updateTransaction({ ...tx, description: desc, amount });
      refresh();
      toast.success('Income updated');
    } else {
      toast.error('Invalid amount');
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
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Income;
