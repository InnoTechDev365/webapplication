
import { useState, useEffect } from "react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";
import { IncomeForm } from "@/components/Income/IncomeForm";
import { IncomeTable } from "@/components/Income/IncomeTable";

const Income = () => {
  const [incomes, setIncomes] = useState<Transaction[]>([]);

  useEffect(() => {
    // Load real income data
    const allTransactions = dataService.getTransactions();
    const incomeTransactions = allTransactions.filter(transaction => transaction.type === 'income');
    setIncomes(incomeTransactions);
  }, []);

  const handleAddIncome = (newIncome: Transaction) => {
    dataService.addTransaction(newIncome);
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
        getCategoryById={dataService.getCategoryById.bind(dataService)} 
      />
    </div>
  );
};

export default Income;
