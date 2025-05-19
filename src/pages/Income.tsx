
import { useState } from "react";
import { mockTransactions, getCategoryById } from "@/lib/mockData";
import { Transaction } from "@/lib/types";
import { IncomeForm } from "@/components/Income/IncomeForm";
import { IncomeTable } from "@/components/Income/IncomeTable";

const Income = () => {
  const [incomes, setIncomes] = useState<Transaction[]>(
    mockTransactions.filter(transaction => transaction.type === 'income')
  );

  const handleAddIncome = (newIncome: Transaction) => {
    setIncomes([newIncome, ...incomes]);
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
        getCategoryById={getCategoryById} 
      />
    </div>
  );
};

export default Income;
