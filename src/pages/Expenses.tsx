
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";
import { ExpenseForm } from "@/components/Expenses/ExpenseForm";
import { ExpensesTable } from "@/components/Expenses/ExpensesTable";
import { toast } from "sonner";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);

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

  const handleDelete = (id: string) => {
    dataService.deleteTransaction(id);
    refresh();
    toast.success('Expense deleted');
  };

  const handleEdit = (tx: Transaction) => {
    const desc = window.prompt('Edit description', tx.description) ?? tx.description;
    const amountStr = window.prompt('Edit amount', String(tx.amount)) ?? String(tx.amount);
    const amount = parseFloat(amountStr);
    if (!isNaN(amount)) {
      dataService.updateTransaction({ ...tx, description: desc, amount });
      refresh();
      toast.success('Expense updated');
    } else {
      toast.error('Invalid amount');
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
        onDelete={handleDelete}
        onEdit={handleEdit}
      />
    </div>
  );
};

export default Expenses;
