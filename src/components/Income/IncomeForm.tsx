
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { 
  Select, 
  SelectTrigger, 
  SelectValue, 
  SelectContent, 
  SelectItem 
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { Transaction } from "@/lib/types";
import { dataService } from "@/lib/dataService";

interface IncomeFormProps {
  onAddIncome: (income: Transaction) => void;
}

export const IncomeForm = ({ onAddIncome }: IncomeFormProps) => {
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  // Get real income categories
  const incomeCategories = dataService.getIncomeCategories();

  const handleAddIncome = () => {
    if (!description || !amount || !category) {
      return;
    }

    const newIncome: Transaction = {
      id: `income_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
      amount: parseFloat(amount),
      description,
      date: new Date().toISOString().split('T')[0],
      category,
      type: 'income'
    };

    onAddIncome(newIncome);
    setDialogOpen(false);
    setDescription("");
    setAmount("");
    setCategory("");
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-1" variant="outline">
          <Plus className="h-4 w-4" /> Add Income
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Income</DialogTitle>
          <DialogDescription>
            Record a new income transaction
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Input 
              id="description" 
              placeholder="e.g., Monthly Salary"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input 
              id="amount" 
              type="number" 
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger id="category">
                <SelectValue placeholder="Select a category" />
              </SelectTrigger>
              <SelectContent>
                {incomeCategories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
            Cancel
          </Button>
          <Button 
            type="button" 
            onClick={handleAddIncome}
            disabled={!description || !amount || !category}
          >
            Add Income
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
