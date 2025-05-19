
import { useState } from "react";
import { mockTransactions, getCategoryById } from "@/lib/mockData";
import { Transaction } from "@/lib/types";
import { ExpenseForm } from "@/components/Expenses/ExpenseForm";
import { ExpensesTable } from "@/components/Expenses/ExpensesTable";

const Expenses = () => {
  const [expenses, setExpenses] = useState<Transaction[]>(
    mockTransactions.filter(transaction => transaction.type === 'expense')
  );

  const handleAddExpense = (newExpense: Transaction) => {
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
        getCategoryById={getCategoryById} 
      />
    </div>
  );
};

export default Expenses;
