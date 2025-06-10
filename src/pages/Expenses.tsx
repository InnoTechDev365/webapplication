
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";
import { ExpenseForm } from "@/components/Expenses/ExpenseForm";
import { ExpensesTable } from "@/components/Expenses/ExpensesTable";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load real expense data
    const allTransactions = dataService.getTransactions();
    const expenseTransactions = allTransactions.filter(transaction => transaction.type === 'expense');
    setExpenses(expenseTransactions);
  }, []);

  const handleAddExpense = (newExpense: Transaction) => {
    dataService.addTransaction(newExpense);
    setExpenses([newExpense, ...expenses]);
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
      />
    </div>
  );
};

export default Expenses;
